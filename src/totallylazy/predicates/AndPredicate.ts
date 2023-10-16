import {Predicate} from "./Predicate.ts";
import {alwaysFalse, alwaysTrue} from "../functions/constant.ts";
import {isNotPredicate, not, NotPredicate} from "./NotPredicate.ts";
import {or} from "./OrPredicate.ts";

export interface AndPredicate<A> extends Predicate<A> {
    readonly predicates: readonly Predicate<A>[]
}

export type ArrayOfContains<A, B> = readonly Extract<A | B, B>[];

export function and<A>(): typeof alwaysTrue;
export function and<P extends Predicate<any>>(predicate: P): P;
export function and<A>(...predicates: readonly NotPredicate<A>[]): NotPredicate<A>;
export function and<A>(...predicates: ArrayOfContains<Predicate<A>, typeof alwaysFalse>): typeof alwaysFalse;
export function and<A>(...predicates: readonly Predicate<A>[]): AndPredicate<A>;
export function and<A>(...predicates: readonly Predicate<A>[]): Predicate<A> {
    if (predicates.some(p => p === alwaysFalse)) return alwaysFalse;
    const compact = predicates.filter(p => p !== alwaysTrue);
    if (compact.length === 0) return alwaysTrue;
    if (compact.length === 1) return predicates[0];
    if (compact.every(isNotPredicate)) return not(or(...compact.map(p => p.predicate)));
    return Object.assign(function and(a: A) {
        return compact.every(p => p(a));
    }, {
        predicates: compact,
        toString: () => `and(${predicates.join(', ')})`
    });
}

export function isAndPredicate<A = any>(value: any): value is AndPredicate<A> {
    return typeof value === 'function' && value.name === 'and' && Array.isArray(value.predicates);
}