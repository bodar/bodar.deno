import {and, Compound, or} from "../template/Compound.ts";
import {empty, text} from "../template/Text.ts";
import {Expression} from "../template/Expression.ts";

export class WhereClause extends Compound {
    static where = text("where");

    constructor(public readonly expression: Compound) {
        super([WhereClause.where, expression]);
    }

    and(expression: Compound): WhereClause {
        return new WhereClause(and(this.expression, expression));
    }

    or(expression: Compound): WhereClause {
        return new WhereClause(or(this.expression, expression));
    }
}

// TODO: Improve type safety
export function where(...expressions: readonly Expression[]): WhereClause {
    return new WhereClause(new Compound(expressions, empty));
}
