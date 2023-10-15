import {isWherePredicate, where} from "../../../src/totallylazy/predicates/WherePredicate.ts";
import {Property, property} from "../../../src/totallylazy/functions/Property.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";
import {assertThat, assertTrue} from "../../../src/totallylazy/asserts/assertThat.ts";
import {isNotPredicate, not} from "../../../src/totallylazy/predicates/NotPredicate.ts";
import {assert} from "https://deno.land/std@0.200.0/assert/assert.ts";

interface Car {
    make: string;
    model: string;
    colour: string;
}

const cars: Car[] = [
    {make: 'Ford', model: 'Fiesta', colour: 'Red'},
    {make: 'Land Rover', model: 'Defender', colour: 'Muddy'},
];

const colour: Property<Car, 'colour'> = property('colour');

Deno.test("WherePredicate", async (context) => {
    await context.step("can be used to filter objects", () => {
        assertThat(cars.filter(where(colour, is('Red'))).length, is(1));
    });

    await context.step("is inspectable", () => {
        const predicate = where(colour, is('Red'));
        assertThat(predicate.mapper, is(colour));
        assertThat(predicate.predicate, equals(is('Red')));
    });

    await context.step("is self describing", () => {
        const predicate = where(colour, is('Red'));
        assertThat(predicate.toString(), is(`where(property('colour'), is("Red"))`));
    });

    await context.step("uses De Morgan's law to ensure 'not' is always on the outside", () => {
        const predicate = where(colour, not(is('Red')));
        assertTrue(isNotPredicate(predicate));
        assert(isWherePredicate(predicate.predicate));
        assertThat(predicate.predicate.mapper, is(colour));
        assertThat(predicate.predicate.predicate, equals(is('Red')));
    });
});


Deno.test("isWherePredicate", async (context) => {
    await context.step("works", () => {
        assertTrue(isWherePredicate(where(colour, is('Red'))));
    })
})