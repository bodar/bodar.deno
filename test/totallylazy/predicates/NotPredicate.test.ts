import {assert} from "https://deno.land/std@0.200.0/assert/mod.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {not} from "../../../src/totallylazy/predicates/NotPredicate.ts";
import {describe} from "../../../src/totallylazy/testing/describe.ts";

describe("NotPredicate", async (it) => {
    const original = is(2);
    const p = not(original);

    await it("negates the original predicate", () => {
        assert(p(3));
        assert(!p(2));
    });

    await it("is inspectable", () => {
        assert(p.predicate === original);
    });

    await it("is self describing", () => {
        assert(p.toString() === 'not(is(2))');
    });

});