import {view} from "../../../src/totallylazy/parsers/View.ts";
import {assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {JsonGrammar} from "../../../src/totallylazy/json/JsonGrammar.ts";
import {Failure} from "../../../src/totallylazy/parsers/Failure.ts";


Deno.test("Grammar", async (context) => {
    await context.step("can parse null", () => {
        assertThat(JsonGrammar.null.parse(view('null')).value, is(null));
        assertTrue(JsonGrammar.null.parse(view('failure')) instanceof Failure);
    });

    await context.step("can parse boolean", () => {
        assertThat(JsonGrammar.boolean.parse(view('true')).value, is(true));
        assertThat(JsonGrammar.boolean.parse(view('false')).value, is(false));
        assertTrue(JsonGrammar.boolean.parse(view('failure')) instanceof Failure);
    });

    await context.step("can parse escaped character", () => {
        assertThat(JsonGrammar.escaped.parse(view('\\"')).value, is('"'));
        assertThat(JsonGrammar.escaped.parse(view('\\\\')).value, is('\\'));
        assertTrue(JsonGrammar.escaped.parse(view('failure')) instanceof Failure);
    });

    await context.step("can parse escaped unicode character", () => {
        assertThat(JsonGrammar.escaped.parse(view('\\u03BB')).value, is(`λ`));
        assertThat(JsonGrammar.escaped.parse(view('\\u5c71')).value, is('山'));
        assertThat(JsonGrammar.escaped.parse(view('\\u7530')).value, is('田'));
        assertThat(JsonGrammar.escaped.parse(view('\\u3000')).value, is('　'));
        assertThat(JsonGrammar.escaped.parse(view('\\u7ae0')).value, is('章'));
        assertThat(JsonGrammar.escaped.parse(view('\\u96c4')).value, is('雄'));
    });

    await context.step("can parse string", () => {
        assertThat(JsonGrammar.string.parse(view('""')).value, is(''));
        assertThat(JsonGrammar.string.parse(view('"Word"')).value, is('Word'));
        assertThat(JsonGrammar.string.parse(view('"This is some \\" random string"')).value, is('This is some " random string'));
        assertThat(JsonGrammar.string.parse(view('"Text with unicode \u03BB after "')).value, is('Text with unicode λ after '));
        assertTrue(JsonGrammar.string.parse(view('failure')) instanceof Failure);
    });

    await context.step("string should not be greedy", () => {
        const result = JsonGrammar.string.parse(view('"foo":"value"'));
        assertThat(result.value, is('foo'));
        assertThat(result.remainder.toSource(), is(':"value"'));
    });

    await context.step("can parse number", () => {
        assertThat(JsonGrammar.number.parse(view('12')).value, is(12));
        assertThat(JsonGrammar.number.parse(view('12.1')).value, is(12.1));
        assertThat(JsonGrammar.number.parse(view('-12')).value, is(-12));
    });

    await context.step("can parse member", () => {
        assertThat(JsonGrammar.member.parse(view('"foo":"value"')).value, equals(['foo', 'value']));
        assertThat(JsonGrammar.member.parse(view('"foo":123')).value, equals(['foo', 123]));
    });

    await context.step("can parse array", () => {
        assertThat(JsonGrammar.array.parse(view('["foo"]')).value, equals(['foo']));
        assertThat(JsonGrammar.array.parse(view('["foo",123]')).value, equals(['foo', 123]));
    });

    await context.step("can parse object", () => {
        assertThat(JsonGrammar.object.parse(view('{"foo":123}')).value, equals({foo: 123}));
        assertThat(JsonGrammar.object.parse(view('{"foo":123,"bar":"baz"}')).value, equals({foo: 123, bar: 'baz'}));
    });

    await context.step("handles whitespace", () => {
        assertThat(JsonGrammar.value().parse(view(' [ [ "cats" , "dogs" ] , [ true , false ] , { "foo" : true , "bar" : false } ] ')).value,
            equals([["cats", "dogs"], [true, false], {"foo": true, "bar": false}]));
        assertThat(JsonGrammar.value().parse(view(' null ')).value, is(null));
    });
});



