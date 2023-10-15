import {AssertionError} from "https://deno.land/std@0.200.0/assert/assertion_error.ts";
import {Predicate} from "../predicates/Predicate.ts";
import {is} from "../predicates/IsPredicate.ts";

export function assertThat(actual: unknown, predicate: Predicate<any>) {
    if (!predicate(actual)) {
        throw new AssertionError(`assertThat(${JSON.stringify(actual)}, ${predicate});`);
    }
}

export function assertTrue(value: boolean): asserts value is true {
    assertThat(value, is(true));
}

export function assertFalse(value: boolean): asserts value is false {
    assertThat(value, is(false));
}
