import {text} from "../template/Text.ts";
import {SetQuantifier} from "./SetQuantifier.ts";
import {Compound} from "../template/Compound.ts";


/*
    TextOnlyExpression select = textOnly("select");
    Option<SetQuantifier> setQuantifier();
    SelectList selectList();
    FromClause fromClause();
    Option<WhereClause> whereClause();
    Option<OrderByClause> orderByClause();
    Option<GroupByClause> groupByClause();
    Option<OffsetClause> offsetClause();
    Option<FetchClause> fetchClause();
 */

export class SelectExpression extends Compound {
    static select = text("select");

    constructor(public readonly setQuantifier: SetQuantifier = SetQuantifier.All) {
        super([SelectExpression.select, setQuantifier]);
    }
}

export function select(setQuantifier: SetQuantifier = SetQuantifier.All): SelectExpression {
    return new SelectExpression(setQuantifier);
}

// export class DerivedColumn extends Sql {
//     constructor(public readonly expression: Expression, public readonly alias: string) {
//         super([expression, text("as"), alias], " ");
//     }
// }
//
// export class AsClause extends Sql {
//     constructor(public readonly expression: Expression, public readonly alias: string) {
//         super([expression, text("as"), alias], " ");
//     }
// }