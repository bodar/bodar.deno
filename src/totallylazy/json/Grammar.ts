import {Parser, parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {returns} from "../parsers/parsers.ts";
import {or} from "../parsers/OrParser.ts";
import {map} from "../transducers/MapTransducer.ts";

export class Grammar {
    static null: Parser<string, null> = parser(string("null"), returns(null));
    static boolean: Parser<string, boolean> = parser(or(string("true"), string("false")), map(v => v === "true"));
}