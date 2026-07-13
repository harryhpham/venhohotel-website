import { createHash } from 'node:crypto';
function canonical(value: unknown): string { if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`; if (value !== null && typeof value === 'object') return `{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`; return JSON.stringify(value); }
export const contextHash = (context: Readonly<Record<string,unknown>>): string => createHash('sha256').update(canonical(context)).digest('hex');
