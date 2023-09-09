import {AssertionError} from "https://deno.land/std@0.200.0/assert/assertion_error.ts";
import {Predicate} from "../predicates/Predicate.ts";
import {is} from "../predicates/IsPredicate.ts";

export function assertThat<A>(actual: A, predicate: Predicate<A>) {
    if (!predicate(actual)) {
        throw new AssertionError(`assertThat(${actual}, ${predicate});`);
    }
}

export function assertTrue(value: boolean) {
    assertThat(value, is(true));
}

export function assertFalse(value: boolean) {
    assertThat(value, is(false));
}