import {Predicate} from "./Predicate.ts";
import {Mapper} from "../functions/Mapper.ts";


/**
 * A predicate that checks if the value extracted from <A> by the given mapper passes the given predicate
 */
export interface WherePredicate<A, B> extends Predicate<A> {
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
    return Object.assign((a: A) => predicate(mapper(a)), {
        mapper,
        predicate,
        toString: () => `where(${mapper}, ${predicate})`
    });
}

/**
 * Checks if the given value is a WherePredicate
 */
export function isWherePredicate<A = any, B = any>(value: any): value is WherePredicate<A, B> {
    return value && typeof value === 'function' && typeof value.mapper === 'function' && typeof value.predicate === 'function';
}