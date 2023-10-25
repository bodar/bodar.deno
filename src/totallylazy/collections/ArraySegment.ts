import {NoSuchElement} from "../errors/NoSuchElement.ts";
import {empty, iterator, Segment, toString} from "./Segment.ts";
import {characters} from "../functions/characters.ts";

export class ArraySegment<T> implements Segment<T> {
    constructor(public array: ArrayLike<T>, public index: number = 0) {
    }

    get empty(): boolean {
        return this.index >= this.array.length
    }

    get head(): T {
        if (this.empty) throw new NoSuchElement();
        return this.array[this.index];
    }

    get tail(): Segment<T> {
        return this.array.length > this.index + 1 ? new ArraySegment(this.array, this.index + 1) : empty;
    }

    [Symbol.iterator](): Iterator<T> {
        return iterator(this);
    }

    toString() {
        return toString(this);
    }
}

export function fromArray<T>(array: ArrayLike<T>): Segment<T> {
    return new ArraySegment(array);
}

export function fromString(value: string): Segment<string> {
    return fromArray(characters(value));
}

export function toArray<T>(segment: Segment<T>): ArrayLike<T> {
    if (segment instanceof ArraySegment) {
        if (segment.index === 0) return segment.array;
        if ('subarray' in segment.array && typeof segment.array.subarray === "function") return segment.array.subarray(segment.index);
        if ('slice' in segment.array && typeof segment.array.slice === "function") return segment.array.slice(segment.index);
        return Array.prototype.slice.call(segment.array, segment.index);
    }
    return Array.from(segment);
}