import {Client} from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import {Transducer} from "../../../totallylazy/transducers/Transducer.ts";
import {isFilterTransducer} from "../../../totallylazy/transducers/FilterTransducer.ts";
import {isIsPredicate} from "../../../totallylazy/predicates/IsPredicate.ts";
import {Predicate} from "../../../totallylazy/predicates/Predicate.ts";
import {isProperty} from "../../../totallylazy/functions/Property.ts";
import {isWherePredicate} from "../../../totallylazy/predicates/WherePredicate.ts";
import {Mapper} from "../../../totallylazy/functions/Mapper.ts";

export interface Definition<A> {
    name: string;
}

/**
 * DO NOT USE. Spike only
 */
export class PostgresSqlBuilder {
    private whereClause: string = '';

    constructor(private tableName: string) {

    }

    where(predicate: Predicate<any>): PostgresSqlBuilder {
        if (isWherePredicate(predicate)) {
            this.whereClause = ` where ${this.mapper(predicate.mapper)}${this.predicate(predicate.predicate)}`;
        }

        return this;
    }

    build(): string {
        return `SELECT * FROM ${this.tableName}` + this.whereClause;
    }

    private mapper(mapper: Mapper<any, any>) {
        if (isProperty(mapper)) {
            return mapper.key
        }
        return "";
    }

    private predicate(predicate: Predicate<any>) {
        if(isIsPredicate(predicate)) {
            return ` = '${predicate.value}'`;
        }
        return "";
    }
}

export class PostgresRecords {
    constructor(private client: Client) {

    }

    async get<A>(definition: Definition<A>, ...transducers: readonly Transducer<any, any>[]): Promise<Iterable<A>> {
        const builder = transducers.reduce((builder, transducer) => {
            if(isFilterTransducer(transducer)) {
                return builder.where(transducer.predicate);
            }
            return builder;
        }, new PostgresSqlBuilder(definition.name));
        const sql = builder.build();
        console.log(sql);
        const {rows} = await this.client.queryObject<A>(sql);
        return rows;
    }
}