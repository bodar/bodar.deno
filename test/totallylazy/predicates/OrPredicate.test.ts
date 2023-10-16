import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {assertFalse, assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {alwaysFalse, alwaysTrue} from "../../../src/totallylazy/functions/constant.ts";
import {not} from "../../../src/totallylazy/predicates/NotPredicate.ts";
import {isOrPredicate, or} from "../../../src/totallylazy/predicates/OrPredicate.ts";
import {and} from "../../../src/totallylazy/predicates/AndPredicate.ts";

const even = (x: number) => x % 2 === 0;

Deno.test("OrPredicate", async (context) => {

    await context.step("identity element is false", () => {
        assertThat(or(), is(alwaysFalse));
    });

    await context.step("when passed a single predicate just returns that", () => {
        const original = is(1)
        assertThat(or(original), is(original));
    });

    await context.step("returns true if any supplied predicates are true", () => {
        const even = (x: number) => x % 2 === 0;
        assertTrue(or(even, is(1))(2));
        assertTrue(or(even, is(1))(1));
        assertFalse(or(even, is(2))(1));
    });

    await context.step("removes redundant alwaysFalse", () => {
        const other = is(2);
        assertThat(or(even, alwaysFalse, other).predicates, equals([even, other]));
    });

    await context.step("if alwaysTrue is present just return it instead", () => {
        const other = is(2);
        const orPredicate = or(alwaysTrue, other);
        assertThat(orPredicate, is(alwaysTrue));
    });

    await context.step("uses De Morgan's law to ensure 'not' is always on the outside", () => {
        const orPredicate = or(not(is(2)), not(is(3)));
        assertThat(orPredicate, equals(not(and(is(2), is(3)))));
    });

    await context.step("is inspectable", () => {
        const other = is(2);
        assertThat(or(even, other).predicates, equals([even, other]));
    });

    await context.step("is self describing", () => {
        assertThat(or(even, is(2)).toString(), is('or((x)=>x % 2 === 0, is(2))'));
    });
});

Deno.test("isOrPredicate", async (context) => {
    await context.step("works", () => {
        assertTrue(isOrPredicate(or(even, is(2))));
    })
})