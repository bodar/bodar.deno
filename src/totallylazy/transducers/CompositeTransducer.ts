import {Transducer} from "./Transducer.ts";

/**
 * A transducer that applies the given transducers in order
 */
export interface CompositeTransducer<A, B, C> extends Transducer<A, C> {
    readonly first: Transducer<A, B>;
    readonly second: Transducer<B, C>;
}

/**
 * Creates a CompositeTransducer that applies the given transducers in order
 */
export function compose<A, B, C>(a: Transducer<A, B>, b: Transducer<B, C>): Transducer<A, C>;
export function compose<A, B, C, D>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>): Transducer<A, D>;
export function compose<A, B, C, D, E>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>): Transducer<A, E>;
export function compose<A, B, C, D, E, F>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>): Transducer<A, F>;
export function compose<A, B, C, D, E, F, G>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>, f: Transducer<F, G>): Transducer<A, G>;
export function compose<A, B, C, D, E, F, G, H>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>, f: Transducer<F, G>, g: Transducer<G, H>): Transducer<A, H>;
export function compose<A, B, C, D, E, F, G, H, I>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>, f: Transducer<F, G>, g: Transducer<G, H>, h: Transducer<H, I>): Transducer<A, I>;
export function compose<A, Z>(...transducers: readonly [Transducer<A, any>, ...Transducer<any, any>[], Transducer<any, Z>]): Transducer<A, Z>;
export function compose(...transducers: readonly Transducer<any, any>[]): Transducer<any, any> {
    return [...transducers].reverse().reduce((r, v) => cons(v, r));
}

function cons<A, B, C>(first: Transducer<A, B>, second: Transducer<B, C>): CompositeTransducer<A, B, C> {
    return Object.assign((iterable: Iterable<A>) => second(first(iterable)), {
        first,
        second,
        toString: () => `${first}, ${second}`,
    });
}

/**
 * Checks if the given value is a CompositeTransducer
 */
export function isCompositeTransducer(value: any): value is CompositeTransducer<any, any, any> {
    return value && typeof value === 'function' && typeof value.first === 'function' && typeof value.second === 'function';
}

/**
 * Decomposes the given transducer into a sequence of transducers
 */
export function* decompose(transducer: Transducer<any, any>): Iterable<Transducer<any, any>> {
    if (isCompositeTransducer(transducer)) {
        yield* decompose(transducer.first);
        yield* decompose(transducer.second);
    } else {
        yield transducer;
    }
}