import {Predicate} from "../predicates/Predicate.ts";
import {Result} from "./Result.ts";
import {fail} from "./Failure.ts";
import {success} from "./Success.ts";
import {Parser} from "./Parser.ts";
import {View} from "./View.ts";

export class PredicateParser<A> implements Parser<A, A> {
    constructor(private predicate: Predicate<A>) {
    }

    parse(input: View<A>): Result<A, A> {
        if (input.isEmpty()) return fail(this.predicate, "[EOF]");
        const c = input.at(0);
        return c && this.predicate(c) ?
            success(c, input.slice(1)) :
            fail(this.predicate, c);
    }
}

