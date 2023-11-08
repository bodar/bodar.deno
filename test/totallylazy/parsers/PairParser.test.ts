import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {pair} from "../../../src/totallylazy/parsers/PairParser.ts";
import {string} from "../../../src/totallylazy/parsers/StringParser.ts";

Deno.test("PairParser", async (context) => {
    await context.step("compose parsers into pairs", () => {
        const result = pair(string('AAA'), string('BBB')).parse(view('AAABBBCCC'));
        assertThat(result.value, equals(['AAA', 'BBB']));
        assertThat(result.remainder.toSource(), is('CCC'));
    });
});
