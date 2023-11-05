import {Failure} from "./Failure.ts";
import {Parser} from "./Parser.ts";
import {Result} from "./Result.ts";
import {success} from "./Success.ts";
import {View} from "./View.ts";

export class OptionalParser<A, B> implements Parser<A, B | undefined> {
    constructor(private readonly parser: Parser<A, B>) {
    }

    parse(input: View<A>): Result<A, B | undefined> {
        const result = this.parser.parse(input);
        if (result instanceof Failure) return success(undefined, input);
        return success(result.value, result.remainder);
    }
}

export function optional<A, B>(parser: Parser<A, B>): Parser<A, B | undefined> {
    return new OptionalParser(parser);
}