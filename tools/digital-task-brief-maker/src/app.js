const planInput = document.querySelector('#plan-input');
const generateButton = document.querySelector('#generate');
const clearButton = document.querySelector('#clear');
const loadSampleButton = document.querySelector('#load-sample');
const reviewList = document.querySelector('#review-list');
const matchCount = document.querySelector('#match-count');
const briefOutput = document.querySelector('#brief-output');
const cardTemplate = document.querySelector('#placement-card-template');
const copyBriefButton = document.querySelector('#copy-brief');
const exportJsonButton = document.querySelector('#export-json');
const printBriefButton = document.querySelector('#print-brief');

const samplePlan = `Platform,Placement,Size,Units,Notes
Instagram,Feed Static Image,1080x1350,2,Launch post and offer variant
TikTok,TopView,9:16,1,Hero awareness video
Pinterest,Standard Pin / Static Pin,1000x1500,3,Recipe-inspired discovery creative
X,Promoted Post Static Image,1:1,1,Launch day amplification
YouTube,Skippable In-Stream,16:9,2,:15 and :30 cutdowns`;

let placementLibrary = [];
let currentBrief = [];

async function boot() {
  placementLibrary = await fetch('./data/placements.json').then((response) => response.json());
  loadSampleButton.addEventListener('click', loadSamplePlan);
  generateButton.addEventListener('click', generateBrief);
  clearButton.addEventListener('click', clearWorkspace);
  copyBriefButton.addEventListener('click', copyBriefText);
  exportJsonButton.addEventListener('click', exportBriefJson);
  printBriefButton.addEventListener('click', () => window.print());
}

function loadSamplePlan() {
  planInput.value = samplePlan;
  generateBrief();
}

function clearWorkspace() {
  planInput.value = '';
  currentBrief = [];
  matchCount.textContent = '0 placements';
  reviewList.className = 'review-list empty-state';
  reviewList.innerHTML = 'Paste a media plan and click <strong>Generate brief</strong> to see placement matches.';
  briefOutput.className = 'brief-output empty-state';
  briefOutput.textContent = 'Your generated digital task brief will appear here.';
}

function generateBrief() {
  const rows = parsePlan(planInput.value);
  currentBrief = rows.map((row, index) => {
    const match = findBestPlacement(row);
    return {
      index: index + 1,
      raw: row,
      matchedPlacement: match.placement,
      confidence: match.confidence,
      searchText: match.searchText
    };
  });

  renderReview(currentBrief);
  renderBrief(currentBrief);
}

function parsePlan(input) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => splitRow(line))
    .filter((cells) => !looksLikeHeader(cells))
    .map((cells) => ({
      platform: cells[0] || '',
      placement: cells[1] || cells[0] || '',
      size: cells[2] || '',
      units: cells[3] || '',
      notes: cells.slice(4).join(' · ')
    }));
}

function splitRow(line) {
  const delimiter = line.includes('\t') ? '\t' : ',';
  return line
    .split(delimiter)
    .map((cell) => cell.trim().replace(/^"|"$/g, ''));
}

function looksLikeHeader(cells) {
  const normalized = cells.join(' ').toLowerCase();
  return normalized.includes('platform') && normalized.includes('placement');
}

function findBestPlacement(row) {
  const searchText = normalize(`${row.platform} ${row.placement} ${row.size} ${row.notes}`);
  let best = { placement: null, confidence: 0, searchText };

  for (const placement of placementLibrary) {
    const candidates = [placement.platform, placement.placement, ...placement.aliases].map(normalize);
    const score = candidates.reduce((highest, candidate) => {
      if (!candidate) return highest;
      if (searchText.includes(candidate)) return Math.max(highest, 1);
      const tokenScore = scoreTokens(searchText, candidate);
      return Math.max(highest, tokenScore);
    }, 0);

    if (score > best.confidence) {
      best = { placement, confidence: score, searchText };
    }
  }

  if (best.confidence < 0.38) best.placement = null;
  return best;
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9:]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreTokens(source, candidate) {
  const candidateTokens = new Set(candidate.split(' ').filter((token) => token.length > 1));
  if (!candidateTokens.size) return 0;
  const hits = [...candidateTokens].filter((token) => source.includes(token)).length;
  return hits / candidateTokens.size;
}

function renderReview(items) {
  matchCount.textContent = `${items.length} placement${items.length === 1 ? '' : 's'}`;

  if (!items.length) {
    reviewList.className = 'review-list empty-state';
    reviewList.textContent = 'No usable placement rows found. Paste a media plan and try again.';
    return;
  }

  reviewList.className = 'review-list';
  reviewList.innerHTML = '';
  for (const item of items) {
    const card = document.createElement('div');
    const isMatched = Boolean(item.matchedPlacement);
    card.className = `review-item${isMatched ? '' : ' unmatched'}`;
    const confidence = Math.round(item.confidence * 100);
    card.innerHTML = isMatched
      ? `<strong>${escapeHtml(item.raw.platform || item.matchedPlacement.platform)} · ${escapeHtml(item.raw.placement || item.matchedPlacement.placement)}</strong><p>Matched to <b>${escapeHtml(item.matchedPlacement.platform)} ${escapeHtml(item.matchedPlacement.placement)}</b> · <span class="confidence">${confidence}% confidence</span></p>`
      : `<strong>${escapeHtml(item.raw.platform || 'Unknown platform')} · ${escapeHtml(item.raw.placement || 'Unknown placement')}</strong><p>No confident match yet. Add this placement to <code>data/placements.json</code> or edit the pasted row.</p>`;
    reviewList.append(card);
  }
}

function renderBrief(items) {
  if (!items.length) {
    briefOutput.className = 'brief-output empty-state';
    briefOutput.textContent = 'Your generated digital task brief will appear here.';
    return;
  }

  briefOutput.className = 'brief-output';
  briefOutput.innerHTML = '';
  briefOutput.append(buildBriefMeta(items));

  for (const item of items) {
    briefOutput.append(item.matchedPlacement ? buildPlacementCard(item) : buildUnmatchedCard(item));
  }
}

function buildBriefMeta(items) {
  const matched = items.filter((item) => item.matchedPlacement).length;
  const meta = document.createElement('section');
  meta.className = 'brief-meta';
  meta.innerHTML = `
    <h3>Digital task brief</h3>
    <p><strong>${matched}/${items.length}</strong> placements matched to the starter spec library.</p>
    <p>Spec links are included for final verification because paid platform requirements change often.</p>
  `;
  return meta;
}

function buildPlacementCard(item) {
  const placement = item.matchedPlacement;
  const fragment = cardTemplate.content.cloneNode(true);
  const card = fragment.querySelector('.brief-card');
  card.querySelector('.platform').textContent = placement.platform;
  card.querySelector('h3').textContent = placement.placement;
  card.querySelector('.asset-type').textContent = placement.assetType;
  card.querySelector('.spec-list').append(...placement.specs.map((spec) => toListItem(`${spec.label}: ${spec.value}`)));
  card.querySelector('.copy-list').append(...placement.copyFields.map(toCopyField));
  card.querySelector('.prompt-list').append(...placement.creativePrompts.map(toListItem));
  card.querySelector('.source-block').append(buildSourceContent(placement, item));
  return fragment;
}

function buildUnmatchedCard(item) {
  const card = document.createElement('section');
  card.className = 'brief-card';
  card.innerHTML = `
    <div class="brief-card-header">
      <div>
        <p class="platform">Needs setup</p>
        <h3>${escapeHtml(item.raw.platform || 'Unknown platform')} · ${escapeHtml(item.raw.placement || 'Unknown placement')}</h3>
      </div>
      <span class="asset-type">Unmatched</span>
    </div>
    <p>Add this placement to the spec library, then regenerate the brief.</p>
    <div class="copy-field">
      <strong>Copy placeholder</strong>
      <span>Limit: confirm platform requirements</span>
      <p>XXX — write copy here once the placement is defined.</p>
    </div>
  `;
  return card;
}

function toListItem(text) {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
}

function toCopyField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'copy-field';
  wrapper.innerHTML = `
    <strong>${escapeHtml(field.label)}</strong>
    <span>Limit: ${escapeHtml(field.limit)}</span>
    <p>${escapeHtml(field.placeholder)}</p>
  `;
  return wrapper;
}

function buildSourceContent(placement, item) {
  const wrapper = document.createElement('div');
  const rowNotes = [item.raw.size && `Plan size: ${item.raw.size}`, item.raw.units && `Units: ${item.raw.units}`, item.raw.notes && `Notes: ${item.raw.notes}`]
    .filter(Boolean)
    .join(' · ');
  const sourceLinks = placement.sourceUrls
    .map((url) => `<a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(new URL(url).hostname)}</a>`)
    .join(' · ');
  const searches = placement.exampleSearches.map((query) => `<span>${escapeHtml(query)}</span>`).join(' · ');

  wrapper.innerHTML = `
    ${rowNotes ? `<p><strong>Media plan notes:</strong> ${escapeHtml(rowNotes)}</p>` : ''}
    <p><strong>Spec verification:</strong> ${sourceLinks}</p>
    <p><strong>Example search starters:</strong> ${searches}</p>
  `;
  return wrapper;
}

async function copyBriefText() {
  if (!currentBrief.length) return showToast('Generate a brief first.');
  const text = currentBrief.map(toPlainText).join('\n\n---\n\n');
  await navigator.clipboard.writeText(text);
  showToast('Brief text copied.');
}

function toPlainText(item) {
  if (!item.matchedPlacement) {
    return `UNMATCHED: ${item.raw.platform} ${item.raw.placement}\nAdd this placement to the spec library.`;
  }

  const placement = item.matchedPlacement;
  return [
    `${placement.platform} — ${placement.placement}`,
    `Asset type: ${placement.assetType}`,
    'Specs:',
    ...placement.specs.map((spec) => `- ${spec.label}: ${spec.value}`),
    'Copy needed:',
    ...placement.copyFields.map((field) => `- ${field.label} (${field.limit}): ${field.placeholder}`),
    'Creative prompts:',
    ...placement.creativePrompts.map((prompt) => `- ${prompt}`),
    `Sources: ${placement.sourceUrls.join(', ')}`
  ].join('\n');
}

function exportBriefJson() {
  if (!currentBrief.length) return showToast('Generate a brief first.');
  const blob = new Blob([JSON.stringify(currentBrief, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `digital-task-brief-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 2400);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

boot();
