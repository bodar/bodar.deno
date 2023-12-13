import {Parser, parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {between, literal, next, separatedBy, surroundedBy, then, whitespace as ws} from "../parsers/parsers.ts";
import {or} from "../parsers/OrParser.ts";
import {map} from "../transducers/MapTransducer.ts";
import {pattern} from "../parsers/PatternParser.ts";
import {many} from "../parsers/ManyParser.ts";
import {JsonValue} from "./types.ts";
import {triple} from "../parsers/TupleParser.ts";
import {lazy} from "../functions/lazy.ts";
import {eof} from "../parsers/EofParser.ts";
import {until} from "../parsers/UntilParser.ts";
import {any} from "../parsers/AnyParser.ts";
import {optional} from "../parsers/OptionalParser.ts";

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

export class Comment {
    constructor(public value: string) {
    }
}

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

export class Grammar {
    static comment: Parser<string, Comment> = parser(or(
        parser(pattern(/[^\n]*/), between(string('//'), or(string('\n'), eof()))),
        parser(any(), until(string('*/')), between(string('/*'), string('*/')), map(characters => characters.join('')))
    ), map(c => new Comment(c.trim())));

    static whitespace<A>(instance: Parser<string, A>): Parser<string, A> {
        return parser(ws(instance), surroundedBy(parser(Grammar.comment, optional())));
    }

    static null: Parser<string, null> = literal(null);

    static boolean: Parser<string, boolean> = or(literal(true), literal(false));

    static escaped: Parser<string, string> = parser(string('\\'), next(or(
        pattern(/["\\/]/),
        parser(pattern(/[bfnrt]/), map(unescape)),
        parser(pattern(/u[0-9a-fA-F]{4}/), map(u => String.fromCharCode(parseInt(u.slice(1), 16))))
    )));

    static characters: Parser<string, string> = pattern(/[^"\\]+/);

    static string: Parser<string, string> = parser(Grammar.characters, or(Grammar.escaped), many(),
        map(characters => characters.join('')), surroundedBy(string('"')));

    static number: Parser<string, number> = parser(pattern(/[-+eE.\d]+/), map(Number));

    static value: Parser<string, JsonValue> = lazy(() => Grammar.whitespace(or(Grammar.object, Grammar.array, Grammar.string, Grammar.number, Grammar.boolean, Grammar.null)));

    static array: Parser<string, JsonValue[]> = parser(Grammar.value, separatedBy(string(',')),
        between(string('['), string(']')));

    static member: Parser<string, [string, JsonValue]> = parser(triple(Grammar.whitespace(Grammar.string), string(':'), Grammar.value),
        map(([key, , value]) => [key, value]));

    static object: Parser<string, JsonValue> = parser(Grammar.member, separatedBy(string(',')),
        between(string('{'), string('}')), map(Object.fromEntries));

    static custom: Parser<string, any> =
        parser(JsdocGrammar.jsdoc, then(Grammar.value), map(([jsdoc, value]: [Jsdoc, JsonValue]) => {
            const constructor = (globalThis as any)[jsdoc.tags.type!];
            return constructor ? Reflect.construct(constructor, [value]) : value;
        }));
}

