import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {string} from "../../../src/totallylazy/parsers/StringParser.ts";
import {triple} from "../../../src/totallylazy/parsers/TripleParser.ts";

Deno.test("TripleParser", async (context) => {
    await context.step("compose parsers into triples", () => {
        const result = triple(string('AAA'), string('BBB'), string('CCC'))
            .parse(view('AAABBBCCCDDD'));
        assertThat(result.value, equals(['AAA', 'BBB', 'CCC']));
        assertThat(result.remainder.toSource(), is('DDD'));
    });
});
