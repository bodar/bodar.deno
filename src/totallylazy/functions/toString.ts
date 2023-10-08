export function toString(value: unknown): string {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (Object.hasOwn(value, 'toString')) return value.toString();
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'function') return value.name;
    return String(value);
}