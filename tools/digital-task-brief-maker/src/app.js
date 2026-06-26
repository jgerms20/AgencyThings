const planInput = document.querySelector('#plan-input');
const planFileInput = document.querySelector('#plan-file');
const dropZone = document.querySelector('#drop-zone');
const fileStatus = document.querySelector('#file-status');
const generateButton = document.querySelector('#generate');
const clearButton = document.querySelector('#clear');
const loadSampleButton = document.querySelector('#load-sample');
const reviewList = document.querySelector('#review-list');
const sourceList = document.querySelector('#source-list');
const sourceCount = document.querySelector('#source-count');
const matchCount = document.querySelector('#match-count');
const workflowScore = document.querySelector('#workflow-score');
const briefOutput = document.querySelector('#brief-output');
const cardTemplate = document.querySelector('#placement-card-template');
const copyBriefButton = document.querySelector('#copy-brief');
const exportJsonButton = document.querySelector('#export-json');
const exportPptButton = document.querySelector('#export-ppt');
const printBriefButton = document.querySelector('#print-brief');
const meters = {
  ingest: document.querySelector('#meter-ingest'),
  match: document.querySelector('#meter-match'),
  verify: document.querySelector('#meter-verify'),
  brief: document.querySelector('#meter-brief')
};

const cdn = {
  xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm',
  jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm',
  pdf: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs',
  pdfWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs',
  pptx: 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm'
};

const samplePlan = `Platform,Placement,Size,Units,Notes
Instagram,Feed Static Image,1080x1350,2,Launch post and offer variant
TikTok,TopView,9:16,1,Hero awareness video
Pinterest,Standard Pin / Static Pin,1000x1500,3,Recipe-inspired discovery creative
X,Promoted Post Static Image,1:1,1,Launch day amplification
YouTube,Skippable In-Stream,16:9,2,:15 and :30 cutdowns`;

let placementLibrary = [];
let currentBrief = [];
let modules = {};

async function boot() {
  placementLibrary = await fetch('./data/placements.json').then((response) => response.json());
  loadSampleButton.addEventListener('click', loadSamplePlan);
  generateButton.addEventListener('click', generateBrief);
  clearButton.addEventListener('click', clearWorkspace);
  copyBriefButton.addEventListener('click', copyBriefText);
  exportJsonButton.addEventListener('click', exportBriefJson);
  exportPptButton.addEventListener('click', exportPowerPointBrief);
  printBriefButton.addEventListener('click', () => window.print());
  planFileInput.addEventListener('change', handleFileSelection);
  planInput.addEventListener('input', () => updateProgress(currentBrief));
  bindDropZone();
  updateProgress([]);
}

function bindDropZone() {
  for (const eventName of ['dragenter', 'dragover']) {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add('dragging');
    });
  }

  for (const eventName of ['dragleave', 'drop']) {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove('dragging');
    });
  }

  dropZone.addEventListener('drop', async (event) => {
    const file = event.dataTransfer.files?.[0];
    if (file) await importFile(file);
  });
}

async function handleFileSelection(event) {
  const file = event.target.files?.[0];
  if (file) await importFile(file);
}

async function importFile(file) {
  try {
    fileStatus.textContent = `Reading ${file.name}`;
    const text = await readPlanFile(file);
    planInput.value = text.trim();
    fileStatus.textContent = `Loaded ${file.name}`;
    showToast(`Loaded ${file.name}`);
    generateBrief();
  } catch (error) {
    fileStatus.textContent = 'Could not read file';
    showToast(error.message || 'Could not read that file.');
  }
}

async function readPlanFile(file) {
  const name = file.name.toLowerCase();
  if (/\.xlsx?$/.test(name)) return readSpreadsheet(file);
  if (/\.pdf$/.test(name)) return readPdf(file);
  if (/\.pptx$/.test(name)) return readPowerPoint(file);
  return file.text();
}

async function readSpreadsheet(file) {
  const XLSX = await loadXlsx();
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const rows = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
    for (const row of sheetRows) {
      if (row.some((cell) => String(cell).trim())) rows.push(row.map(csvEscape).join(','));
    }
  }

  return rows.join('\n');
}

async function readPdf(file) {
  const pdfjs = await loadPdfjs();
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => item.str).join(' ');
    if (text.trim()) pages.push(text);
  }

  return pages.join('\n');
}

async function readPowerPoint(file) {
  const JSZip = await loadJsZip();
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => Number(a.match(/slide(\d+)/)?.[1] || 0) - Number(b.match(/slide(\d+)/)?.[1] || 0));
  const parser = new DOMParser();
  const lines = [];

  for (const name of slideNames) {
    const xml = await zip.files[name].async('text');
    const doc = parser.parseFromString(xml, 'application/xml');
    const text = [...doc.querySelectorAll('a\\:t, t')].map((node) => node.textContent.trim()).filter(Boolean).join(' ');
    if (text) lines.push(text);
  }

  return lines.join('\n');
}

async function loadXlsx() {
  if (!modules.xlsx) {
    const imported = await import(cdn.xlsx);
    modules.xlsx = imported.default || imported;
  }
  return modules.xlsx;
}

async function loadJsZip() {
  if (!modules.jszip) {
    const imported = await import(cdn.jszip);
    modules.jszip = imported.default || imported;
  }
  return modules.jszip;
}

async function loadPdfjs() {
  if (!modules.pdfjs) {
    modules.pdfjs = await import(cdn.pdf);
    modules.pdfjs.GlobalWorkerOptions.workerSrc = cdn.pdfWorker;
  }
  return modules.pdfjs;
}

function loadSamplePlan() {
  planInput.value = samplePlan;
  fileStatus.textContent = 'Sample loaded';
  generateBrief();
}

function clearWorkspace() {
  planInput.value = '';
  planFileInput.value = '';
  fileStatus.textContent = 'No file selected';
  currentBrief = [];
  matchCount.textContent = '0 placements';
  sourceCount.textContent = '0 sources';
  reviewList.className = 'review-list empty-state';
  reviewList.textContent = 'Add a media plan to see match confidence and missing specs.';
  sourceList.className = 'source-list empty-state';
  sourceList.textContent = 'Source links and visual search prompts will appear here.';
  briefOutput.className = 'brief-output empty-state';
  briefOutput.textContent = 'Your assembled brief will appear here.';
  updateProgress([]);
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
      searchText: match.searchText,
      matchSignals: match.signals
    };
  });

  renderReview(currentBrief);
  renderSources(currentBrief);
  renderBrief(currentBrief);
  updateProgress(currentBrief);
}

function parsePlan(input) {
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];

  const parsedRows = lines.map(splitRow).filter((cells) => cells.some(Boolean));
  const headerMap = getHeaderMap(parsedRows[0]);
  const dataRows = headerMap ? parsedRows.slice(1) : parsedRows;

  return dataRows
    .map((cells) => rowFromCells(cells, headerMap))
    .filter((row) => row.platform || row.placement || row.notes);
}

function splitRow(line) {
  if (line.includes('\t')) return line.split('\t').map(cleanCell);
  if (line.includes(',')) return parseCsvLine(line).map(cleanCell);
  return [cleanCell(line)];
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

function cleanCell(value) {
  return String(value || '').trim().replace(/^"|"$/g, '');
}

function getHeaderMap(cells) {
  const normalized = cells.map(normalizeHeader);
  const map = {
    platform: findHeaderIndex(normalized, ['platform', 'channel', 'publisher', 'network']),
    placement: findHeaderIndex(normalized, ['placement', 'ad unit', 'adunit', 'format', 'deliverable', 'tactic']),
    size: findHeaderIndex(normalized, ['size', 'dimension', 'dimensions', 'ratio', 'spec']),
    units: findHeaderIndex(normalized, ['unit', 'units', 'qty', 'quantity', 'count']),
    notes: findHeaderIndex(normalized, ['note', 'notes', 'description', 'details', 'message'])
  };
  const hits = Object.values(map).filter((index) => index > -1).length;
  return hits >= 2 ? map : null;
}

function findHeaderIndex(headers, candidates) {
  return headers.findIndex((header) => candidates.some((candidate) => header === candidate || header.includes(candidate)));
}

function normalizeHeader(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function rowFromCells(cells, headerMap) {
  if (headerMap) {
    return {
      platform: getMappedCell(cells, headerMap.platform),
      placement: getMappedCell(cells, headerMap.placement),
      size: getMappedCell(cells, headerMap.size),
      units: getMappedCell(cells, headerMap.units),
      notes: getMappedCell(cells, headerMap.notes) || cells.filter(Boolean).join(' | ')
    };
  }

  if (cells.length === 1) return rowFromPlainText(cells[0]);

  return {
    platform: cells[0] || detectPlatform(cells.join(' ')),
    placement: cells[1] || cells[0] || '',
    size: cells[2] || detectSize(cells.join(' ')),
    units: cells[3] || '',
    notes: cells.slice(4).join(' | ')
  };
}

function getMappedCell(cells, index) {
  return index > -1 ? cells[index] || '' : '';
}

function rowFromPlainText(text) {
  return {
    platform: detectPlatform(text),
    placement: text,
    size: detectSize(text),
    units: '',
    notes: text
  };
}

function detectPlatform(text) {
  const normalizedText = normalize(text);
  const placement = placementLibrary.find((item) => normalizedText.includes(normalize(item.platform)));
  return placement?.platform || '';
}

function detectSize(text) {
  return text.match(/\d{2,5}\s?x\s?\d{2,5}|\d{1,2}:\d{1,2}/i)?.[0] || '';
}

function findBestPlacement(row) {
  const searchText = normalize(`${row.platform} ${row.placement} ${row.size} ${row.notes}`);
  let best = { placement: null, confidence: 0, searchText, signals: [] };

  for (const placement of placementLibrary) {
    const candidates = [placement.platform, placement.placement, placement.assetType, ...(placement.aliases || [])].filter(Boolean);
    const signals = candidates.map((candidate) => scoreCandidate(searchText, candidate)).sort((a, b) => b.score - a.score);
    const platformBonus = searchText.includes(normalize(placement.platform)) ? 0.08 : 0;
    const topScore = Math.min(1, (signals[0]?.score || 0) + platformBonus);

    if (topScore > best.confidence) {
      best = { placement, confidence: topScore, searchText, signals: signals.slice(0, 4) };
    }
  }

  if (best.confidence < 0.36) best.placement = null;
  return best;
}

function scoreCandidate(source, candidate) {
  const normalized = normalize(candidate);
  if (!normalized) return { original: candidate, score: 0, tokens: [] };
  if (source.includes(normalized)) return { original: candidate, score: 1, tokens: normalized.split(' ') };

  const tokens = normalized.split(' ').filter((token) => token.length > 1);
  const hits = tokens.filter((token) => source.includes(token));
  const score = tokens.length ? hits.length / tokens.length : 0;
  return { original: candidate, score, tokens: hits };
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9:]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function renderReview(items) {
  matchCount.textContent = `${items.length} placement${items.length === 1 ? '' : 's'}`;

  if (!items.length) {
    reviewList.className = 'review-list empty-state';
    reviewList.textContent = 'No usable placement rows found. Add a media plan and try again.';
    return;
  }

  reviewList.className = 'review-list';
  reviewList.innerHTML = '';

  for (const item of items) {
    const card = document.createElement('article');
    const isMatched = Boolean(item.matchedPlacement);
    const confidence = Math.round(item.confidence * 100);
    card.className = `review-item${isMatched ? '' : ' unmatched'}`;
    card.innerHTML = isMatched
      ? `<div><strong>${escapeHtml(item.raw.platform || item.matchedPlacement.platform)} - ${escapeHtml(item.raw.placement || item.matchedPlacement.placement)}</strong><p>Matched to <b>${escapeHtml(item.matchedPlacement.platform)} ${escapeHtml(item.matchedPlacement.placement)}</b> <span class="confidence">${confidence}%</span></p></div>${buildConfidenceDetails(item)}`
      : `<div><strong>${escapeHtml(item.raw.platform || 'Unknown platform')} - ${escapeHtml(item.raw.placement || 'Unknown placement')}</strong><p>No confident match yet. Add this placement to the spec library or edit the row text.</p></div>`;
    reviewList.append(card);
  }
}

function buildConfidenceDetails(item) {
  const signals = item.matchSignals.length
    ? item.matchSignals.map((signal) => `<li><b>${escapeHtml(signal.original)}</b> scored ${Math.round(signal.score * 100)}%${signal.tokens.length ? ` from tokens: ${escapeHtml(signal.tokens.join(', '))}` : ''}</li>`).join('')
    : '<li>No detailed signals available.</li>';
  return `
    <details class="confidence-details">
      <summary>Confidence details</summary>
      <p><strong>Imported text:</strong> ${escapeHtml(item.searchText)}</p>
      <ul>${signals}</ul>
    </details>
  `;
}

function renderSources(items) {
  const matched = items.filter((item) => item.matchedPlacement);
  const sourceTotal = matched.reduce((count, item) => count + (item.matchedPlacement.sourceUrls || []).length, 0);
  sourceCount.textContent = `${sourceTotal} source${sourceTotal === 1 ? '' : 's'}`;

  if (!items.length) {
    sourceList.className = 'source-list empty-state';
    sourceList.textContent = 'Source links and visual search prompts will appear here.';
    return;
  }

  sourceList.className = 'source-list';
  sourceList.innerHTML = '';

  for (const item of items) {
    const card = document.createElement('article');
    card.className = `source-card${item.matchedPlacement ? '' : ' source-card-warning'}`;

    if (!item.matchedPlacement) {
      card.innerHTML = `<strong>${escapeHtml(item.raw.platform || 'Unknown platform')} - ${escapeHtml(item.raw.placement || 'Unknown placement')}</strong><p>No source package yet.</p>`;
      sourceList.append(card);
      continue;
    }

    const placement = item.matchedPlacement;
    const confidence = Math.round(item.confidence * 100);
    const sourceLinks = (placement.sourceUrls || []).map(toSourceLink).join('');
    const searchTiles = (placement.exampleSearches || [`${placement.platform} ${placement.placement} ad example`]).map(toSearchTile).join('');
    card.innerHTML = `
      <div class="source-card-header">
        <div>
          <strong>${escapeHtml(placement.platform)} - ${escapeHtml(placement.placement)}</strong>
          <p>${confidence}% match</p>
        </div>
        <span class="confidence-chip">Verify</span>
      </div>
      <div class="source-links">${sourceLinks}</div>
      <ul class="verification-list">
        <li>Confirm current dimensions, ratio, duration, and copy limits.</li>
        <li>Confirm examples match the same platform placement.</li>
        <li>Clip only references that clarify creative behavior.</li>
      </ul>
      <div class="clip-grid">${searchTiles}</div>
    `;
    sourceList.append(card);
  }
}

function toSourceLink(url) {
  let label = url;
  try {
    label = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    label = 'source';
  }
  return `<a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function toSearchTile(query) {
  const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  return `<a class="clip-tile" href="${escapeAttribute(searchUrl)}" target="_blank" rel="noreferrer"><span>Image search</span><strong>${escapeHtml(query)}</strong></a>`;
}

function renderBrief(items) {
  if (!items.length) {
    briefOutput.className = 'brief-output empty-state';
    briefOutput.textContent = 'Your assembled brief will appear here.';
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
  meta.innerHTML = `<h3>Digital task brief</h3><p><strong>${matched}/${items.length}</strong> placements matched to the starter spec library.</p>`;
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
  card.querySelector('.spec-list').append(...(placement.specs || []).map((spec) => toListItem(`${spec.label}: ${spec.value}`)));
  card.querySelector('.copy-list').append(...(placement.copyFields || []).map(toCopyField));
  card.querySelector('.prompt-list').append(...(placement.creativePrompts || []).map(toListItem));
  card.querySelector('.source-block').append(buildSourceContent(placement, item));
  return fragment;
}

function buildSafeZonePreview(placement) {
  const ratioSpec = (placement.specs || []).find((spec) => /ratio/i.test(spec.label));
  const resolutionSpec = (placement.specs || []).find((spec) => /resolution|size|dimension/i.test(spec.label));
  const ratio = ratioSpec?.value || 'Confirm ratio in source';
  const resolution = resolutionSpec?.value || 'Confirm exact size in source';
  const isVertical = /9:16|4:5|2:3|1080\s?x\s?1920|1000\s?x\s?1500/i.test(`${ratio} ${resolution}`);
  const wrapper = document.createElement('div');
  wrapper.className = `safe-zone-preview${isVertical ? ' vertical' : ''}`;
  wrapper.innerHTML = `
    <div class="safe-zone-art" aria-hidden="true">
      <span class="safe-zone top">Avoid UI</span>
      <span class="safe-zone middle">Keep logo, product, claim, CTA here</span>
      <span class="safe-zone bottom">Avoid captions</span>
    </div>
    <div class="safe-zone-notes">
      <h4>Spec visual</h4>
      <p><strong>Ratio:</strong> ${escapeHtml(ratio)}</p>
      <p><strong>Size:</strong> ${escapeHtml(resolution)}</p>
    </div>
  `;
  return wrapper;
}

function buildUnmatchedCard(item) {
  const card = document.createElement('section');
  card.className = 'brief-card unmatched-card';
  card.innerHTML = `
    <div class="brief-card-header">
      <div>
        <p class="platform">Needs setup</p>
        <h3>${escapeHtml(item.raw.platform || 'Unknown platform')} - ${escapeHtml(item.raw.placement || 'Unknown placement')}</h3>
      </div>
      <span class="asset-type">Unmatched</span>
    </div>
    <p>Add this placement to the spec library, then regenerate the brief.</p>
    <div class="copy-field"><strong>Copy placeholder</strong><span>Limit: confirm platform requirements</span><p>Write copy here once the placement is defined.</p></div>
  `;
  return card;
}

function buildSourceContent(placement, item) {
  const wrapper = document.createElement('div');
  const rowNotes = [item.raw.size && `Plan size: ${item.raw.size}`, item.raw.units && `Units: ${item.raw.units}`, item.raw.notes && `Notes: ${item.raw.notes}`].filter(Boolean).join(' | ');
  const sourceLinks = (placement.sourceUrls || []).map(toSourceLink).join('');
  const searches = (placement.exampleSearches || []).map((query) => `<span>${escapeHtml(query)}</span>`).join('');
  wrapper.className = 'source-block-inner';
  wrapper.innerHTML = `
    ${rowNotes ? `<p><strong>Media plan notes:</strong> ${escapeHtml(rowNotes)}</p>` : ''}
    <p><strong>Spec verification:</strong></p>
    <div class="source-links compact-links">${sourceLinks}</div>
    ${searches ? `<p><strong>Example searches:</strong> ${searches}</p>` : ''}
  `;
  return wrapper;
}

function toListItem(text) {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
}

function toCopyField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'copy-field';
  wrapper.innerHTML = `<strong>${escapeHtml(field.label)}</strong><span>Limit: ${escapeHtml(field.limit)}</span><p>${escapeHtml(field.placeholder)}</p>`;
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
    `${placement.platform} - ${placement.placement}`,
    `Confidence: ${Math.round(item.confidence * 100)}%`,
    `Plan notes: ${[item.raw.size, item.raw.units, item.raw.notes].filter(Boolean).join(' | ') || 'None'}`,
    'Specs:',
    ...(placement.specs || []).map((spec) => `- ${spec.label}: ${spec.value}`),
    'Copy needed:',
    ...(placement.copyFields || []).map((field) => `- ${field.label} (${field.limit}): ${field.placeholder}`),
    'Creative prompts:',
    ...(placement.creativePrompts || []).map((prompt) => `- ${prompt}`),
    `Sources: ${(placement.sourceUrls || []).join(' | ')}`
  ].join('\n');
}

function exportBriefJson() {
  if (!currentBrief.length) return showToast('Generate a brief first.');
  const blob = new Blob([JSON.stringify(currentBrief, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `digital-task-brief-${dateStamp()}.json`);
  showToast('JSON exported.');
}

async function exportPowerPointBrief() {
  if (!currentBrief.length) return showToast('Generate a brief first.');
  const imported = await import(cdn.pptx);
  const PptxGenJS = imported.default || imported;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'AgencyThings';
  pptx.subject = 'Digital Task Brief';
  pptx.title = 'Digital Task Brief';

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '111111' };
  titleSlide.addText('Digital Task Brief', { x: 0.6, y: 0.55, w: 12, h: 0.6, fontSize: 34, bold: true, color: 'FFFFFF' });
  titleSlide.addText(`${currentBrief.filter((item) => item.matchedPlacement).length}/${currentBrief.length} placements matched`, { x: 0.6, y: 1.35, w: 10, h: 0.4, fontSize: 16, color: 'FFD400' });

  for (const item of currentBrief) {
    const slide = pptx.addSlide();
    const placement = item.matchedPlacement;
    const title = placement ? `${placement.platform} - ${placement.placement}` : `${item.raw.platform || 'Unknown'} - ${item.raw.placement || 'Unknown placement'}`;
    slide.addText(title, { x: 0.45, y: 0.35, w: 12.2, h: 0.45, fontSize: 21, bold: true, color: '111111' });
    slide.addText(`Match confidence: ${Math.round(item.confidence * 100)}%`, { x: 0.45, y: 0.85, w: 5, h: 0.3, fontSize: 11, color: '444444' });

    if (!placement) {
      slide.addText('Needs setup in the placement library before a complete brief can be generated.', { x: 0.55, y: 1.4, w: 10.5, h: 0.5, fontSize: 15, color: 'B00020' });
      continue;
    }

    slide.addText('Specs', { x: 0.55, y: 1.35, w: 5.6, h: 0.3, fontSize: 14, bold: true, color: '111111' });
    slide.addText((placement.specs || []).map((spec) => `- ${spec.label}: ${spec.value}`).join('\n'), { x: 0.55, y: 1.72, w: 5.8, h: 2.25, fontSize: 10, color: '222222' });
    slide.addText('Copy needed', { x: 6.75, y: 1.35, w: 5.6, h: 0.3, fontSize: 14, bold: true, color: '111111' });
    slide.addText((placement.copyFields || []).map((field) => `- ${field.label} (${field.limit})\n  ${field.placeholder}`).join('\n'), { x: 6.75, y: 1.72, w: 5.8, h: 2.65, fontSize: 10, color: '222222' });
    slide.addText(`Sources: ${(placement.sourceUrls || []).join(' | ')}`, { x: 0.55, y: 6.45, w: 12, h: 0.35, fontSize: 7.5, color: '444444' });
  }

  await pptx.writeFile({ fileName: `digital-task-brief-${dateStamp()}.pptx` });
  showToast('PowerPoint exported.');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function updateProgress(items) {
  const hasInput = Boolean(planInput.value.trim());
  const matched = items.filter((item) => item.matchedPlacement).length;
  const total = items.length;
  const sourceTotal = items.reduce((count, item) => count + (item.matchedPlacement?.sourceUrls?.length || 0), 0);
  const values = {
    ingest: hasInput ? 100 : 0,
    match: total ? Math.round((matched / total) * 100) : 0,
    verify: sourceTotal ? 100 : 0,
    brief: total ? 100 : 0
  };

  for (const [key, value] of Object.entries(values)) meters[key].value = value;
  const ready = Math.round((values.ingest + values.match + values.verify + values.brief) / 4);
  workflowScore.textContent = `${ready}% ready`;

  setNodeState('ingest', values.ingest);
  setNodeState('match', values.match);
  setNodeState('verify', values.verify);
  setNodeState('clip', sourceTotal ? 100 : 0);
  setNodeState('brief', values.brief);
}

function setNodeState(node, value) {
  const element = document.querySelector(`[data-node="${node}"]`);
  element.classList.toggle('complete', value >= 100);
  element.classList.toggle('active', value > 0 && value < 100);
}

function csvEscape(value) {
  const text = String(value ?? '').trim();
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
};

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => escapeMap[char]);
}

function escapeAttribute(value = '') {
  return escapeHtml(value);
}

boot().catch((error) => {
  console.error(error);
  showToast('The tool could not start. Refresh and try again.');
});
