import {DescriptivePredicate, Predicate} from "./Predicate.ts";


export interface NotPredicate<A> extends DescriptivePredicate<A> {
    predicate: Predicate<A>
}

export function not<A>(predicate: Predicate<A>): NotPredicate<A> {
    return Object.assign((a: A) => !predicate(a), {
        predicate,
        toString: () => `not(${predicate})`
    });
}

