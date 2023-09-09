import {Predicate} from "./Predicate.ts";

/**
 * A predicate that checks if the value is equal to the given value using Object.is
 */
export interface IsPredicate<A> extends Predicate<A> {
    /**
     * The value to check against
     */
    value: A;
}

/**
 * Creates a predicate that checks if the value is equal to the given value using Object.is
 */
export function is<A>(value: A): IsPredicate<A> {
    return Object.assign((a: A) => Object.is(a, value), {
        value: value,
        toString: () => `is(${value})`
    });
}
