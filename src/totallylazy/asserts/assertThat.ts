import {AssertionError} from "https://deno.land/std@0.200.0/assert/assertion_error.ts";
import {Predicate} from "../predicates/Predicate.ts";
import {is} from "../predicates/IsPredicate.ts";
import {toString} from "../functions/toString.ts";

export function assertThat(actual: unknown, predicate: Predicate<any>) {
    if (!predicate(actual)) {
        throw new AssertionError(`assertThat(${toString(actual)}, ${toString(predicate)});`);
    }
}

export function assertTrue(value: boolean) {
    assertThat(value, is(true));
}

export function assertFalse(value: boolean) {
    assertThat(value, is(false));
}
