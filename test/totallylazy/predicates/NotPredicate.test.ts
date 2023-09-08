import {assert} from "https://deno.land/std@0.200.0/assert/mod.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {not} from "../../../src/totallylazy/predicates/NotPredicate.ts";

Deno.test("NotPredicate", async (context) => {
    await context.step("negates the original predicate", () => {
        assert(not(is(2))(3));
        assert(!not(is(2))(2));
    });

    await context.step("is inspectable", () => {
        const p = is(2);
        assert(not(p).predicate === p);
    });

    await context.step("is self describing", () => {
        assert(not(is(2)).toString() === 'not(is(2))');
    });
});