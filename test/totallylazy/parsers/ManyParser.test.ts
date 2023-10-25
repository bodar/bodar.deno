import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {many} from "../../../src/totallylazy/parsers/ManyParser.ts";
import {string} from "../../../src/totallylazy/parsers/StringParser.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {fromString, toArray} from "../../../src/totallylazy/collections/ArraySegment.ts";

Deno.test("ManyParser", async (context) => {
    await context.step("can parse many", () => {
        const result = many(string('A')).parse(fromString('AAABBBCCC'));
        assertThat(result.value, equals(['A', 'A', 'A']));
        assertThat(toArray(result.remainder), equals(['B','B','B','C','C','C']));
    });

    await context.step("still works if it consumes all values", () => {
        const result = many(string('A')).parse(fromString('AAA'));
        assertThat(result.value, equals(['A', 'A', 'A']));
        assertThat(toArray(result.remainder), equals([]));
    });
});
