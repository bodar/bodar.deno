import {Parser, parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {next, returns} from "../parsers/parsers.ts";
import {or} from "../parsers/OrParser.ts";
import {map} from "../transducers/MapTransducer.ts";
import {pattern} from "../parsers/PatternParser.ts";

export class Grammar {
    static null: Parser<string, null> = parser(string("null"), returns(null));
    static boolean: Parser<string, boolean> = parser(or(string("true"), string("false")), map(v => v === "true"));

    static escapedCharacter: Parser<string, string> = parser(string('\\'), next(or(pattern(/["\\/bfnrt]/), pattern(/u[0-9a-fA-F]{4}/))));
}