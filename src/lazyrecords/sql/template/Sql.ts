import {text, Text} from "./Text.ts";
import {value, Value} from "./Value.ts";
import {id, Identifier} from "./Identifier.ts";
import {escapeIdentifier, escapeLiteral} from "../ansi/escape.ts";
import {Expression} from "./Expression.ts";

/**
 * A Sql expression.
 */
export class Sql extends Expression implements Iterable<Text | Identifier | Value> {
    constructor(private readonly expressions: readonly Expression[],
                private separator: string = "",
                private start: string = "",
                private end: string = start) {
        super();
    }

    * [Symbol.iterator](): Iterator<Text | Identifier | Value> {
        if (this.start !== '') yield text(this.start);
        let first = true;
        for (const expression of this.expressions) {
            if (expression instanceof Text) yield expression;
            if (expression instanceof Identifier) yield expression;
            if (expression instanceof Value) yield expression;
            if (expression instanceof Sql) yield* expression;
            if (first) {
                if (this.separator !== '') yield text(this.separator);
                first = false;
            }
        }
        if (this.end !== '') yield text(this.end);
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

    toString(): string {
        return this.generate(e => {
            if (e instanceof Identifier) return escapeIdentifier(e.identifier);
            if (e instanceof Value) return typeof e.value === 'string' ? escapeLiteral(e.value) : String(e.value);
            return '';
        });
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


/**
 * Create multiple Identifiers from an array of strings.
 *
 * With optional separator. Defaults to ', '.
 */
export function ids(identifiers: readonly string[]): Sql {
    return sql(identifiers.map(id), ', ');
}


export function values(values: unknown[] ): Sql {
    return sql(values.map(value), ', ');
}

export const spread = values;