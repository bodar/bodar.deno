import {assert} from "https://deno.land/std@0.200.0/assert/assert.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("IsPredicate", async (context) => {
    const p = is(2);

    await context.step("does strict equality", () => {
        assert(p(2));
    });

    await context.step("is inspectable", () => {
        assert(p.value === 2);
    });

    await context.step("is self describing", () => {
        assert(p.toString() === 'is(2)');
    });
});