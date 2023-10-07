import {Client} from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import {Definition, PostgresRecords} from "../../../src/lazyrecords/postgres/PostgresRecords.ts";
import {filter} from "../../../src/totallylazy/transducers/FilterTransducer.ts";
import {Property, property} from "../../../src/totallylazy/functions/Property.ts";
import {is} from "../../../src/totallylazy/predicates/IsPredicate.ts";
import {where} from "../../../src/totallylazy/predicates/WherePredicate.ts";

Deno.test("PostgresRecords", async (context) => {
    const client = new Client({
        user: "admin",
        password: "password",
        database: "slipway",
        hostname: "localhost",
        port: 5432,
    });
    await client.connect();

    const records = new PostgresRecords(client);

    interface Country {
        country_code: string;
        country_name: string;
    }

    const country: Definition<Country> = {name: "country"};
    const countryCode: Property<Country, 'country_code'> = property("country_code");

    await context.step("can get a record by name", async () => {
        const record = await records.get(country, filter(where(countryCode, is("GB"))));
        console.log(Array.from(record));
    });


    await client.end();
});