import {parser, Parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {pattern} from "../parsers/PatternParser.ts";
import {between, next, then, whitespace as ws} from "../parsers/parsers.ts";
import {many} from "../parsers/ManyParser.ts";
import {map} from "../transducers/MapTransducer.ts";

export interface JsdocTags {
    type: string;
}

export class Jsdoc {
    constructor(public tags: Partial<JsdocTags>) {
    }
}

export class JsdocGrammar {
    static typeExpression: Parser<string, string> = parser(pattern(/[a-zA-Z]+/), between(string('{'), string('}')));

    static type: Parser<string, ['type', string]> = parser(ws(parser(string('@'), next(string('type')))), then(ws(JsdocGrammar.typeExpression)));

    static tags: Parser<string, Partial<JsdocTags>> = parser(JsdocGrammar.type, many(), map(Object.fromEntries));

    static jsdoc: Parser<string, Jsdoc> = parser(JsdocGrammar.tags, between(string('/**'), string('*/')), map(c => new Jsdoc(c)));
}