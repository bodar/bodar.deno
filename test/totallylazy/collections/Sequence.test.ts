import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {filter} from "../../../src/totallylazy/transducers/FilterTransducer.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {compose, decompose} from "../../../src/totallylazy/transducers/CompositeTransducer.ts";
import {map} from "../../../src/totallylazy/transducers/MapTransducer.ts";
import {sequence} from "../../../src/totallylazy/collections/Sequence.ts";

Deno.test("Sequence", async (context) => {
    const even = (x: number) => x % 2 === 0;
    const f = filter(even);
    const m = map(String);
    const original = [1, 2, 3, 4, 5];
    const t = sequence(original, f, m);

    await context.step("can compose together multiple Transducers", () => {
        assertThat(Array.from(t), equals(['2', '4']));
    });

    await context.step("is inspectable", () => {
        assertThat(t.source, is(original));
        assertThat(Array.from(decompose(t.transducer)), equals([f, m]));
    });

    await context.step("is self describing", () => {
        assertThat(t.toString(), is(`sequence(${original}, ${f}, ${m})`));
    });

    await context.step("collapse nested sequences", () => {
        const r = sequence(t, filter(v => v.length > 1), map(Number));
        assertThat(r.source, is(original));
        assertThat(Array.from(decompose(r.transducer)).length, is(4));
    });

});
