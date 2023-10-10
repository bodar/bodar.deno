import {Qualified} from "./Qualified.ts";
import {text, Text} from "../template/Text.ts";
import {Aliasable} from "./Aliasable.ts";

export class Column extends Aliasable {
}

export function column(name: string | Text | Qualified): Column {
    return new Column(typeof name === "string" ? text(name) : name);
}

