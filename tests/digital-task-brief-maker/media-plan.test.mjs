import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildGroups,
  buildSearchPack,
  buildSlidePlan,
  extractInventoryTableRows,
  findBestPlacement,
  inventoryRowsToPlanText,
  parsePlan
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
    assert.ok(searchPack.some((item) => item.label === 'Official specs' && /TikTok/.test(item.query)));
    assert.ok(searchPack.some((item) => item.label === 'Brand examples' && /Gatorade Lower Sugar/.test(item.query)));
  });
});
