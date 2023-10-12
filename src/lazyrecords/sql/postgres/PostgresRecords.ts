import {Client} from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import {Transducer} from "../../../totallylazy/transducers/Transducer.ts";
import {Definition, selectExpression} from "../builder/builders.ts";
import {statement} from "./statement.ts";
import {sql} from "../template/Sql.ts";


export class PostgresRecords {
    constructor(private client: Client) {

    }

    async get<A>(definition: Definition<A>, ...transducers: readonly Transducer<any, any>[]): Promise<Iterable<A>> {
        const queryOptions = statement(sql(selectExpression(definition, ...transducers)));
        console.log(queryOptions);
        const {rows} = await this.client.queryObject<A>(queryOptions);
        return rows;
    }
}