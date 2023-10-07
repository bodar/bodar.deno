import {Expression} from "./Expression.ts";
import {sql, Sql} from "./Sql.ts";
import {text} from "./Text.ts";

/**
 * An identifier is a name that is used to identify a variable, function, table, or any other object in a database.
 */
export class Identifier extends Expression {
    constructor(public readonly identifier: string) {
        super();
    }
}

/**
 * Create an Identifier from a string.
 */
export function id(identifier: string): Identifier {
    return new Identifier(identifier);
}

/**
 * Create multiple Identifiers from an array of strings.
 *
 * With optional separator. Defaults to ', '.
 */
export function ids(identifiers: readonly string[], separator: string = ', '): Sql {
    return sql(...identifiers.flatMap((v, i) => i > 0 ? [text(separator), id(v)] : [id(v)]));
}
