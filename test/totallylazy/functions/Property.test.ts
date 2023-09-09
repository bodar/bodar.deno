import {property, Property} from "../../../src/totallylazy/functions/Property.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("Property", async (context) => {
    interface Car {
        make: string;
        model: string;
        colour: string;
    }

    const car: Car = {make: 'Ford', model: 'Fiesta', colour: 'Red'};

    const colour:Property<Car, 'colour'> = property('colour');

    await context.step("can be used as a function", () => {
        assertThat(colour(car), is('Red'));
    });

    await context.step("is inspectable", () => {
        assertThat(colour.key, is('colour'));
    });

    await context.step("is self describing", () => {
        assertThat(colour.toString(), is(`property('colour')`));
    });
});