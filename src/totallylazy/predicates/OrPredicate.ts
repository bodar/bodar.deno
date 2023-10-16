import {Predicate} from "./Predicate.ts";
import {alwaysFalse, alwaysTrue} from "../functions/constant.ts";
import {isNotPredicate, not, NotPredicate} from "./NotPredicate.ts";
import {ReadonlyArrayContains} from "../collections/Array.ts";
import {and, AndPredicate} from "./AndPredicate.ts";

export interface OrPredicate<A> extends Predicate<A> {
    readonly predicates: readonly Predicate<A>[]
}

export function or<A>(): typeof alwaysTrue;
export function or<P extends Predicate<any>>(predicate: P): P;
export function or<A>(...predicates: readonly NotPredicate<A>[]): NotPredicate<A>;
export function or<A>(...predicates: ReadonlyArrayContains<Predicate<A>, typeof alwaysTrue>): typeof alwaysTrue;
export function or<A>(...predicates: readonly Predicate<A>[]): AndPredicate<A>;
export function or<A>(...predicates: readonly Predicate<A>[]): Predicate<A> {
    if (predicates.some(p => p === alwaysTrue)) return alwaysTrue;
    const compact = predicates.filter(p => p !== alwaysFalse);
    if (compact.length === 0) return alwaysFalse;
    if (compact.length === 1) return predicates[0];
    if (compact.every(isNotPredicate)) return not(and(...compact.map(p => p.predicate)));
    return Object.assign(function or(a: A) {
        return predicates.some(p => p(a));
    }, {
        predicates:compact,
        toString: () => `or(${predicates.join(', ')})`
    });
}

export function isOrPredicate<A = any>(value: any): value is OrPredicate<A> {
    return typeof value === 'function' && value.name === 'or' && Array.isArray(value.predicates);
}