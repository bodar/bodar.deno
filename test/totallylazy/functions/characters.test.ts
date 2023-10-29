import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {characters} from "../../../src/totallylazy/functions/characters.ts";

Deno.test("characters", async (context) => {
    await context.step("supports unicode", () => {
        // https://mathiasbynens.be/notes/javascript-unicode
        assertThat(characters('Iñtërnâtiônàlizætiøn☃💩').length, is(22));
    });
});