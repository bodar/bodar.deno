import {Expression} from "./Expression.ts";
import {sql, Sql} from "./Sql.ts";
import {text} from "./Text.ts";

export class Value extends Expression {
    constructor(public readonly value: unknown) {
        super();
    }
}

export function value(value: unknown): Expression {
    if (value instanceof Expression) return value;
    if (value === undefined) return new Value(null);
    return new Value(value);
}


export function values(values: unknown[], separator: string = ', '): Sql {
    return sql(...values.flatMap((v, i) => i > 0 ? [text(separator), value(v)] : [value(v)]));
}

export const spread = values;