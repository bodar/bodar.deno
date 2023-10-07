import {Sql} from "../template/Sql.ts";
import {Expression} from "../template/Expression.ts";
import {Identifier} from "../template/Identifier.ts";
import {escapeIdentifier, escapeLiteral} from "./escape.ts";
import {Value} from "../template/Value.ts";
import {Text} from "../template/Text.ts";

export function debugQuery(sql: Sql): string {
    return sql.expressions.reduce((a: string, e: Expression) => {
        if (e instanceof Text) return a + e.text;
        if (e instanceof Identifier) return a + escapeIdentifier(e.identifier);
        if (e instanceof Value) return a + (typeof e.value === 'string' ? escapeLiteral(e.value) : e.value);
        return a;
    }, '');
}