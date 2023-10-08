import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../../src/totallylazy/predicates/IsPredicate.ts";
import {select} from "../../../../src/lazyrecords/sql/ansi/SelectExpression.ts";
import {all} from "../../../../src/lazyrecords/sql/ansi/SetQuantifier.ts";

Deno.test('SelectExpression', async (context) => {
    await context.step('can select all', function () {
        assertThat(select(all).toString(), is(`select all`));

    });
});

