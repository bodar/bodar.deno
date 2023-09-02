import {AssertionError} from "https://deno.land/std@0.200.0/assert/assertion_error.ts";
import {Predicate} from "./predicates.ts";

export function assertThat<A>(actual: A, predicate: Predicate<A>) {
    if (!predicate(actual)) {
        throw new AssertionError(`assertThat(${actual}, ${predicate});`);
    }
}
