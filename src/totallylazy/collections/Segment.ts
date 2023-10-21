export interface Segment<T> {
    readonly head: T | undefined;
    readonly tail: Segment<T> | undefined;
}

export function segment<T>(head: T | undefined = undefined, tail: Segment<T> | undefined = undefined): Segment<T> {
    return {head, tail};
}

export function toArray<T>(segment: Segment<T>): T[] {
    return Array.from(iterable(segment));
}

export function fromArray<T>(array: readonly T[]): Segment<T> {
    if (array.length === 0) return emptySegment;
    if (array.length === 1) return segment(array[0]);
    return segment(array[0], fromArray(array.slice(1)));
}

export const emptySegment: Segment<never> = {
    head: undefined,
    tail: undefined,
}

export function* iterator<T>(segment: Segment<T>): Iterator<T> {
    while (segment) {
        if (segment.head === undefined) return;
        yield segment.head;
        if (segment.tail === undefined) return;
        segment = segment.tail;
    }
}

export function iterable<T>(segment: Segment<T>): Iterable<T> {
    return {[Symbol.iterator]: () => iterator(segment)};
}