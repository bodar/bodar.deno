import {Predicate} from "./Predicate.ts";
import {Mapper} from "../functions/Mapper.ts";
import {logical, LogicalPredicate} from "./LogicalPredicate.ts";


/**
 * A predicate that checks if the value extracted from <A> by the given mapper passes the given predicate
 */
export interface WherePredicate<A, B> extends LogicalPredicate<A> {
    /**
     * The function used to extract a value of type <B> from <A>
     */
    readonly mapper: Mapper<A, B>;

    /**
     * The predicate to check <B> against
     */
    readonly predicate: Predicate<B>;
}

/**
 * Creates a predicate that checks if the value extracted from <A> by the given mapper passes the given predicate
 */
export function where<A, B>(mapper: Mapper<A, B>, predicate: Predicate<B>): WherePredicate<A, B> {
    return Object.assign(logical(function where(a: A) {
        return predicate(mapper(a));
    }), {
        mapper,
        predicate,
        toString: () => `where(${mapper}, ${predicate})`
    });
}

/**
 * Checks if the given value is a WherePredicate
 */
export function isWherePredicate<A = any, B = any>(value: any): value is WherePredicate<A, B> {
    return typeof value === 'function' && value.name === 'where' && typeof value.mapper === 'function' && typeof value.predicate === 'function';
}