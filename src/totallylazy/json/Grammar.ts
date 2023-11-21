import {Parser, parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {next, returns, surroundedBy} from "../parsers/parsers.ts";
import {or} from "../parsers/OrParser.ts";
import {map} from "../transducers/MapTransducer.ts";
import {pattern} from "../parsers/PatternParser.ts";
import {many} from "../parsers/ManyParser.ts";

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
    static null: Parser<string, null> = parser(string("null"), returns(null));

    static boolean: Parser<string, boolean> = parser(or(string("true"), string("false")), map(v => v === "true"));

    static escapedCharacter: Parser<string, string> = parser(string('\\'), next(or(
        pattern(/["\\/]/),
        parser(pattern(/[bfnrt]/), map(unescape)),
        parser(pattern(/u[0-9a-fA-F]{4}/), map(u => String.fromCharCode(parseInt(u.slice(1), 16))))
        )));

    static anyCodePoint: Parser<string, string> = pattern(/[^"\\]/);

    static string: Parser<string, string> = parser(many(or(Grammar.escapedCharacter, Grammar.anyCodePoint)),
        map(characters => characters.join('')), surroundedBy(string('"')));
}

