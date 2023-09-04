import {assert} from "https://deno.land/std@0.200.0/assert/assert.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {describe} from "../../../src/totallylazy/testing/describe.ts";

describe("IsPredicate", async (it) => {
    const p = is(2);

    await it("does strict equality", () => {
        assert(p(2));
    });

    await it("is inspectable", () => {
        assert(p.value === 2);
    });

    await it("is self describing", () => {
        assert(p.toString() === 'is(2)');
    });
});
