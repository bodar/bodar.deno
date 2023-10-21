import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {fromArray, segment, toArray} from "../../../src/totallylazy/collections/Segment.ts";

Deno.test("Segment", async (context) => {
    await context.step("can create from parts", () => {
        assertThat(toArray(segment()), equals([]));
        assertThat(toArray(segment(1)), equals([1]));
        assertThat(toArray(segment(1, segment(2))), equals([1, 2]));
        assertThat(toArray(segment(1, segment(2, segment(3)))), equals([1, 2, 3]));
    });

    await context.step("can create from an array", () => {
        assertThat(fromArray([]), equals(segment()));
        assertThat(fromArray([1]), equals(segment(1)));
        assertThat(fromArray([1, 2]), equals(segment(1, segment(2))));
        assertThat(fromArray([1, 2, 3]), equals(segment(1, segment(2, segment(3)))));
    });
});