import {assertFalse, assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {by, isByComparator} from "../../../src/totallylazy/comparators/by.ts";
import {descending} from "../../../src/totallylazy/comparators/descending.ts";
import {property} from "../../../src/totallylazy/functions/Property.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";

Deno.test("by", async (context) => {
    interface Car {
        make: string;
        model: string;
        colour: string;
    }

    const cars: Car[] = [
        {make: 'Land Rover', model: 'Defender', colour: 'Muddy'},
        {make: 'Ford', model: 'Galaxy', colour: 'Red'},
        {make: 'Toyota', model: 'Prius', colour: 'Silver'},
    ];

    const make = property<Car, 'make'>('make');

    await context.step("can work with a property", () => {
        assertThat(cars.sort(by(make, descending)).map(make), equals(["Toyota","Land Rover","Ford"]));
    });

    await context.step("can work with a key", () => {
        assertThat(cars.sort(by('make', descending)).map(make), equals(["Toyota","Land Rover","Ford"]));
    });

    await context.step("is inspectable", () => {
        const comparator = by<Car, 'make'>('make', descending);
        assertThat(comparator.mapper, equals(make));
        assertThat(comparator.comparator, equals(descending));
    });

    await context.step("has function name", () => {
        const comparator = by<Car, 'make'>('make', descending);
        assertThat(comparator.name, is('by'));
    });

    await context.step("is self describing", () => {
        const comparator = by<Car, 'make'>('make', descending);
        assertThat(comparator.toString(), is(`by(property('make'), ${descending})`));
    });
});

Deno.test("isByComparator", async (context) => {
    await context.step("has function name", () => {
        assertTrue(isByComparator(by<string, 'length'>('length', descending)));
        assertFalse(isByComparator(descending));
    });
});