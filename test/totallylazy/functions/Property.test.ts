import {isProperty, property, Property} from "../../../src/totallylazy/functions/Property.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

interface Car {
    make: string;
    model: string;
    colour: string;
}

const car: Car = {make: 'Ford', model: 'Fiesta', colour: 'Red'};

const colour:Property<Car, 'colour'> = property('colour');

Deno.test("Property", async (context) => {
    await context.step("can be used as a function", () => {
        assertThat(colour(car), is('Red'));
    });

    await context.step("is inspectable", () => {
        assertThat(colour.key, is('colour'));
    });

    await context.step("sets function name", () => {
        assertThat(colour.name, is('property'));
    });

    await context.step("is self describing", () => {
        assertThat(colour.toString(), is(`property('colour')`));
    });
});

Deno.test("isProperty", async (context) => {
    await context.step("works", () => {
        assertThat(isProperty(colour), is(true));
        assertThat(isProperty(() => 'false'), is(false));
    });
});