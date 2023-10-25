import {Predicate} from "../predicates/Predicate.ts";
import {Segment} from "../collections/Segment.ts";
import {Result} from "./Result.ts";
import {fail} from "./Failure.ts";
import {success} from "./Success.ts";
import {Parser} from "./Parser.ts";

export class PredicateParser<A> implements Parser<A, A> {
    constructor(private predicate: Predicate<A>) {
    }

    parse(segment: Segment<A>): Result<A, A> {
        if (segment.empty) return fail(this.predicate, "[EOF]");
        const c = segment.head;
        return this.predicate(c) ?
            success(c, segment.tail) :
            fail(this.predicate, c);
    }
}

