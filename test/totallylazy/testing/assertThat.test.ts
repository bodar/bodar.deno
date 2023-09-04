import {assertThrows} from "https://deno.land/std@0.200.0/assert/assert_throws.ts";
import {assertThat} from "../../../src/totallylazy/testing/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {AssertionError} from "https://deno.land/std@0.200.0/assert/assertion_error.ts";

Deno.test("assertThat", async (context) => {
    await (async (it) => {
        const actual = 2;

        await context.step('does not throw when predicate matches', () => {
            assertThat(actual, is(actual));
        });

        await context.step('does throw when predicate does not match', () => {
            assertThrows(() => assertThat(actual, is(3)), AssertionError, "assertThat(2, is(3))");
        });
    })(async (test, inner) => {
        await context.step(test, inner)
    });
});
