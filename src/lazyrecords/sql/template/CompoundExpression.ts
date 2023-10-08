import {Expression} from "./Expression.ts";
import {empty, space, Text} from "./Text.ts";
import {Identifier} from "./Identifier.ts";
import {Value} from "./Value.ts";

export class CompoundExpression extends Expression implements Iterable<Text | Identifier | Value> {
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
            if (expression instanceof CompoundExpression) yield* expression;
            if (first) {
                if (this.separator !== empty) yield this.separator;
                first = false;
            }
        }
        if (this.end !== empty) yield this.end;
    }
}