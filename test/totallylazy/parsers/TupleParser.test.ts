import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {string} from "../../../src/totallylazy/parsers/StringParser.ts";
import {pair, triple} from "../../../src/totallylazy/parsers/TupleParser.ts";
import {pattern} from "../../../src/totallylazy/parsers/PatternParser.ts";
import { map } from "../../../src/totallylazy/transducers/MapTransducer.ts";
import {parser} from "../../../src/totallylazy/parsers/Parser.ts";

Deno.test("TupleParser", async (context) => {
    await context.step("compose parsers into pairs", () => {
        const result = pair(string('AAA'), string('BBB')).parse(view('AAABBBCCC'));
        assertThat(result.value, equals(['AAA', 'BBB']));
        assertThat(result.remainder.toSource(), is('CCC'));
    });

    await context.step("compose parsers into triples", () => {
        const integer = parser(pattern(/\d+/), map(Number));
        const result = triple(integer, string('AAA'), string('BBB'))
            .parse(view('123AAABBBCCC'));
        assertThat(result.value, equals([123, 'AAA', 'BBB']));
        assertThat(result.remainder.toSource(), is('CCC'));
    });
});
