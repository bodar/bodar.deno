import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {PatternParser} from "../../../src/totallylazy/parsers/PatternParser.ts";

Deno.test("PatternParser", async (context) => {
    await context.step("can parse using a pattern", () => {
        const result = new PatternParser(/A+/).parse(view('AAABBBCCC'));
        assertThat(result.value, is('AAA'));
        assertThat(result.remainder.toSource(), is('BBBCCC'));
    });
});
