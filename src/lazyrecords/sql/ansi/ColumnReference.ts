import {DerivedColumn} from "./DerivedColumn.ts";
import {TablePrimary} from "./TablePrimary.ts";
import {Qualifiable} from "./Qualifiable.ts";

export class ColumnReference extends Qualifiable {
    constructor(name: string, qualifier?: string) {
        super(name, qualifier);
    }
}

export function column(name: string): DerivedColumn {
    return new DerivedColumn(new ColumnReference(name));
}

export class TableName extends Qualifiable {
    constructor(name: string, qualifier?: string) {
        super(name, qualifier);
    }
}

export function table(name: string): TablePrimary {
    return new TablePrimary(new TableName(name));
}