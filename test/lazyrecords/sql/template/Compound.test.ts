import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {Compound} from "../../../../src/lazyrecords/sql/template/Compound.ts";
import {text} from "../../../../src/lazyrecords/sql/template/Text.ts";

Deno.test('Compound', async (context) => {
    const a = text('a');
    const b = text('b');
    const c = text('c');
    const separator = text(', ');

    await context.step('correctly inserts the separator where needed', function () {
        assertThat(Array.from(new Compound([], separator)), equals([]));
        assertThat(Array.from(new Compound([a], separator)), equals([a]));
        assertThat(Array.from(new Compound([a, b], separator)), equals([a, separator, b]));
        assertThat(Array.from(new Compound([a, b, c], separator)), equals([a, separator, b, separator, c]));
    });

    await context.step('can also add start and end', function () {
        const start = text('(');
        const end = text(')');
        assertThat(Array.from(new Compound([a, b, c], separator, start, end)), equals([start, a, separator, b, separator, c, end]));
    });
});