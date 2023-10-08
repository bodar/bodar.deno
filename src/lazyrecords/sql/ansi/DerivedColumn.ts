import {Compound} from "../template/Compound.ts";
import {ColumnReference} from "./ColumnReference.ts";
import {AsClause} from "./AsClause.ts";

export class DerivedColumn extends Compound {
    constructor(public readonly expression: ColumnReference, public readonly alias?: AsClause) {
        super(alias ? [expression, alias] : [expression]);
    }
}