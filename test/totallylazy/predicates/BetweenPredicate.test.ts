import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {between} from "../../../src/totallylazy/predicates/BetweenPredicate.ts";

Deno.test("BetweenPredicate", async (context) => {
    const predicate = between(2, 4);

    await context.step("can use built in comparators", () => {
        assertThat(predicate(1), is(false));
        assertThat(predicate(2), is(true));
        assertThat(predicate(3), is(true));
        assertThat(predicate(4), is(true));
        assertThat(predicate(5), is(false));
    });

    await context.step("is inspectable", () => {
        assertThat(predicate.start, is(2));
        assertThat(predicate.end, is(4));
    });

    await context.step("is self describing", () => {
        assertThat(predicate.toString(), is('between(2, 4)'));
    });
});
