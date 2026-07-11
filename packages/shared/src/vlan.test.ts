import { describe, expect, it } from 'vitest';
import { countVlans, formatVlanRanges, parseVlanRanges } from './vlan';

describe('parseVlanRanges', () => {
  it('parses a single id', () => {
    expect(parseVlanRanges('100')).toEqual({ ok: true, ranges: [[100, 100]] });
  });

  it('parses a range', () => {
    expect(parseVlanRanges('200-300')).toEqual({ ok: true, ranges: [[200, 300]] });
  });

  it('parses mixed tokens and sorts them', () => {
    expect(parseVlanRanges('200-300,100')).toEqual({
      ok: true,
      ranges: [
        [100, 100],
        [200, 300],
      ],
    });
  });

  it('treats empty input as no ranges', () => {
    expect(parseVlanRanges('   ')).toEqual({ ok: true, ranges: [] });
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseVlanRanges(' 100 , 200-300 ')).toEqual({
      ok: true,
      ranges: [
        [100, 100],
        [200, 300],
      ],
    });
  });

  it.each([
    ['0', 'below min'],
    ['4095', 'above max'],
    ['abc', 'non-numeric'],
    ['300-200', 'low > high'],
    ['100,,200', 'empty token'],
    ['1-2-3', 'too many parts'],
    ['100-150,140-160', 'overlap'],
    ['100,100', 'duplicate'],
  ])('rejects %s (%s)', (input) => {
    expect(parseVlanRanges(input).ok).toBe(false);
  });
});

describe('formatVlanRanges', () => {
  it('round-trips canonical form', () => {
    const parsed = parseVlanRanges('100,200-300');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(formatVlanRanges(parsed.ranges)).toBe('100,200-300');
    }
  });
});

describe('countVlans', () => {
  it('counts singles and ranges', () => {
    expect(
      countVlans([
        [100, 100],
        [200, 300],
      ]),
    ).toBe(102);
  });
});
