import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {descending} from "../../../src/totallylazy/comparators/descending.ts";

Deno.test("descending", async (context) => {
    await context.step("follows the Java comparator contract", () => {
        assertThat(descending(1, 2), equals(1));
        assertThat(descending(1, 1), equals(0));
        assertThat(descending(2, 1), equals(-1));
    });

    await context.step("can sort an array", () => {
        const array = [3, 1, 2, 5, 4];
        assertThat(array.sort(descending), equals([5, 4, 3, 2, 1]));
    });
});
