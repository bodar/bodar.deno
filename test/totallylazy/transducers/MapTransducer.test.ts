import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {map, isMapTransducer} from "../../../src/totallylazy/transducers/MapTransducer.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("MapTransducer", async (context) => {
    const transducer = map(String);

    await context.step("can be created first then applied to an iterable", () => {
        assertThat(Array.from(transducer([1, 2, 3, 4, 5])), equals(['1', '2', '3', '4', '5']));
    });

    await context.step("is inspectable", () => {
        assertThat(transducer.mapper, is(String));
    });

    await context.step("is self describing", () => {
        assertThat(transducer.toString(), is(`map(${String})`));
    });
});

Deno.test("isMapTransducer", async (context) => {
    await context.step("works", () => {
        assertThat(isMapTransducer(map(String)), is(true));
        assertThat(isMapTransducer(() => 'false'), is(false));
    });
});