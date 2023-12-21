import {Jsdoc, JsdocGrammar} from "../../../src/totallylazy/json/JsdocGrammar.ts";
import {view} from "../../../src/totallylazy/parsers/View.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";

Deno.test("JsdocGrammar", async (context) => {
    await context.step("can parse a JSDOC comment", () => {
        const map = JsdocGrammar.jsdoc.parse(view('/** @type {Map} */')).value;
        assertThat(map, equals(new Jsdoc({type: 'Map'})));
    });
});