import {DescriptivePredicate} from "./Predicate.ts";

export interface IsPredicate<A> extends DescriptivePredicate<A> {
    value: A;
}

/**
 * Returns a predicate that does a strict equality check against the value
 */
export const is = <A>(value: A): IsPredicate<A> => Object.assign((a: A) => a === value, {
    value: value,
    toString: () => `is(${value})`
});
