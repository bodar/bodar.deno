import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../../src/totallylazy/predicates/IsPredicate.ts";
import {select} from "../../../../src/lazyrecords/sql/ansi/SelectExpression.ts";
import {distinct} from "../../../../src/lazyrecords/sql/ansi/SetQuantifier.ts";
import {sql} from "../../../../src/lazyrecords/sql/template/Sql.ts";
import {column, table} from "../../../../src/lazyrecords/sql/ansi/ColumnReference.ts";
import {from} from "../../../../src/lazyrecords/sql/ansi/FromClause.ts";

Deno.test('SelectExpression', async (context) => {
    await context.step('can select all', function () {
        assertThat(sql(
            select(distinct, [
                    column('name')
                ], from(table('person'))
            )).toString(), is('select distinct name from person'));
    });
});