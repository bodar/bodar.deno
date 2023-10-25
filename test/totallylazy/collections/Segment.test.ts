import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {segment, toString} from "../../../src/totallylazy/collections/Segment.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("Segment", async (context) => {
    await context.step("can create from parts", () => {
        assertThat(segment().toArray(), equals([]));
        assertThat(segment(1).toArray(), equals([1]));
        assertThat(segment(1, segment(2)).toArray(), equals([1, 2]));
        assertThat(segment(1, segment(2, segment(3))).toArray(), equals([1, 2, 3]));
    });

    await context.step("supports toString", () => {
        assertThat(toString(segment()), is('segment()'));
        assertThat(toString(segment(1)), is('segment(1)'));
        assertThat(toString(segment(1, segment(2))), is('segment(1, segment(2))'));
        assertThat(toString(segment(1, segment(2, segment(3)))), is('segment(1, segment(2, segment(3)))'));
    });
});