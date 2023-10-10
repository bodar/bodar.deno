import {Compound} from "../template/Compound.ts";
import {text} from "../template/Text.ts";
import {Table} from "./Table.ts";
import {Aliased} from "./Aliased.ts";

export class FromClause extends Compound {
    static from = text("from");

    constructor(public readonly table: Table | Aliased<Table>) {
        super([FromClause.from, table]);
    }
}

export function from(tableReference: Table | Aliased<Table>): FromClause {
    return new FromClause(tableReference);
}