import {Parser} from "./Parser.ts";
import {Result} from "./Result.ts";
import {fail} from "./Failure.ts";
import {success} from "./Success.ts";
import {View} from "./View.ts";

export class PatternParser implements Parser<string, string> {
    constructor(private readonly pattern: RegExp) {
    }

    parse(input: View<string>): Result<string, string> {
        const source = String(input.toSource());
        const match = source.match(this.pattern);
        if (match == null) return fail(this.pattern, source);
        const result = match[0];
        return success(result, input.slice(result.length));
    }
}

