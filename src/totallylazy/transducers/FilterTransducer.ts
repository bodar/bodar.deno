import { not } from "../predicates/NotPredicate.ts";
import {Predicate} from "../predicates/Predicate.ts";
import {Transducer} from "./Transducer.ts";

/**
 * A transducer that filters the given iterable by the given predicate
 */
export interface FilterTransducer<A> extends Transducer<A, A> {
    /**
     * The predicate to filter by
     */
    readonly predicate: Predicate<A>
}

/**
 * Creates a transducer that filters the given iterable by the given predicate
 */
export function filter<A>(predicate: Predicate<A>): FilterTransducer<A> {
    return Object.assign(function* filter(iterable: Iterable<A>) {
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

/**
 * Alias for not filter  (inspired by ruby)
 */
export function reject<A>(predicate: Predicate<A>) {
    return filter(not(predicate));
}



export function isFilterTransducer(value: any): value is FilterTransducer<any> {
    return typeof value === 'function' && value.name === 'filter' && Object.hasOwn(value, 'predicate');
}