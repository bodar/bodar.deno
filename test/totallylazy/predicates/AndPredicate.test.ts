import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {assertFalse, assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {and, isAndPredicate} from "../../../src/totallylazy/predicates/AndPredicate.ts";
import {alwaysFalse, alwaysTrue} from "../../../src/totallylazy/functions/constant.ts";
import {not} from "../../../src/totallylazy/predicates/NotPredicate.ts";
import {or} from "../../../src/totallylazy/predicates/OrPredicate.ts";

const even = (x: number) => x % 2 === 0;

Deno.test("AndPredicate", async (context) => {

    await context.step("identity element is true", () => {
        assertThat(and(), is(alwaysTrue));
    });

    await context.step("when passed a single predicate just returns that", () => {
        const original = is(1)
        assertThat(and(original), is(original));
    });

    await context.step("returns true if all supplied predicates are true", () => {
        const even = (x: number) => x % 2 === 0;
        assertTrue(and(even, is(2))(2));
        assertFalse(and(even, is(2))(1));
    });

    await context.step("removes redundant alwaysTrue", () => {
        const other = is(2);
        assertThat(and(even, alwaysTrue, other).predicates, equals([even, other]));
    });

    await context.step("if alwaysFalse is present just return it instead", () => {
        const other = is(2);
        const andPredicate = and(alwaysFalse, other);
        assertThat(andPredicate, is(alwaysFalse));
    });

    await context.step("uses De Morgan's law to ensure 'not' is always on the outside", () => {
        const andPredicate = and(not(is(2)), not(is(3)));
        assertThat(andPredicate, equals(not(or(is(2), is(3)))));
    });

    await context.step("collapses nested 'and' predicates", () => {
        const andPredicate = and(is(2), and(is(3), and(is(4), is(5))));
        assertThat(andPredicate, equals(and(is(2), is(3), is(4), is(5))));
    });

    await context.step("is inspectable", () => {
        const other = is(2);
        assertThat(and(even, other).predicates, equals([even, other]));
    });

    await context.step("is self describing", () => {
        assertThat(and(even, is(2)).toString(), is('and((x)=>x % 2 === 0, is(2))'));
    });
});

Deno.test("isAndPredicate", async (context) => {
    await context.step("works", () => {
        assertTrue(isAndPredicate(and(even, is(2))));
    })
})