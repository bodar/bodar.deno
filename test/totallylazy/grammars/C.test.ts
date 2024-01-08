import {view} from "../../../src/totallylazy/parsers/View.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {C, Comment} from "../../../src/totallylazy/grammars/C.ts";

Deno.test("C", async (context) => {
    await context.step("can capture a comment", () => {
        assertThat(C.comment.parse(view('// This is a single line comment\n')).value,
            equals(new Comment('This is a single line comment')));
        assertThat(C.comment.parse(view('// This is a single line comment')).value,
            equals(new Comment('This is a single line comment')));
        assertThat(C.comment.parse(view('/* This is a multi line comment */')).value,
            equals(new Comment('This is a multi line comment')));
    });
});