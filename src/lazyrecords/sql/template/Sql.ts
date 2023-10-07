import {Expression} from "./Expression.ts";
import {text, Text} from "./Text.ts";
import {value, Value} from "./Value.ts";
import {Identifier} from "./Identifier.ts";

/**
 * A Sql expression.
 */
export class Sql extends Expression implements Iterable<Text | Identifier | Value> {
    constructor(private readonly expressions: readonly Expression[]) {
        super();
    }

    * [Symbol.iterator](): Iterator<Text | Identifier | Value> {
        for (const expression of this.expressions) {
            if (expression instanceof Text) yield expression;
            if (expression instanceof Identifier) yield expression;
            if (expression instanceof Value) yield expression;
            if (expression instanceof Sql) yield* expression;
        }
    }

    generate(handler: (expression: (Identifier | Value)) => string): string {
        return Array.from(this).map(e => {
            if (e instanceof Text) return e.text;
            if (e instanceof Identifier || e instanceof Value) return handler(e);
        }).join('');
    }

    values(): unknown[] {
        return Array.from(this).flatMap(e => e instanceof Value ? [e.value] : []);
    }
}

/**
 * Create a Sql expression from a number of expressions.
 */
export function sql(...expressions: readonly Expression[]): Sql {
    return new Sql(expressions);
}

/**
 * Create a SQL expression from a template string.
 */
export function SQL(chunks: TemplateStringsArray, ...values: readonly unknown[]): Sql {
    return sql(...(function* () {
        let index = 0;
        for (const chunk of chunks) {
            if (chunk !== '') yield text(chunk);
            if (index < values.length) yield value(values[index]);
            index++;
        }
    })());
}