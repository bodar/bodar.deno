import {Predicate} from "../predicates/Predicate.ts";
import {Result} from "./Result.ts";
import {fail} from "./Failure.ts";
import {success} from "./Success.ts";
import {Parser} from "./Parser.ts";
import {View} from "./View.ts";

export class PredicatesParser<A> implements Parser<A, A[]> {
    constructor(private predicates: Predicate<A>[]) {
    }

    parse(input: View<A>): Result<A, A[]> {
        const result: A[] = [];
        for (const predicate of this.predicates) {
            if (input.isEmpty()) return fail(predicate, "[EOF]");
            const a = input.at(0);
            if (!(a && predicate(a))) return fail(predicate, a);
            result.push(a);
            input = input.slice(1)
        }
        return success(result, input);
    }
}

export function matches<A>(...predicates: Predicate<A>[]): Parser<A, A[]> {
    return new PredicatesParser(predicates);
}