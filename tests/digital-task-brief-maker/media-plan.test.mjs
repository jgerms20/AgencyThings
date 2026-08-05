import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildDeckSequence,
  buildDurationSpecBlocks,
  buildGroups,
  buildSearchPack,
  buildSlidePlan,
  createPlanTable,
  duplicatePlanTable,
  extractDurationVariants,
  extractInventoryTableRows,
  findBestPlacement,
  imageCandidates,
  inventoryRowsToPlanText,
  parsePlan,
  planTablesToText,
  removePlanTable,
  renamePlanTable,
  verifiedSourceUrls
} from '../../tools/digital-task-brief-maker/src/mediaPlan.js';

const fixtureRows = [
  ['', "1) These sections to be adjusted from 'Master' list to be campaign specific", '', '', '', '', '', '', '', ''],
  ['', 'Channel', 'Partner', 'Asset', 'Asset Format\n(Static Image, Video, etc.)', 'Format Specs (spec details for asset itself, type of file MP3. etc, JPEG Animated or static)', 'Placements - Ad Copy Needs', 'Asset/Materials Due to Media Agency or Partner', 'Flight Dates', 'Asset Quantity'],
  ['Responsible Agency to provide', 'OMD/OS', 'OMD/OS', 'OMD/OS', 'OMD/OS', 'OMD/OS', '', 'OMD/OS', 'OMD/OS', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', 'TVC', '', '', '', '', '', '', '', ''],
  ['', 'Linear Video', 'All partners', ':15s or :30s Video Spot', 'Video File', '16x9\nSD and HD versions', 'N/A', '2/13/2026', '3/2 - 9/6', '1x-2x'],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', 'POLV', '', '', '', '', '', '', '', ''],
  ['', 'POLV', 'All partners', ':15s or :30s Video Spot', 'Video File', 'Video: 16x9\n1920 x 1080 HD mp4\n15-30 mbps Bitrate', 'N/A', '2/13/2026', '3/2 - 9/6', '2'],
  ['', 'AUDIO', '', '', '', '', '', '', '', ''],
  ['', 'Streaming Audio', 'SXM/Pandora', ':15s, :30s Audio Spot', 'Audio File', ':15s, :30s Audio Spot', '', 'Script due to SXM 2/2', '3/2 - 9/6', '2'],
  ['', '', '', '300x250', 'HIGH RES JPEG and PNG', 'HIGH RES JPEG', '', '2/13/2026', '', '1'],
  ['', '', 'Spotify', ':15s, :30s Audio Spot', 'Audio File', ':15s, :30s Audio Spot', '', '', '', '1'],
  ['', 'SOCIAL', '', '', '', '', '', '', '', ''],
  ['', 'Social Video', 'Meta', ':06s, :15s, :30s', 'mp4', '4x5, 9x16, 1x1', '', '2/13/2026', '3/2 - 9/6', '3'],
  ['', '', 'TikTok', '', '', '9x16', '', '', '', '1'],
  ['', 'Programmatic', '', '', '', '', '', '', '', ''],
  ['', 'Display Inventory (Audio, NYT, NBA)', 'DSP, DV360, NBA', 'Banners', 'JPEG', '300x250, 728x90, 160x600, 320x50, 300x600', '', '2/13/2026', '3/2 - 9/6', '6'],
  ['', 'Custom', '', '', '', '', '', '', '', ''],
  ['', 'Roku Marquee', 'Roku', 'Custom Marquee Video Ad', 'Marquee Video', 'High-resolution logo(s)\nVideo Asset - Built to the Same Specs as POLV', '', '2/9/2026', '', '1'],
  ['', 'OOH', '', '', '', '', '', '', '', ''],
  ['', 'OOH', 'GSTV', ':15s Video', 'Video File', '4x3', '', '', '', '1'],
  ['', '', '', ':05s Video', '', '4x3', '', '', '', '1']
];

const placementLibrary = [
  {
    id: 'tiktok-video',
    platform: 'TikTok',
    placement: 'Vertical Video',
    aliases: ['tiktok 9x16', 'tiktok social video'],
    assetType: 'Video',
    specs: [{ label: 'Ratio', value: '9:16' }],
    copyFields: [{ label: 'Caption', limit: 'Confirm current limit' }],
    creativePrompts: ['Use a fast opening hook.'],
    exampleSearches: ['TikTok video ad examples'],
    sourceUrls: ['https://ads.tiktok.com/help/article/video-ads-specifications']
  }
];

describe('media plan reasoning', () => {
  it('extracts inventory rows while ignoring workbook instructions and agency ownership rows', () => {
    const rows = extractInventoryTableRows(fixtureRows, 'Lower Sugar Plan');

    assert.equal(rows.length, 11);
    assert.deepEqual([...new Set(rows.map((row) => row.bucket))], ['TVC', 'POLV', 'AUDIO', 'SOCIAL', 'PROGRAMMATIC', 'CUSTOM', 'OOH']);
    assert.equal(rows[0].partner, 'All partners');
    assert.equal(rows[0].asset, ':15s or :30s Video Spot');
    assert.equal(rows[0].specs, '16x9; SD and HD versions');
    assert.equal(rows[2].bucket, 'AUDIO');
    assert.equal(rows[2].channel, 'Streaming Audio');
    assert.equal(rows[2].partner, 'SXM/Pandora');
    assert.equal(rows[3].partner, 'SXM/Pandora');
    assert.equal(rows[3].asset, '300x250');
    assert.ok(rows.every((row) => !/responsible agency|these sections/i.test(Object.values(row).join(' '))));
  });

  it('turns extracted inventory into clean review groups by bucket, partner, asset, and specs', () => {
    const text = inventoryRowsToPlanText(extractInventoryTableRows(fixtureRows, 'Lower Sugar Plan'));
    const rows = parsePlan(text, placementLibrary);
    const items = rows.map((row, index) => ({ index: index + 1, raw: row, ...findBestPlacement(row, placementLibrary) }));
    const groups = buildGroups(items);

    assert.equal(rows[0].bucket, 'TVC');
    assert.equal(rows[0].channel, 'Linear Video');
    assert.equal(rows[0].partner, 'All partners');
    assert.equal(rows[0].asset, ':15s or :30s Video Spot');
    assert.equal(rows[0].size, 'Video File | 16x9; SD and HD versions');

    assert.ok(groups.find((group) => group.platform === 'SOCIAL' && group.placementName === 'TikTok - :06s, :15s, :30s'));
    assert.ok(groups.find((group) => group.platform === 'PROGRAMMATIC' && group.placementName === 'DSP, DV360, NBA - Banners'));
    assert.ok(groups.find((group) => group.platform === 'OOH' && group.placementName === 'GSTV - :05s Video'));
    const sxmAudio = groups.find((group) => group.platform === 'AUDIO' && /SXM\/Pandora - :15s/.test(group.placementName));
    assert.ok(sxmAudio);
    assert.ok(!sxmAudio.matchedPlacement.copyFields.some((field) => /X Ads/i.test(field.limit)));
    assert.ok(groups.every((group) => !group.platform.startsWith('Inventory:')));
    assert.ok(groups.every((group) => group.specNotes.every((note) => note.length <= 180)));
  });

  it('plans deck slides by platform and creates source/search links from the real row context', () => {
    const text = inventoryRowsToPlanText(extractInventoryTableRows(fixtureRows, 'Lower Sugar Plan'));
    const rows = parsePlan(text, placementLibrary);
    const items = rows.map((row, index) => ({ index: index + 1, raw: row, ...findBestPlacement(row, placementLibrary) }));
    const groups = buildGroups(items);
    const slides = buildSlidePlan(groups, { slideCount: 12, slideStrategy: 'platform', includeSources: true });
    const tvcGroup = groups.find((group) => group.platform === 'TVC');
    const socialTikTok = groups.find((group) => group.platform === 'SOCIAL' && /TikTok/.test(group.placementName));
    const searchPack = buildSearchPack(socialTikTok, { clientName: 'Gatorade Lower Sugar' });
    const splitSlides = buildSlidePlan(
      Array.from({ length: 5 }, (_, index) => ({ ...socialTikTok, key: `social-${index}`, placementName: `Social Asset ${index + 1}` })),
      { slideCount: 10, slideStrategy: 'platform' }
    );

    assert.ok(slides.find((slide) => slide.title === 'AUDIO' && slide.groups.length >= 3));
    assert.ok(slides.find((slide) => slide.title === 'SOCIAL' && slide.groups.length >= 2));
    assert.equal(splitSlides.length, 2);
    assert.equal(splitSlides[0].groups.length, 4);
    assert.equal(splitSlides[1].groups.length, 1);
    assert.ok(!tvcGroup.matchedPlacement.sourceUrls.some((url) => /tiktok/i.test(url)));
    assert.ok(socialTikTok.matchedPlacement.sourceUrls.some((url) => /tiktok/i.test(url)));
    assert.ok(searchPack.some((item) => item.label === 'Official specs' && item.type === 'source'));
    assert.ok(searchPack.some((item) => item.url === 'https://ads.tiktok.com/help/article/video-ads-specifications'));
    assert.ok(searchPack.filter((item) => item.label === 'Official specs').every((item) => !item.query));
    const dimensionOnly = buildSearchPack({
      platform: 'POLV',
      placementName: 'Video spot',
      partners: ['All partners'],
      assets: [':30 video'],
      channels: ['Linear video'],
      formats: ['MP4'],
      specNotes: ['1920 x 1080 HD']
    });
    assert.ok(dimensionOnly.some((item) => /iabtechlab\.com/.test(item.url || '')));
    assert.ok(dimensionOnly.every((item) => !/business\.x\.com/.test(item.url || '')));
    assert.ok(searchPack.some((item) => item.label === 'Brand examples' && /Gatorade Lower Sugar/.test(item.query)));
  });
});

describe('editable plan tables', () => {
  it('creates, renames, duplicates, removes, and serializes named tables', () => {
    const first = createPlanTable('Paid media', [
      ['SOCIAL', 'Social Video', 'Meta', ':15s Video', 'MP4', '9x16', '', '1', 'Launch']
    ], 'table-paid');
    const second = createPlanTable('Audio', [
      ['AUDIO', 'Streaming Audio', 'Spotify', ':30s Audio Spot', 'Audio File', ':30s', '', '1', '']
    ], 'table-audio');
    const renamed = renamePlanTable([first, second], 'table-paid', 'Launch media');
    const duplicated = duplicatePlanTable(renamed, 'table-audio', 'table-audio-copy');
    const removed = removePlanTable(duplicated, 'table-paid');

    assert.equal(renamed[0].name, 'Launch media');
    assert.equal(duplicated[2].name, 'Audio copy');
    assert.equal(duplicated[2].id, 'table-audio-copy');
    assert.deepEqual(duplicated[2].rows, second.rows);
    assert.notEqual(duplicated[2].rows, second.rows);
    assert.deepEqual(removePlanTable([first], 'table-paid'), [first]);
    assert.equal(removed.length, 2);
    assert.equal(planTablesToText([first, second]), [
      'Bucket\tChannel\tPartner\tAsset\tAsset Format\tSpecs\tPlacement\tQuantity\tNotes',
      'SOCIAL\tSocial Video\tMeta\t:15s Video\tMP4\t9x16\t\t1\tLaunch',
      'AUDIO\tStreaming Audio\tSpotify\t:30s Audio Spot\tAudio File\t:30s\t\t1\t'
    ].join('\n'));
  });
});

describe('placement-level source and deck planning', () => {
  it('keeps every requested duration and creates duration-specific spec blocks', () => {
    assert.deepEqual(extractDurationVariants(':15s or :30s Video Spot'), [':15', ':30']);
    assert.deepEqual(extractDurationVariants(':15s / :30s'), [':15', ':30']);
    assert.deepEqual(extractDurationVariants('15-30 sec video'), [':15', ':30']);
    assert.deepEqual(extractDurationVariants('15-30 mbps bitrate'), []);

    const blocks = buildDurationSpecBlocks({
      placementName: 'All partners - :15s or :30s Video Spot',
      assets: [':15s or :30s Video Spot'],
      specNotes: ['16x9; 1920 x 1080; 15-30 mbps'],
      matchedPlacement: { specs: [{ label: 'Format', value: 'MP4' }] }
    });
    assert.deepEqual(blocks.map((block) => block.duration), [':15', ':30']);
    assert.ok(blocks.every((block) => block.specs.includes('Format: MP4')));
  });

  it('returns only verified sources and at most three attributed image candidates', () => {
    const group = {
      matchedPlacement: {
        sourceUrls: [
          'https://help.pinterest.com/en/business/article/pinterest-product-specs',
          'https://help.pinterest.com/en/business/article/creative-specs',
          'https://www.google.com/search?tbm=isch&q=pinterest'
        ],
        imageCandidates: [
          { id: 'one', url: 'https://cdn.example.com/one.png', sourceLabel: 'Official gallery', sourceUrl: 'https://example.com/one' },
          { id: 'two', url: 'https://cdn.example.com/two.png', sourceLabel: 'Case study', sourceUrl: 'https://example.com/two' },
          { id: 'three', url: 'https://cdn.example.com/three.png', sourceLabel: 'Ad library', sourceUrl: 'https://example.com/three' },
          { id: 'four', url: 'https://cdn.example.com/four.png', sourceLabel: 'Extra', sourceUrl: 'https://example.com/four' }
        ]
      }
    };

    assert.deepEqual(verifiedSourceUrls(group), ['https://help.pinterest.com/en/business/article/pinterest-product-specs']);
    assert.deepEqual(imageCandidates(group).map((candidate) => candidate.id), ['one', 'two', 'three']);
    assert.ok(imageCandidates(group).every((candidate) => candidate.sourceLabel && candidate.sourceUrl));
  });

  it('builds title, timing, divider, one slide per placement, appendix, and closing roles', () => {
    const groups = [
      { key: 'tvc-15', platform: 'TVC', placementName: ':15 Video' },
      { key: 'polv-30', platform: 'POLV', placementName: ':30 Video' },
      { key: 'audio-15', platform: 'AUDIO', placementName: 'Spotify :15' },
      { key: 'audio-30', platform: 'AUDIO', placementName: 'Spotify :30' }
    ];
    const sequence = buildDeckSequence(groups, {
      includeTiming: true,
      includeDividers: true,
      includeAppendix: true,
      includeClosing: true,
      campaignDate: '2026-08-06'
    });

    assert.deepEqual(sequence.map((slide) => slide.role), [
      'title', 'timing', 'divider', 'placement', 'divider', 'placement', 'divider', 'placement', 'placement', 'appendix', 'closing'
    ]);
    assert.deepEqual(sequence.filter((slide) => slide.role === 'placement').map((slide) => slide.group.key), groups.map((group) => group.key));
    assert.equal(sequence.find((slide) => slide.role === 'timing').date, '2026-08-06');
    assert.ok(sequence.every((slide) => !/^Slide \d+:/i.test(slide.title || '')));
  });
});
