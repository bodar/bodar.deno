import {Client} from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import {PostgresRecords} from "../../../../src/lazyrecords/sql/postgres/PostgresRecords.ts";
import {property, Property} from "../../../../src/totallylazy/functions/Property.ts";
import {filter} from "../../../../src/totallylazy/transducers/FilterTransducer.ts";
import {where} from "../../../../src/totallylazy/predicates/WherePredicate.ts";
import {is} from "../../../../src/totallylazy/predicates/IsPredicate.ts";
import {definition} from "../../../../src/lazyrecords/sql/builder/builders.ts";
import {select} from "../../../../src/totallylazy/functions/Select.ts";
import {map} from "../../../../src/totallylazy/transducers/MapTransducer.ts";


Deno.test({
    name: "PostgresRecords",
    ignore: true,
    fn: async (context) => {
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

        const country = definition<Country>("country");
        const countryCode: Property<Country, 'country_code'> = property("country_code");

        await context.step("can get a record by name", async () => {
            const record = await records.get(country,
                filter(where(countryCode, is("GB"))),
                map(select(countryCode))
            );
            console.log(Array.from(record));
        });


        await client.end();
    }
},);