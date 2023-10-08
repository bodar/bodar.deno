import {statement} from "../../../../src/lazyrecords/sql/postgres/statement.ts";
import {id} from "../../../../src/lazyrecords/sql/template/Identifier.ts";
import {SQL, ids, values} from "../../../../src/lazyrecords/sql/template/Sql.ts";
import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../../src/totallylazy/predicates/EqualsPredicate.ts";

Deno.test('statement', async (context) => {
    await context.step('supports correctly escaping identifiers', function() {
        const dynamic = "user's";
        assertThat(statement(SQL`SELECT * FROM ${id(dynamic)} WHERE name = ${'dan'}`), equals({
            text: 'SELECT * FROM "user\'s" WHERE name = $1',
            args: ['dan']
        }));
    });

    await context.step('automatically handles arrays of identifiers', function() {
        assertThat(statement(SQL`${ids(['first_name', 'last_name'])}`), equals({
            text: `"first_name", "last_name"`,
            args: []
        }));
    });

    await context.step('automatically handles arrays and ids', function() {
        const template = SQL`INSERT INTO users (${ids(['first_name', 'last_name'])}) VALUES (${values(['Dan', 'Bodart'])})`;
        assertThat(statement(template), equals({
            text: `INSERT INTO users ("first_name", "last_name") VALUES ($1, $2)`,
            args: ['Dan', 'Bodart']
        }));
    });
});