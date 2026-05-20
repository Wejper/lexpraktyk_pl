export async function tursoExecute(
  sql: string,
  args: (string | number | null)[] = []
): Promise<Record<string, unknown>[]> {
  const TURSO_DB_URL = (import.meta.env.TURSO_DB_URL ?? process.env.TURSO_DB_URL) as string;
  const TURSO_AUTH_TOKEN = (import.meta.env.TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN) as string;
  const url = TURSO_DB_URL.replace('libsql://', 'https://') + '/v2/pipeline';

  const body = {
    requests: [
      {
        type: 'execute',
        stmt: {
          sql,
          args: args.map((a) => {
            if (a === null) return { type: 'null' };
            if (typeof a === 'number') {
              return Number.isInteger(a)
                ? { type: 'integer', value: String(a) }
                : { type: 'float', value: a };
            }
            return { type: 'text', value: a };
          }),
        },
      },
      { type: 'close' },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso HTTP ${res.status}: ${text}`);
  }

  const data = await res.json() as {
    results: Array<{
      type: string;
      response?: {
        type: string;
        result?: {
          cols: Array<{ name: string }>;
          rows: Array<Array<{ type: string; value: unknown }>>;
        };
      };
      error?: { message: string };
    }>;
  };

  const first = data.results[0];
  if (!first || first.type === 'error') {
    throw new Error(`Turso error: ${first?.error?.message ?? 'unknown'}`);
  }

  const result = first.response?.result;
  if (!result) return [];

  const cols = result.cols.map((c) => c.name);
  return result.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    cols.forEach((col, i) => {
      const cell = row[i];
      if (!cell || cell.type === 'null') {
        obj[col] = null;
      } else if (cell.type === 'integer') {
        obj[col] = Number(cell.value);
      } else if (cell.type === 'float') {
        obj[col] = Number(cell.value);
      } else {
        obj[col] = cell.value;
      }
    });
    return obj;
  });
}
