import {Parser} from "./Parser.ts";
import {Result} from "./Result.ts";
import {Failure} from "./Failure.ts";
import {success} from "./Success.ts";
import {View} from "./View.ts";

export class ManyParser<A, B> implements Parser<A, B[]> {
    constructor(private parser: Parser<A, B>) {
    }

    parse(input: View<A>): Result<A, B[]> {
        const list: B[] = [];

        while (!input.isEmpty()) {
            const result = this.parser.parse(input);
            if (result instanceof Failure) break;
            list.push(result.value);
            input = result.remainder;
        }
        return success(list, input);
    }
}

export function many<A, B>(parser: Parser<A, B>): Parser<A, B[]> {
    return new ManyParser(parser);
}