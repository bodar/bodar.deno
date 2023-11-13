import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {success} from "../../../src/totallylazy/parsers/Success.ts";
import {map} from "../../../src/totallylazy/transducers/MapTransducer.ts";
import {result} from "../../../src/totallylazy/parsers/Result.ts";
import {flatMap} from "../../../src/totallylazy/transducers/FlatMapTransducer.ts";
import {string} from "../../../src/totallylazy/parsers/StringParser.ts";

Deno.test("Result", async (context) => {
    await context.step("can map", () => {
        const r = result(success('1', view('23')), map(Number));
        assertThat(r.value, is(1));
        assertThat(r.remainder.toSource(), is('23'));
    });

    await context.step("can flatMap", () => {
        const anotherParser = string('1');
        const r = result(success('1', view('23')), flatMap(n => anotherParser.parse(view(n))));
        assertThat(r.value, is('1'));
        assertThat(r.remainder.toSource(), is('23'));
    });
});