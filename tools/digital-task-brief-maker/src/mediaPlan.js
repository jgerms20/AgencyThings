const bucketOrder = ['TVC', 'POLV', 'AUDIO', 'SOCIAL', 'PROGRAMMATIC', 'CUSTOM', 'OOH', 'MEDIA PLAN'];

export function applyMergedSpreadsheetCells(sheet, rows) {
  for (const merge of sheet['!merges'] || []) {
    const value = rows[merge.s.r]?.[merge.s.c];
    if (!String(value || '').trim()) continue;
    for (let rowIndex = merge.s.r; rowIndex <= merge.e.r; rowIndex += 1) {
      rows[rowIndex] ||= [];
      for (let colIndex = merge.s.c; colIndex <= merge.e.c; colIndex += 1) {
        if (!String(rows[rowIndex][colIndex] || '').trim()) rows[rowIndex][colIndex] = value;
      }
    }
  }
}

export function extractInventoryWorkbookSheets(sheets) {
  const extracted = sheets
    .map((sheet) => ({ sheetName: sheet.sheetName, rows: extractInventoryTableRows(sheet.rows, sheet.sheetName) }))
    .filter((sheet) => sheet.rows.length);
  const preferred = extracted.filter((sheet) => !/master/i.test(sheet.sheetName) && sheet.rows.length >= 3);
  return dedupeInventoryRows((preferred.length ? preferred : extracted).flatMap((sheet) => sheet.rows));
}

export function extractInventoryTableRows(rows, sheetName = '') {
  const output = [];
  let headerMap = null;
  let activeBucket = '';
  let carry = { channel: '', partner: '', asset: '' };

  for (const row of rows) {
    const header = findInventoryHeaderMap(row);
    if (header) {
      headerMap = header;
      activeBucket = '';
      carry = { channel: '', partner: '', asset: '' };
      continue;
    }
    if (!headerMap) continue;

    const item = readInventoryRow(row, headerMap);
    if (isInventoryInstructionRow(item)) continue;

    if (isInventorySectionRow(item)) {
      activeBucket = normalizeInventoryBucket(item.channel);
      carry = { channel: '', partner: '', asset: '' };
      continue;
    }

    const hasOwnDetail = Object.values(item).some((value) => String(value || '').trim());
    if (!hasOwnDetail) continue;

    item.channel ||= carry.channel;
    item.partner ||= carry.partner;
    item.asset ||= carry.asset;

    if (!isUsableInventoryRow(item)) continue;

    if (item.channel && !isBucketOnlyLabel(item.channel)) carry.channel = item.channel;
    if (item.partner) carry.partner = item.partner;
    if (item.asset) carry.asset = item.asset;

    output.push({
      bucket: activeBucket || classifyInventoryBucket(item.channel),
      channel: cleanInventoryText(item.channel),
      partner: cleanInventoryText(item.partner),
      asset: cleanInventoryText(item.asset),
      assetFormat: cleanInventoryText(item.assetFormat),
      specs: cleanInventoryText(condenseInventoryText(item.specs, 180)),
      placement: cleanInventoryText(item.placement),
      dueDate: cleanInventoryText(item.dueDate),
      flightDates: cleanInventoryText(item.flightDates),
      quantity: cleanInventoryText(item.quantity),
      copyNeeds: cleanInventoryText(condenseInventoryText(item.copyNeeds, 150)),
      notes: cleanInventoryText(condenseInventoryText(item.notes, 180)),
      sheetName
    });
  }

  return output;
}

export function inventoryRowsToPlanText(rows) {
  if (!rows.length) return '';
  const header = ['Bucket', 'Channel', 'Partner', 'Asset', 'Asset Format', 'Specs', 'Placement', 'Quantity', 'Notes', 'Due Date', 'Flight Dates', 'Copy Needs'];
  const body = rows.map((row) => [
    row.bucket,
    row.channel,
    row.partner,
    row.asset,
    row.assetFormat,
    row.specs,
    row.placement,
    row.quantity,
    row.notes,
    row.dueDate,
    row.flightDates,
    row.copyNeeds
  ].map(inventoryCell).join('\t'));
  return [header.join('\t'), ...body].join('\n');
}

export function parsePlan(input, placementLibrary = []) {
  const lines = toCandidateLines(input, placementLibrary);
  if (!lines.length) return [];

  const parsedRows = lines.map(splitRow).filter((cells) => cells.some(Boolean));
  const headerMap = getHeaderMap(parsedRows[0]);
  const dataRows = headerMap ? parsedRows.slice(1) : parsedRows;

  return dataRows
    .map((cells) => rowFromCells(cells, headerMap, placementLibrary))
    .filter((row) => row.platform || row.placement || row.notes || row.bucket || row.asset);
}

export function findBestPlacement(row, placementLibrary = []) {
  const libraryMatch = findLibraryPlacement(row, placementLibrary);
  if (isStructuredPlanRow(row)) {
    const trustedPlacement = isTrustedStructuredLibraryMatch(row, libraryMatch) ? libraryMatch.placement : null;
    return {
      placement: buildInventoryPlacement(row, trustedPlacement),
      confidence: Math.max(0.84, libraryMatch.confidence || 0),
      searchText: libraryMatch.searchText,
      signals: libraryMatch.signals.length ? libraryMatch.signals : [{ original: 'Structured inventory row', score: 0.9, tokens: [] }]
    };
  }
  return libraryMatch;
}

function isTrustedStructuredLibraryMatch(row, libraryMatch) {
  if (!libraryMatch.placement || libraryMatch.confidence < 0.62) return false;
  const rowText = normalize([row.platform, row.bucket, row.channel, row.partner, row.asset, row.placement].join(' '));
  const platform = normalize(libraryMatch.placement.platform);
  if (platform && rowText.includes(platform)) return true;
  return (libraryMatch.placement.aliases || [])
    .map(normalize)
    .filter((alias) => alias.length > 2)
    .some((alias) => rowText.includes(alias));
}

export function buildGroups(items) {
  const grouped = new Map();

  for (const item of items) {
    const row = item.raw || {};
    const placement = item.matchedPlacement || item.placement || null;
    const platform = stripInventoryPrefix(row.bucket || placement?.platform || row.platform || row.channel || 'Needs setup');
    const placementName = placement?.placement || buildInventoryPlacementName(row) || row.placement || 'Unknown placement';
    const key = normalize(`${platform} ${placementName}`) || `group-${item.index}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        platform,
        placementName,
        matchedPlacement: placement,
        confidence: item.confidence || 0,
        rows: [],
        sizes: new Set(),
        units: 0,
        unitLabel: '',
        notes: [],
        specNotes: [],
        partners: new Set(),
        assets: new Set(),
        channels: new Set(),
        formats: new Set()
      });
    }

    const group = grouped.get(key);
    group.rows.push(item);
    group.confidence = Math.max(group.confidence, item.confidence || 0);
    addIfPresent(group.sizes, row.size);
    addIfPresent(group.partners, row.partner);
    addIfPresent(group.assets, row.asset);
    addIfPresent(group.channels, row.channel);
    addIfPresent(group.formats, row.assetFormat);
    for (const note of [row.specs, row.copyNeeds].filter(Boolean)) group.specNotes.push(conciseText(note, 180));
    if (row.notes) group.notes.push(conciseText(row.notes, 180));

    const unitNumber = Number(String(row.units || row.quantity || '').replace(/[^0-9.]/g, ''));
    if (Number.isFinite(unitNumber) && unitNumber > 0) group.units += unitNumber;
    if ((row.units || row.quantity) && !group.unitLabel) group.unitLabel = row.units || row.quantity;
  }

  return [...grouped.values()].map((group) => ({
    ...group,
    sizes: group.sizes,
    partners: [...group.partners],
    assets: [...group.assets],
    channels: [...group.channels],
    formats: [...group.formats],
    specNotes: [...new Set(group.specNotes)].slice(0, 4)
  }));
}

export function buildSlidePlan(groups, options = {}) {
  const slideCount = Math.max(1, Number(options.slideCount || 8));
  const slideStrategy = options.slideStrategy || 'placement';
  if (!groups.length) return [];

  let slides;
  if (slideStrategy === 'platform') {
    slides = [...groupBy(groups, (group) => group.platform)].flatMap(([platform, platformGroups]) => {
      const chunks = chunk(platformGroups, 4);
      return chunks.map((platformChunk, index) => ({
        title: chunks.length > 1 ? `${platform} ${index + 1}/${chunks.length}` : platform,
        groups: platformChunk
      }));
    });
  } else if (slideStrategy === 'compact') {
    slides = chunk(groups, 3).map((chunkGroups, index) => ({ title: `Summary ${index + 1}`, groups: chunkGroups }));
  } else {
    slides = groups.map((group) => ({ title: `${group.platform} - ${group.placementName}`, groups: [group] }));
  }

  return slides.slice(0, slideCount);
}

export function buildSearchPack(group, options = {}) {
  const clientName = options.clientName && options.clientName !== 'Client / brand' ? options.clientName : '';
  const partner = group.partners?.[0] || '';
  const asset = group.assets?.[0] || group.placementName;
  const base = [partner || group.platform, asset].filter(Boolean).join(' ');
  const officialQuery = officialSpecQuery(group);
  const brandQuery = [clientName, partner || group.platform, asset, 'ad example'].filter(Boolean).join(' ');

  return [
    { label: 'Official specs', query: officialQuery, type: 'web' },
    { label: 'Image examples', query: `${base} ad examples`, type: 'image' },
    { label: 'Brand examples', query: brandQuery || `${base} brand example`, type: 'image' },
    { label: 'Competitive examples', query: `${base} best ad examples`, type: 'image' }
  ];
}

export function specSummary(placement, limit = 3) {
  return (placement?.specs || []).slice(0, limit).map((spec) => `${spec.label}: ${spec.value}`);
}

export function statusLabel(status) {
  return {
    approved: 'Approved',
    tbd: 'TBD',
    rejected: 'Needs fix'
  }[status] || 'TBD';
}

export function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

export function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

export function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9:]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function conciseText(value, length = 120) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > length ? `${text.slice(0, length - 3)}...` : text;
}

export function csvEscape(value) {
  const text = String(value ?? '').trim();
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function stripInventoryPrefix(value) {
  return String(value || '').replace(/^Inventory:\s*/i, '').trim();
}

export function hexForPpt(value) {
  return String(value || '#111111').replace('#', '').toUpperCase();
}

export function dateStamp(includeTime = false) {
  const date = new Date();
  if (!includeTime) return date.toISOString().slice(0, 10);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16).replace('T', '-').replace(':', '');
}

function findLibraryPlacement(row, placementLibrary) {
  const searchText = normalize(`${row.platform} ${row.bucket} ${row.channel} ${row.partner} ${row.placement} ${row.asset} ${row.assetFormat} ${row.size} ${row.specs} ${row.notes}`);
  let best = { placement: null, confidence: 0, searchText, signals: [] };

  for (const placement of placementLibrary) {
    const candidates = [placement.platform, placement.placement, placement.assetType, ...(placement.aliases || [])].filter(Boolean);
    const signals = candidates.map((candidate) => scoreCandidate(searchText, candidate)).sort((a, b) => b.score - a.score);
    const platformBonus = searchText.includes(normalize(placement.platform)) ? 0.08 : 0;
    const topScore = Math.min(1, (signals[0]?.score || 0) + platformBonus);

    if (topScore > best.confidence) {
      best = { placement, confidence: topScore, searchText, signals: signals.slice(0, 3) };
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

function buildInventoryPlacement(row, libraryPlacement) {
  const specs = [
    ['Channel', row.channel],
    ['Partner', row.partner],
    ['Asset', row.asset],
    ['Format', row.assetFormat],
    ['Specs', row.specs],
    ['Quantity', row.quantity || row.units],
    ['Timing', [row.dueDate && `Due ${row.dueDate}`, row.flightDates && `Flight ${row.flightDates}`].filter(Boolean).join(' | ')]
  ]
    .filter(([, value]) => usefulText(value))
    .map(([label, value]) => ({ label, value: conciseText(value, 180) }));

  const copyFields = usefulText(row.copyNeeds)
    ? [{ label: 'Copy needs', limit: conciseText(row.copyNeeds, 120), placeholder: 'Confirm copy direction from the plan and source specs.' }]
    : (libraryPlacement?.copyFields || [{ label: 'Copy / legal', limit: 'Confirm with partner specs', placeholder: 'Add copy, CTA, claims, legal, and URL needs.' }]);

  return {
    id: `inventory-${normalize([row.bucket, row.channel, row.partner, row.asset].join(' '))}`,
    platform: stripInventoryPrefix(row.bucket || row.channel || row.platform || libraryPlacement?.platform || 'MEDIA PLAN'),
    placement: buildInventoryPlacementName(row) || libraryPlacement?.placement || row.placement || 'Media plan deliverable',
    aliases: [],
    assetType: row.assetFormat || libraryPlacement?.assetType || row.asset || 'Media plan deliverable',
    objectiveFit: row.channel || libraryPlacement?.objectiveFit || 'Imported from media plan',
    specs: specs.length ? specs : (libraryPlacement?.specs || []),
    copyFields,
    creativePrompts: [
      'Build directly against the imported media-plan specs before applying platform defaults.',
      'Confirm official partner specs, safe zones, and file requirements before release.',
      row.notes ? `Reference note: ${conciseText(row.notes, 120)}` : ''
    ].filter(Boolean),
    exampleSearches: buildInventoryExampleSearches(row),
    sourceUrls: [...new Set([...(libraryPlacement?.sourceUrls || []), ...sourceUrlsForRow(row)])]
  };
}

function buildInventoryPlacementName(row) {
  const partner = usefulText(row.partner) ? row.partner : '';
  const asset = usefulText(row.asset) ? row.asset : '';
  const placement = usefulText(row.placement) && !/^n\/?a$/i.test(row.placement) ? row.placement : '';
  if (partner && asset) return `${partner} - ${asset}`;
  if (partner && placement) return `${partner} - ${placement}`;
  if (partner) return partner;
  return asset || placement || '';
}

function buildInventoryExampleSearches(row) {
  const partner = row.partner || row.channel || row.bucket;
  const asset = row.asset || row.assetFormat || 'ad';
  return [
    `${partner} ${asset} ad examples`,
    `${row.bucket || row.channel} ${asset} creative examples`
  ].filter(Boolean);
}

function sourceUrlsForRow(row) {
  const text = normalize([row.bucket, row.channel, row.partner, row.asset].join(' '));
  const urls = [];
  if (/meta|instagram|facebook/.test(text)) urls.push('https://www.facebook.com/business/ads-guide');
  if (/tiktok/.test(text)) urls.push('https://ads.tiktok.com/help/article/video-ads-specifications');
  if (/youtube|google/.test(text)) urls.push('https://support.google.com/google-ads/answer/2375464');
  if (/pinterest/.test(text)) urls.push('https://help.pinterest.com/en/business/article/creative-specs');
  if (/\bx\b|twitter|amplify/.test(text)) urls.push('https://business.x.com/en/help/campaign-setup/creative-ad-specifications.html');
  return urls;
}

function officialSpecQuery(group) {
  const text = normalize([group.platform, group.placementName, ...(group.partners || []), ...(group.assets || [])].join(' '));
  if (/meta|instagram|facebook/.test(text)) return 'Meta ads guide image video creative specifications official';
  if (/tiktok/.test(text)) return 'TikTok ads creative specifications official';
  if (/youtube|google/.test(text)) return 'Google Ads video ad specifications official';
  if (/pinterest/.test(text)) return 'Pinterest business creative specs official';
  if (/\bx\b|twitter|amplify/.test(text)) return 'X ads creative ad specifications official';
  if (/spotify|pandora|sxm|audacy|iheart|podcast/.test(text)) return 'audio ad specs Spotify Pandora podcast official';
  if (/programmatic|display|banner|dv360|dsp|iab/.test(text)) return 'IAB display ad unit specs banner official';
  if (/roku|disney|lg|brightline|custom/.test(text)) return `${group.placementName} advertising specs official`;
  if (/ooh|gstv|cooler/.test(text)) return `${group.placementName} OOH advertising specs official`;
  return `${group.platform} ${group.placementName} ad specs official`;
}

function toCandidateLines(input, placementLibrary) {
  const rawLines = input.split(/\r?\n/).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed) return [];
    if (trimmed.includes(',') || trimmed.includes('\t')) return [trimmed];
    return trimmed.split(/[;•]+/).map((piece) => piece.trim()).filter(Boolean);
  });
  const expanded = rawLines.flatMap((line) => {
    if (line.length > 260 && !line.includes(',') && !line.includes('\t')) return chunkPlainTextLine(line, placementLibrary);
    return [line];
  });
  const filtered = expanded.filter((line) => isLikelyDeliverableLine(line, placementLibrary));
  return filtered.length ? filtered : rawLines.slice(0, 80);
}

function chunkPlainTextLine(line, placementLibrary) {
  const platforms = [...new Set(placementLibrary.map((item) => item.platform).concat(['Meta', 'Facebook', 'Twitter', 'LinkedIn', 'Snapchat', 'TikTok', 'Pinterest', 'YouTube']))]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp);
  if (!platforms.length) return [line];
  const pattern = new RegExp(`(?=\\b(?:${platforms.join('|')})\\b)`, 'i');
  const chunks = line.split(pattern).map((chunk) => chunk.trim()).filter(Boolean);
  return chunks.length > 1 ? chunks : [line];
}

function isLikelyDeliverableLine(line, placementLibrary) {
  if (line.includes(',') || line.includes('\t')) return true;
  if (detectPlatform(line, placementLibrary) || detectSize(line)) return true;
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
    bucket: findHeaderIndex(normalized, ['bucket', 'section', 'category']),
    channel: findHeaderIndex(normalized, ['channel', 'platform', 'publisher', 'network']),
    partner: findHeaderIndex(normalized, ['partner', 'vendor', 'publisher']),
    asset: findHeaderIndex(normalized, ['asset', 'deliverable']),
    assetFormat: findHeaderIndex(normalized, ['asset format', 'format']),
    specs: findHeaderIndex(normalized, ['specs', 'format specs', 'specification']),
    placement: findHeaderIndex(normalized, ['placement', 'placements', 'ad unit', 'adunit', 'tactic']),
    size: findHeaderIndex(normalized, ['size', 'dimension', 'dimensions', 'ratio']),
    units: findHeaderIndex(normalized, ['unit', 'units', 'qty', 'quantity', 'asset quantity', 'count']),
    notes: findHeaderIndex(normalized, ['note', 'notes', 'description', 'details', 'message', 'helpful']),
    dueDate: findHeaderIndex(normalized, ['due date', 'materials due', 'asset materials due']),
    flightDates: findHeaderIndex(normalized, ['flight date', 'flight dates']),
    copyNeeds: findHeaderIndex(normalized, ['copy needs', 'ad copy needs'])
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

function rowFromCells(cells, headerMap, placementLibrary) {
  if (headerMap) {
    const row = {
      bucket: stripInventoryPrefix(getMappedCell(cells, headerMap.bucket)),
      channel: getMappedCell(cells, headerMap.channel),
      partner: getMappedCell(cells, headerMap.partner),
      asset: getMappedCell(cells, headerMap.asset),
      assetFormat: getMappedCell(cells, headerMap.assetFormat),
      specs: getMappedCell(cells, headerMap.specs),
      placement: getMappedCell(cells, headerMap.placement),
      size: getMappedCell(cells, headerMap.size),
      units: getMappedCell(cells, headerMap.units),
      notes: getMappedCell(cells, headerMap.notes),
      dueDate: getMappedCell(cells, headerMap.dueDate),
      flightDates: getMappedCell(cells, headerMap.flightDates),
      copyNeeds: getMappedCell(cells, headerMap.copyNeeds)
    };
    row.platform = row.bucket || row.channel;
    row.placement = buildInventoryPlacementName(row) || row.placement || row.channel || row.platform;
    row.size = [row.assetFormat || row.size, row.specs].filter(Boolean).join(' | ');
    row.notes = [row.notes, row.dueDate && `Due: ${row.dueDate}`, row.flightDates && `Flight: ${row.flightDates}`, row.copyNeeds && `Copy: ${row.copyNeeds}`]
      .filter(Boolean)
      .map((value) => conciseText(value, 180))
      .join(' | ');
    return row;
  }

  if (cells.length === 1) return rowFromPlainText(cells[0], placementLibrary);

  return {
    platform: cells[0] || detectPlatform(cells.join(' '), placementLibrary),
    placement: cells[1] || cells[0] || '',
    size: cells[2] || detectSize(cells.join(' ')),
    units: cells[3] || '',
    notes: conciseText(cells.slice(4).join(' | '), 180)
  };
}

function getMappedCell(cells, index) {
  return index > -1 ? cells[index] || '' : '';
}

function rowFromPlainText(text, placementLibrary) {
  const platform = detectPlatform(text, placementLibrary);
  const provisional = { platform, placement: conciseText(text, 100), size: detectSize(text), units: '', notes: conciseText(text, 180) };
  const match = findBestPlacement(provisional, placementLibrary);
  return {
    platform,
    placement: match.placement?.placement || provisional.placement,
    size: provisional.size,
    units: '',
    notes: provisional.notes
  };
}

function detectPlatform(text, placementLibrary) {
  const normalizedText = normalize(text);
  const placement = placementLibrary.find((item) => normalizedText.includes(normalize(item.platform)));
  return placement?.platform || '';
}

function detectSize(text) {
  return String(text || '').match(/\d{2,5}\s?x\s?\d{2,5}|\d{1,2}:\d{1,2}/i)?.[0] || '';
}

function findInventoryHeaderMap(row) {
  const map = {};
  row.forEach((value, index) => {
    const text = normalizeInventoryHeader(value);
    if (!text) return;
    if (text.includes('format specs')) map.specs = index;
    else if (text.includes('asset format')) map.assetFormat = index;
    else if (text.includes('placements') || text.includes('ad copy needs')) map.placement = index;
    else if (text.includes('materials due') || text.includes('asset materials due')) map.dueDate = index;
    else if (text.includes('flight date')) map.flightDates = index;
    else if (text.includes('asset quantity') || text === 'quantity' || text === 'qty') map.quantity = index;
    else if (text.includes('copy needs')) map.copyNeeds = index;
    else if (text.includes('helpful') || text.includes('link') || text.includes('notes')) map.notes = index;
    else if (text === 'channel' || text === 'platform') map.channel = index;
    else if (text === 'partner' || text === 'publisher' || text === 'vendor') map.partner = index;
    else if (text === 'asset' || text === 'deliverable') map.asset = index;
  });
  const hits = ['channel', 'partner', 'asset', 'assetFormat', 'specs'].filter((key) => Number.isInteger(map[key])).length;
  return hits >= 4 ? map : null;
}

function readInventoryRow(row, map) {
  return {
    channel: getInventoryCell(row, map.channel),
    partner: getInventoryCell(row, map.partner),
    asset: getInventoryCell(row, map.asset),
    assetFormat: getInventoryCell(row, map.assetFormat),
    specs: getInventoryCell(row, map.specs),
    placement: getInventoryCell(row, map.placement),
    dueDate: getInventoryCell(row, map.dueDate),
    flightDates: getInventoryCell(row, map.flightDates),
    quantity: getInventoryCell(row, map.quantity),
    copyNeeds: getInventoryCell(row, map.copyNeeds),
    notes: getInventoryCell(row, map.notes)
  };
}

function getInventoryCell(row, index) {
  return Number.isInteger(index) ? String(row[index] || '').trim() : '';
}

function isInventoryInstructionRow(item) {
  return /responsible agency|asset tracking|these sections|omd\/os/i.test(Object.values(item).join(' '));
}

function isInventorySectionRow(item) {
  if (!item.channel) return false;
  const detailValues = [item.partner, item.asset, item.assetFormat, item.specs, item.placement, item.dueDate, item.flightDates, item.quantity, item.copyNeeds, item.notes];
  return detailValues.every((value) => !String(value || '').trim()) && isBucketOnlyLabel(item.channel);
}

function isUsableInventoryRow(item) {
  if (!item.partner && !item.asset && !item.specs && !item.assetFormat) return false;
  if (/^n\/?a$/i.test(item.partner) && /^n\/?a$/i.test(item.asset)) return false;
  return Boolean(item.channel || item.partner || item.asset);
}

function isBucketOnlyLabel(value) {
  const text = normalizeInventoryHeader(value);
  return /^(linear|tvc|television|tv commercial|polv|programmatic olv|audio|podcast|social|programmatic|display|custom|ooh|out of home)$/.test(text);
}

function normalizeInventoryBucket(value) {
  const text = normalizeInventoryHeader(value);
  if (/linear|tvc|television|tv commercial/.test(text)) return 'TVC';
  if (/polv|programmatic olv|online video/.test(text)) return 'POLV';
  if (/audio|podcast/.test(text)) return 'AUDIO';
  if (/social/.test(text)) return 'SOCIAL';
  if (/programmatic|display inventory|video inventory|display/.test(text)) return 'PROGRAMMATIC';
  if (/ooh|out of home|gstv/.test(text)) return 'OOH';
  if (/custom|roku|lg|home screen|marquee|brightline/.test(text)) return 'CUSTOM';
  return cleanInventoryText(value).toUpperCase() || 'MEDIA PLAN';
}

function classifyInventoryBucket(channel) {
  return normalizeInventoryBucket(channel || 'MEDIA PLAN');
}

function condenseInventoryText(value, maxLength) {
  const pieces = String(value || '')
    .replace(/\r/g, '\n')
    .split(/\n|•|\t/)
    .map((piece) => piece.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((piece) => !/^n\/?a$/i.test(piece));
  const unique = [...new Set(pieces)].slice(0, 5).join('; ');
  return unique.length > maxLength ? `${unique.slice(0, maxLength - 3)}...` : unique;
}

function cleanInventoryText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeInventoryHeader(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function dedupeInventoryRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = normalizeInventoryHeader([row.bucket, row.channel, row.partner, row.asset, row.assetFormat, row.specs].join(' '));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inventoryCell(value) {
  return String(value || '').replace(/[\t\r\n•]+/g, ' | ').replace(/\s+/g, ' ').trim();
}

function isStructuredPlanRow(row) {
  return Boolean(row.bucket || row.partner || row.asset || row.assetFormat || row.specs);
}

function usefulText(value) {
  return Boolean(String(value || '').trim()) && !/^n\/?a$/i.test(String(value || '').trim());
}

function addIfPresent(set, value) {
  if (usefulText(value)) set.add(String(value).trim());
}

export function sortBuckets(a, b) {
  const first = bucketOrder.indexOf(a);
  const second = bucketOrder.indexOf(b);
  if (first === -1 && second === -1) return a.localeCompare(b);
  if (first === -1) return 1;
  if (second === -1) return -1;
  return first - second;
}
