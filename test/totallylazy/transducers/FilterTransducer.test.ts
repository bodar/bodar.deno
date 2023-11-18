import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {filter, isFilterTransducer} from "../../../src/totallylazy/transducers/FilterTransducer.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import { Transducer } from "../../../src/totallylazy/transducers/Transducer.ts";

const even = (x: number) => x % 2 === 0;
const transducer = filter(even);

Deno.test("FilterTransducer", async (context) => {
    await context.step("can be created first then applied to an iterable", () => {
        assertThat(Array.from(transducer([1, 2, 3, 4, 5])), equals([2, 4]));
    });

    await context.step("is inspectable", () => {
        assertThat(transducer.predicate, is(even));
    });

    await context.step("has transducer type", () => {
        assertThat(transducer[Transducer.type], is('filter'));
    });


    await context.step("is self describing", () => {
        assertThat(transducer.toString(), is('filter((x)=>x % 2 === 0)'));
    });
});

Deno.test("isFilterTransducer", async (context) => {
    await context.step("works", () => {
        assertThat(isFilterTransducer(filter(even)), is(true));
        assertThat(isFilterTransducer(() => 'false'), is(false));
    });
});