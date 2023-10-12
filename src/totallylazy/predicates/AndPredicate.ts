import {Predicate} from "./Predicate.ts";

export interface AndPredicate<A> extends Predicate<A> {
    readonly predicates: readonly Predicate<A>[]
}

export function and<A>(...predicates: readonly Predicate<A>[]): AndPredicate<A> {
    return Object.assign(function and(a: A) {
        return predicates.every(p => p(a));
    }, {
        predicates,
        toString: () => `and(${predicates.join(', ')})`
    });
}

export function isAndPredicate<A = any>(value: any): value is AndPredicate<A> {
    return value && typeof value === 'function' && value.name === 'and' && Array.isArray(value.predicates);
}