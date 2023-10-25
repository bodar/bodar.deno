import {Segment} from "../collections/Segment.ts";
import {Failure} from "./Failure.ts";
import {Parser} from "./Parser.ts";
import {Result} from "./Result.ts";
import {success} from "./Success.ts";

export class OptionalParser<A, B> implements Parser<A, B | undefined> {
    constructor(private readonly parser: Parser<A, B>) {
    }

    parse(segment: Segment<A>): Result<A, B | undefined> {
        const result = this.parser.parse(segment);
        if (result instanceof Failure) return success(undefined, segment);
        return success(result.value, result.remainder);
    }
}

export function optional<A, B>(parser: Parser<A, B>): Parser<A, B | undefined> {
    return new OptionalParser(parser);
}