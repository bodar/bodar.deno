import {Compound} from "../template/Compound.ts";
import {TableName} from "./ColumnReference.ts";
import {AsClause} from "./AsClause.ts";

export class TablePrimary extends Compound {
    constructor(public readonly expression: TableName, public readonly alias?: AsClause) {
        super(alias ? [expression, alias] : [expression]);
    }
}
