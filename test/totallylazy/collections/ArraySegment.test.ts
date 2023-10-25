import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {empty} from "../../../src/totallylazy/collections/Segment.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {fromArray, fromString} from "../../../src/totallylazy/collections/ArraySegment.ts";

Deno.test("ArraySegment", async (context) => {
    await context.step("supports is empty", () => {
        assertThat(fromArray([]).empty, is(true));
        assertThat(fromArray([1]).empty, is(false));
        assertThat(fromArray([1]).tail.empty, is(true));
    });

    await context.step("can create from an array", () => {
        const s = fromArray([1, 2, 3]);
        assertThat(s.head, is(1));
        assertThat(s.tail.head, is(2));
        assertThat(s.tail.tail.head, is(3));
        assertThat(s.tail.tail.tail, is(empty));
    });

    await context.step("can create from a TypeArray", () => {
        const hello: Uint8Array = new TextEncoder().encode('HELLO');
        const s = fromArray(hello);
        assertThat(s.head, is(72));
        assertThat(s.tail.head, is(69));
        assertThat(s.tail.tail.head, is(76));
        assertThat(s.tail.tail.tail.head, is(76));
        assertThat(s.tail.tail.tail.tail.head, is(79));
        assertThat(s.tail.tail.tail.tail.tail, is(empty));
    });

    await context.step("toArray returns the original array if available", () => {
        const original = [1, 2, 3];
        const arraySegment = fromArray(original);
        assertThat(arraySegment.toArray(), is(original));
        assertThat(arraySegment.tail.toArray(), equals(original.slice(1)));
        assertThat(arraySegment.tail.tail.toArray(), equals(original.slice(2)));

        const hello: Uint8Array = new TextEncoder().encode('HELLO');
        const helloSegment = fromArray(hello);
        assertThat(helloSegment.toArray(), is(hello));
        assertThat(helloSegment.tail.toArray(), equals(hello.subarray(1)));
        assertThat(helloSegment.tail.tail.toArray(), equals(hello.subarray(2)));
    });

    await context.step("can create from a string", () => {
        const s = fromString("HELLO");
        assertThat(s.head, is('H'));
        assertThat(s.tail.head, is('E'));
        assertThat(s.tail.tail.head, is('L'));
        assertThat(s.tail.tail.tail.head, is('L'));
        assertThat(s.tail.tail.tail.tail.head, is('O'));
        assertThat(s.tail.tail.tail.tail.tail, is(empty));
    });

    await context.step("is iterable", () => {
        const s = fromString("HELLO");
        assertThat(Array.from(s), equals(['H', 'E', 'L', 'L', 'O']));
    });
});