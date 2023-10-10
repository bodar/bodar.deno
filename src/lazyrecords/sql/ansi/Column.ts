import {Qualified} from "./Qualified.ts";
import {Text} from "../template/Text.ts";
import {Aliasable} from "./Aliasable.ts";
import {id} from "../template/Identifier.ts";

export class Column extends Aliasable {
}

export function column(name: string | Text | Qualified): Column {
    return new Column(typeof name === "string" ? id(name) : name);
}

