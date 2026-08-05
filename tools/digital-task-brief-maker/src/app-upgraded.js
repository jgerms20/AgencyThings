import * as BriefCore from './mediaPlan.js';

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

const els = {
  planInput: qs('#plan-input'),
  pasteBuffer: qs('#paste-buffer'),
  tableTabs: qs('#table-tabs'),
  tableGrid: qs('#table-grid'),
  addTableButton: qs('#add-table'),
  renameTableButton: qs('#rename-table'),
  duplicateTableButton: qs('#duplicate-table'),
  removeTableButton: qs('#remove-table'),
  addRowButton: qs('#add-row'),
  pasteRowsButton: qs('#paste-rows'),
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

const cdn = {
  xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm',
  jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm',
  pdf: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs',
  pdfWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs',
  pptx: 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/+esm'
};

const stepLabels = ['Upload', 'Review', 'Sources', 'Customize', 'Export'];
const samplePlan = `Bucket\tChannel\tPartner\tAsset\tAsset Format\tSpecs\tPlacement\tQuantity\tNotes
TVC\tLinear Video\tAll partners\t:15s or :30s Video Spot\tVideo File\t16x9; SD and HD versions\tN/A\t2\tLaunch TV creative
POLV\tPOLV\tAll partners\t:15s or :30s Video Spot\tVideo File\tVideo: 16x9; 1920 x 1080 HD mp4; 15-30 mbps\tN/A\t2\tProgrammatic OLV
AUDIO\tStreaming Audio\tSXM/Pandora\t:15s, :30s Audio Spot\tAudio File\t:15s, :30s Audio Spot\t\t2\tScript due to partner
AUDIO\tStreaming Audio\tSpotify\t:15s, :30s Audio Spot\tAudio File\t:15s, :30s Audio Spot\t\t1\tConfirm platform spec
SOCIAL\tSocial Video\tMeta\t:06s, :15s, :30s\tmp4\t4x5, 9x16, 1x1\t\t3\tMeta video set
PROGRAMMATIC\tDisplay Inventory\tDSP, DV360, NBA\tBanners\tJPEG\t300x250, 728x90, 160x600, 320x50, 300x600\t\t6\tDisplay banners`;

let placementLibrary = [];
let modules = {};
let tableSequence = 1;

const state = {
  activeStep: 0,
  items: [],
  groups: [],
  decisions: {},
  selectedGroups: {},
  sourceNotes: {},
  sourceImages: {},
  planTables: [],
  activeTableId: '',
  template: null,
  options: defaultOptions()
};

boot().catch((error) => {
  console.error(error);
  showToast('The tool could not start. Refresh and try again.');
});

async function boot() {
  placementLibrary = await fetch('./data/placements.json').then((response) => response.json());
  resetPlanTables();
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
  els.addTableButton?.addEventListener('click', addPlanTable);
  els.renameTableButton?.addEventListener('click', renameActiveTable);
  els.duplicateTableButton?.addEventListener('click', duplicateActiveTable);
  els.removeTableButton?.addEventListener('click', removeActiveTable);
  els.addRowButton?.addEventListener('click', addPlanRow);
  els.pasteRowsButton?.addEventListener('click', addPastedRows);
  els.tableTabs?.addEventListener('click', handleTableTabClick);
  els.tableGrid?.addEventListener('input', handleTableCellInput);
  els.tableGrid?.addEventListener('click', handleTableRowAction);
  els.copyBriefButton?.addEventListener('click', copyBriefText);
  els.exportJsonButton?.addEventListener('click', exportBriefJson);
  els.exportPptButton?.addEventListener('click', () => exportPowerPointBrief());
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

function nextTableId() {
  const id = `table-${tableSequence}`;
  tableSequence += 1;
  return id;
}

function resetPlanTables(rows = []) {
  const table = BriefCore.createPlanTable('Media plan', rows, nextTableId());
  state.planTables = [table];
  state.activeTableId = table.id;
  syncPlanInput();
  renderPlanTables();
}

function activePlanTable() {
  return state.planTables.find((table) => table.id === state.activeTableId) || state.planTables[0];
}

function syncPlanInput() {
  if (els.planInput) els.planInput.value = BriefCore.planTablesToText(state.planTables);
}

function renderPlanTables() {
  if (!els.tableTabs || !els.tableGrid) return;
  els.tableTabs.innerHTML = state.planTables.map((table) => `<button type="button" role="tab" aria-selected="${table.id === state.activeTableId}" class="table-tab${table.id === state.activeTableId ? ' active' : ''}" data-table-id="${escapeAttribute(table.id)}">${escapeHtml(table.name)}</button>`).join('');
  const table = activePlanTable();
  if (!table) return;
  const head = BriefCore.planTableColumns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
  const rows = table.rows.map((row, rowIndex) => `<tr>${BriefCore.planTableColumns.map((column, columnIndex) => `<td><label><span class="sr-only">${escapeHtml(column)} row ${rowIndex + 1}</span><input value="${escapeAttribute(row[columnIndex] || '')}" data-table-cell data-row="${rowIndex}" data-column="${columnIndex}" /></label></td>`).join('')}<td><button type="button" class="row-remove" data-remove-row="${rowIndex}" aria-label="Remove row ${rowIndex + 1}">Remove</button></td></tr>`).join('');
  els.tableGrid.innerHTML = `<table class="plan-table"><thead><tr>${head}<th scope="col">Row</th></tr></thead><tbody>${rows || `<tr><td colspan="10" class="empty-table-cell">No rows yet. Add a row or paste rows below.</td></tr>`}</tbody></table>`;
  els.removeTableButton.disabled = state.planTables.length <= 1;
}

function addPlanTable() {
  const table = BriefCore.createPlanTable(`Table ${state.planTables.length + 1}`, [], nextTableId());
  state.planTables = [...state.planTables, table];
  state.activeTableId = table.id;
  syncPlanInput();
  renderPlanTables();
}

function renameActiveTable() {
  const table = activePlanTable();
  if (!table) return;
  const name = window.prompt('Table name', table.name);
  if (!name) return;
  state.planTables = BriefCore.renamePlanTable(state.planTables, table.id, name);
  renderPlanTables();
}

function duplicateActiveTable() {
  const table = activePlanTable();
  if (!table) return;
  const nextId = nextTableId();
  state.planTables = BriefCore.duplicatePlanTable(state.planTables, table.id, nextId);
  state.activeTableId = nextId;
  syncPlanInput();
  renderPlanTables();
}

function removeActiveTable() {
  const previousLength = state.planTables.length;
  state.planTables = BriefCore.removePlanTable(state.planTables, state.activeTableId);
  if (state.planTables.length === previousLength) return;
  state.activeTableId = state.planTables[0].id;
  syncPlanInput();
  renderPlanTables();
}

function addPlanRow() {
  const table = activePlanTable();
  if (!table) return;
  table.rows.push(BriefCore.planTableColumns.map(() => ''));
  syncPlanInput();
  renderPlanTables();
}

function addPastedRows() {
  const table = activePlanTable();
  const rows = tabularTextToRows(els.pasteBuffer?.value || '');
  if (!table || !rows.length) return showToast('Paste at least one row first.');
  table.rows.push(...rows);
  els.pasteBuffer.value = '';
  syncPlanInput();
  renderPlanTables();
  showToast(`${rows.length} row${rows.length === 1 ? '' : 's'} added.`);
}

function handleTableTabClick(event) {
  const button = event.target.closest('[data-table-id]');
  if (!button) return;
  state.activeTableId = button.dataset.tableId;
  renderPlanTables();
}

function handleTableCellInput(event) {
  const input = event.target.closest('[data-table-cell]');
  const table = activePlanTable();
  if (!input || !table) return;
  table.rows[Number(input.dataset.row)][Number(input.dataset.column)] = input.value;
  syncPlanInput();
}

function handleTableRowAction(event) {
  const button = event.target.closest('[data-remove-row]');
  const table = activePlanTable();
  if (!button || !table) return;
  table.rows.splice(Number(button.dataset.removeRow), 1);
  syncPlanInput();
  renderPlanTables();
}

function tabularTextToRows(text) {
  const lines = String(text || '').trim().split(/\r?\n/).filter(Boolean);
  const rows = lines.map((line) => (line.includes('\t') ? line.split('\t') : line.split(','))).map((row) => BriefCore.planTableColumns.map((_, index) => String(row[index] || '').trim()));
  if (/bucket|channel|partner/i.test(rows[0]?.join(' ') || '')) rows.shift();
  return rows.filter((row) => row.some(Boolean));
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
    const result = await readPlanFile(file);
    if (result.tables?.length) {
      state.planTables = result.tables;
      state.activeTableId = result.tables[0].id;
    } else {
      resetPlanTables(tabularTextToRows(result.text || ''));
    }
    syncPlanInput();
    renderPlanTables();
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
  if (/\.pdf$/.test(name)) return { text: await readPdf(file) };
  if (/\.pptx$/.test(name)) return { text: await readPowerPoint(file) };
  return { text: await file.text() };
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
  if (inventoryRows.length >= 3) {
    const rows = tabularTextToRows(BriefCore.inventoryRowsToPlanText(inventoryRows));
    return { text: BriefCore.inventoryRowsToPlanText(inventoryRows), tables: [BriefCore.createPlanTable('Imported inventory', rows, nextTableId())] };
  }
  const tables = sheets.map((sheet) => BriefCore.createPlanTable(sheet.sheetName, sheet.rows.filter((row) => row.some((cell) => String(cell).trim())).map((row) => BriefCore.planTableColumns.map((_, index) => String(row[index] || ''))), nextTableId())).filter((table) => table.rows.length);
  return { text: fallbackRows.join('\n'), tables };
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
  resetPlanTables(tabularTextToRows(samplePlan));
  els.fileStatus.textContent = 'Sample loaded';
  generateBrief({ goToReview: true });
}

function clearWorkspace() {
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
  resetPlanTables();
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
    const urls = officialSourceUrls(group);
    const candidates = BriefCore.imageCandidates(group);
    return {
      ...group,
      matchedPlacement: {
        ...(group.matchedPlacement || {}),
        sourceUrls: urls,
        imageCandidates: candidates
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
    if (!state.sourceImages[group.key]) state.sourceImages[group.key] = BriefCore.imageCandidates(group)[0]?.url || '';
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
    return;
  }
  const candidateField = event.target.closest('[data-source-candidate]');
  if (candidateField) {
    state.sourceImages[candidateField.dataset.sourceCandidate] = candidateField.value;
    renderSources();
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
    platformSection.className = `platform-group channel-${slugify(platform)}`;
    platformSection.style.setProperty('--channel-accent', channelColor(platform));
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
  const durations = BriefCore.buildDurationSpecBlocks(group)
    .filter((block) => block.duration !== 'All')
    .map((block) => `<span class="duration-chip">${escapeHtml(block.duration)}</span>`)
    .join('');
  card.innerHTML = `
    <div class="review-main">
      <label class="select-group"><input type="checkbox" data-select-group="${escapeAttribute(group.key)}" ${state.selectedGroups[group.key] ? 'checked' : ''} /> Select</label>
      <div>
        <strong>${escapeHtml(group.placementName)}</strong>
        <p>${escapeHtml(group.matchedPlacement?.assetType || 'Needs spec setup')} - ${confidence}% confidence - ${group.rows.length} row${group.rows.length === 1 ? '' : 's'} - ${units} unit${units === 1 ? '' : 's'}</p>
      </div>
      <span class="status-chip">${statusLabel(status)}</span>
    </div>
    ${durations ? `<div class="duration-row"><strong>Required cutdowns</strong>${durations}</div>` : ''}
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
    card.className = `source-card channel-${slugify(group.platform)}`;
    card.style.setProperty('--channel-accent', channelColor(group.platform));
    const sourceLinks = sourceUrls(group).map(toSourceLink).join('') || '<span class="muted">No authoritative spec link is mapped yet. Use the imported plan specs and confirm with the partner.</span>';
    const durationBlocks = BriefCore.buildDurationSpecBlocks(group).map((block) => `<article class="duration-spec"><strong>${escapeHtml(block.duration === 'All' ? 'Placement specs' : `${block.duration} specs`)}</strong><ul>${block.specs.slice(0, 5).map((spec) => `<li>${escapeHtml(spec)}</li>`).join('') || '<li>Confirm with partner.</li>'}</ul></article>`).join('');
    const candidates = BriefCore.imageCandidates(group);
    const note = state.sourceNotes[group.key] || '';
    const image = state.sourceImages[group.key] || '';
    const candidateCards = candidates.length
      ? candidates.map((candidate) => `<label class="image-candidate${image === candidate.url ? ' selected' : ''}"><input type="radio" name="image-${escapeAttribute(group.key)}" data-source-candidate="${escapeAttribute(group.key)}" value="${escapeAttribute(candidate.url)}" ${image === candidate.url ? 'checked' : ''} /><img src="${escapeAttribute(candidate.url)}" alt="${escapeAttribute(candidate.alt || candidate.sourceLabel)}" loading="lazy" /><span><strong>${escapeHtml(candidate.label || 'Creative example')}</strong><small>From <a href="${escapeAttribute(candidate.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(candidate.sourceLabel)}</a></small></span></label>`).join('')
      : '<p class="muted candidate-empty">No verified image candidate is mapped yet. Add an approved image URL below.</p>';
    card.innerHTML = `
      <div class="source-card-header">
        <div>
          <strong>${escapeHtml(group.platform)} - ${escapeHtml(group.placementName)}</strong>
          <p>${statusLabel(state.decisions[group.key])} - verify with official specs first, then add the best example image.</p>
        </div>
        <span class="confidence-chip">${Math.round(group.confidence * 100)}%</span>
      </div>
      <div class="duration-spec-grid">${durationBlocks}</div>
      <div><strong class="field-heading">Official partner / specification pages</strong><div class="source-links">${sourceLinks}</div></div>
      <fieldset class="candidate-fieldset"><legend>Choose one creative example</legend><div class="candidate-grid">${candidateCards}</div></fieldset>
      <label class="note-field">Or use an approved image URL<input data-source-image="${escapeAttribute(group.key)}" type="url" value="${escapeAttribute(image)}" placeholder="https://... direct image URL" /></label>
      <label class="note-field">Reference notes<textarea data-source-note="${escapeAttribute(group.key)}" rows="3" placeholder="Paste source notes, spec caveats, or visual direction here.">${escapeHtml(note)}</textarea></label>
    `;
    els.sourceList.append(card);
  }
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
  return officialSourceUrls(group);
}

function officialSourceUrls(group) {
  return BriefCore.verifiedSourceUrls({
    ...group,
    matchedPlacement: { ...(group.matchedPlacement || {}), sourceUrls: BriefCore.officialSourceUrls(group) }
  });
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
  const themeXml = themeFile ? await themeFile.async('text') : '';
  const slideFiles = Object.entries(zip.files)
    .filter(([name]) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .map(([, entry]) => entry);
  const slideXml = (await Promise.all(slideFiles.map((entry) => entry.async('text')))).join('\n');
  const colors = extractTemplateColors(themeXml, slideXml);
  return { name: file.name, colors };
}

function extractTemplateColors(themeXml, slideXml = '') {
  const themeColors = [...themeXml.matchAll(/<a:srgbClr[^>]+val="([0-9A-Fa-f]{6})"/g)]
    .map((match) => `#${match[1]}`)
    .filter(isUsefulTemplateColor);
  const counts = new Map();
  for (const match of slideXml.matchAll(/(?:val|lastClr)="([0-9A-Fa-f]{6})"/g)) {
    const color = `#${match[1].toUpperCase()}`;
    counts.set(color, (counts.get(color) || 0) + 1);
  }
  const ranked = [...counts].sort((left, right) => right[1] - left[1]).map(([color]) => color);
  const primary = ranked.find((color) => colorBrightness(color) < 55) || themeColors.find(isDarkColor) || '#111111';
  const warmAccent = ranked.find((color) => {
    const { red, green, blue } = rgbForHex(color);
    return red > 180 && green > 45 && green < 185 && blue < green * 0.82;
  });
  const vibrantAccent = ranked.find((color) => color !== primary && colorChroma(color) > 90 && colorBrightness(color) > 70);
  if (!ranked.length && !themeColors.length) return null;
  return {
    primaryColor: primary,
    accentColor: warmAccent || vibrantAccent || themeColors[1] || themeColors[0] || '#f36b21',
    backgroundColor: '#ffffff',
    textColor: '#111111'
  };
}

function collectOptions() {
  const templateColors = state.template?.colors || {};
  state.options = {
    clientName: qs('#client-name')?.value.trim() || 'Client / brand',
    campaignName: qs('#campaign-name')?.value.trim() || 'Campaign name',
    campaignDate: qs('#campaign-date')?.value || '',
    slideCount: Math.max(1, Number(qs('#slide-count')?.value || 40)),
    templateName: state.template?.name || '',
    primaryColor: templateColors.primaryColor || '#111111',
    accentColor: templateColors.accentColor || '#f36b21',
    backgroundColor: templateColors.backgroundColor || '#ffffff',
    textColor: templateColors.textColor || '#111111',
    includeTiming: Boolean(qs('#include-timing')?.checked),
    includeDividers: Boolean(qs('#include-dividers')?.checked),
    includeClosing: Boolean(qs('#include-closing')?.checked),
    includeAppendix: Boolean(qs('#include-appendix')?.checked),
    includeSafeZones: Boolean(qs('#include-safe-zones')?.checked),
    includeReviewStatus: Boolean(qs('#include-review-status')?.checked)
  };
  document.documentElement.style.setProperty('--client-primary', state.options.primaryColor);
  document.documentElement.style.setProperty('--client-accent', state.options.accentColor);
  document.documentElement.style.setProperty('--client-background', state.options.backgroundColor);
  document.documentElement.style.setProperty('--client-text', state.options.textColor);
  els.previewClient.textContent = state.options.clientName;
  els.previewCampaign.textContent = [state.options.campaignName, formatCampaignDate(state.options.campaignDate), state.options.templateName && `Template: ${state.options.templateName}`].filter(Boolean).join(' - ');
}

function defaultOptions() {
  return {
    clientName: 'Client / brand',
    campaignName: 'Campaign name',
    campaignDate: '',
    slideCount: 40,
    templateName: '',
    primaryColor: '#111111',
    accentColor: '#f36b21',
    backgroundColor: '#ffffff',
    textColor: '#111111',
    includeTiming: false,
    includeDividers: true,
    includeClosing: true,
    includeAppendix: false,
    includeSafeZones: true,
    includeReviewStatus: true
  };
}

function renderDeckPlan() {
  const sequence = buildDeckSequence();
  els.deckCount.textContent = outputGroups().length ? `${sequence.length} slide${sequence.length === 1 ? '' : 's'} in outline` : 'Deck outline';
  if (!outputGroups().length) {
    els.deckPlan.className = 'deck-plan empty-state';
    els.deckPlan.textContent = 'Upload and review placements to see the deck plan.';
    return;
  }
  els.deckPlan.className = 'deck-plan';
  els.deckPlan.innerHTML = sequence.map((slide, index) => `<article class="deck-role-${escapeAttribute(slide.role)}" style="--channel-accent:${slide.platform ? channelColor(slide.platform) : state.options.accentColor}"><span>${String(index + 1).padStart(2, '0')} · ${escapeHtml(slideRoleLabel(slide.role))}</span><strong>${escapeHtml(slide.title)}</strong><p>${escapeHtml(slideOutlineDescription(slide))}</p></article>`).join('');
}

function buildDeckSequence() {
  return BriefCore.buildDeckSequence(outputGroups(), state.options).slice(0, state.options.slideCount);
}

function renderBrief() {
  const sequence = buildDeckSequence();
  if (!outputGroups().length) {
    els.briefOutput.className = 'brief-output empty-state';
    els.briefOutput.textContent = 'Your assembled brief will appear here.';
    return;
  }
  els.briefOutput.className = 'brief-output';
  els.briefOutput.innerHTML = `<section class="brief-meta"><h3>${escapeHtml(state.options.clientName)} - ${escapeHtml(state.options.campaignName)}</h3><p>${outputGroups().length} active placement groups. ${state.groups.filter((group) => state.decisions[group.key] === 'rejected').length} marked needs fix.</p></section>`;
  for (const [index, slide] of sequence.entries()) {
    const card = document.createElement('section');
    card.className = `brief-card brief-role-${slide.role}`;
    card.style.setProperty('--channel-accent', slide.platform ? channelColor(slide.platform) : state.options.accentColor);
    card.innerHTML = renderBriefSlide(slide, index);
    els.briefOutput.append(card);
  }
}

function renderBriefSlide(slide, index) {
  const kicker = `<p class="platform">${String(index + 1).padStart(2, '0')} · ${escapeHtml(slideRoleLabel(slide.role))}</p>`;
  if (slide.role === 'title') return `<div class="brief-hero">${kicker}<h3>${escapeHtml(state.options.clientName)}</h3><p>${escapeHtml(state.options.campaignName)}</p>${state.options.campaignDate ? `<time>${escapeHtml(formatCampaignDate(state.options.campaignDate))}</time>` : ''}</div>`;
  if (slide.role === 'timing') return `<div class="brief-hero">${kicker}<h3>Timing</h3><p>${escapeHtml(formatCampaignDate(slide.date) || 'Date to be confirmed')}</p></div>`;
  if (slide.role === 'divider') return `<div class="brief-divider">${kicker}<h3>${escapeHtml(slide.platform)}</h3><p>${outputGroups().filter((group) => group.platform === slide.platform).length} placement${outputGroups().filter((group) => group.platform === slide.platform).length === 1 ? '' : 's'}</p></div>`;
  if (slide.role === 'placement') return `<div class="brief-card-header"><div>${kicker}<h3>${escapeHtml(slide.title)}</h3></div><span class="asset-type">${escapeHtml(slide.platform)}</span></div>${renderBriefGroup(slide.group)}`;
  if (slide.role === 'appendix') return `<div class="brief-card-header"><div>${kicker}<h3>Verified source appendix</h3></div></div>${buildSourceAppendixMarkup(slide.groups)}`;
  return `<div class="brief-hero brief-closing">${kicker}<h3>Thank you</h3><p>${escapeHtml(state.options.clientName)}</p></div>`;
}

function renderBriefGroup(group) {
  const placement = group.matchedPlacement;
  const status = state.decisions[group.key] || 'tbd';
  const specs = buildSpecSnapshot(group, 5).map((spec) => `<li>${escapeHtml(spec)}</li>`).join('') || '<li>Confirm specs manually.</li>';
  const copyFields = (placement?.copyFields || []).slice(0, 4).map((field) => `<li>${escapeHtml(field.label)} - ${escapeHtml(field.limit)}</li>`).join('') || '<li>Confirm copy fields manually.</li>';
  const prompts = (placement?.creativePrompts || []).slice(0, 3).map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join('');
  const note = state.sourceNotes[group.key] ? `<p><strong>Reference notes:</strong> ${escapeHtml(state.sourceNotes[group.key])}</p>` : '';
  const image = state.sourceImages[group.key] ? `<figure class="brief-example-image"><img src="${escapeAttribute(state.sourceImages[group.key])}" alt="Example reference for ${escapeAttribute(group.placementName)}" loading="lazy" /><figcaption>Selected creative example</figcaption></figure>` : '';
  const durations = BriefCore.buildDurationSpecBlocks(group).filter((block) => block.duration !== 'All').map((block) => `<li><strong>${escapeHtml(block.duration)}</strong> deliverable</li>`).join('');
  return `<article class="brief-placement"><header><strong>${escapeHtml(group.platform)} · ${escapeHtml(group.placementName)}</strong>${state.options.includeReviewStatus ? `<span>${escapeHtml(statusLabel(status))}</span>` : ''}</header><div class="placement-layout"><div>${durations ? `<h4>Required cutdowns</h4><ul>${durations}</ul>` : ''}<div class="grid-two compact-grid"><div><h4>Specs</h4><ul>${specs}</ul></div><div><h4>Copy and restrictions</h4><ul>${copyFields}</ul></div></div>${prompts ? `<h4>Creative direction</h4><ul>${prompts}</ul>` : ''}${note}</div><div>${image || '<div class="image-placeholder"><strong>Creative example</strong><span>Select an approved image in Sources.</span></div>'}${state.options.includeSafeZones ? buildSafeZoneMarkup(placement) : ''}</div></div></article>`;
}

function buildSafeZoneMarkup(placement) {
  const ratio = (placement?.specs || []).find((spec) => /ratio/i.test(spec.label))?.value || 'Confirm ratio';
  return `<div class="mini-safe-zone"><span>Safe zone</span><strong>${escapeHtml(ratio)}</strong><small>Keep logo, product, claim, CTA clear of UI.</small></div>`;
}

function buildSourceAppendixMarkup(groups = outputGroups()) {
  const rows = [];
  for (const group of groups) {
    const links = sourceUrls(group).map(toSourceLink).join('') || '<span class="muted">No source links yet.</span>';
    const image = state.sourceImages[group.key] ? `<p><strong>Selected image:</strong> ${escapeHtml(state.sourceImages[group.key])}</p>` : '';
    const note = state.sourceNotes[group.key] ? `<p>${escapeHtml(state.sourceNotes[group.key])}</p>` : '';
    rows.push(`<article><strong>${escapeHtml(group.platform)} · ${escapeHtml(group.placementName)}</strong><div class="source-links">${links}</div>${image}${note}</article>`);
  }
  return `<div class="appendix-list">${rows.join('')}</div>`;
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
  const sequence = buildDeckSequence();
  if (!outputGroups().length) return '';
  return [
    `${state.options.clientName} - ${state.options.campaignName}`,
    `${outputGroups().length} placement groups`,
    '',
    ...sequence.flatMap((slide, index) => [`${String(index + 1).padStart(2, '0')} · ${slideRoleLabel(slide.role)} · ${slide.title}`, ...(slide.group ? groupToPlainText(slide.group) : []), ''])
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

async function exportPowerPointBrief({ fileSuffix = 'powerpoint', toast = 'PowerPoint exported.' } = {}) {
  const sequence = buildDeckSequence();
  if (!outputGroups().length) return showToast('Generate a brief first.');
  const imported = await import(cdn.pptx);
  const PptxGenJS = imported.default || imported;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Digital Task Brief Maker';
  pptx.subject = 'Digital Task Brief';
  pptx.title = `${state.options.clientName} Digital Task Brief`;
  pptx.company = state.options.templateName || 'AgencyThings';
  pptx.theme = {
    headFontFace: 'Arial',
    bodyFontFace: 'Arial',
    lang: 'en-US'
  };

  for (const slidePlan of sequence) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    if (slidePlan.role === 'title') addPptTitleSlide(pptx, slide);
    else if (slidePlan.role === 'timing') addPptTimingSlide(pptx, slide, slidePlan);
    else if (slidePlan.role === 'divider') addPptDividerSlide(pptx, slide, slidePlan);
    else if (slidePlan.role === 'placement') addPptPlacementSlide(pptx, slide, slidePlan.group);
    else if (slidePlan.role === 'appendix') addPptAppendixSlide(pptx, slide, slidePlan.groups);
    else addPptClosingSlide(pptx, slide);
  }

  await pptx.writeFile({ fileName: `digital-task-brief-${dateStamp(true)}-${fileSuffix}.pptx` });
  showToast(toast);
}

function addPptTitleSlide(pptx, slide) {
  slide.background = { color: hexForPpt(state.options.primaryColor) };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.34, h: 0.28, fill: { color: hexForPpt(state.options.accentColor) }, line: { color: hexForPpt(state.options.accentColor) } });
  slide.addText(state.options.clientName.toUpperCase(), { x: 0.72, y: 1.4, w: 11.8, h: 0.7, fontSize: 34, bold: true, color: 'FFFFFF', margin: 0 });
  slide.addText(state.options.campaignName, { x: 0.72, y: 2.25, w: 11.2, h: 0.6, fontSize: 23, color: hexForPpt(state.options.accentColor), margin: 0 });
  if (state.options.campaignDate) slide.addText(formatCampaignDate(state.options.campaignDate), { x: 0.72, y: 3.05, w: 6, h: 0.35, fontSize: 13, color: 'FFFFFF', margin: 0 });
  if (state.options.templateName) slide.addText(`Template profile: ${state.options.templateName}`, { x: 0.72, y: 6.62, w: 8, h: 0.22, fontSize: 8, color: 'D9D9D9', margin: 0 });
}

function addPptTimingSlide(pptx, slide, slidePlan) {
  addPptHeader(pptx, slide, 'TIMING');
  slide.addText(formatCampaignDate(slidePlan.date) || 'Date to be confirmed', { x: 0.72, y: 2.4, w: 11.8, h: 0.8, fontSize: 34, bold: true, color: hexForPpt(state.options.primaryColor), align: 'center', margin: 0 });
  addPptFooter(pptx, slide);
}

function addPptDividerSlide(pptx, slide, slidePlan) {
  slide.background = { color: hexForPpt(state.options.primaryColor) };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.34, h: 0.22, fill: { color: hexForPpt(state.options.accentColor) }, line: { color: hexForPpt(state.options.accentColor) } });
  slide.addText(slidePlan.platform.toUpperCase(), { x: 0.72, y: 2.5, w: 11.9, h: 1, fontSize: 40, bold: true, color: 'FFFFFF', align: 'center', margin: 0 });
  slide.addText('CREATIVE DELIVERABLES', { x: 0.72, y: 3.65, w: 11.9, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', charSpacing: 2, margin: 0 });
}

function addPptPlacementSlide(pptx, slide, group) {
  const placement = group.matchedPlacement;
  const imageUrl = state.sourceImages[group.key];
  addPptHeader(pptx, slide, group.platform.toUpperCase(), group.placementName);
  const specs = buildSpecSnapshot(group, 6);
  const durationRows = BriefCore.buildDurationSpecBlocks(group).filter((block) => block.duration !== 'All').map((block) => `${block.duration} deliverable`);
  const copyRows = (placement?.copyFields || []).slice(0, 4).map((field) => `${field.label}: ${field.limit}`);
  const restrictions = (placement?.creativePrompts || []).slice(0, 3);
  addPptSection(slide, 'SPECS', [...durationRows, ...specs], 0.72, 1.48, 5.75, 2.05);
  addPptSection(slide, 'COPY + RESTRICTIONS', [...copyRows, ...restrictions], 0.72, 3.82, 5.75, 2.35);
  if (imageUrl) {
    addImageToSlide(slide, imageUrl, { x: 7.05, y: 1.46, w: 5.55, h: 4.75 });
    slide.addText('SELECTED CREATIVE EXAMPLE', { x: 7.05, y: 6.28, w: 5.55, h: 0.22, fontSize: 8, bold: true, color: '666666', align: 'center', margin: 0 });
  } else {
    slide.addShape(pptx.ShapeType.rect, { x: 7.05, y: 1.46, w: 5.55, h: 4.75, fill: { color: 'F3F4F6' }, line: { color: 'C9CED6', dash: 'dash' } });
    slide.addText('SELECT CREATIVE EXAMPLE\nIN SOURCES', { x: 7.55, y: 3.18, w: 4.55, h: 0.72, fontSize: 18, bold: true, color: '6B7280', align: 'center', valign: 'mid', margin: 0 });
  }
  if (state.sourceNotes[group.key]) slide.addNotes(`Reference notes: ${state.sourceNotes[group.key]}`);
  addPptFooter(pptx, slide, state.options.includeReviewStatus ? statusLabel(state.decisions[group.key] || 'tbd') : '');
}

function addPptAppendixSlide(pptx, slide, groups) {
  addPptHeader(pptx, slide, 'APPENDIX', 'Verified sources');
  const rows = groups.slice(0, 12).map((group) => ({
    text: `${group.platform} · ${group.placementName}\n${sourceUrls(group).join('\n') || 'Partner confirmation required'}`,
    options: { bullet: false, breakLine: true }
  }));
  slide.addText(rows, { x: 0.72, y: 1.42, w: 11.9, h: 5.55, fontSize: 9, color: '222222', breakLine: false, margin: 0.05, valign: 'top' });
  addPptFooter(pptx, slide);
}

function addPptClosingSlide(pptx, slide) {
  slide.background = { color: hexForPpt(state.options.primaryColor) };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.34, h: 0.28, fill: { color: hexForPpt(state.options.accentColor) }, line: { color: hexForPpt(state.options.accentColor) } });
  slide.addText('THANK YOU', { x: 0.72, y: 2.65, w: 11.9, h: 0.9, fontSize: 42, bold: true, color: 'FFFFFF', align: 'center', margin: 0 });
  slide.addText(state.options.clientName, { x: 0.72, y: 3.75, w: 11.9, h: 0.35, fontSize: 15, color: hexForPpt(state.options.accentColor), align: 'center', margin: 0 });
}

function addPptHeader(pptx, slide, eyebrow, title = '') {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.34, h: 0.2, fill: { color: hexForPpt(state.options.accentColor) }, line: { color: hexForPpt(state.options.accentColor) } });
  slide.addText(eyebrow, { x: 0.72, y: 0.42, w: 4.3, h: 0.24, fontSize: 9, bold: true, color: hexForPpt(state.options.accentColor), charSpacing: 1.4, margin: 0 });
  slide.addText(title || eyebrow, { x: 0.72, y: 0.72, w: 11.9, h: 0.55, fontSize: 26, bold: true, color: hexForPpt(state.options.primaryColor), margin: 0, fit: 'shrink' });
}

function addPptSection(slide, heading, rows, x, y, w, h) {
  slide.addText(heading, { x, y, w, h: 0.25, fontSize: 10, bold: true, color: hexForPpt(state.options.accentColor), charSpacing: 1.1, margin: 0 });
  slide.addText(rows.length ? rows.map((row) => ({ text: row, options: { bullet: { indent: 12 }, breakLine: true } })) : 'Confirm with partner.', { x, y: y + 0.34, w, h: h - 0.34, fontSize: 10.5, color: '222222', breakLine: false, margin: 0.04, valign: 'top', fit: 'shrink' });
}

function addPptFooter(pptx, slide, rightText = '') {
  slide.addShape(pptx.ShapeType.line, { x: 0.72, y: 7.05, w: 11.9, h: 0, line: { color: 'D8DDE4', width: 1 } });
  slide.addText(state.options.clientName, { x: 0.72, y: 7.12, w: 6, h: 0.16, fontSize: 7, color: '777777', margin: 0 });
  if (rightText) slide.addText(rightText.toUpperCase(), { x: 8.2, y: 7.12, w: 4.4, h: 0.16, fontSize: 7, bold: true, color: '777777', align: 'right', margin: 0 });
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

function slugify(value) {
  return normalize(value).replace(/[:\s]+/g, '-');
}

function channelColor(platform) {
  const text = normalize(platform);
  if (/tvc|linear/.test(text)) return '#cc2b2b';
  if (/polv|olv|video/.test(text)) return '#6f42c1';
  if (/audio|spotify|pandora|sxm/.test(text)) return '#13795b';
  if (/social|meta|instagram|facebook|tiktok|pinterest|twitter|(^| )x( |$)/.test(text)) return '#0b59ff';
  if (/programmatic|display|banner/.test(text)) return '#b45f06';
  return '#45556c';
}

function slideRoleLabel(role) {
  return {
    title: 'Title',
    timing: 'Timing',
    divider: 'Section divider',
    placement: 'Placement',
    appendix: 'Appendix',
    closing: 'Closing'
  }[role] || 'Slide';
}

function slideOutlineDescription(slide) {
  if (slide.role === 'title') return [state.options.campaignName, formatCampaignDate(state.options.campaignDate)].filter(Boolean).join(' · ');
  if (slide.role === 'timing') return formatCampaignDate(slide.date) || 'Date to be confirmed';
  if (slide.role === 'divider') return `Header slide before ${slide.platform} deliverables`;
  if (slide.role === 'placement') return 'One placement with specs, cutdowns, copy restrictions, and selected image';
  if (slide.role === 'appendix') return 'Verified partner and standards links';
  return state.options.clientName;
}

function formatCampaignDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9:]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function isUsefulTemplateColor(color) {
  const normalized = color.toLowerCase();
  return !['#ffffff', '#000000', '#f2f2f2', '#e7e6e6'].includes(normalized);
}

function isDarkColor(color) {
  return colorBrightness(color) < 130;
}

function rgbForHex(color) {
  const hex = String(color || '#111111').replace('#', '').padEnd(6, '0').slice(0, 6);
  return {
    red: parseInt(hex.slice(0, 2), 16) || 0,
    green: parseInt(hex.slice(2, 4), 16) || 0,
    blue: parseInt(hex.slice(4, 6), 16) || 0
  };
}

function colorBrightness(color) {
  const { red, green, blue } = rgbForHex(color);
  return red * 0.299 + green * 0.587 + blue * 0.114;
}

function colorChroma(color) {
  const { red, green, blue } = rgbForHex(color);
  return Math.max(red, green, blue) - Math.min(red, green, blue);
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
  const storedTheme = localStorage.getItem('brief-maker-theme');
  const isDark = storedTheme ? storedTheme === 'dark' : true;
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
