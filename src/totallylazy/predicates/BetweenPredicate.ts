import {Predicate} from "./Predicate.ts";
import {Comparator} from "../comparitors/Comparator.ts";
import {ascending} from "../comparitors/mod.ts";

/**
 * A predicate that checks if the value is between the given values
 */
export interface BetweenPredicate<A> extends Predicate<A> {
    readonly start: A;
    readonly end: A;
}

/**
 * Creates a predicate that checks if the value is between the given values
 */
export function between<A>(start: A, end: A, comparator: Comparator<A> = ascending): BetweenPredicate<A> {
    return Object.assign((value: A) => comparator(value, start) >= 0 && comparator(value, end) <= 0, {
        start,
        end,
        toString: () => `between(${start}, ${end})`
    });
}
