import {AssertionError} from "std/assert/assertion_error.ts";
import {Predicate} from "../predicates/Predicate.ts";
import {is} from "../predicates/IsPredicate.ts";
import { toString } from "../functions/toString.ts";

export function assertThat(actual: unknown, predicate: Predicate<any>) {
    if (!predicate(actual)) {
        throw new AssertionError(`assertThat(${toString(actual)}, ${predicate});`);
    }
}

export function assertTrue(value: boolean): asserts value is true {
    assertThat(value, is(true));
}

export function assertFalse(value: boolean): asserts value is false {
    assertThat(value, is(false));
}
