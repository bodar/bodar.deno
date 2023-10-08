import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {ascending} from "../../../src/totallylazy/comparators/ascending.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {comparators} from "../../../src/totallylazy/comparators/comparators.ts";
import {by} from "../../../src/totallylazy/comparators/by.ts";
import {descending} from "../../../src/totallylazy/comparators/descending.ts";

Deno.test("comparators", async (context) => {
    await context.step("can compose multiple comparators to sort by more than 1 property", () => {
        interface Car {
            make: string;
            model: string;
            colour: string;
        }

        const cars: Car[] = [
            {make: 'Ford', model: 'Galaxy', colour: 'Red'},
            {make: 'Ford', model: 'Fiesta', colour: 'Red'},
            {make: 'Ford', model: 'Fiesta', colour: 'Blue'},
            {make: 'Land Rover', model: 'Defender', colour: 'Muddy'},
            {make: 'Land Rover', model: 'Defender', colour: 'Black'},
            {make: 'Land Rover', model: 'Discovery', colour: 'Black'},
            {make: 'Land Rover', model: 'Discovery', colour: 'Green'},
        ];

        assertThat(cars.sort(comparators(
            by('make', descending),
            by('model', ascending),
            by('colour', ascending),
        )), equals([
            {make: "Land Rover", model: "Defender", colour: "Black"},
            {make: "Land Rover", model: "Defender", colour: "Muddy"},
            {make: "Land Rover", model: "Discovery", colour: "Black"},
            {make: "Land Rover", model: "Discovery", colour: "Green"},
            {make: "Ford", model: "Fiesta", colour: "Blue"},
            {make: "Ford", model: "Fiesta", colour: "Red"},
            {make: "Ford", model: "Galaxy", colour: "Red"}
        ]));
    });
});
