import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {filter} from "../../../src/totallylazy/transducers/sync/FilterTransducer.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";

Deno.test("FilterTransducer", async (context) => {
    await context.step("can be created first then applied to an iterable", () => {
        const even = (x: number) => x % 2 === 0;
        const transducer = filter(even);
        assertThat(Array.from(transducer([1, 2, 3, 4, 5])), equals([2, 4]));
    });

    await context.step("is inspectable", () => {
    });

    await context.step("is self describing", () => {
    });
});