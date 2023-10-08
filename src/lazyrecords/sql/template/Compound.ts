import {Expression} from "./Expression.ts";
import {empty, space, text, Text} from "./Text.ts";
import {id, Identifier} from "./Identifier.ts";
import {value, Value} from "./Value.ts";

export class Compound extends Expression implements Iterable<Text | Identifier | Value> {
    constructor(public readonly expressions: readonly Expression[],
                public separator: Text = space,
                public start: Text = empty,
                public end: Text = start) {
        super();
    }

    * [Symbol.iterator](): Iterator<Text | Identifier | Value> {
        if (this.start !== empty) yield this.start;
        let first = true;
        for (const expression of this.expressions) {
            if (expression instanceof Text) yield expression;
            if (expression instanceof Identifier) yield expression;
            if (expression instanceof Value) yield expression;
            if (expression instanceof Compound) yield* expression;
            if (first) {
                if (this.separator !== empty) yield this.separator;
                first = false;
            }
        }
        if (this.end !== empty) yield this.end;
    }
}

/**
 * Create multiple Identifiers from an array of strings.
 *
 * With optional separator. Defaults to ', '.
 */
export function ids(identifiers: readonly string[]): Compound {
    return new Compound(identifiers.map(id), text(', '));
}


export function values(values: unknown[] ): Compound {
    return new Compound(values.map(value), text(', '));
}

export const spread = values;