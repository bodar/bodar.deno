import {Transducer} from "./Transducer.ts";

/**
 * A transducer that applies the given transducers in order
 */
export interface CompositeTransducer<A, B> extends Transducer<A, B> {
     readonly transducers: readonly Transducer<any, any>[];
}

/**
 * Creates a CompositeTransducer that applies the given transducers in order
 */
export function compose<A, B, C>(a: Transducer<A, B>, b: Transducer<B, C>): CompositeTransducer<A, C>;
export function compose<A, B, C, D>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>): CompositeTransducer<A, D>;
export function compose<A, B, C, D, E>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>): CompositeTransducer<A, E>;
export function compose<A, B, C, D, E, F>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>): CompositeTransducer<A, F>;
export function compose<A, B, C, D, E, F, G>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>, f: Transducer<F, G>): CompositeTransducer<A, G>;
export function compose<A, B, C, D, E, F, G, H>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>, f: Transducer<F, G>, g: Transducer<G, H>): CompositeTransducer<A, H>;
export function compose<A, B, C, D, E, F, G, H, I>(a: Transducer<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, e: Transducer<E, F>, f: Transducer<F, G>, g: Transducer<G, H>, h: Transducer<H, I>): CompositeTransducer<A, I>;
export function compose<A, Z>(...transducers: readonly [Transducer<A, any>, ...Transducer<any, any>[], Transducer<any, Z>]): CompositeTransducer<A, Z>;
export function compose(...transducers: readonly Transducer<any, any>[]): CompositeTransducer<any, any> {
    const flat = flatten(transducers);
    return Object.assign((iterable: Iterable<any>) => flat.reduce((a, t) => t(a), iterable), {
        transducers: flat,
        toString: () => transducers.join(', ')
    });
}

/**
 * Checks if the given value is a CompositeTransducer
 */
export function isCompositeTransducer(value: any): value is CompositeTransducer<any, any> {
    return typeof value === 'function' && Array.isArray(value.transducers);
}

/**
 * Flattens the given transducers
 */
export function flatten(transducers: readonly Transducer<any, any>[]): readonly Transducer<any, any>[] {
    return transducers.flatMap(t => isCompositeTransducer(t) ? flatten(t.transducers) : t);
}