import {assert} from "https://deno.land/std@0.200.0/assert/assert.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("IsPredicate", async (context) => {
    await context.step("uses Object.is for equality", () => {
        assert(is(2)(2));
        assert(!is(2)(3));
        assert(is(NaN)(NaN));
    });

    await context.step("is inspectable", () => {
        assert(is(2).value === 2);
    });

    await context.step("is self describing", () => {
        assert(is(2).toString() === 'is(2)');
    });
});