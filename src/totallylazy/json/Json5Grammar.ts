import {parser, Parser} from "../parsers/Parser.ts";
import {string} from "../parsers/StringParser.ts";
import {or} from "../parsers/OrParser.ts";
import {pattern} from "../parsers/PatternParser.ts";
import {between, surroundedBy, then} from "../parsers/parsers.ts";
import {eof} from "../parsers/EofParser.ts";
import {any} from "../parsers/AnyParser.ts";
import {until} from "../parsers/UntilParser.ts";
import {map} from "../transducers/MapTransducer.ts";
import {optional} from "../parsers/OptionalParser.ts";
import {JsonGrammarClass} from "./JsonGrammar.ts";
import {Jsdoc, JsdocGrammar} from "./JsdocGrammar.ts";
import {JsonValue} from "./types.ts";
import { lazy } from "../functions/lazy.ts";

export class Comment {
    constructor(public value: string) {
    }
}

export class Json5GrammarClass extends JsonGrammarClass {
    comment: Parser<string, Comment> = parser(or(
        parser(pattern(/[^\n]*/), between(string('//'), or(string('\n'), eof()))),
        parser(any(), until(string('*/')), between(string('/*'), string('*/')), map(characters => characters.join('')))
    ), map(c => new Comment(c.trim())));

    whitespace<A>(instance: Parser<string, A>) {
        return parser(super.whitespace(instance), surroundedBy(parser(this.comment, optional())));
    }

    value(): Parser<string, JsonValue | any> {
        return lazy(() => or(this.custom(), super.value()));
    }

    custom(): Parser<string, any> {
        return parser(JsdocGrammar.jsdoc, then(this.value()), map(([jsdoc, value]: [Jsdoc, JsonValue]) => {
            const constructor = (globalThis as any)[jsdoc.tags.type!];
            return constructor ? Reflect.construct(constructor, [value]) : value;
        }));
    }
}

export const Json5Grammar = new Json5GrammarClass();