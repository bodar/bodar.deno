import {Expression} from "./Expression.ts";

/**
 * A raw text expression. Will not have any placeholders or values
 *
 * Does not need to be escaped as this will be done by the specific database function.
 */
export class Text extends Expression {
    constructor(public readonly text: string) {
        super();
    }
}

/**
 * Create a Text expression from a string.
 */
export function text(text: string): Text {
    return new Text(text);
}

/**
 * Alias for text.
 */
export const raw = text;
