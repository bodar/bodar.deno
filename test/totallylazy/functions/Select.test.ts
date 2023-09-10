import {property, Property} from "../../../src/totallylazy/functions/Property.ts";
import {assertThat} from "../../../src/totallylazy/asserts/assertThat.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {select} from "../../../src/totallylazy/functions/Select.ts";
import {equals} from "../../../src/totallylazy/predicates/EqualsPredicate.ts";

Deno.test("Select", async (context) => {
    interface Car {
        make: string;
        model: string;
        colour: string;
    }

    const car: Car = {make: 'Ford', model: 'Fiesta', colour: 'Red'};

    const properties: Property<Car, keyof Car>[] = [property('make'), property('colour')];
    const selection = select(...properties);

    await context.step("can be used as a function", () => {
        assertThat(selection(car), equals({make: 'Ford', colour: 'Red'}));
    });

    await context.step("is inspectable", () => {
        assertThat(selection.properties, equals(properties));
    });

    await context.step("is self describing", () => {
        assertThat(selection.toString(), is(`select(${properties})`));
    });
});