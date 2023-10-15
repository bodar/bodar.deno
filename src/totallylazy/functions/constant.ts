export interface Constant<T> {
    (...any: any[]): T;

    value: T;
}

export function constant<T>(value: T): Constant<T> {
    return Object.assign((..._any: any[]) => value, {
        value,
        toString: () => `constant(${value})`
    });
}

export const alwaysTrue = constant(true);

export const alwaysFalse = constant(false);
