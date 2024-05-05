import {assertThrows} from "std/assert/assert_throws.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {AssertionError} from "std/assert/assertion_error.ts";

Deno.test("assertThat", async (context) => {
    const actual = 2;

    await context.step('does not throw when predicate matches', () => {
        assertThat(actual, is(actual));
    });

    await context.step('does throw when predicate does not match', () => {
        assertThrows(() => assertThat(actual, is(3)), AssertionError, "assertThat(2, is(3))");
    });
});
