import {assertThrows} from "https://deno.land/std@0.200.0/assert/assert_throws.ts";
import {describe} from "../../../src/totallylazy/testing/describe.ts";
import {assertThat} from "../../../src/totallylazy/testing/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {AssertionError} from "https://deno.land/std@0.200.0/assert/assertion_error.ts";

describe("assertThat", async (it) => {
    const actual = 2;

    await it('does not throw when predicate matches', () => {
        assertThat(actual, is(actual));
    });

    await it('does throw when predicate does not match', () => {
        assertThrows(() => assertThat(actual, is(3)), AssertionError, "assertThat(2, is(3))");
    });
});
