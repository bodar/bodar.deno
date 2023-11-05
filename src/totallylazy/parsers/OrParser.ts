import {Parser} from "./Parser.ts";
import {Result} from "./Result.ts";
import {fail, Failure} from "./Failure.ts";
import {View} from "./View.ts";

export class OrParser<A, B> implements Parser<A, B> {
    constructor(private readonly parsers: Parser<A, B>[]) {
    }

    parse(segment: View<A>): Result<A, B> {
        for (const parser of this.parsers) {
            const result = parser.parse(segment);
            if (!(result instanceof Failure)) return result;
        }
        return fail(this.parsers, segment);
    }
}

export function or<A, B>(...parsers: Parser<A, B>[]): Parser<A, B> {
    return new OrParser(parsers);
}