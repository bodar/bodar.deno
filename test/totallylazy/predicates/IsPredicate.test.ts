import {assert} from "https://deno.land/std@0.200.0/assert/assert.ts";
import {is, isIsPredicate} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("IsPredicate", async (context) => {
    await context.step("uses Object.is for equality", () => {
        assert(is(2)(2));
        assert(!is(2)(3));
        assert(is(NaN)(NaN));
    });

    await context.step("is inspectable", () => {
        assert(is(2).value === 2);
    });

    await context.step("has function name", () => {
        assert(is(2).name === 'is');
    });

    await context.step("is self describing", () => {
        assert(is(2).toString() === 'is(2)');
    });
});

Deno.test("isIsPredicate", async (context) => {
   await context.step("works", () => {
       assert(isIsPredicate(is(2)));
       assert(isIsPredicate(is(undefined)));
       assert(!isIsPredicate(() => 'false'));
   });
});