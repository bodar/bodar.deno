import {characters} from "../functions/characters.ts";

export interface Segment<T> {
    readonly head: T | undefined;
    readonly tail: Segment<T> | undefined;
}

export function segment<T>(head: T | undefined = undefined, tail: Segment<T> | undefined = undefined): Segment<T> {
    return {head, tail};
}

export function toArray<T>(segment: Segment<T>): SliceableArray<T> {
    if (segment instanceof ArraySegment) return segment.array;
    return Array.from(iterable(segment));
}

export function toString(segment: Segment<unknown>): string {
    if (segment.head === undefined) return 'segment()';
    if (segment.tail === undefined) return `segment(${segment.head})`;
    return `segment(${segment.head}, ${toString(segment.tail)})`
}

export function fromArray<T>(array: SliceableArray<T>): Segment<T> {
    return new ArraySegment(array);
}

export function fromString(value: string): Segment<string> {
    return fromArray(characters(value));
}

export interface SliceableArray<T> extends ArrayLike<T> {
    slice(start: number): SliceableArray<T>;
}

export class ArraySegment<T> implements Segment<T> {
    constructor(public array: SliceableArray<T>) {
    }

    get head(): T | undefined {
        return this.array[0];
    }

    get tail(): Segment<T> | undefined {
        return this.array.length > 1 ? new ArraySegment(this.array.slice(1)) : undefined;
    }
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