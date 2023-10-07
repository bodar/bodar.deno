import {Expression} from "./Expression.ts";
import {text, Text} from "./Text.ts";
import {value} from "./Value.ts";

/**
 * A Sql expression.
 */
export class Sql extends Expression {
    constructor(public readonly expressions: readonly Expression[]) {
        super();
    }
}

/**
 * Create a Sql expression from a number of expressions.
 */
export function sql(...expressions: readonly Expression[]): Sql {
    return new Sql(expressions.flatMap(e => {
        if(e instanceof Text && e.text === '') return [];
        if(e instanceof Sql) return e.expressions;
        return [e];
    }));
}

/**
 * Create a SQL expression from a template string.
 */
export function SQL(chunks: TemplateStringsArray, ...values: readonly any[]): Sql {
    return sql(...chunks.flatMap((chunk, index) => {
        if (index > (values.length - 1)) return [text(chunk)];
        return [text(chunk), value(values[index])];
    }));
}