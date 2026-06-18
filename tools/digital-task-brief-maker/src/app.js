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
const exportPptButton = document.querySelector('#export-ppt');
const planFile = document.querySelector('#plan-file');
const sourceList = document.querySelector('#source-list');
const sourceCount = document.querySelector('#source-count');
const workflowScore = document.querySelector('#workflow-score');
const meters = {
  ingest: document.querySelector('#meter-ingest'),
  match: document.querySelector('#meter-match'),
  verify: document.querySelector('#meter-verify'),
  brief: document.querySelector('#meter-brief')
};

const samplePlan = `Platform,Placement,Size,Units,Notes
Instagram,Feed Static Image,1080x1350,2,Launch post and offer variant
TikTok,TopView,9:16,1,Hero awareness video
Pinterest,Standard Pin / Static Pin,1000x1500,3,Recipe-inspired discovery creative
X,Promoted Post Static Image,1:1,1,Launch day amplification
YouTube,Skippable In-Stream,16:9,2,:15 and :30 cutdowns`;

let placementLibrary = [];
let currentBrief = [];

async function boot() {
  placementLibrary = await fetch(new URL('../data/placements.json', import.meta.url)).then((response) => response.json());
  loadSampleButton.addEventListener('click', loadSamplePlan);
  generateButton.addEventListener('click', generateBrief);
  clearButton.addEventListener('click', clearWorkspace);
  copyBriefButton.addEventListener('click', copyBriefText);
  exportJsonButton.addEventListener('click', exportBriefJson);
  printBriefButton.addEventListener('click', () => window.print());
  exportPptButton.addEventListener('click', exportPowerPointBrief);
  planFile.addEventListener('change', importPlanFile);
  resetWorkflowState();
}

function loadSamplePlan() {
  planInput.value = samplePlan;
  generateBrief();
}

async function importPlanFile(event) {
  const [file] = event.target.files;
  if (!file) return;

  const extension = file.name.split('.').pop().toLowerCase();
  if (['xlsx', 'xls'].includes(extension)) {
    planInput.value = await extractWorkbookRows(file);
  } else if (extension === 'pptx') {
    planInput.value = await extractPowerPointText(file);
  } else {
    planInput.value = await file.text();
  }

  setWorkflowProgress({ ingest: 100, match: 0, verify: 0, brief: 0 });
  activateWorkflowNode('ingest');
  showToast(`Loaded ${file.name}`);
}

async function extractWorkbookRows(file) {
  const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  return workbook.SheetNames
    .flatMap((sheetName) => XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' }))
    .filter((row) => row.some(Boolean))
    .map((row) => row.join(','))
    .join('\n');
}

async function extractPowerPointText(file) {
  const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name));
  const slideTexts = await Promise.all(slideFiles.map(async (name) => xmlToText(await zip.files[name].async('text'))));
  return slideTexts.filter(Boolean).join('\n');
}

function xmlToText(xml) {
  return xml
    .replace(/<a:t>/g, '')
    .replace(/<\/a:t>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function clearWorkspace() {
  planInput.value = '';
  currentBrief = [];
  matchCount.textContent = '0 placements';
  reviewList.className = 'review-list empty-state';
  reviewList.innerHTML = 'Paste a media plan and click <strong>Generate brief</strong> to see placement matches.';
  briefOutput.className = 'brief-output empty-state';
  briefOutput.textContent = 'Your assembled brief will appear here after the workflow runs.';
  sourceCount.textContent = '0 sources';
  sourceList.className = 'source-list empty-state';
  sourceList.textContent = 'Verified platform links, example-search prompts, and visual clipping slots will appear here.';
  resetWorkflowState();
}

function generateBrief() {
  const rows = parsePlan(planInput.value);
  setWorkflowProgress({ ingest: rows.length ? 100 : 0, match: 20, verify: 0, brief: 0 });
  activateWorkflowNode('match');
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

  const readiness = calculateReadiness(currentBrief);
  setWorkflowProgress({
    ingest: rows.length ? 100 : 0,
    match: readiness.matchPercent,
    verify: readiness.verifyPercent,
    brief: readiness.briefPercent
  });
  activateWorkflowNode(readiness.briefPercent === 100 ? 'brief' : 'verify');
  renderReview(currentBrief);
  renderSources(currentBrief);
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
  if (!line.includes(delimiter)) return inferDeliverableRow(line);
  return line
    .split(delimiter)
    .map((cell) => cell.trim().replace(/^"|"$/g, ''));
}

function inferDeliverableRow(line) {
  const platform = placementLibrary.find((placement) => normalize(line).includes(normalize(placement.platform)))?.platform || '';
  return [platform, line, '', '', 'Imported from deliverables list'];
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

function calculateReadiness(items) {
  if (!items.length) return { matchPercent: 0, verifyPercent: 0, briefPercent: 0 };
  const matched = items.filter((item) => item.matchedPlacement);
  const averageConfidence = matched.reduce((sum, item) => sum + item.confidence, 0) / items.length;
  const matchPercent = Math.round(averageConfidence * 100);
  const verifyPercent = Math.round((matched.length / items.length) * 100);
  const briefPercent = Math.round(((matchPercent + verifyPercent) / 2));
  workflowScore.textContent = `${briefPercent}% ready`;
  return { matchPercent, verifyPercent, briefPercent };
}

function setWorkflowProgress(progress) {
  for (const [key, value] of Object.entries(progress)) {
    if (meters[key]) meters[key].value = value;
  }
}

function resetWorkflowState() {
  workflowScore.textContent = '0% ready';
  setWorkflowProgress({ ingest: 0, match: 0, verify: 0, brief: 0 });
  activateWorkflowNode('ingest');
}

function activateWorkflowNode(activeNode) {
  document.querySelectorAll('.workflow-node').forEach((node) => {
    node.classList.toggle('active', node.dataset.node === activeNode);
    node.classList.toggle('complete', ['ingest', 'match', 'verify', 'clip', 'brief'].indexOf(node.dataset.node) < ['ingest', 'match', 'verify', 'clip', 'brief'].indexOf(activeNode));
  });
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

function renderSources(items) {
  const matched = items.filter((item) => item.matchedPlacement);
  const sources = matched.flatMap((item) => item.matchedPlacement.sourceUrls);
  sourceCount.textContent = `${sources.length} source${sources.length === 1 ? '' : 's'}`;

  if (!items.length) {
    sourceList.className = 'source-list empty-state';
    sourceList.textContent = 'Verified platform links, example-search prompts, and visual clipping slots will appear here.';
    return;
  }

  sourceList.className = 'source-list';
  sourceList.innerHTML = '';

  for (const item of items) {
    const wrapper = document.createElement('article');
    wrapper.className = `source-card${item.matchedPlacement ? '' : ' source-card-warning'}`;

    if (!item.matchedPlacement) {
      wrapper.innerHTML = `
        <div>
          <strong>${escapeHtml(item.raw.platform || 'Unknown platform')} · ${escapeHtml(item.raw.placement || 'Unknown placement')}</strong>
          <p>No source package yet. Add a placement spec to unlock verification and clipping prompts.</p>
        </div>
        <span class="confidence-chip warning">Needs setup</span>
      `;
      sourceList.append(wrapper);
      continue;
    }

    const placement = item.matchedPlacement;
    const confidence = Math.round(item.confidence * 100);
    const links = placement.sourceUrls
      .map((url) => `<a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(new URL(url).hostname)}</a>`)
      .join('');
    const clips = placement.exampleSearches
      .map((query) => `<div class="clip-tile"><span>Image clip queue</span><strong>${escapeHtml(query)}</strong></div>`)
      .join('');

    wrapper.innerHTML = `
      <div class="source-card-header">
        <div>
          <strong>${escapeHtml(placement.platform)} · ${escapeHtml(placement.placement)}</strong>
          <p>Verification sources and visual example prompts for creative context.</p>
        </div>
        <span class="confidence-chip">${confidence}% match</span>
      </div>
      <div class="source-links">${links}</div>
      <div class="clip-grid">${clips}</div>
    `;
    sourceList.append(wrapper);
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
  card.querySelector('.safe-zone-slot').append(buildSafeZonePreview(placement));
  card.querySelector('.spec-list').append(...placement.specs.map((spec) => toListItem(`${spec.label}: ${spec.value}`)));
  card.querySelector('.copy-list').append(...placement.copyFields.map(toCopyField));
  card.querySelector('.prompt-list').append(...placement.creativePrompts.map(toListItem));
  card.querySelector('.source-block').append(buildSourceContent(placement, item));
  return fragment;
}

function buildSafeZonePreview(placement) {
  const wrapper = document.createElement('div');
  const ratioSpec = placement.specs.find((spec) => /ratio/i.test(spec.label));
  const resolutionSpec = placement.specs.find((spec) => /resolution/i.test(spec.label));
  const ratio = ratioSpec?.value || 'Platform-native ratio';
  const resolution = resolutionSpec?.value || 'Confirm exact resolution in source link';
  const isVertical = /9:16|4:5|2:3|1080 × 1920|1000 × 1500/i.test(`${ratio} ${resolution}`);
  wrapper.className = `safe-zone-preview${isVertical ? ' vertical' : ''}`;
  wrapper.innerHTML = `
    <div class="safe-zone-art" aria-hidden="true">
      <span class="safe-zone top">Avoid UI / handle</span>
      <span class="safe-zone middle">Keep logo, product, claims, CTA here</span>
      <span class="safe-zone bottom">Avoid captions / buttons</span>
    </div>
    <div class="safe-zone-notes">
      <h4>Spec visual + safe-zone reminder</h4>
      <p><strong>Ratio:</strong> ${escapeHtml(ratio)}</p>
      <p><strong>Resolution:</strong> ${escapeHtml(resolution)}</p>
      <p>Use the linked platform source to confirm final safe zones before trafficking.</p>
    </div>
  `;
  return wrapper;
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

async function exportPowerPointBrief() {
  if (!currentBrief.length) return showToast('Generate a brief first.');
  const pptxModule = await import('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm');
  const pptx = new pptxModule.default();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'AgencyThings';
  pptx.subject = 'Digital Task Brief';
  pptx.title = 'Digital Task Brief';

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '140D1F' };
  titleSlide.addText('Digital Task Brief', { x: 0.6, y: 0.7, w: 12, h: 0.7, fontSize: 34, bold: true, color: 'FFFFFF' });
  titleSlide.addText(`${currentBrief.filter((item) => item.matchedPlacement).length}/${currentBrief.length} placements matched`, { x: 0.6, y: 1.55, w: 10, h: 0.4, fontSize: 16, color: 'FFD6EF' });

  for (const item of currentBrief) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    const placement = item.matchedPlacement;
    const title = placement ? `${placement.platform} · ${placement.placement}` : `${item.raw.platform || 'Unknown'} · ${item.raw.placement || 'Unknown placement'}`;
    slide.addText(title, { x: 0.45, y: 0.35, w: 12.2, h: 0.4, fontSize: 22, bold: true, color: '20171F' });

    if (!placement) {
      slide.addText('Needs setup in the placement library before a complete brief can be generated.', { x: 0.55, y: 1.1, w: 10, h: 0.5, fontSize: 15, color: '8A0F57' });
      continue;
    }

    slide.addText('Specs', { x: 0.55, y: 1.0, w: 2.8, h: 0.3, fontSize: 15, bold: true, color: '5B21B6' });
    slide.addText(placement.specs.map((spec) => `• ${spec.label}: ${spec.value}`).join('\n'), { x: 0.55, y: 1.35, w: 5.7, h: 2.1, fontSize: 10, color: '20171F', breakLine: false });
    slide.addText('Copy needed', { x: 6.7, y: 1.0, w: 2.8, h: 0.3, fontSize: 15, bold: true, color: '5B21B6' });
    slide.addText(placement.copyFields.map((field) => `• ${field.label} (${field.limit})\n  ${field.placeholder}`).join('\n'), { x: 6.7, y: 1.35, w: 5.8, h: 2.4, fontSize: 10, color: '20171F' });
    slide.addText(`Sources: ${placement.sourceUrls.join(' | ')}`, { x: 0.55, y: 6.45, w: 12, h: 0.35, fontSize: 8, color: '5B21B6' });
  }

  await pptx.writeFile({ fileName: `digital-task-brief-${new Date().toISOString().slice(0, 10)}.pptx` });
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
