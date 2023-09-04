import {Predicate} from "./Predicate.ts";

/**
 * A predicate that negates the given predicate
 */
export interface NotPredicate<A> extends Predicate<A> {
    /**
     * The predicate to negate
     */
    predicate: Predicate<A>
}

/**
 * Creates a predicate that negates the given predicate
 */
export function not<A>(predicate: Predicate<A>): NotPredicate<A> {
    return Object.assign((a: A) => !predicate(a), {
        predicate,
        toString: () => `not(${predicate})`
    });
}

