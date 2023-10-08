import {QueryOptions} from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import {Sql} from "../template/Sql.ts";
import {Identifier} from "../template/Identifier.ts";
import {Value} from "../template/Value.ts";
import {escapeIdentifier} from "../ansi/escape.ts";

function generatePlaceholders(sql: Sql) {
    let count = 1;
    return sql.generate(e => {
        if (e instanceof Identifier) return escapeIdentifier(e.identifier);
        if (e instanceof Value) return '$' + count++;
        return '';
    });
}

export function statement(sql: Sql): QueryOptions {
    return {
        text: generatePlaceholders(sql),
        args: sql.values()
    }
}



