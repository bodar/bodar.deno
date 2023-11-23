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


export class Grammar {
    static null: Parser<string, null> = literal(null);

    static boolean: Parser<string, boolean> = or(literal(true), literal(false));

    static escaped: Parser<string, string> = parser(string('\\'), next(or(
        pattern(/["\\/]/),
        parser(pattern(/[bfnrt]/), map(unescape)),
        parser(pattern(/u[0-9a-fA-F]{4}/), map(u => String.fromCharCode(parseInt(u.slice(1), 16))))
    )));

    static characters: Parser<string, string> = pattern(/[^"\\]+/);

    static string: Parser<string, string> = parser(many(or(Grammar.escaped, Grammar.characters)),
        map(characters => characters.join('')), surroundedBy(string('"')));

    static number: Parser<string, number> = parser(pattern(/[-+eE.\d]+/), map(Number));

    static value: Parser<string, JsonValue> = lazy(() => or(Grammar.object, Grammar.array, Grammar.string, Grammar.number, Grammar.boolean, Grammar.null));

    static member: Parser<string, [string, JsonValue]> = parser(triple(whitespace(Grammar.string), string(':'), whitespace(Grammar.value)),
        map(([key, , value]) => [key, value]));

    static separator: Parser<string, string> = string(',');

    static array: Parser<string, JsonValue[]> = parser(whitespace(Grammar.value), separatedBy(Grammar.separator),
        between(whitespace(string('[')), whitespace(string(']'))));

    static object: Parser<string, JsonValue> = parser(Grammar.member, separatedBy(Grammar.separator),
        between(whitespace(string('{')), whitespace(string('}'))), map(members => Object.fromEntries(members)));
}

