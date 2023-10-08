import {Compound} from "../template/Compound.ts";
import {DerivedColumn} from "./DerivedColumn.ts";
import {text} from "../template/Text.ts";

export class SelectList extends Compound {
    constructor(public readonly derivedColumns: DerivedColumn[]) {
        super(derivedColumns, text(", "));
    }
}