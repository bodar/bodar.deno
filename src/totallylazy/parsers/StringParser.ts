import {Segment} from "../collections/Segment.ts";
import {fail} from "./Failure.ts";
import {Parser} from "./Parser.ts";
import {Result} from "./Result.ts";
import {success} from "./Success.ts";

export class StringParser implements Parser<string, string> {
    constructor(private expected: string) {
    }

    parse(segment: Segment<string>): Result<string, string> {
        const result: string[] = [];
        for (const e of this.expected) {
            if (segment.empty) return fail(this.expected, result.join(''));
            const a = segment.head;
            result.push(a);
            if (e != a) return fail(this.expected, result.toString());
            segment = segment.tail;
        }
        return success(result.join(''), segment);
    }
}

export function string(expected: string): Parser<string, string> {
    return new StringParser(expected);
}