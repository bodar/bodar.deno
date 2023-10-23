import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {fromArray, fromString, segment, toArray, toString} from "../../../src/totallylazy/collections/Segment.ts";
import { is } from "../../../src/totallylazy/predicates/IsPredicate.ts";

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

    await context.step("can create from an array", () => {
        const s = fromArray([1, 2, 3]);
        assertThat(s.head, is(1));
        assertThat(s.tail!.head, is(2));
        assertThat(s.tail!.tail!.head, is(3));
        assertThat(s.tail!.tail!.tail, is(undefined));
    });

    await context.step("can create from a TypeArray", () => {
        const hello: Uint8Array = new TextEncoder().encode('HELLO');
        const s = fromArray(hello);
        assertThat(s.head, is(72));
        assertThat(s.tail!.head, is(69));
        assertThat(s.tail!.tail!.head, is(76));
        assertThat(s.tail!.tail!.tail!.head, is(76));
        assertThat(s.tail!.tail!.tail!.tail!.head, is(79));
        assertThat(s.tail!.tail!.tail!.tail!.tail, is(undefined));
    });

    await context.step("toArray returns the original array if available", () => {
        const original = [1, 2, 3];
        const arraySegment = fromArray(original);
        assertThat(toArray(arraySegment), is(original));

        const hello: Uint8Array = new TextEncoder().encode('HELLO');
        const helloSegment = fromArray(hello);
        assertThat(toArray(helloSegment), is(hello));
    });

    await context.step("can create from a string", () => {
        const s = fromString("HELLO");
        assertThat(s.head, is('H'));
        assertThat(s.tail!.head, is('E'));
        assertThat(s.tail!.tail!.head, is('L'));
        assertThat(s.tail!.tail!.tail!.head, is('L'));
        assertThat(s.tail!.tail!.tail!.tail!.head, is('O'));
        assertThat(s.tail!.tail!.tail!.tail!.tail, is(undefined));
    });
});