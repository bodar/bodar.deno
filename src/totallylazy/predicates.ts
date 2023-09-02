export type Predicate<A> = (a: A) => boolean;

export interface IsPredicate<A> extends Predicate<A> {
    value: A;
}

/**
 * Returns a predicate that does a strict equality check against the value
 */
export const is = <A>(value: A): IsPredicate<A> => Object.assign((a: A) => a === value, {value: value, toString: () => `is(${value})`});

export interface NotPredicate<A> extends Predicate<A> {
    predicate: Predicate<A>
}

export const not = <A>(predicate: Predicate<A>): NotPredicate<A> => Object.assign((a: A) => !predicate(a), {predicate, toString: () => `not(${predicate})`});

