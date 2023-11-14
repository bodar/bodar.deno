import {Parser} from "./Parser.ts";
import {Result} from "./Result.ts";
import {fail} from "./Failure.ts";
import {success} from "./Success.ts";
import {View} from "./View.ts";

export interface Matcher {
    [Symbol.match](string: string): RegExpMatchArray | null;
}

export class PatternParser implements Parser<string, string> {
    constructor(private readonly matcher: Matcher) {
    }

    parse(input: View<string>): Result<string, string> {
        const source = String(input.toSource());
        const match = this.matcher[Symbol.match](source);
        if (match === null) return fail(this.matcher, source);
        const [result] = match;
        return success(result, input.slice(result.length));
    }
}

export function pattern(matcher: Matcher): Parser<string, string> {
    return new PatternParser(matcher);
}

