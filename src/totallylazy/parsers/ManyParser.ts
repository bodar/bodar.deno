import {Parser} from "./Parser.ts";
import {Segment} from "../collections/Segment.ts";
import {Result} from "./Result.ts";
import {Failure} from "./Failure.ts";
import {success} from "./Success.ts";

export class ManyParser<A, B> implements Parser<A, B[]> {
    constructor(private parser: Parser<A, B>) {
    }

    parse(segment: Segment<A>): Result<A, B[]> {
        const list: B[] = [];

        while (!segment.empty) {
            const result = this.parser.parse(segment);
            if (result instanceof Failure) break;
            list.push(result.value);
            segment = result.remainder;
        }
        return success(list, segment);
    }
}

export function many<A, B>(parser: Parser<A, B>): Parser<A, B[]> {
    return new ManyParser(parser);
}