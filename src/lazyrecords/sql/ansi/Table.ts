import {Text} from "../template/Text.ts";
import {Qualified} from "./Qualified.ts";
import {Aliasable} from "./Aliasable.ts";
import {id} from "../template/Identifier.ts";

export class Table extends Aliasable {
}

export function table(name: string | Text | Qualified): Table {
    return new Table(typeof name === "string" ? id(name) : name);
}