import {view} from "../../../src/totallylazy/parsers/View.ts";
import {assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {Grammar} from "../../../src/totallylazy/json/Grammar.ts";
import {Failure} from "../../../src/totallylazy/parsers/Failure.ts";

Deno.test("Grammar", async (context) => {
    await context.step("can parse null", () => {
        assertThat(Grammar.null.parse(view('null')).value, is(null));
        assertTrue(Grammar.null.parse(view('failure')) instanceof Failure);
    });

    await context.step("can parse boolean", () => {
        assertThat(Grammar.boolean.parse(view('true')).value, is(true));
        const result = Grammar.boolean.parse(view('false'));
        assertThat(result.value, is(false));
        assertTrue(Grammar.boolean.parse(view('failure')) instanceof Failure);
    });
});