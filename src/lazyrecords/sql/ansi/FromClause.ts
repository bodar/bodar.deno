import {Compound} from "../template/Compound.ts";
import {text} from "../template/Text.ts";
import {TableReference} from "./Table.ts";

export class FromClause extends Compound {
    static from = text("from");

    constructor(public readonly table: TableReference) {
        super([FromClause.from, table]);
    }
}

export function from(tableReference: TableReference): FromClause {
    return new FromClause(tableReference);
}