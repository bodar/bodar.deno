import {Transducer} from "../transducers/Transducer.ts";
import {flatten} from "../transducers/CompositeTransducer.ts";

export class Sequence<T> implements Iterable<T> {
    constructor(public readonly source: Iterable<any>,
                public readonly transducers: readonly Transducer<any, any>[]) {
    }

    [Symbol.iterator](): Iterator<T> {
        return this.transducers.reduce((r, v) => v(r), this.source)[Symbol.iterator]();
    }

    toString(): string {
        return `sequence(${this.source}, ${this.transducers})`;
    }
}

export function sequence<A>(a: Iterable<A>): Sequence<A>;
export function sequence<A, B>(a: Iterable<A>, b: Transducer<A, B>): Sequence<B>;
export function sequence<A, B, C>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>): Sequence<C>;
export function sequence<A, B, C, D>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>): Sequence<D>;
export function sequence<A, B, C, D, E>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>, e: Transducer<D, E>): Sequence<E>;
export function sequence<A, B, C, D, E, F>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>, e: Transducer<D, E>, f: Transducer<E, F>): Sequence<F>;
export function sequence(source: Iterable<any>, ...transducers: readonly Transducer<any, any>[]): Sequence<any> | AsyncIterable<any> {
    if (source instanceof Sequence) {
        return new Sequence<any>(source.source, flatten([...source.transducers, ...transducers]));
    }
    return new Sequence<any>(source, flatten(transducers));
}

