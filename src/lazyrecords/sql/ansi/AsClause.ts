import {Compound} from "../template/Compound.ts";
import {text} from "../template/Text.ts";

export class AsClause extends Compound {
    static as = text("as");

    constructor(public readonly alias: string) {
        super([AsClause.as, text(alias)]);
    }
}