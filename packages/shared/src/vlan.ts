// VLAN range parsing/formatting shared by the admin VLANRange UI (planned) and
// any connection view that displays allocations. Grammar: comma-separated
// tokens, each either a single VLAN id or a `low-high` inclusive range, e.g.
// "100,200-300". Valid VLAN ids are 1..4094.

const MIN_VLAN = 1;
const MAX_VLAN = 4094;

export type VlanRange = readonly [number, number];

export type ParseResult = { ok: true; ranges: VlanRange[] } | { ok: false; reason: string };

/**
 * Parse a VLAN range string into normalized [low, high] pairs.
 * Rejects out-of-range ids, low>high, and overlapping/duplicate ranges.
 */
export function parseVlanRanges(input: string): ParseResult {
  const trimmed = input.trim();
  if (trimmed === '') {
    return { ok: true, ranges: [] };
  }

  const ranges: VlanRange[] = [];
  for (const rawToken of trimmed.split(',')) {
    const token = rawToken.trim();
    if (token === '') {
      return { ok: false, reason: 'empty range token' };
    }

    const parts = token.split('-');
    if (parts.length > 2) {
      return { ok: false, reason: `invalid token: ${token}` };
    }

    const low = parseId(parts[0]);
    if (low === null) {
      return { ok: false, reason: `invalid VLAN id: ${parts[0]}` };
    }
    let high = low;
    if (parts.length === 2) {
      const parsedHigh = parseId(parts[1]);
      if (parsedHigh === null) {
        return { ok: false, reason: `invalid VLAN id: ${parts[1]}` };
      }
      high = parsedHigh;
    }

    if (low > high) {
      return { ok: false, reason: `range low > high: ${token}` };
    }
    ranges.push([low, high]);
  }

  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] <= sorted[i - 1][1]) {
      return { ok: false, reason: 'overlapping ranges' };
    }
  }

  return { ok: true, ranges: sorted };
}

function parseId(raw: string): number | null {
  const s = raw.trim();
  if (!/^\d+$/.test(s)) {
    return null;
  }
  const n = Number(s);
  if (n < MIN_VLAN || n > MAX_VLAN) {
    return null;
  }
  return n;
}

/** Render normalized ranges back to the canonical "100,200-300" form. */
export function formatVlanRanges(ranges: readonly VlanRange[]): string {
  return ranges.map(([low, high]) => (low === high ? `${low}` : `${low}-${high}`)).join(',');
}

/** Total number of VLAN ids covered by the ranges. */
export function countVlans(ranges: readonly VlanRange[]): number {
  return ranges.reduce((sum, [low, high]) => sum + (high - low + 1), 0);
}
