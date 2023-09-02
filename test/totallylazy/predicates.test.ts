import {assert} from "https://deno.land/std@0.200.0/assert/mod.ts";
import {is, not} from "../../src/totallylazy/predicates.ts";
import {describe} from "../../src/totallylazy/test.ts";

describe("is", async (it) => {
    const p = is(2);

    await it("does strict equality", () => {
        assert(p(2));
    });

    await it("is inspectable", () => {
        assert(p.value === 2);
    });
});

describe("not", async (it) => {
    const original = is(2);
    const p = not(original);

    await it("negates the original predicate", () => {
        assert(p(3));
        assert(!p(2));
    });

    await it("is inspectable", () => {
        assert(p.predicate === original);
    });
});