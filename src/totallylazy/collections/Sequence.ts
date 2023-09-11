import {Transducer} from "../transducers/Transducer.ts";
import {compose} from "../transducers/CompositeTransducer.ts";

export class Sequence<A, B> implements Iterable<B> {
    constructor(public readonly source: Iterable<A>,
                public readonly transducer: Transducer<A, B>) {
    }

    [Symbol.iterator](): Iterator<B> {
        return this.transducer(this.source)[Symbol.iterator]();
    }

    toString(): string {
        return `sequence(${this.source}, ${this.transducer})`;
    }
}

export function sequence<A>(a: Iterable<A>): Sequence<A, A>;
export function sequence<A, B>(a: Iterable<A>, b: Transducer<A, B>): Sequence<A, B>;
export function sequence<A, B, C>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>): Sequence<A, C>;
export function sequence<A, B, C, D>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>): Sequence<A, D>;
export function sequence<A, B, C, D, E>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>, e: Transducer<D, E>): Sequence<A, E>;
export function sequence<A, B, C, D, E, F>(a: Iterable<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>, e: Transducer<D, E>, f: Transducer<E, F>): Sequence<A, F>;
export function sequence(source: Iterable<any>, ...transducers: readonly Transducer<any, any>[]): Sequence<any, any> {
    const t = compose.apply(null, transducers as any);
    if (source instanceof Sequence) {
        return new Sequence<any, any>(source.source, compose(source.transducer, t));
    }
    return new Sequence<any, any>(source, t);
}

