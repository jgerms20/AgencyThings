import * as BriefCore from './mediaPlan.js';

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

const els = {
  planInput: qs('#plan-input'),
  planFileInput: qs('#plan-file'),
  dropZone: qs('#drop-zone'),
  fileStatus: qs('#file-status'),
  uploadButton: qs('#generate'),
  clearButton: qs('#clear'),
  loadSampleButton: qs('#load-sample'),
  reviewList: qs('#review-list'),
  sourceList: qs('#source-list'),
  briefOutput: qs('#brief-output'),
  reviewSummary: qs('#review-summary'),
  matchCount: qs('#match-count'),
  sourceCount: qs('#source-count'),
  deckCount: qs('#deck-count'),
  deckPlan: qs('#deck-plan'),
  workflowState: qs('#workflow-state'),
  themeToggle: qs('#theme-toggle'),
  briefOptions: qs('#brief-options'),
  copyBriefButton: qs('#copy-brief'),
  exportJsonButton: qs('#export-json'),
  exportPptButton: qs('#export-ppt'),
  exportGoogleButton: qs('#export-google'),
  printBriefButton: qs('#print-brief'),
  approveAllButton: qs('#approve-confident'),
  approveSelectedButton: qs('#approve-selected'),
  markAllTbdButton: qs('#mark-all-tbd'),
  templateFileInput: qs('#template-file'),
  templateStatus: qs('#template-status'),
  statPlacements: qs('#stat-placements'),
  statApproved: qs('#stat-approved'),
  statTbd: qs('#stat-tbd'),
  statSources: qs('#stat-sources'),
  previewClient: qs('#preview-client'),
  previewCampaign: qs('#preview-campaign')
};

const stepButtons = qsa('.step-button');
const stepPanels = qsa('.step-panel');
const swatchButtons = qsa('[data-template-style]');

const cdn = {
  xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm',
  jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm',
  pdf: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs',
  pdfWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs',
  pptx: 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm'
};

const stepLabels = ['Upload', 'Review', 'Sources', 'Customize', 'Export'];
const brandStylePresets = {
  gatorade: { label: 'Sport brand', primaryColor: '#ffd400', accentColor: '#00a7a7', backgroundColor: '#ffffff', textColor: '#111111' },
  'agency-clean': { label: 'Clean agency', primaryColor: '#f5f5f0', accentColor: '#111111', backgroundColor: '#ffffff', textColor: '#111111' },
  'dark-launch': { label: 'Dark launch', primaryColor: '#15171c', accentColor: '#ffcf24', backgroundColor: '#111111', textColor: '#ffffff' },
  'high-contrast': { label: 'High contrast', primaryColor: '#ffffff', accentColor: '#0057ff', backgroundColor: '#ffffff', textColor: '#111111' }
};

const samplePlan = `Bucket\tChannel\tPartner\tAsset\tAsset Format\tSpecs\tPlacement\tQuantity\tNotes
TVC\tLinear Video\tAll partners\t:15s or :30s Video Spot\tVideo File\t16x9; SD and HD versions\tN/A\t2\tLaunch TV creative
POLV\tPOLV\tAll partners\t:15s or :30s Video Spot\tVideo File\tVideo: 16x9; 1920 x 1080 HD mp4; 15-30 mbps\tN/A\t2\tProgrammatic OLV
AUDIO\tStreaming Audio\tSXM/Pandora\t:15s, :30s Audio Spot\tAudio File\t:15s, :30s Audio Spot\t\t2\tScript due to partner
AUDIO\tStreaming Audio\tSpotify\t:15s, :30s Audio Spot\tAudio File\t:15s, :30s Audio Spot\t\t1\tConfirm platform spec
SOCIAL\tSocial Video\tMeta\t:06s, :15s, :30s\tmp4\t4x5, 9x16, 1x1\t\t3\tMeta video set
PROGRAMMATIC\tDisplay Inventory\tDSP, DV360, NBA\tBanners\tJPEG\t300x250, 728x90, 160x600, 320x50, 300x600\t\t6\tDisplay banners`;

let placementLibrary = [];
let modules = {};

const state = {
  activeStep: 0,
  items: [],
  groups: [],
  decisions: {},
  selectedGroups: {},
  sourceNotes: {},
  sourceImages: {},
  template: null,
  options: defaultOptions()
};

boot().catch((error) => {
  console.error(error);
  showToast('The tool could not start. Refresh and try again.');
});

async function boot() {
  placementLibrary = await fetch('./data/placements.json').then((response) => response.json());
  restoreTheme();
  bindEvents();
  collectOptions();
  updateInterface();
}

function bindEvents() {
  els.uploadButton?.addEventListener('click', () => generateBrief({ goToReview: true }));
  els.clearButton?.addEventListener('click', clearWorkspace);
  els.loadSampleButton?.addEventListener('click', loadSamplePlan);
  els.planFileInput?.addEventListener('change', handleFileSelection);
  els.planInput?.addEventListener('input', updateStats);
  els.copyBriefButton?.addEventListener('click', copyBriefText);
  els.exportJsonButton?.addEventListener('click', exportBriefJson);
  els.exportPptButton?.addEventListener('click', () => exportPowerPointBrief());
  els.exportGoogleButton?.addEventListener('click', exportGoogleSlidesBrief);
  els.printBriefButton?.addEventListener('click', () => window.print());
  els.approveAllButton?.addEventListener('click', approveAllGroups);
  els.approveSelectedButton?.addEventListener('click', approveSelectedGroups);
  els.markAllTbdButton?.addEventListener('click', markAllTbd);
  els.themeToggle?.addEventListener('click', toggleTheme);
  els.templateFileInput?.addEventListener('change', handleTemplateSelection);
  els.briefOptions?.addEventListener('input', handleOptionsChange);
  els.briefOptions?.addEventListener('change', handleOptionsChange);
  els.reviewList?.addEventListener('click', handleReviewAction);
  els.reviewList?.addEventListener('change', handleReviewSelection);
  els.sourceList?.addEventListener('input', handleSourceInput);
  swatchButtons.forEach((button) => button.addEventListener('click', handleTemplateStyleButton));

  document.addEventListener('click', (event) => {
    const stepButton = event.target.closest('[data-step]');
    if (stepButton) return goToStep(Number(stepButton.dataset.step));
    if (event.target.closest('[data-prev-step]')) return goToStep(Math.max(0, state.activeStep - 1));
    if (event.target.closest('[data-next-step]')) return goToStep(Math.min(stepLabels.length - 1, state.activeStep + 1));
  });

  bindDropZone();
}

function handleOptionsChange() {
  collectOptions();
  renderDeckPlan();
  renderBrief();
}

function bindDropZone() {
  if (!els.dropZone) return;
  for (const eventName of ['dragenter', 'dragover']) {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.add('dragging');
    });
  }
  for (const eventName of ['dragleave', 'drop']) {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.remove('dragging');
    });
  }
  els.dropZone.addEventListener('drop', async (event) => {
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
    els.fileStatus.textContent = `Reading ${file.name}`;
    const text = await readPlanFile(file);
    els.planInput.value = text.trim();
    els.fileStatus.textContent = `Loaded ${file.name}. Click Upload to review.`;
    showToast('File loaded. Click Upload to review matches.');
    updateStats();
  } catch (error) {
    console.error(error);
    els.fileStatus.textContent = 'Could not read file';
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
  els.planInput.value = samplePlan;
  els.fileStatus.textContent = 'Sample loaded';
  generateBrief({ goToReview: true });
}

function clearWorkspace() {
  els.planInput.value = '';
  els.planFileInput.value = '';
  els.fileStatus.textContent = 'No file selected';
  Object.assign(state, {
    activeStep: 0,
    items: [],
    groups: [],
    decisions: {},
    selectedGroups: {},
    sourceNotes: {},
    sourceImages: {}
  });
  collectOptions();
  updateInterface();
}

function generateBrief({ goToReview = false } = {}) {
  const rows = BriefCore.parsePlan(els.planInput.value, placementLibrary);
  state.items = rows.map((row, index) => {
    const match = BriefCore.findBestPlacement(row, placementLibrary);
    return {
      index: index + 1,
      raw: row,
      matchedPlacement: match.placement,
      confidence: match.confidence,
      searchText: match.searchText,
      matchSignals: match.signals
    };
  });
  state.groups = enrichGroups(BriefCore.buildGroups(state.items));
  seedReviewDecisions();
  collectOptions();
  updateInterface();
  if (!state.groups.length) return showToast('No usable placements found. Try a table with Bucket, Channel, Partner, and Asset columns.');
  if (goToReview) goToStep(1);
}

function enrichGroups(groups) {
  return groups.map((group) => {
    const urls = [...new Set([...(group.matchedPlacement?.sourceUrls || []), ...officialSourceUrls(group)])];
    return {
      ...group,
      matchedPlacement: {
        ...(group.matchedPlacement || {}),
        sourceUrls: urls
      }
    };
  });
}

function seedReviewDecisions() {
  const decisions = {};
  const selected = {};
  for (const group of state.groups) {
    decisions[group.key] = state.decisions[group.key] || 'tbd';
    selected[group.key] = state.selectedGroups[group.key] || false;
  }
  state.decisions = decisions;
  state.selectedGroups = selected;
}

function handleReviewAction(event) {
  const button = event.target.closest('[data-review-action]');
  if (!button) return;
  state.decisions[button.dataset.groupKey] = button.dataset.reviewAction;
  updateInterface();
}

function handleReviewSelection(event) {
  const field = event.target.closest('[data-select-group]');
  if (!field) return;
  state.selectedGroups[field.dataset.selectGroup] = field.checked;
  field.closest('.review-item')?.classList.toggle('selected-for-bulk', field.checked);
}

function approveAllGroups() {
  for (const group of state.groups) {
    if (state.decisions[group.key] !== 'rejected') state.decisions[group.key] = 'approved';
  }
  updateInterface();
}

function approveSelectedGroups() {
  let count = 0;
  for (const group of state.groups) {
    if (!state.selectedGroups[group.key]) continue;
    state.decisions[group.key] = 'approved';
    count += 1;
  }
  if (!count) return showToast('Select one or more matches first.');
  updateInterface();
}

function markAllTbd() {
  for (const group of state.groups) state.decisions[group.key] = 'tbd';
  updateInterface();
}

function handleSourceInput(event) {
  const noteField = event.target.closest('[data-source-note]');
  if (noteField) {
    state.sourceNotes[noteField.dataset.sourceNote] = noteField.value;
    renderBrief();
    return;
  }
  const imageField = event.target.closest('[data-source-image]');
  if (imageField) {
    state.sourceImages[imageField.dataset.sourceImage] = imageField.value.trim();
    renderBrief();
  }
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
  els.workflowState.textContent = `Step ${state.activeStep + 1} of ${stepLabels.length} - ${stepLabels[state.activeStep]}`;
}

function updateStats() {
  const approved = state.groups.filter((group) => state.decisions[group.key] === 'approved').length;
  const rejected = state.groups.filter((group) => state.decisions[group.key] === 'rejected').length;
  const tbd = Math.max(0, state.groups.length - approved - rejected);
  const sources = state.groups.filter((group) => state.decisions[group.key] !== 'rejected').length;
  els.statPlacements.textContent = state.groups.length;
  els.statApproved.textContent = approved;
  els.statTbd.textContent = tbd;
  els.statSources.textContent = sources;
  els.matchCount.textContent = `${state.groups.length} group${state.groups.length === 1 ? '' : 's'}`;
  els.sourceCount.textContent = `${sources} source pack${sources === 1 ? '' : 's'}`;
}

function renderReview() {
  if (!state.groups.length) {
    els.reviewList.className = 'review-list empty-state';
    els.reviewList.textContent = 'No matches yet.';
    els.reviewSummary.textContent = 'Upload a plan to see compact platform and placement groups.';
    return;
  }
  const highConfidence = state.groups.filter((group) => group.confidence >= 0.76).length;
  els.reviewSummary.textContent = `${state.items.length} plan rows collapsed into ${state.groups.length} review groups. ${highConfidence} look high confidence.`;
  els.reviewList.className = 'review-list scroll-box';
  els.reviewList.innerHTML = '';
  for (const [platform, groups] of BriefCore.groupBy(state.groups, (group) => group.platform)) {
    const platformSection = document.createElement('section');
    platformSection.className = 'platform-group';
    platformSection.innerHTML = `<header><h3>${escapeHtml(platform)}</h3><span>${groups.length} placement${groups.length === 1 ? '' : 's'}</span></header>`;
    const rows = document.createElement('div');
    rows.className = 'platform-group-list';
    groups.forEach((group) => rows.append(buildReviewCard(group)));
    platformSection.append(rows);
    els.reviewList.append(platformSection);
  }
}

function buildReviewCard(group) {
  const status = state.decisions[group.key] || 'tbd';
  const card = document.createElement('article');
  card.className = `review-item status-${status}${state.selectedGroups[group.key] ? ' selected-for-bulk' : ''}`;
  const specs = buildSpecSnapshot(group, 4).map((spec) => `<span>${escapeHtml(spec)}</span>`).join('') || '<span>Confirm specs manually</span>';
  const units = group.units || group.rows.length;
  const confidence = Math.round(group.confidence * 100);
  const notes = conciseText(group.notes.filter(Boolean).join(' | '), 120);
  card.innerHTML = `
    <div class="review-main">
      <label class="select-group"><input type="checkbox" data-select-group="${escapeAttribute(group.key)}" ${state.selectedGroups[group.key] ? 'checked' : ''} /> Select</label>
      <div>
        <strong>${escapeHtml(group.placementName)}</strong>
        <p>${escapeHtml(group.matchedPlacement?.assetType || 'Needs spec setup')} - ${confidence}% confidence - ${group.rows.length} row${group.rows.length === 1 ? '' : 's'} - ${units} unit${units === 1 ? '' : 's'}</p>
      </div>
      <span class="status-chip">${statusLabel(status)}</span>
    </div>
    <div class="chip-row spec-snapshot">${specs}</div>
    ${notes ? `<p class="review-note">${escapeHtml(notes)}</p>` : ''}
    <div class="review-actions" role="group" aria-label="Review ${escapeAttribute(group.placementName)}">
      <button type="button" class="choice approve ${status === 'approved' ? 'selected' : ''}" data-group-key="${escapeAttribute(group.key)}" data-review-action="approved">Approve</button>
      <button type="button" class="choice tbd ${status === 'tbd' ? 'selected' : ''}" data-group-key="${escapeAttribute(group.key)}" data-review-action="tbd">TBD</button>
      <button type="button" class="choice reject ${status === 'rejected' ? 'selected' : ''}" data-group-key="${escapeAttribute(group.key)}" data-review-action="rejected">Needs fix</button>
    </div>
  `;
  return card;
}

function renderSources() {
  const groups = outputGroups();
  if (!groups.length) {
    els.sourceList.className = 'source-list empty-state';
    els.sourceList.textContent = 'Approve or mark placements TBD to build the source package.';
    return;
  }
  els.sourceList.className = 'source-list scroll-box';
  els.sourceList.innerHTML = '';
  for (const group of groups) {
    const card = document.createElement('article');
    card.className = 'source-card';
    const sourceLinks = sourceUrls(group).map(toSourceLink).join('') || '<span class="muted">No source URLs yet.</span>';
    const specSnapshot = buildSpecSnapshot(group, 4).map((spec) => `<span>${escapeHtml(spec)}</span>`).join('') || '<span>Confirm specs manually.</span>';
    const searchTiles = buildSearchPack(group).map(toSearchTile).join('');
    const note = state.sourceNotes[group.key] || '';
    const image = state.sourceImages[group.key] || '';
    card.innerHTML = `
      <div class="source-card-header">
        <div>
          <strong>${escapeHtml(group.platform)} - ${escapeHtml(group.placementName)}</strong>
          <p>${statusLabel(state.decisions[group.key])} - verify with official specs first, then add the best example image.</p>
        </div>
        <span class="confidence-chip">${Math.round(group.confidence * 100)}%</span>
      </div>
      <div class="spec-snapshot"><strong>Projected specs</strong>${specSnapshot}</div>
      <div class="source-links">${sourceLinks}</div>
      <div class="clip-grid">${searchTiles}</div>
      <label class="note-field">Example image URL<input data-source-image="${escapeAttribute(group.key)}" type="url" value="${escapeAttribute(image)}" placeholder="Paste the best image URL to include in the deck" /></label>
      <label class="note-field">Reference notes<textarea data-source-note="${escapeAttribute(group.key)}" rows="3" placeholder="Paste source notes, spec caveats, or visual direction here.">${escapeHtml(note)}</textarea></label>
    `;
    els.sourceList.append(card);
  }
}

function buildSearchPack(group) {
  const pack = BriefCore.buildSearchPack(group, state.options);
  const official = { label: 'Official specs', query: officialSpecQuery(group), type: 'web' };
  return [official, ...pack.filter((item) => item.label !== 'Official specs')];
}

function buildSpecSnapshot(group, limit = 4) {
  const importedSpecs = (group?.specNotes || []).filter(Boolean).map((spec) => conciseText(spec, 120));
  const librarySpecs = BriefCore.specSummary(group?.matchedPlacement, limit);
  const rows = [
    ...(group?.channels || []).slice(0, 1).map((channel) => `Channel: ${channel}`),
    ...(group?.partners || []).slice(0, 1).map((partner) => `Partner: ${partner}`),
    ...(group?.formats || []).slice(0, 1).map((format) => `Format: ${format}`),
    ...importedSpecs,
    ...librarySpecs
  ];
  return [...new Set(rows)].slice(0, limit);
}

function sourceUrls(group) {
  return [...new Set([...(group.matchedPlacement?.sourceUrls || []), ...officialSourceUrls(group)])];
}

function officialSourceUrls(group) {
  const text = normalize([group.platform, group.placementName, ...(group.partners || []), ...(group.assets || []), ...(group.channels || []), ...(group.formats || []), ...(group.specNotes || [])].join(' '));
  const urls = [];
  if (/meta|instagram|facebook/.test(text)) urls.push('https://www.facebook.com/business/ads-guide');
  if (/tiktok/.test(text)) urls.push('https://ads.tiktok.com/help/article/video-ads-specifications');
  if (/youtube|google/.test(text)) urls.push('https://support.google.com/google-ads/answer/2375464');
  if (/pinterest/.test(text)) urls.push('https://help.pinterest.com/en/business/article/creative-specs');
  if (/\bx\b|twitter|amplify/.test(text)) urls.push('https://business.x.com/en/help/campaign-setup/creative-ad-specifications.html');
  if (/spotify/.test(text)) urls.push('https://ads.spotify.com/en-US/ad-specs/');
  if (/pandora|sxm|siriusxm|soundcloud/.test(text)) urls.push('https://www.sxmmedia.com/');
  if (/audacy/.test(text)) urls.push('https://audacyinc.com/advertising/');
  if (/iheart/.test(text)) urls.push('https://www.iheartmedia.com/advertising/');
  if (/programmatic|display|banner|dv360|dsp|iab|300x250|728x90|160x600|320x50|300x600/.test(text)) urls.push('https://iabtechlab.com/standards/iab-new-ad-portfolio-guidelines/');
  if (/ctv|connected tv/.test(text)) urls.push('https://iabtechlab.com/standards/ctv-ad-portfolio/');
  return urls;
}

function officialSpecQuery(group) {
  const text = normalize([group.platform, group.placementName, ...(group.partners || []), ...(group.assets || [])].join(' '));
  if (/meta|instagram|facebook/.test(text)) return 'Meta ads guide image video creative specifications official';
  if (/tiktok/.test(text)) return 'TikTok ads creative specifications official';
  if (/youtube|google/.test(text)) return 'Google Ads video ad specifications official';
  if (/pinterest/.test(text)) return 'Pinterest business creative specs official';
  if (/\bx\b|twitter|amplify/.test(text)) return 'X ads creative ad specifications official';
  if (/spotify/.test(text)) return 'Spotify audio ad specs official';
  if (/pandora|sxm|siriusxm|soundcloud/.test(text)) return 'SXM Media Pandora audio advertising specs official';
  if (/audacy/.test(text)) return 'Audacy audio ad specs official';
  if (/iheart/.test(text)) return 'iHeartMedia audio advertising specs official';
  if (/podcast|audio/.test(text)) return 'audio ad specs podcast advertising official';
  if (/programmatic|display|banner|dv360|dsp|iab/.test(text)) return 'IAB new ad portfolio display ad specs official';
  return `${group.platform} ${group.placementName} ad specs official`;
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

async function handleTemplateSelection(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    els.templateStatus.textContent = `Reading ${file.name}`;
    state.template = await readTemplateProfile(file);
    els.templateStatus.textContent = `${file.name} loaded`;
    collectOptions();
    updateInterface();
    showToast('Brand template loaded. Export colors updated.');
  } catch (error) {
    console.warn(error);
    state.template = { name: file.name, colors: null };
    els.templateStatus.textContent = `${file.name} added`;
    collectOptions();
    updateInterface();
  }
}

async function readTemplateProfile(file) {
  const JSZip = await loadJsZip();
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const themeFile = zip.files['ppt/theme/theme1.xml'];
  const colors = themeFile ? extractTemplateColors(await themeFile.async('text')) : null;
  return { name: file.name, colors };
}

function extractTemplateColors(xml) {
  const colors = [...xml.matchAll(/<a:srgbClr[^>]+val="([0-9A-Fa-f]{6})"/g)]
    .map((match) => `#${match[1]}`)
    .filter(isUsefulTemplateColor);
  if (!colors.length) return null;
  return {
    primaryColor: colors[0],
    accentColor: colors[1] || colors[0],
    backgroundColor: colors.find((color) => !isDarkColor(color)) || '#ffffff',
    textColor: isDarkColor(colors[0]) ? '#ffffff' : '#111111'
  };
}

function collectOptions() {
  const templateStyle = qs('#template-style')?.value || 'gatorade';
  const preset = brandStylePresets[templateStyle] || brandStylePresets.gatorade;
  const templateColors = state.template?.colors || {};
  state.options = {
    clientName: qs('#client-name')?.value.trim() || 'Client / brand',
    campaignName: qs('#campaign-name')?.value.trim() || 'Campaign name',
    campaignYear: qs('#campaign-year')?.value.trim() || '',
    slideCount: Math.max(1, Number(qs('#slide-count')?.value || 12)),
    slideStrategy: qs('#slide-strategy')?.value || 'platform',
    templateStyle,
    templateName: state.template?.name || '',
    primaryColor: templateColors.primaryColor || preset.primaryColor,
    accentColor: templateColors.accentColor || preset.accentColor,
    backgroundColor: templateColors.backgroundColor || preset.backgroundColor,
    textColor: templateColors.textColor || preset.textColor,
    includeSafeZones: Boolean(qs('#include-safe-zones')?.checked),
    includeSources: Boolean(qs('#include-sources')?.checked),
    includeSearches: Boolean(qs('#include-searches')?.checked),
    includeReviewStatus: Boolean(qs('#include-review-status')?.checked)
  };
  document.documentElement.style.setProperty('--client-primary', state.options.primaryColor);
  document.documentElement.style.setProperty('--client-accent', state.options.accentColor);
  els.previewClient.textContent = state.options.clientName;
  els.previewCampaign.textContent = [state.options.campaignName, state.options.campaignYear, state.options.templateName && `Template: ${state.options.templateName}`].filter(Boolean).join(' - ');
  swatchButtons.forEach((button) => button.classList.toggle('active', button.dataset.templateStyle === templateStyle && !state.template?.colors));
}

function defaultOptions() {
  return {
    clientName: 'Client / brand',
    campaignName: 'Campaign name',
    campaignYear: '',
    slideCount: 12,
    slideStrategy: 'platform',
    templateStyle: 'gatorade',
    templateName: '',
    primaryColor: '#ffd400',
    accentColor: '#00a7a7',
    backgroundColor: '#ffffff',
    textColor: '#111111',
    includeSafeZones: true,
    includeSources: true,
    includeSearches: true,
    includeReviewStatus: true
  };
}

function handleTemplateStyleButton(event) {
  const button = event.target.closest('[data-template-style]');
  if (!button) return;
  const select = qs('#template-style');
  if (select) select.value = button.dataset.templateStyle;
  state.template = null;
  if (els.templateFileInput) els.templateFileInput.value = '';
  if (els.templateStatus) els.templateStatus.textContent = 'No template added';
  collectOptions();
  renderDeckPlan();
  renderBrief();
}

function renderDeckPlan() {
  const slides = buildSlidePlan();
  const appendixCount = state.options.includeSources && outputGroups().length ? Math.ceil(outputGroups().length / 10) : 0;
  const titleCount = slides.length ? 1 : 0;
  const totalSlides = titleCount + slides.length + appendixCount;
  els.deckCount.textContent = totalSlides ? `${totalSlides} slide${totalSlides === 1 ? '' : 's'} in outline` : 'Deck outline';
  if (!slides.length) {
    els.deckPlan.className = 'deck-plan empty-state';
    els.deckPlan.textContent = 'Upload and review placements to see the deck plan.';
    return;
  }
  els.deckPlan.className = 'deck-plan';
  const titleCard = `<article><span>Slide 1</span><strong>Title</strong><p>${escapeHtml([state.options.clientName, state.options.campaignName, state.options.campaignYear].filter(Boolean).join(' - '))}</p></article>`;
  const contentCards = slides.map((slide, index) => `<article><span>Slide ${index + 2}</span><strong>${escapeHtml(slide.title)}</strong><p>${slide.groups.map((group) => `${group.platform} - ${group.placementName}`).map(escapeHtml).join(' | ')}</p></article>`).join('');
  const appendixCards = Array.from({ length: appendixCount }, (_, index) => `<article><span>Slide ${slides.length + index + 2}</span><strong>Sources and searches ${index + 1}/${appendixCount}</strong><p>Official links, projected specs, example image slots, and notes.</p></article>`).join('');
  els.deckPlan.innerHTML = titleCard + contentCards + appendixCards;
}

function buildSlidePlan() {
  return BriefCore.buildSlidePlan(outputGroups(), state.options);
}

function renderBrief() {
  const slides = buildSlidePlan();
  if (!slides.length) {
    els.briefOutput.className = 'brief-output empty-state';
    els.briefOutput.textContent = 'Your assembled brief will appear here.';
    return;
  }
  els.briefOutput.className = 'brief-output';
  els.briefOutput.innerHTML = `<section class="brief-meta"><h3>${escapeHtml(state.options.clientName)} - ${escapeHtml(state.options.campaignName)}</h3><p>${outputGroups().length} active placement groups. ${state.groups.filter((group) => state.decisions[group.key] === 'rejected').length} marked needs fix.</p></section>`;
  for (const [index, slide] of slides.entries()) {
    const card = document.createElement('section');
    card.className = 'brief-card';
    card.innerHTML = `<div class="brief-card-header"><div><p class="platform">Slide ${index + 1}</p><h3>${escapeHtml(slide.title)}</h3></div><span class="asset-type">${slide.groups.length} placement${slide.groups.length === 1 ? '' : 's'}</span></div><div class="brief-slide-grid">${slide.groups.map(renderBriefGroup).join('')}</div>`;
    els.briefOutput.append(card);
  }
  if (state.options.includeSources) els.briefOutput.append(buildSourceAppendix());
}

function renderBriefGroup(group) {
  const placement = group.matchedPlacement;
  const status = state.decisions[group.key] || 'tbd';
  const specs = buildSpecSnapshot(group, 5).map((spec) => `<li>${escapeHtml(spec)}</li>`).join('') || '<li>Confirm specs manually.</li>';
  const copyFields = (placement?.copyFields || []).slice(0, 4).map((field) => `<li>${escapeHtml(field.label)} - ${escapeHtml(field.limit)}</li>`).join('') || '<li>Confirm copy fields manually.</li>';
  const prompts = (placement?.creativePrompts || []).slice(0, 3).map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join('');
  const note = state.sourceNotes[group.key] ? `<p><strong>Reference notes:</strong> ${escapeHtml(state.sourceNotes[group.key])}</p>` : '';
  const image = state.sourceImages[group.key] ? `<figure class="brief-example-image"><img src="${escapeAttribute(state.sourceImages[group.key])}" alt="Example reference for ${escapeAttribute(group.placementName)}" loading="lazy" /><figcaption>Example reference</figcaption></figure>` : '';
  return `<article class="brief-placement"><header><strong>${escapeHtml(group.platform)} - ${escapeHtml(group.placementName)}</strong>${state.options.includeReviewStatus ? `<span>${escapeHtml(statusLabel(status))}</span>` : ''}</header>${image}${state.options.includeSafeZones ? buildSafeZoneMarkup(placement) : ''}<div class="grid-two compact-grid"><div><h4>Specs</h4><ul>${specs}</ul></div><div><h4>Copy</h4><ul>${copyFields}</ul></div></div>${prompts ? `<h4>Creative prompts</h4><ul>${prompts}</ul>` : ''}${note}</article>`;
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
    const links = sourceUrls(group).map(toSourceLink).join('') || '<span class="muted">No source links yet.</span>';
    const searches = state.options.includeSearches ? buildSearchPack(group).slice(0, 2).map((item) => `<span>${escapeHtml(item.query)}</span>`).join('') : '';
    const image = state.sourceImages[group.key] ? `<p><strong>Example image:</strong> ${escapeHtml(state.sourceImages[group.key])}</p>` : '';
    const note = state.sourceNotes[group.key] ? `<p>${escapeHtml(state.sourceNotes[group.key])}</p>` : '';
    list.insertAdjacentHTML('beforeend', `<article><strong>${escapeHtml(group.platform)} - ${escapeHtml(group.placementName)}</strong><div class="source-links">${links}</div><div class="chip-row">${searches}</div>${image}${note}</article>`);
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
    ...slides.flatMap((slide, index) => [`Slide ${index + 1}: ${slide.title}`, ...slide.groups.flatMap(groupToPlainText), ''])
  ].join('\n');
}

function groupToPlainText(group) {
  const placement = group.matchedPlacement;
  return [
    `${group.platform} - ${group.placementName}`,
    `Status: ${statusLabel(state.decisions[group.key] || 'tbd')}`,
    `Confidence: ${Math.round(group.confidence * 100)}%`,
    `Specs: ${buildSpecSnapshot(group, 5).join('; ') || 'Confirm manually'}`,
    `Copy: ${(placement?.copyFields || []).map((field) => `${field.label} (${field.limit})`).join('; ') || 'Confirm manually'}`,
    state.sourceImages[group.key] ? `Example image: ${state.sourceImages[group.key]}` : '',
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
      sourceImage: state.sourceImages[group.key] || '',
      specs: buildSpecSnapshot(group, 10),
      sourceUrls: sourceUrls(group)
    }))
  };
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `digital-task-brief-${dateStamp(true)}.json`);
  showToast('JSON exported.');
}

async function exportGoogleSlidesBrief() {
  await exportPowerPointBrief({ fileSuffix: 'google-slides-import', toast: 'Google Slides-ready PowerPoint exported. Upload it to Google Slides to convert the deck.' });
}

async function exportPowerPointBrief({ fileSuffix = 'powerpoint', toast = 'PowerPoint exported.' } = {}) {
  const slides = buildSlidePlan();
  if (!slides.length) return showToast('Generate a brief first.');
  const imported = await import(cdn.pptx);
  const PptxGenJS = imported.default || imported;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Digital Task Brief Maker';
  pptx.subject = 'Digital Task Brief';
  pptx.title = `${state.options.clientName} Digital Task Brief`;
  pptx.company = state.options.templateName || 'AgencyThings';

  const titleSlide = pptx.addSlide();
  const darkExport = document.body.classList.contains('dark-mode') || isDarkColor(state.options.backgroundColor || state.options.primaryColor);
  const titleBg = darkExport ? '#111111' : (state.options.backgroundColor || state.options.primaryColor);
  const titleText = darkExport ? '#ffffff' : (state.options.textColor || '#111111');
  titleSlide.background = { color: hexForPpt(titleBg) };
  titleSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.34, h: 0.24, fill: { color: hexForPpt(state.options.accentColor) }, line: { color: hexForPpt(state.options.accentColor) } });
  titleSlide.addText(state.options.clientName, { x: 0.55, y: 0.62, w: 12, h: 0.55, fontSize: 30, bold: true, color: hexForPpt(titleText) });
  titleSlide.addText([state.options.campaignName, state.options.campaignYear].filter(Boolean).join(' - '), { x: 0.55, y: 1.28, w: 11.5, h: 0.38, fontSize: 17, color: hexForPpt(darkExport ? state.options.accentColor : '#333333') });
  titleSlide.addText(`${outputGroups().length} placement groups`, { x: 0.55, y: 2.05, w: 8, h: 0.35, fontSize: 13, color: hexForPpt(darkExport ? '#eeeeee' : '#333333') });
  if (state.options.templateName) titleSlide.addText(`Template reference: ${state.options.templateName}`, { x: 0.55, y: 2.45, w: 10, h: 0.25, fontSize: 9, color: hexForPpt(darkExport ? '#cccccc' : '#555555') });
  titleSlide.addText(`Generated ${new Date().toLocaleString()}`, { x: 0.55, y: 6.65, w: 8, h: 0.25, fontSize: 8, color: hexForPpt(darkExport ? '#cccccc' : '#555555') });

  for (const [index, slidePlan] of slides.entries()) {
    const slide = pptx.addSlide();
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.34, h: 0.18, fill: { color: hexForPpt(state.options.primaryColor) }, line: { color: hexForPpt(state.options.primaryColor) } });
    slide.addText(`Slide ${index + 1}: ${slidePlan.title}`, { x: 0.45, y: 0.38, w: 12.2, h: 0.4, fontSize: 20, bold: true, color: '111111' });
    let y = 1.05;
    const hasImages = slidePlan.groups.some((group) => state.sourceImages[group.key]);
    const textWidth = hasImages ? 8.95 : 12;
    for (const group of slidePlan.groups) {
      const placement = group.matchedPlacement;
      const imageUrl = state.sourceImages[group.key];
      slide.addText(`${group.platform} - ${group.placementName}`, { x: 0.55, y, w: textWidth, h: 0.28, fontSize: 13, bold: true, color: '111111' });
      slide.addText(`Status: ${statusLabel(state.decisions[group.key] || 'tbd')} | Confidence: ${Math.round(group.confidence * 100)}%`, { x: hasImages ? 9.75 : 6.8, y, w: hasImages ? 2.7 : 5.5, h: 0.25, fontSize: 9, color: '555555' });
      y += 0.32;
      slide.addText(`Specs: ${buildSpecSnapshot(group, 4).join(' | ') || 'Confirm manually'}`, { x: 0.55, y, w: textWidth, h: 0.38, fontSize: 7.8, color: '222222', breakLine: false });
      y += 0.46;
      slide.addText(`Copy: ${(placement?.copyFields || []).slice(0, 3).map((field) => `${field.label} (${field.limit})`).join(' | ') || 'Confirm manually'}`, { x: 0.55, y, w: textWidth, h: 0.35, fontSize: 7.8, color: '222222', breakLine: false });
      if (imageUrl) addImageToSlide(slide, imageUrl, { x: 9.85, y: y - 0.78, w: 2.75, h: 1.05 });
      y += 0.56;
    }
  }

  if (state.options.includeSources) {
    const sourceRows = outputGroups().map((group) => {
      const urls = sourceUrls(group).join(' | ');
      const searches = buildSearchPack(group).slice(0, 2).map((item) => `${item.label}: ${item.query}`).join(' | ');
      const image = state.sourceImages[group.key] ? `Image: ${state.sourceImages[group.key]}` : '';
      const note = state.sourceNotes[group.key] ? `Notes: ${state.sourceNotes[group.key]}` : '';
      return `${group.platform} - ${group.placementName}: ${[urls, searches, image, note].filter(Boolean).join(' | ')}`;
    });
    for (const [index, rows] of chunk(sourceRows, 10).entries()) {
      const sourceSlide = pptx.addSlide();
      sourceSlide.addText(`Sources and searches ${index + 1}/${Math.ceil(sourceRows.length / 10)}`, { x: 0.45, y: 0.35, w: 12, h: 0.45, fontSize: 22, bold: true, color: '111111' });
      sourceSlide.addText(rows.join('\n'), { x: 0.55, y: 1.0, w: 12, h: 5.7, fontSize: 7.4, color: '222222', breakLine: false });
    }
  }

  await pptx.writeFile({ fileName: `digital-task-brief-${dateStamp(true)}-${fileSuffix}.pptx` });
  showToast(toast);
}

function addImageToSlide(slide, url, placement) {
  try {
    const source = url.startsWith('data:image/') ? { data: url } : { path: url };
    slide.addImage({ ...source, ...placement });
    return true;
  } catch {
    slide.addText(`Image: ${url}`, { ...placement, fontSize: 6.8, color: '555555', fit: 'shrink' });
    return false;
  }
}

function statusLabel(status) {
  return BriefCore.statusLabel(status);
}

function chunk(items, size) {
  return BriefCore.chunk(items, size);
}

function csvEscape(value) {
  const text = String(value ?? '').trim();
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function conciseText(value, length = 120) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > length ? `${text.slice(0, length - 3)}...` : text;
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9:]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function isUsefulTemplateColor(color) {
  const normalized = color.toLowerCase();
  return !['#ffffff', '#000000', '#f2f2f2', '#e7e6e6'].includes(normalized);
}

function isDarkColor(color) {
  const hex = String(color || '#111111').replace('#', '');
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return (red * 0.299 + green * 0.587 + blue * 0.114) < 130;
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
  els.themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('brief-maker-theme', isDark ? 'dark' : 'light');
}

function restoreTheme() {
  const isDark = localStorage.getItem('brief-maker-theme') === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  els.themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => escapeMap[char]);
}
function escapeAttribute(value = '') {
  return escapeHtml(value);
}
