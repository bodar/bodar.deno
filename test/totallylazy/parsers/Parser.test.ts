import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {map} from "../../../src/totallylazy/transducers/MapTransducer.ts";
import {flatMap} from "../../../src/totallylazy/transducers/FlatMapTransducer.ts";
import {string} from "../../../src/totallylazy/parsers/StringParser.ts";
import {parser} from "../../../src/totallylazy/parsers/Parser.ts";
import {pattern} from "../../../src/totallylazy/parsers/PatternParser.ts";
import {precededBy, then} from "../../../src/totallylazy/parsers/PairParser.ts";

Deno.test("Parser", async (context) => {
    await context.step("can map", () => {
        const r = parser(pattern(/\d+/), map(Number)).parse(view('123 USD'));
        assertThat(r.value, is(123));
        assertThat(r.remainder.toSource(), is(' USD'));
    });

    await context.step("can flatMap", () => {
        const input = view('123 USD');
        const anotherParser = string('1');
        const r = parser(pattern(/\d+/), flatMap(n => anotherParser.parse(view(n)))).parse(input);
        assertThat(r.value, is('1'));
        assertThat(r.remainder.toSource(), is(' USD'));
    });

    await context.step("can compose", () => {
        const input = view('123 USD');
        const r = parser(pattern(/\d+/), map(Number), then(
            parser(string('USD'), precededBy(string(' '))))).parse(input);
        assertThat(r.value, equals([123, 'USD']));
        assertThat(r.remainder.toSource(), is(''));
    });
});