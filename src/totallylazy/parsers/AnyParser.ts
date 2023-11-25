import {Parser} from "./Parser.ts";
import {success} from "./Success.ts";
import {fail} from "./Failure.ts";
import {Result} from "./Result.ts";
import {View} from "./View.ts";

export class AnyParser<A> implements Parser<A,A>{
    parse(input: View<A>): Result<A, A> {
        if (input.isEmpty()) return fail("Expected any", input);
        return success(input.at(0)!, input.slice(1));
    }
}

export function any<A>(): Parser<A, A> {
    return new AnyParser();
}