import {Predicate} from "../predicates/Predicate.ts";
import {Transducer} from "./Transducer.ts";

/**
 * A transducer that filters the given iterable by the given predicate
 */
export interface FilterTransducer<A> extends Transducer<A, A> {
    /**
     * The predicate to filter by
     */
    predicate: Predicate<A>
}

/**
 * Creates a transducer that filters the given iterable by the given predicate
 */
export function filter<A>(predicate: Predicate<A>): FilterTransducer<A> {
    return Object.assign(function* (iterable: Iterable<A>) {
        for (const a of iterable) {
            if (predicate(a)) yield a;
        }
    }, {
        predicate,
        toString: () => `filter(${predicate})`
    });
}

/**
 * Alias for filter (inspired by ruby)
 */
export const accept = filter;