export const parsePgArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (value == null) {
    return [];
  }

  const s = String(value).trim();
  if (s === '' || s === '{}') {
    return [];
  }

  if (!(s.startsWith('{') && s.endsWith('}'))) {
    return [s];
  }

  const inner = s.slice(1, -1);
  const out: string[] = [];
  const quoted: boolean[] = [];
  let buf = '';
  let i = 0;
  let inQuotes = false;
  let escape = false;
  let currentQuoted = false;

  while (i < inner.length) {
    const ch = inner[i++];

    if (escape) {
      buf += ch;
      escape = false;
      continue;
    }

    if (inQuotes) {
      if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        buf += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      currentQuoted = true;
      continue;
    }

    if (ch === ',') {
      out.push(buf.trim());
      quoted.push(currentQuoted);
      buf = '';
      currentQuoted = false;
      continue;
    }

    buf += ch;
  }

  // push the last element
  if (buf.length > 0) {
    out.push(buf.trim());
    quoted.push(currentQuoted);
  }

  // Keep empty elements out, and drop unquoted NULL only
  return out.filter((x, idx) => x !== '' && (quoted[idx] || x.toUpperCase() !== 'NULL'));
};
