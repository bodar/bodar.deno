import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {ascending} from "../../../src/totallylazy/comparators/ascending.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";

Deno.test("ascending", async (context) => {
    await context.step("follows the Java comparator contract", () => {
        assertThat(ascending(1, 2), equals(-1));
        assertThat(ascending(1, 1), equals(0));
        assertThat(ascending(2, 1), equals(1));
    });

    await context.step("can sort an array", () => {
        const array = [3, 1, 2, 5, 4];
        assertThat(array.sort(ascending), equals([1, 2, 3, 4, 5]));
    });
});
