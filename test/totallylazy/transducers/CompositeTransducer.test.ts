import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {filter} from "../../../src/totallylazy/transducers/FilterTransducer.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {compose} from "../../../src/totallylazy/transducers/CompositeTransducer.ts";
import {map} from "../../../src/totallylazy/transducers/MapTransducer.ts";

Deno.test("CompositeTransducer", async (context) => {
    const even = (x: number) => x % 2 === 0;
    const f = filter(even);
    const m = map(String);
    const t = compose(f, m);

    await context.step("can compose together multiple Transducers", () => {
        assertThat(Array.from(t([1, 2, 3, 4, 5])), equals(['2', '4']));
    });

    await context.step("is inspectable", () => {
        assertThat(t.transducers, equals([f, m]));
    });

    await context.step("is self describing", () => {
        assertThat(t.toString(), is(`compose(${f},${m})`));
    });

    await context.step("overload works with more than 2 arguments", () => {
        const r = compose(filter(even), map(String), filter(v => v.length > 1), map(Number));
        assertThat(Array.from(r([1, 2, 5, 10])), equals([10]));
    });

    await context.step("always flattens nested transducers", () => {
        const r = compose(filter(even), map(String), compose(filter(v => v.length > 1), map(Number)));
        assertThat(r.transducers.length, is(4));
    });

});
