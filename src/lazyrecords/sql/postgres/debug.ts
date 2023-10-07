import {Sql} from "../template/Sql.ts";
import {Identifier} from "../template/Identifier.ts";
import {escapeIdentifier, escapeLiteral} from "./escape.ts";
import {Value} from "../template/Value.ts";

export function debugQuery(sql: Sql): string {
    return sql.generate(e => {
        if (e instanceof Identifier) return escapeIdentifier(e.identifier);
        if (e instanceof Value) return typeof e.value === 'string' ? escapeLiteral(e.value) : String(e.value);
        return '';
    });
}