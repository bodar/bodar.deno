import {Compound} from "../template/Compound.ts";
import {text} from "../template/Text.ts";

import {TableReference} from "./TableReference.ts";

export class FromClause extends Compound {
    static from = text("from");

    constructor(public readonly tableReference: TableReference) {
        super([FromClause.from, tableReference]);
    }
}

export function from(tableReference: TableReference): FromClause {
    return new FromClause(tableReference);
}