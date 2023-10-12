import {Predicate} from "./Predicate.ts";

export interface OrPredicate<A> extends Predicate<A> {
    readonly predicates: readonly Predicate<A>[]
}

export function or<A>(...predicates: readonly Predicate<A>[]): OrPredicate<A> {
    return Object.assign(function or(a: A) {
        return predicates.some(p => p(a));
    }, {
        predicates,
        toString: () => `or(${predicates.join(', ')})`
    });
}

export function isOrPredicate<A = any>(value: any): value is OrPredicate<A> {
    return typeof value === 'function' && value.name === 'or' && Array.isArray(value.predicates);
}