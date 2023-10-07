import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {escapeIdentifier, escapeLiteral} from "../../../../src/lazyrecords/sql/postgres/escape.ts";
import {is} from "../../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test('escapeIdentifier', async (context) => {
    await context.step('wraps in double quotes and escapes existing quotes', function () {
        assertThat(escapeIdentifier('column'), is(`"column"`));
        assertThat(escapeIdentifier('Hello " Dan'), is(`"Hello "" Dan"`));
    });
});

Deno.test('escapeLiteral', async (context) => {
    await context.step('wraps in single quotes and escapes existing quotes', function () {
        assertThat(escapeLiteral('Dan'), is(`'Dan'`));
        assertThat(escapeLiteral(`Dan's cat` ), is(`'Dan''s cat'`));
    });
});