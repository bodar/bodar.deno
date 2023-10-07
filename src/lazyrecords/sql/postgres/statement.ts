import {QueryOptions} from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import {escapeIdentifier} from "./escape.ts";
import {Sql} from "../template/Sql.ts";
import {Expression} from "../template/Expression.ts";
import {Identifier} from "../template/Identifier.ts";
import {Value} from "../template/Value.ts";
import {Text} from "../template/Text.ts";

function toSql(sql: Sql): string {
    let count = 1;
    return sql.expressions.reduce((a: string, e: Expression) => {
        if (e instanceof Text) return a + e.text;
        if (e instanceof Identifier) return a + escapeIdentifier(e.identifier);
        if (e instanceof Value) return a + '$' + count++;
        return a;
    }, '');
}

function toValues(sql: Sql): unknown[] {
    return sql.expressions.flatMap(e => e instanceof Value ? [e.value] : []);
}

export function statement(sql: Sql): QueryOptions {
    return {
        text: toSql(sql),
        args: toValues(sql)
    }
}



