import {text, Text} from "../template/Text.ts";
import {Qualified} from "./Qualified.ts";
import {Aliasable} from "./Aliasable.ts";

export class Table extends Aliasable {
}

export function table(name: string | Text | Qualified): Table {
    return new Table(typeof name === "string" ? text(name) : name);
}