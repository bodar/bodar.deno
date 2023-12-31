import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {select} from "../../../../src/lazyrecords/sql/ansi/SelectExpression.ts";
import {distinct} from "../../../../src/lazyrecords/sql/ansi/SetQuantifier.ts";
import {sql} from "../../../../src/lazyrecords/sql/template/Sql.ts";
import {column} from "../../../../src/lazyrecords/sql/ansi/Column.ts";
import {from} from "../../../../src/lazyrecords/sql/ansi/FromClause.ts";
import {table} from "../../../../src/lazyrecords/sql/ansi/Table.ts";
import {where} from "../../../../src/lazyrecords/sql/ansi/WhereClause.ts";
import {qualified} from "../../../../src/lazyrecords/sql/ansi/Qualified.ts";
import {is} from "../../../../src/lazyrecords/sql/ansi/IsExpression.ts";

Deno.test('SelectExpression', async (context) => {
    await context.step('can write in normal SQL order', function () {
        assertThat(sql(
            select(distinct, [column('name').as('n')],
                from(table('person').as('p')),
                where(column('age'), is(42))
            )).toString(), equals('select distinct "name" as "n" from "person" as "p" where "age" = 42'));
    });

    await context.step('can select a single column', function () {
        assertThat(sql(
            select(distinct, column('name'),
                from(table('person'))
            )).toString(), equals('select distinct "name" from "person"'));
    });

    await context.step('can use fully qualified names', function () {
        assertThat(sql(
            select(distinct, column(qualified('schema', 'name')),
                from(table('person'))
            )).toString(), equals('select distinct "schema"."name" from "person"'));
    });

    await context.step(`can add additional 'and' clauses`, function () {
        assertThat(sql(
            select(distinct, [column('name').as('n')],
                from(table('person').as('p')),
                where(column('age'), is(42))
                    .and(column('weight'), is(100))
            )).toString(), equals('select distinct "name" as "n" from "person" as "p" where ("age" = 42 and "weight" = 100)'));
    });

    await context.step(`can add additional 'or' clauses`, function () {
        assertThat(sql(
            select(distinct, [column('name').as('n')],
                from(table('person').as('p')),
                where(column('age'), is(42))
                    .or(column('weight'), is(100))
            )).toString(), equals('select distinct "name" as "n" from "person" as "p" where ("age" = 42 or "weight" = 100)'));
    });
});