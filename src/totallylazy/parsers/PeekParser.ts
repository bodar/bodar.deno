import {Success, success} from "./Success.ts";
import {Result} from "./Result.ts";
import {View} from "./View.ts";
import {Parser} from "./Parser.ts";

export class PeekParser<A, B> implements Parser<A, B> {
    constructor(private readonly parser: Parser<A, B>) {
    }

    parse(source: View<A>): Result<A, B> {
        const result = this.parser.parse(source);
        return result instanceof Success ? success(result.value, source) : result;
    }
}

export function peek<A, B>(): (parser: Parser<A, B>) => Parser<A, B>;
export function peek<A, B>(parser: Parser<A, B>): Parser<A, B> ;
export function peek<A, B>(parser?: Parser<A, B>): any {
    if (!parser) return peek;
    return new PeekParser(parser);
}