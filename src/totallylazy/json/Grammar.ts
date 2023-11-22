import {Parser, parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {literal, next, surroundedBy} from "../parsers/parsers.ts";
import {or} from "../parsers/OrParser.ts";
import {map} from "../transducers/MapTransducer.ts";
import {pattern} from "../parsers/PatternParser.ts";
import {many} from "../parsers/ManyParser.ts";
import {JsonValue} from "./types.ts";
import {triple} from "../parsers/TupleParser.ts";

function unescape(escaped: 'b' | 'n' | 'r'| 't' | 'f'): string {
    switch (escaped) {
        case 'b': return '\b';
        case 'n': return '\n';
        case 'r': return '\r';
        case 't': return '\t';
        case 'f': return '\f';
        default: throw new Error(`Should never happen: ${escaped}`);
    }
}


export class Grammar {
    static null: Parser<string, null> = literal(null);

    static boolean: Parser<string, boolean> = or(literal(true), literal(false));

    static escaped: Parser<string, string> = parser(string('\\'), next(or(
        pattern(/^["\\/]/),
        parser(pattern(/^[bfnrt]/), map(unescape)),
        parser(pattern(/^u[0-9a-fA-F]{4}/), map(u => String.fromCharCode(parseInt(u.slice(1), 16))))
        )));

    static characters: Parser<string, string> = pattern(/^[^"\\]+/);

    static string: Parser<string, string> = parser(many(or(Grammar.escaped, Grammar.characters)),
        map(characters => characters.join('')), surroundedBy(string('"')));

    static number: Parser<string, number> = parser(pattern(/^[-+eE.\d]+/), map(Number));

    static value: Parser<string, JsonValue> = or<string, JsonValue>(/*Grammar.object, Grammar.array,*/ Grammar.string, Grammar.number, Grammar.boolean, Grammar.null);

    static member: Parser<string, [string, JsonValue]> = parser(triple(Grammar.string, string(':'), Grammar.value), map(([key, , value]) => [key, value]));
}

