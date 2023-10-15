import {is} from "../../../../src/totallylazy/predicates/IsPredicate.ts";
import {assertThat} from "../../../../src/totallylazy/asserts/assertThat.ts";
import {definition, toSelect} from "../../../../src/lazyrecords/sql/builder/builders.ts";
import {sql} from "../../../../src/lazyrecords/sql/template/Sql.ts";
import {filter} from "../../../../src/totallylazy/transducers/FilterTransducer.ts";
import {where} from "../../../../src/totallylazy/predicates/WherePredicate.ts";
import {property} from "../../../../src/totallylazy/functions/Property.ts";
import {map} from "../../../../src/totallylazy/transducers/MapTransducer.ts";
import {select} from "../../../../src/totallylazy/functions/Select.ts";
import { and } from "../../../../src/totallylazy/predicates/AndPredicate.ts";
import { or } from "../../../../src/totallylazy/predicates/OrPredicate.ts";


interface Country {
    country_code: string;
    country_name: string;
    optional?: string;
}

const country = definition<Country>("country");
const countryCode = property<Country, 'country_code'>("country_code");
const countryName = property<Country, 'country_name'>("country_name");
const optional = property<Country, 'optional'>("optional");

Deno.test("selectExpression", async (context) => {
    await context.step("works with just the definition", () => {
        assertThat(sql(toSelect(country)).toString(),
            is('select all * from "country"'));
    });

    await context.step("can filter with where", () => {
        assertThat(sql(toSelect(country, filter(where(countryCode, is("GB"))))).toString(),
            is(`select all * from "country" where "country_code" = 'GB'`));
    });

    await context.step("can map with select", () => {
        assertThat(sql(toSelect(country, map(select(countryCode)))).toString(),
            is(`select all "country_code" from "country"`));
    });

    await context.step("can combine", () => {
        assertThat(sql(toSelect(country, filter(where(countryCode, is("GB"))), map(select(countryCode)))).toString(),
            is(`select all "country_code" from "country" where "country_code" = 'GB'`));
    });

    await context.step("supports 'and' predicates", () => {
        assertThat(sql(toSelect(country, filter(and(where(countryCode, is("GB")), where(countryName, is("United Kingdom")))))).toString(),
            is(`select all * from "country" where ("country_code" = 'GB' and "country_name" = 'United Kingdom')`));
    });

    await context.step("supports 'or' predicates", () => {
        assertThat(sql(toSelect(country, filter(or(where(countryCode, is("GB")), where(countryName, is("United Kingdom")))))).toString(),
            is(`select all * from "country" where ("country_code" = 'GB' or "country_name" = 'United Kingdom')`));
    });

    await context.step("'and' can be also just be written with multiple filters", () => {
        assertThat(sql(toSelect(country, filter(where(countryCode, is("GB"))), filter(where(countryName, is("United Kingdom"))))).toString(),
            is(`select all * from "country" where ("country_code" = 'GB' and "country_name" = 'United Kingdom')`));
    });

    await context.step("can also write 'and' in infix style", () => {
        assertThat(sql(toSelect(country, filter(where(countryCode, is("GB")).and(where(countryName, is("United Kingdom")))))).toString(),
            is(`select all * from "country" where ("country_code" = 'GB' and "country_name" = 'United Kingdom')`));
    });

    await context.step("can also write 'or' in infix style", () => {
        assertThat(sql(toSelect(country, filter(where(countryCode, is("GB")).or(where(countryName, is("United Kingdom")))))).toString(),
            is(`select all * from "country" where ("country_code" = 'GB' or "country_name" = 'United Kingdom')`));
    });

    await context.step("correctly handles null values", () => {
        assertThat(sql(toSelect(country, filter(where(optional, is<string|undefined|null>(null))))).toString(),
            is(`select all * from "country" where "optional" is null`));
    });

    await context.step("correctly transforms undefined values", () => {
        assertThat(sql(toSelect(country, filter(where(optional, is<string|undefined>(undefined))))).toString(),
            is(`select all * from "country" where "optional" is null`));
    });
});