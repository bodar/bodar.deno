import {Parser, parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {between, literal, next, separatedBy, surroundedBy, whitespace} from "../parsers/parsers.ts";
import {or} from "../parsers/OrParser.ts";
import {map} from "../transducers/MapTransducer.ts";
import {pattern} from "../parsers/PatternParser.ts";
import {many} from "../parsers/ManyParser.ts";
import {JsonValue} from "./types.ts";
import {triple} from "../parsers/TupleParser.ts";
import {lazy} from "../functions/lazy.ts";

function unescape(escaped: 'b' | 'n' | 'r' | 't' | 'f'): string {
    switch (escaped) {
        case 'b':
            return '\b';
        case 'n':
            return '\n';
        case 'r':
            return '\r';
        case 't':
            return '\t';
        case 'f':
            return '\f';
        default:
            throw new Error(`Should never happen: ${escaped}`);
    }
}

export class JsonGrammarClass {
    /**
     * Allow whitespace to be overridden in subclasses
     */
    whitespace<A>(instance: Parser<string, A>) {
        return whitespace(instance);
    }

    null: Parser<string, null> = literal(null);

    boolean: Parser<string, boolean> = or(literal(true), literal(false));

    escaped: Parser<string, string> = parser(string('\\'), next(or(
        pattern(/["\\/]/),
        parser(pattern(/[bfnrt]/), map(unescape)),
        parser(pattern(/u[0-9a-fA-F]{4}/), map(u => String.fromCharCode(parseInt(u.slice(1), 16))))
    )));

    characters: Parser<string, string> = pattern(/[^"\\]+/);

    string: Parser<string, string> = parser(this.characters, or(this.escaped), many(),
        map(characters => characters.join('')), surroundedBy(string('"')));

    number: Parser<string, number> = parser(pattern(/[-+eE.\d]+/), map(Number));

    value(): Parser<string, JsonValue> {
        return lazy(() => this.whitespace(or(this.object, this.array, this.string, this.number, this.boolean, this.null)));
    }

    array: Parser<string, JsonValue[]> = parser(this.value(), separatedBy(string(',')),
        between(string('['), string(']')));

    member: Parser<string, [string, JsonValue]> = parser(triple(this.whitespace(this.string), string(':'), this.value()),
        map(([key, , value]) => [key, value]));

    object: Parser<string, JsonValue> = parser(this.member, separatedBy(string(',')),
        between(string('{'), string('}')), map(Object.fromEntries));
}

export const JsonGrammar = new JsonGrammarClass();

