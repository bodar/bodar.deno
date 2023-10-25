import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {segment, toString} from "../../../src/totallylazy/collections/Segment.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {toArray} from "../../../src/totallylazy/collections/ArraySegment.ts";

Deno.test("Segment", async (context) => {
    await context.step("can create from parts", () => {
        assertThat(toArray(segment()), equals([]));
        assertThat(toArray(segment(1)), equals([1]));
        assertThat(toArray(segment(1, segment(2))), equals([1, 2]));
        assertThat(toArray(segment(1, segment(2, segment(3)))), equals([1, 2, 3]));
    });

    await context.step("supports toString", () => {
        assertThat(toString(segment()), is('segment()'));
        assertThat(toString(segment(1)), is('segment(1)'));
        assertThat(toString(segment(1, segment(2))), is('segment(1, segment(2))'));
        assertThat(toString(segment(1, segment(2, segment(3)))), is('segment(1, segment(2, segment(3)))'));
    });
});