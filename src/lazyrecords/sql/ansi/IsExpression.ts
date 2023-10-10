import {text} from "../template/Text.ts";
import {Value} from "../template/Value.ts";
import {PredicateExpression} from "./PredicateExpression.ts";

export class IsExpression extends PredicateExpression {
    static is = text("is");

    constructor(public readonly value: Value) {
        super([IsExpression.is, value]);
    }
}

export function is(instance: unknown): IsExpression {
    return new IsExpression(new Value(instance));
}