import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {spread, sql, SQL} from "../../../../src/lazyrecords/sql/template/Sql.ts";
import {text} from "../../../../src/lazyrecords/sql/template/Text.ts";
import {value} from "../../../../src/lazyrecords/sql/template/Value.ts";

Deno.test('SQL', async (context) => {
    await context.step('text', function () {
        assertThat(SQL``, equals(sql()));
        assertThat(SQL`select 1;`, equals(sql(text('select 1;'))));
    });

    await context.step('text and value', function () {
        assertThat(SQL`${1}`, equals(sql(value(1))));
        const name = 'Dan';
        assertThat(SQL`select *
                       from user
                       where name = ${name};`, equals(sql(
            text('select * from user where name = '),
            value(name),
            text(';')
        )));
    });

    await context.step('does not introduce any spaces', function () {
        assertThat(SQL`Hello${1}SQL${2}`, equals(sql(
            text('Hello'),
            value(1),
            text('SQL'),
            value(2),
        )));
    });

    await context.step('handles null', function () {
        assertThat(SQL`SELECT * FROM users WHERE name = ${null}`, equals(sql(
            text('SELECT * FROM users WHERE name = '),
            value(null),
        )));
    });

    await context.step('maps undefined to null', function () {
        assertThat(SQL`SELECT * FROM users WHERE name = ${undefined}`, equals(sql(
            text('SELECT * FROM users WHERE name = '),
            value(null),
        )));
    });

    await context.step('can nest SQL expressions', function () {
        assertThat(SQL`SELECT * ${SQL`FROM users WHERE name = ${undefined}`}`, equals(sql(
            text('SELECT * '),
            sql(text('FROM users WHERE name = '),
                value(null)),
        )));
    });

    await context.step('can keep a array as a single value', function () {
        assertThat(SQL`${['Dan', 'Bodart']}`, equals(sql(
            value(['Dan', 'Bodart'])
        )));
    });

    await context.step('can spread an array into multiple values', function () {
        assertThat(SQL`(${spread(['Dan', 'Bodart'])})`, equals(sql(
            text('('),
            sql(
                value('Dan'),
                text(', '),
                value('Bodart'),
            ),
            text(')'),
        )));
    });
})
