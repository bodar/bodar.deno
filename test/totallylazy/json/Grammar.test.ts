import {view} from "../../../src/totallylazy/parsers/View.ts";
import {assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {Grammar} from "../../../src/totallylazy/json/Grammar.ts";
import {Failure} from "../../../src/totallylazy/parsers/Failure.ts";

Deno.test("Grammar", async (context) => {
    await context.step("can parse null", () => {
        assertThat(Grammar.null.parse(view('null')).value, is(null));
        assertTrue(Grammar.null.parse(view('failure')) instanceof Failure);
    });

    await context.step("can parse boolean", () => {
        assertThat(Grammar.boolean.parse(view('true')).value, is(true));
        assertThat(Grammar.boolean.parse(view('false')).value, is(false));
        assertTrue(Grammar.boolean.parse(view('failure')) instanceof Failure);
    });

    await context.step("can parse escaped character", () => {
        assertThat(Grammar.escapedCharacter.parse(view('\\"')).value, is('"'));
        assertThat(Grammar.escapedCharacter.parse(view('\\\\')).value, is('\\'));
        assertTrue(Grammar.escapedCharacter.parse(view('failure')) instanceof Failure);
    });

    await context.step("can parse escaped unicode character", () => {
        assertThat(Grammar.escapedCharacter.parse(view('\\u03BB')).value, is(`λ`));
        assertThat(Grammar.escapedCharacter.parse(view('\\u5c71')).value, is('山'));
        assertThat(Grammar.escapedCharacter.parse(view('\\u7530')).value, is('田'));
        assertThat(Grammar.escapedCharacter.parse(view('\\u3000')).value, is('　'));
        assertThat(Grammar.escapedCharacter.parse(view('\\u7ae0')).value, is('章'));
        assertThat(Grammar.escapedCharacter.parse(view('\\u96c4')).value, is('雄'));
    });

    await context.step("can parse string", () => {
        assertThat(Grammar.string.parse(view('""')).value, is(''));
        assertThat(Grammar.string.parse(view('"Word"')).value, is('Word'));
        assertThat(Grammar.string.parse(view('"This is some \\" random string"')).value, is('This is some " random string'));
        assertThat(Grammar.string.parse(view('"Text with unicode \u03BB after "')).value, is('Text with unicode λ after '));
        assertTrue(Grammar.string.parse(view('failure')) instanceof Failure);
    });
});