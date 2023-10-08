import {text} from "../template/Text.ts";
import {SetQuantifier} from "./SetQuantifier.ts";
import {Compound} from "../template/Compound.ts";
import {DerivedColumn} from "./DerivedColumn.ts";
import {SelectList} from "./SelectList.ts";
import {FromClause} from "./FromClause.ts";


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

    constructor(public readonly setQuantifier: SetQuantifier = SetQuantifier.All,
                public readonly selectList: SelectList,
                public readonly fromClause: FromClause) {
        super([SelectExpression.select, setQuantifier, selectList, fromClause]);
    }
}

export function select(setQuantifier: SetQuantifier = SetQuantifier.All,
                       selectList: DerivedColumn[],
                       fromClause: FromClause): SelectExpression {
    return new SelectExpression(setQuantifier, new SelectList(selectList), fromClause);
}

