import {DescriptivePredicate} from "./Predicate.ts";

export interface IsPredicate<A> extends DescriptivePredicate<A> {
    value: A;
}

/**
 * Returns a predicate that does a strict equality check against the value
 * @template T
 * @param {T} value
 * @returns {IsPredicate<T>}
 */
export function is<A>(value: A): IsPredicate<A> {
    return Object.assign((a: A) => a === value, {
        value: value,
        toString: () => `is(${value})`
    });
}
