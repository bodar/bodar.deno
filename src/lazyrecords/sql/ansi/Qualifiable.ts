import {Compound} from "../template/Compound.ts";
import {empty, text} from "../template/Text.ts";

export class Qualifiable extends Compound {
    static dot = text(".");

    constructor(public readonly name: string, public readonly qualifier?: string) {
        super(qualifier ? [text(qualifier), Qualifiable.dot, text(name)] : [text(name)], empty);
    }
}