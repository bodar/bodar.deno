import {Compound} from "../template/Compound.ts";
import {empty, text} from "../template/Text.ts";

export class Qualified extends Compound {
    static dot = text(".");

    constructor(public readonly qualifier: string, public readonly name: string, ) {
        super([text(qualifier), Qualified.dot, text(name)], empty);
    }
}