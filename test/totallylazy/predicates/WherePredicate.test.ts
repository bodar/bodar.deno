import {where} from "../../../src/totallylazy/predicates/WherePredicate.ts";
import {Property, property} from "../../../src/totallylazy/functions/Property.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";

Deno.test("WherePredicate", async (context) => {
    await context.step("can be used to filter objects", () => {
        interface Car {
            make: string;
            model: string;
            colour: string;
        }

        const cars: Car[] = [
            {make: 'Ford', model: 'Fiesta', colour: 'Red'},
            {make: 'Land Rover', model: 'Defender', colour: 'Muddy'},
        ];

        const colour:Property<Car, 'colour'> = property('colour');

        assertThat(cars.filter(where(colour, is('Red'))).length, is(1));
    });

    await context.step("is inspectable", () => {
    });

    await context.step("is self describing", () => {
    });
});