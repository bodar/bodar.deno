import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {many} from "../../../src/totallylazy/parsers/ManyParser.ts";
import {string} from "../../../src/totallylazy/parsers/StringParser.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("ManyParser", async (context) => {
    await context.step("can parse many", () => {
        const result = many(string('A')).parse(view('AAABBBCCC'));
        assertThat(result.value, equals(['A', 'A', 'A']));
        assertThat(result.remainder.toSource(), is('BBBCCC'));
    });

    await context.step("still works if it consumes all values", () => {
        const result = many(string('A')).parse(view('AAA'));
        assertThat(result.value, equals(['A', 'A', 'A']));
        assertThat(result.remainder.toSource(), is(''));
    });
});
