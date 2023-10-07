import {Comparator} from "./Comparator.ts";

export function ascending<T>(a: T, b: T) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

export function descending<T>(a: T, b: T): number {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
}

export function comparators<T>(...comparators: Comparator<T>[]): Comparator<T> {
    return (a, b) => {
        for (const comparator of comparators) {
            const result = comparator(a, b);
            if (result != 0) return result;
        }
        return 0;
    }
}