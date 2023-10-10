export function toString(value: unknown): string {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'function') return value.name;
    if (Object.hasOwn(value, 'toString')) return value.toString();
    return JSON.stringify(value)
}