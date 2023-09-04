import {assert} from "https://deno.land/std@0.200.0/assert/mod.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {not} from "../../../src/totallylazy/predicates/NotPredicate.ts";

Deno.test("NotPredicate", async (context) => {
    const original = is(2);
    const p = not(original);

    await context.step("negates the original predicate", () => {
        assert(p(3));
        assert(!p(2));
    });

    await context.step("is inspectable", () => {
        assert(p.predicate === original);
    });

    await context.step("is self describing", () => {
        assert(p.toString() === 'not(is(2))');
    });
});