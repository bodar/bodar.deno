import {assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {Comment, Json5Grammar} from "../../../src/totallylazy/json/Json5Grammar.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {JsonGrammar} from "../../../src/totallylazy/json/JsonGrammar.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("Grammar", async (context) => {
    await context.step("can capture a comment", () => {
        assertThat(Json5Grammar.comment.parse(view('// This is a single line comment\n')).value,
            equals(new Comment('This is a single line comment')));
        assertThat(Json5Grammar.comment.parse(view('// This is a single line comment')).value,
            equals(new Comment('This is a single line comment')));
        assertThat(Json5Grammar.comment.parse(view('/* This is a multi line comment */')).value,
            equals(new Comment('This is a multi line comment')));
    });

    await context.step("whitespace can contain a comment", () => {
        assertThat(Json5Grammar.whitespace(JsonGrammar.null).parse(view('// This is a single line comment\n null')).value,
            is(null));
        assertThat(Json5Grammar.whitespace(JsonGrammar.null).parse(view('/* This is a multi line comment */ null')).value,
            is(null));
    });

    await context.step("ignores comments", () => {
        assertThat(Json5Grammar.value().parse(view('// This is a single line comment\n "some string"')).value,
            is('some string'));
        assertThat(Json5Grammar.value().parse(view('/* This is a multi line comment */ "some string"')).value,
            is('some string'));
    });

    await context.step("can use a JSDOC comment to construct any custom Type that is in scope and takes a single Json value", () => {
        const map = Json5Grammar.custom().parse(view('/** @type {Map} */ [["key", "value"]]')).value;
        assertTrue(map instanceof Map);
        assertThat(map.get('key'), is('value'));

        const set = Json5Grammar.custom().parse(view('/** @type {Set} */ [1, 2]')).value;
        assertTrue(set instanceof Set);
        assertThat(set.has(1), is(true));
        assertThat(set.has(2), is(true));

        const date = Json5Grammar.custom().parse(view('/** @type {Date} */ "2023-12-13T06:45:12.218Z"')).value;
        assertTrue(date instanceof Date);
        assertThat(date.toISOString(), is('2023-12-13T06:45:12.218Z'));
    });

    await context.step("overrides value with the custom type", () => {
        const map = Json5Grammar.value().parse(view('/** @type {Map} */ [["key", "value"]]')).value;
        assertTrue(map instanceof Map);
        assertThat(map.get('key'), is('value'));
    });
});