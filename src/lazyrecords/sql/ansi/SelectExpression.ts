import {text} from "../template/Text.ts";
import {SetQuantifier} from "./SetQuantifier.ts";
import {Sql} from "../template/Sql.ts";

export class SelectExpression extends Sql {
    static select = text("select");

    constructor(public readonly setQuantifier: SetQuantifier = SetQuantifier.All) {
        super([SelectExpression.select, setQuantifier], " ");
    }
}

export function select(setQuantifier: SetQuantifier = SetQuantifier.All): SelectExpression {
    return new SelectExpression(setQuantifier);
}