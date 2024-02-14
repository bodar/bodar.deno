import {Predicate} from "../predicates/Predicate.ts";
import {Result} from "./Result.ts";
import {fail} from "./Failure.ts";
import {success} from "./Success.ts";
import {Parser} from "./Parser.ts";
import {View} from "./View.ts";

export class PredicatesParser<A> implements Parser<A, A[]> {
    constructor(private predicate: Predicate<A>) {
    }

    parse(input: View<A>): Result<A, A[]> {
        const result: A[] = [];
        if (input.isEmpty()) return fail(this.predicate, "[EOF]");
        const a = input.at(0);
        if (!(a && this.predicate(a))) return fail(this.predicate, a);
        result.push(a);
        input = input.slice(1)
        return success(result, input);
    }
}

export function matches<A>(predicate: Predicate<A>): Parser<A, A[]> {
    return new PredicatesParser(predicate);
}