import {text} from "../template/Text.ts";
import {SetQuantifier} from "./SetQuantifier.ts";
import {Compound, list} from "../template/Compound.ts";
import {FromClause} from "./FromClause.ts";
import {Column} from "./Column.ts";
import {Aliased} from "./Aliased.ts";
import {WhereClause} from "./WhereClause.ts";
import {Expression} from "../template/Expression.ts";


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

export type ColumnReference = Column | Aliased<Column>;
export type SelectList = (ColumnReference)[] | (ColumnReference);

export class SelectExpresssion extends Compound {
    static select = text("select");

    constructor(public readonly setQuantifier: SetQuantifier,
                public readonly selectList: SelectList,
                public readonly fromClause: FromClause,
                public readonly whereClause?: WhereClause) {
        super([SelectExpresssion.select,
            setQuantifier,
            Array.isArray(selectList) ? list(selectList) : selectList,
            fromClause,
            whereClause]
            .filter(Boolean) as Expression[]);
    }
}

export function select(setQuantifier: SetQuantifier,
                       selectList: SelectList,
                       fromClause: FromClause,
                       whereClause?: WhereClause): SelectExpresssion {
    return new SelectExpresssion(setQuantifier, selectList, fromClause, whereClause);
}

