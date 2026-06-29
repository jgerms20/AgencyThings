import * as BriefCore from './mediaPlan.js';

const planInput = document.querySelector('#plan-input');
const planFileInput = document.querySelector('#plan-file');
const dropZone = document.querySelector('#drop-zone');
const fileStatus = document.querySelector('#file-status');
const uploadButton = document.querySelector('#generate');
const clearButton = document.querySelector('#clear');
const loadSampleButton = document.querySelector('#load-sample');
const reviewList = document.querySelector('#review-list');
const sourceList = document.querySelector('#source-list');
const briefOutput = document.querySelector('#brief-output');
const reviewSummary = document.querySelector('#review-summary');
const matchCount = document.querySelector('#match-count');
const sourceCount = document.querySelector('#source-count');
const deckCount = document.querySelector('#deck-count');
const deckPlan = document.querySelector('#deck-plan');
const workflowState = document.querySelector('#workflow-state');
const themeToggle = document.querySelector('#theme-toggle');
const briefOptions = document.querySelector('#brief-options');
const copyBriefButton = document.querySelector('#copy-brief');
const exportJsonButton = document.querySelector('#export-json');
const exportPptButton = document.querySelector('#export-ppt');
const printBriefButton = document.querySelector('#print-brief');
const approveConfidentButton = document.querySelector('#approve-confident');
const markAllTbdButton = document.querySelector('#mark-all-tbd');
const stepButtons = [...document.querySelectorAll('.step-button')];
const stepPanels = [...document.querySelectorAll('.step-panel')];

const statPlacements = document.querySelector('#stat-placements');
const statApproved = document.querySelector('#stat-approved');
const statTbd = document.querySelector('#stat-tbd');
const statSources = document.querySelector('#stat-sources');
const previewClient = document.querySelector('#preview-client');
const previewCampaign = document.querySelector('#preview-campaign');

const cdn = {
  xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm',
  jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm',
  pdf: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs',
  pdfWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs',
  pptx: 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm'
};

const stepLabels = ['Upload', 'Review', 'Sources', 'Customize', 'Export'];
const samplePlan = `Platform,Placement,Size,Units,Notes
Instagram,Feed Static Image,1080x1350,2,Launch post and offer variant
TikTok,TopView,9:16,1,Hero awareness video
Pinterest,Standard Pin / Static Pin,1000x1500,3,Recipe-inspired discovery creative
X,Promoted Post Static Image,1:1,1,Launch day amplification
YouTube,Skippable In-Stream,16:9,2,:15 and :30 cutdowns`;

let placementLibrary = [];
let modules = {};

const state = {
  activeStep: 0,
  items: [],
  groups: [],
  decisions: {},
  sourceNotes: {},
  options: defaultOptions()
};

async function boot() {
  placementLibrary = await fetch('./data/placements.json').then((response) => response.json());
  restoreTheme();
  bindEvents();
  collectOptions();
  updateInterface();
}

function bindEvents() {
  uploadButton.addEventListener('click', () => generateBrief({ goToReview: true }));
  clearButton.addEventListener('click', clearWorkspace);
  loadSampleButton.addEventListener('click', loadSamplePlan);
  planFileInput.addEventListener('change', handleFileSelection);
  planInput.addEventListener('input', () => updateStats());
  copyBriefButton.addEventListener('click', copyBriefText);
  exportJsonButton.addEventListener('click', exportBriefJson);
  exportPptButton.addEventListener('click', exportPowerPointBrief);
  printBriefButton.addEventListener('click', () => window.print());
  approveConfidentButton.addEventListener('click', approveConfidentGroups);
  markAllTbdButton.addEventListener('click', markAllTbd);
  themeToggle.addEventListener('click', toggleTheme);

  briefOptions.addEventListener('input', () => {
    collectOptions();
    renderDeckPlan();
    renderBrief();
  });
  briefOptions.addEventListener('change', () => {
    collectOptions();
    renderDeckPlan();
    renderBrief();
  });

  reviewList.addEventListener('click', handleReviewAction);
  sourceList.addEventListener('input', handleSourceNote);

  document.addEventListener('click', (event) => {
    const stepButton = event.target.closest('[data-step]');
    if (stepButton) return goToStep(Number(stepButton.dataset.step));
    if (event.target.closest('[data-prev-step]')) return goToStep(Math.max(0, state.activeStep - 1));
    if (event.target.closest('[data-next-step]')) return goToStep(Math.min(stepLabels.length - 1, state.activeStep + 1));
  });

  bindDropZone();
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
    fileStatus.textContent = `Loaded ${file.name}. Click Upload to review.`;
    showToast('File loaded. Click Upload to review matches.');
    updateStats();
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
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', raw: false, cellDates: true });
  const sheets = [];
  const fallbackRows = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
    BriefCore.applyMergedSpreadsheetCells(sheet, sheetRows);
    sheets.push({ sheetName, rows: sheetRows });
    for (const row of sheetRows) {
      if (row.some((cell) => String(cell).trim())) fallbackRows.push(row.map(csvEscape).join(','));
    }
  }

  const inventoryRows = BriefCore.extractInventoryWorkbookSheets(sheets);
  if (inventoryRows.length >= 3) return BriefCore.inventoryRowsToPlanText(inventoryRows);
  return fallbackRows.join('\n');
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
  generateBrief({ goToReview: true });
}

function clearWorkspace() {
  planInput.value = '';
  planFileInput.value = '';
  fileStatus.textContent = 'No file selected';
  state.items = [];
  state.groups = [];
  state.decisions = {};
  state.sourceNotes = {};
  collectOptions();
  goToStep(0, { silent: true });
  updateInterface();
}

function generateBrief({ goToReview = false } = {}) {
  const rows = parsePlan(planInput.value);
  state.items = rows.map((row, index) => {
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

  state.groups = buildGroups(state.items);
  seedReviewDecisions();
  collectOptions();
  updateInterface();

  if (!state.groups.length) {
    showToast('No usable placements found. Try a table with Platform and Placement columns.');
    return;
  }

  if (goToReview) goToStep(1);
}

function parsePlan(input) {
  return BriefCore.parsePlan(input, placementLibrary);
}

function toCandidateLines(input) {
  const rawLines = input.split(/\r?\n|[;•]+/).map((line) => line.trim()).filter(Boolean);
  const expanded = rawLines.flatMap((line) => {
    if (line.length > 260 && !line.includes(',') && !line.includes('\t')) return chunkPlainTextLine(line);
    return [line];
  });
  const filtered = expanded.filter(isLikelyDeliverableLine);
  return filtered.length ? filtered : rawLines.slice(0, 40);
}

function chunkPlainTextLine(line) {
  const platforms = [...new Set(placementLibrary.map((item) => item.platform).concat(['Meta', 'Facebook', 'Twitter', 'LinkedIn', 'Snapchat']))]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp);
  if (!platforms.length) return [line];
  const pattern = new RegExp(`(?=\\b(?:${platforms.join('|')})\\b)`, 'i');
  const chunks = line.split(pattern).map((chunk) => chunk.trim()).filter(Boolean);
  return chunks.length > 1 ? chunks : [line];
}

function isLikelyDeliverableLine(line) {
  if (line.includes(',') || line.includes('\t')) return true;
  if (detectPlatform(line) || detectSize(line)) return true;
  return placementLibrary.some((placement) => normalize(line).includes(normalize(placement.placement)));
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
      notes: conciseText(getMappedCell(cells, headerMap.notes) || cells.filter(Boolean).join(' | '), 180)
    };
  }

  if (cells.length === 1) return rowFromPlainText(cells[0]);

  return {
    platform: cells[0] || detectPlatform(cells.join(' ')),
    placement: cells[1] || cells[0] || '',
    size: cells[2] || detectSize(cells.join(' ')),
    units: cells[3] || '',
    notes: conciseText(cells.slice(4).join(' | '), 180)
  };
}

function getMappedCell(cells, index) {
  return index > -1 ? cells[index] || '' : '';
}

function rowFromPlainText(text) {
  const platform = detectPlatform(text);
  const provisional = { platform, placement: conciseText(text, 100), size: detectSize(text), units: '', notes: conciseText(text, 180) };
  const match = findBestPlacement(provisional);
  return {
    platform,
    placement: match.placement?.placement || provisional.placement,
    size: provisional.size,
    units: '',
    notes: provisional.notes
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
  return BriefCore.findBestPlacement(row, placementLibrary);
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

function buildGroups(items) {
  return BriefCore.buildGroups(items);
}

function seedReviewDecisions() {
  const next = {};
  for (const group of state.groups) {
    next[group.key] = state.decisions[group.key] || 'tbd';
  }
  state.decisions = next;
}

function handleReviewAction(event) {
  const button = event.target.closest('[data-review-action]');
  if (!button) return;
  state.decisions[button.dataset.groupKey] = button.dataset.reviewAction;
  updateInterface();
}

function approveConfidentGroups() {
  for (const group of state.groups) {
    if (group.confidence >= 0.76 && state.decisions[group.key] !== 'rejected') state.decisions[group.key] = 'approved';
  }
  updateInterface();
}

function markAllTbd() {
  for (const group of state.groups) state.decisions[group.key] = 'tbd';
  updateInterface();
}

function handleSourceNote(event) {
  const field = event.target.closest('[data-source-note]');
  if (!field) return;
  state.sourceNotes[field.dataset.sourceNote] = field.value;
  renderBrief();
}

function goToStep(step, { silent = false } = {}) {
  if (!canVisitStep(step)) {
    if (!silent) showToast('Upload a plan first.');
    return;
  }
  state.activeStep = step;
  updateStepVisibility();
  updateStats();
  if (!silent) document.querySelector('.workflow-canvas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function canVisitStep(step) {
  return step === 0 || state.groups.length > 0;
}

function updateInterface() {
  renderReview();
  renderSources();
  renderDeckPlan();
  renderBrief();
  updateStepVisibility();
  updateStats();
}

function updateStepVisibility() {
  stepPanels.forEach((panel) => panel.classList.toggle('active', Number(panel.dataset.stepPanel) === state.activeStep));
  stepButtons.forEach((button) => {
    const step = Number(button.dataset.step);
    button.classList.toggle('active', step === state.activeStep);
    button.classList.toggle('complete', step < state.activeStep && canVisitStep(step));
    button.classList.toggle('locked', !canVisitStep(step));
  });
  workflowState.textContent = `Step ${state.activeStep + 1} of ${stepLabels.length} - ${stepLabels[state.activeStep]}`;
}

function updateStats() {
  const approved = state.groups.filter((group) => state.decisions[group.key] === 'approved').length;
  const rejected = state.groups.filter((group) => state.decisions[group.key] === 'rejected').length;
  const tbd = Math.max(0, state.groups.length - approved - rejected);
  const sources = state.groups.filter((group) => state.decisions[group.key] !== 'rejected').length;

  statPlacements.textContent = state.groups.length;
  statApproved.textContent = approved;
  statTbd.textContent = tbd;
  statSources.textContent = sources;
  matchCount.textContent = `${state.groups.length} group${state.groups.length === 1 ? '' : 's'}`;
  sourceCount.textContent = `${sources} source pack${sources === 1 ? '' : 's'}`;
}

function renderReview() {
  if (!state.groups.length) {
    reviewList.className = 'review-list empty-state';
    reviewList.textContent = 'No matches yet.';
    reviewSummary.textContent = 'Upload a plan to see compact platform and placement groups.';
    return;
  }

  const highConfidence = state.groups.filter((group) => group.confidence >= 0.76).length;
  reviewSummary.textContent = `${state.items.length} plan rows collapsed into ${state.groups.length} review groups. ${highConfidence} look high confidence.`;
  reviewList.className = 'review-list scroll-box';
  reviewList.innerHTML = '';

  for (const [platform, groups] of groupBy(state.groups, (group) => group.platform)) {
    const platformSection = document.createElement('section');
    platformSection.className = 'platform-group';
    platformSection.innerHTML = `<header><h3>${escapeHtml(platform)}</h3><span>${groups.length} placement${groups.length === 1 ? '' : 's'}</span></header>`;

    const rows = document.createElement('div');
    rows.className = 'platform-group-list';
    for (const group of groups) rows.append(buildReviewCard(group));
    platformSection.append(rows);
    reviewList.append(platformSection);
  }
}

function buildReviewCard(group) {
  const status = state.decisions[group.key] || 'tbd';
  const card = document.createElement('article');
  card.className = `review-item status-${status}`;
  const specs = group.specNotes.slice(0, 2).map((spec) => `<span>Specs: ${escapeHtml(spec)}</span>`).join('')
    || specSummary(group.matchedPlacement, 2).map((spec) => `<span>${escapeHtml(spec)}</span>`).join('');
  const planFacts = [
    ...(group.channels || []).slice(0, 1).map((channel) => `Channel: ${channel}`),
    ...(group.partners || []).slice(0, 2).map((partner) => `Partner: ${partner}`),
    ...(group.formats || []).slice(0, 1).map((format) => `Format: ${format}`)
  ].map((fact) => `<span>${escapeHtml(fact)}</span>`).join('');
  const sizeList = group.specNotes.length ? '' : [...group.sizes].slice(0, 2).map((size) => `<span>${escapeHtml(size)}</span>`).join('');
  const units = group.units || group.rows.length;
  const confidence = Math.round(group.confidence * 100);
  const notes = conciseText(group.notes.filter(Boolean).join(' | '), 120);

  card.innerHTML = `
    <div class="review-main">
      <div>
        <strong>${escapeHtml(group.placementName)}</strong>
        <p>${escapeHtml(group.matchedPlacement?.assetType || 'Needs spec setup')} - ${confidence}% confidence - ${group.rows.length} row${group.rows.length === 1 ? '' : 's'} - ${units} unit${units === 1 ? '' : 's'}</p>
      </div>
      <span class="status-chip">${statusLabel(status)}</span>
    </div>
    <div class="chip-row">${planFacts}${sizeList}${specs || '<span>Confirm specs manually</span>'}</div>
    ${notes ? `<p class="review-note">${escapeHtml(notes)}</p>` : ''}
    <div class="review-actions" role="group" aria-label="Review ${escapeAttribute(group.placementName)}">
      <button type="button" class="choice ${status === 'approved' ? 'selected' : ''}" data-group-key="${escapeAttribute(group.key)}" data-review-action="approved">OK Approve</button>
      <button type="button" class="choice ${status === 'tbd' ? 'selected' : ''}" data-group-key="${escapeAttribute(group.key)}" data-review-action="tbd">? TBD</button>
      <button type="button" class="choice danger ${status === 'rejected' ? 'selected' : ''}" data-group-key="${escapeAttribute(group.key)}" data-review-action="rejected">X Needs fix</button>
    </div>
  `;
  return card;
}

function renderSources() {
  const groups = outputGroups();
  if (!groups.length) {
    sourceList.className = 'source-list empty-state';
    sourceList.textContent = 'Approve or mark placements TBD to build the source package.';
    return;
  }

  sourceList.className = 'source-list scroll-box';
  sourceList.innerHTML = '';

  for (const group of groups) {
    const placement = group.matchedPlacement;
    const card = document.createElement('article');
    card.className = 'source-card';
    const sourceLinks = (placement?.sourceUrls || []).map(toSourceLink).join('') || '<span class="muted">No source URLs in the spec library yet.</span>';
    const searchTiles = buildSearchPack(group).map(toSearchTile).join('');
    const note = state.sourceNotes[group.key] || '';

    card.innerHTML = `
      <div class="source-card-header">
        <div>
          <strong>${escapeHtml(group.platform)} - ${escapeHtml(group.placementName)}</strong>
          <p>${statusLabel(state.decisions[group.key])} - use these links to verify specs and examples.</p>
        </div>
        <span class="confidence-chip">${Math.round(group.confidence * 100)}%</span>
      </div>
      <div class="source-links">${sourceLinks}</div>
      <div class="source-checks">
        <label><input type="checkbox" /> Specs checked</label>
        <label><input type="checkbox" /> Examples useful</label>
        <label><input type="checkbox" /> Safe zones noted</label>
      </div>
      <div class="clip-grid">${searchTiles}</div>
      <label class="note-field">Reference notes<textarea data-source-note="${escapeAttribute(group.key)}" rows="3" placeholder="Paste example links, source notes, or visual direction here.">${escapeHtml(note)}</textarea></label>
    `;
    sourceList.append(card);
  }
}

function buildSearchPack(group) {
  return BriefCore.buildSearchPack(group, state.options);
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

function toSearchTile(item) {
  const searchUrl = item.type === 'web'
    ? `https://www.google.com/search?q=${encodeURIComponent(item.query)}`
    : `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(item.query)}`;
  return `<a class="clip-tile" href="${escapeAttribute(searchUrl)}" target="_blank" rel="noreferrer"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.query)}</strong></a>`;
}

function collectOptions() {
  state.options = {
    clientName: document.querySelector('#client-name')?.value.trim() || 'Client / brand',
    campaignName: document.querySelector('#campaign-name')?.value.trim() || 'Campaign name',
    slideCount: Math.max(1, Number(document.querySelector('#slide-count')?.value || 12)),
    slideStrategy: document.querySelector('#slide-strategy')?.value || 'platform',
    primaryColor: document.querySelector('#primary-color')?.value || '#ffd400',
    accentColor: document.querySelector('#accent-color')?.value || '#00a7a7',
    includeSafeZones: Boolean(document.querySelector('#include-safe-zones')?.checked),
    includeSources: Boolean(document.querySelector('#include-sources')?.checked),
    includeSearches: Boolean(document.querySelector('#include-searches')?.checked),
    includeReviewStatus: Boolean(document.querySelector('#include-review-status')?.checked)
  };
  document.documentElement.style.setProperty('--client-primary', state.options.primaryColor);
  document.documentElement.style.setProperty('--client-accent', state.options.accentColor);
  previewClient.textContent = state.options.clientName;
  previewCampaign.textContent = state.options.campaignName;
}

function defaultOptions() {
  return {
    clientName: 'Client / brand',
    campaignName: 'Campaign name',
    slideCount: 12,
    slideStrategy: 'platform',
    primaryColor: '#ffd400',
    accentColor: '#00a7a7',
    includeSafeZones: true,
    includeSources: true,
    includeSearches: true,
    includeReviewStatus: true
  };
}

function renderDeckPlan() {
  const slides = buildSlidePlan();
  const appendixCount = state.options.includeSources && outputGroups().length ? Math.ceil(outputGroups().length / 10) : 0;
  const titleCount = slides.length ? 1 : 0;
  const totalSlides = titleCount + slides.length + appendixCount;
  deckCount.textContent = `${totalSlides} slide${totalSlides === 1 ? '' : 's'} planned`;

  if (!slides.length) {
    deckPlan.className = 'deck-plan empty-state';
    deckPlan.textContent = 'Upload and review placements to see the deck plan.';
    return;
  }

  deckPlan.className = 'deck-plan';
  const titleCard = `
    <article>
      <span>Slide 1</span>
      <strong>Title</strong>
      <p>${escapeHtml(state.options.clientName)} - ${escapeHtml(state.options.campaignName)}</p>
    </article>
  `;
  const contentCards = slides.map((slide, index) => `
    <article>
      <span>Slide ${index + 2}</span>
      <strong>${escapeHtml(slide.title)}</strong>
      <p>${slide.groups.map((group) => `${group.platform} - ${group.placementName}`).map(escapeHtml).join(' | ')}</p>
    </article>
  `).join('');
  const appendixCards = Array.from({ length: appendixCount }, (_, index) => `
    <article>
      <span>Slide ${slides.length + index + 2}</span>
      <strong>Sources and searches ${index + 1}/${appendixCount}</strong>
      <p>Verification links, official-search prompts, image searches, and notes.</p>
    </article>
  `).join('');
  deckPlan.innerHTML = titleCard + contentCards + appendixCards;
}

function buildSlidePlan() {
  return BriefCore.buildSlidePlan(outputGroups(), state.options);
}

function renderBrief() {
  const slides = buildSlidePlan();
  if (!slides.length) {
    briefOutput.className = 'brief-output empty-state';
    briefOutput.textContent = 'Your assembled brief will appear here.';
    return;
  }

  briefOutput.className = 'brief-output';
  briefOutput.innerHTML = `
    <section class="brief-meta">
      <h3>${escapeHtml(state.options.clientName)} - ${escapeHtml(state.options.campaignName)}</h3>
      <p>${outputGroups().length} active placement groups. ${state.groups.filter((group) => state.decisions[group.key] === 'rejected').length} marked needs fix.</p>
    </section>
  `;

  for (const [index, slide] of slides.entries()) {
    const card = document.createElement('section');
    card.className = 'brief-card';
    card.innerHTML = `
      <div class="brief-card-header">
        <div>
          <p class="platform">Slide ${index + 1}</p>
          <h3>${escapeHtml(slide.title)}</h3>
        </div>
        <span class="asset-type">${slide.groups.length} placement${slide.groups.length === 1 ? '' : 's'}</span>
      </div>
      <div class="brief-slide-grid">${slide.groups.map(renderBriefGroup).join('')}</div>
    `;
    briefOutput.append(card);
  }

  if (state.options.includeSources) briefOutput.append(buildSourceAppendix());
}

function renderBriefGroup(group) {
  const placement = group.matchedPlacement;
  const status = state.decisions[group.key] || 'tbd';
  const specs = specSummary(placement, 5).map((spec) => `<li>${escapeHtml(spec)}</li>`).join('') || '<li>Confirm specs manually.</li>';
  const copyFields = (placement?.copyFields || []).slice(0, 4).map((field) => `<li>${escapeHtml(field.label)} - ${escapeHtml(field.limit)}</li>`).join('') || '<li>Confirm copy fields manually.</li>';
  const prompts = (placement?.creativePrompts || []).slice(0, 3).map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join('');
  const note = state.sourceNotes[group.key] ? `<p><strong>Reference notes:</strong> ${escapeHtml(state.sourceNotes[group.key])}</p>` : '';

  return `
    <article class="brief-placement">
      <header><strong>${escapeHtml(group.platform)} - ${escapeHtml(group.placementName)}</strong>${state.options.includeReviewStatus ? `<span>${escapeHtml(statusLabel(status))}</span>` : ''}</header>
      ${state.options.includeSafeZones ? buildSafeZoneMarkup(placement) : ''}
      <div class="grid-two compact-grid"><div><h4>Specs</h4><ul>${specs}</ul></div><div><h4>Copy</h4><ul>${copyFields}</ul></div></div>
      ${prompts ? `<h4>Creative prompts</h4><ul>${prompts}</ul>` : ''}
      ${note}
    </article>
  `;
}

function buildSafeZoneMarkup(placement) {
  const ratio = (placement?.specs || []).find((spec) => /ratio/i.test(spec.label))?.value || 'Confirm ratio';
  return `<div class="mini-safe-zone"><span>Safe zone</span><strong>${escapeHtml(ratio)}</strong><small>Keep logo, product, claim, CTA clear of UI.</small></div>`;
}

function buildSourceAppendix() {
  const appendix = document.createElement('section');
  appendix.className = 'brief-card source-appendix';
  appendix.innerHTML = `<div class="brief-card-header"><div><p class="platform">Appendix</p><h3>Sources and searches</h3></div></div>`;
  const list = document.createElement('div');
  list.className = 'appendix-list';

  for (const group of outputGroups()) {
    const links = (group.matchedPlacement?.sourceUrls || []).map(toSourceLink).join('') || '<span class="muted">No source links yet.</span>';
    const searches = state.options.includeSearches ? buildSearchPack(group).slice(0, 2).map((item) => `<span>${escapeHtml(item.query)}</span>`).join('') : '';
    const note = state.sourceNotes[group.key] ? `<p>${escapeHtml(state.sourceNotes[group.key])}</p>` : '';
    list.insertAdjacentHTML('beforeend', `<article><strong>${escapeHtml(group.platform)} - ${escapeHtml(group.placementName)}</strong><div class="source-links">${links}</div><div class="chip-row">${searches}</div>${note}</article>`);
  }

  appendix.append(list);
  return appendix;
}

function outputGroups() {
  return state.groups.filter((group) => state.decisions[group.key] !== 'rejected');
}

async function copyBriefText() {
  const text = toPlainTextBrief();
  if (!text) return showToast('Generate a brief first.');
  await navigator.clipboard.writeText(text);
  showToast('Brief text copied.');
}

function toPlainTextBrief() {
  const slides = buildSlidePlan();
  if (!slides.length) return '';
  return [
    `${state.options.clientName} - ${state.options.campaignName}`,
    `${outputGroups().length} placement groups`,
    '',
    ...slides.flatMap((slide, index) => [
      `Slide ${index + 1}: ${slide.title}`,
      ...slide.groups.flatMap((group) => groupToPlainText(group)),
      ''
    ])
  ].join('\n');
}

function groupToPlainText(group) {
  const placement = group.matchedPlacement;
  return [
    `${group.platform} - ${group.placementName}`,
    `Status: ${statusLabel(state.decisions[group.key] || 'tbd')}`,
    `Confidence: ${Math.round(group.confidence * 100)}%`,
    `Specs: ${specSummary(placement, 5).join('; ') || 'Confirm manually'}`,
    `Copy: ${(placement?.copyFields || []).map((field) => `${field.label} (${field.limit})`).join('; ') || 'Confirm manually'}`,
    state.sourceNotes[group.key] ? `Reference notes: ${state.sourceNotes[group.key]}` : ''
  ].filter(Boolean);
}

function exportBriefJson() {
  if (!state.groups.length) return showToast('Generate a brief first.');
  const payload = {
    options: state.options,
    groups: state.groups.map((group) => ({
      key: group.key,
      platform: group.platform,
      placement: group.placementName,
      status: state.decisions[group.key],
      confidence: group.confidence,
      rows: group.rows.length,
      sizes: [...group.sizes],
      sourceNotes: state.sourceNotes[group.key] || '',
      specs: specSummary(group.matchedPlacement, 10)
    }))
  };
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `digital-task-brief-${dateStamp(true)}.json`);
  showToast('JSON exported.');
}

async function exportPowerPointBrief() {
  const slides = buildSlidePlan();
  if (!slides.length) return showToast('Generate a brief first.');

  const imported = await import(cdn.pptx);
  const PptxGenJS = imported.default || imported;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Digital Task Brief Maker';
  pptx.subject = 'Digital Task Brief';
  pptx.title = `${state.options.clientName} Digital Task Brief`;

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: hexForPpt(document.body.classList.contains('dark-mode') ? '#111111' : state.options.primaryColor) };
  titleSlide.addText(state.options.clientName, { x: 0.55, y: 0.55, w: 12, h: 0.55, fontSize: 30, bold: true, color: document.body.classList.contains('dark-mode') ? 'FFFFFF' : '111111' });
  titleSlide.addText(state.options.campaignName, { x: 0.55, y: 1.22, w: 11.5, h: 0.38, fontSize: 17, color: document.body.classList.contains('dark-mode') ? 'FFD400' : '333333' });
  titleSlide.addText(`${outputGroups().length} placement groups`, { x: 0.55, y: 2.0, w: 8, h: 0.35, fontSize: 13, color: document.body.classList.contains('dark-mode') ? 'EEEEEE' : '333333' });
  titleSlide.addText(`Generated ${new Date().toLocaleString()}`, { x: 0.55, y: 6.65, w: 8, h: 0.25, fontSize: 8, color: document.body.classList.contains('dark-mode') ? 'CCCCCC' : '555555' });

  for (const [index, slidePlan] of slides.entries()) {
    const slide = pptx.addSlide();
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.34, h: 0.18, fill: { color: hexForPpt(state.options.primaryColor) }, line: { color: hexForPpt(state.options.primaryColor) } });
    slide.addText(`Slide ${index + 1}: ${slidePlan.title}`, { x: 0.45, y: 0.38, w: 12.2, h: 0.4, fontSize: 20, bold: true, color: '111111' });

    let y = 1.05;
    for (const group of slidePlan.groups) {
      const placement = group.matchedPlacement;
      slide.addText(`${group.platform} - ${group.placementName}`, { x: 0.55, y, w: 5.9, h: 0.28, fontSize: 13, bold: true, color: '111111' });
      slide.addText(`Status: ${statusLabel(state.decisions[group.key] || 'tbd')} | Confidence: ${Math.round(group.confidence * 100)}%`, { x: 6.8, y, w: 5.5, h: 0.25, fontSize: 9, color: '555555' });
      y += 0.32;
      slide.addText(`Specs: ${specSummary(placement, 4).join(' | ') || 'Confirm manually'}`, { x: 0.55, y, w: 12, h: 0.38, fontSize: 7.8, color: '222222', breakLine: false });
      y += 0.46;
      slide.addText(`Copy: ${(placement?.copyFields || []).slice(0, 3).map((field) => `${field.label} (${field.limit})`).join(' | ') || 'Confirm manually'}`, { x: 0.55, y, w: 12, h: 0.35, fontSize: 7.8, color: '222222', breakLine: false });
      y += 0.56;
    }
  }

  if (state.options.includeSources) {
    const sourceRows = outputGroups().map((group) => {
      const urls = (group.matchedPlacement?.sourceUrls || []).join(' | ');
      const searches = buildSearchPack(group).slice(0, 2).map((item) => `${item.label}: ${item.query}`).join(' | ');
      const note = state.sourceNotes[group.key] ? `Notes: ${state.sourceNotes[group.key]}` : '';
      return `${group.platform} - ${group.placementName}: ${[urls, searches, note].filter(Boolean).join(' | ')}`;
    });
    for (const [index, rows] of chunk(sourceRows, 10).entries()) {
      const sourceSlide = pptx.addSlide();
      sourceSlide.addText(`Sources and searches ${index + 1}/${Math.ceil(sourceRows.length / 10)}`, { x: 0.45, y: 0.35, w: 12, h: 0.45, fontSize: 22, bold: true, color: '111111' });
      sourceSlide.addText(rows.join('\n'), { x: 0.55, y: 1.0, w: 12, h: 5.7, fontSize: 7.4, color: '222222', breakLine: false });
    }
  }

  await pptx.writeFile({ fileName: `digital-task-brief-${dateStamp(true)}.pptx` });
  showToast('PowerPoint exported.');
}

function specSummary(placement, limit = 3) {
  return (placement?.specs || []).slice(0, limit).map((spec) => `${spec.label}: ${spec.value}`);
}

function statusLabel(status) {
  return {
    approved: 'Approved',
    tbd: 'TBD',
    rejected: 'Needs fix'
  }[status] || 'TBD';
}

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9:]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function conciseText(value, length = 120) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > length ? `${text.slice(0, length - 3)}...` : text;
}

function csvEscape(value) {
  const text = String(value ?? '').trim();
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hexForPpt(value) {
  return String(value || '#111111').replace('#', '').toUpperCase();
}

function dateStamp(includeTime = false) {
  const now = new Date();
  if (!includeTime) return now.toISOString().slice(0, 10);
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16).replace('T', '-').replace(':', '');
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

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('brief-maker-theme', isDark ? 'dark' : 'light');
}

function restoreTheme() {
  const isDark = localStorage.getItem('brief-maker-theme') === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
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
