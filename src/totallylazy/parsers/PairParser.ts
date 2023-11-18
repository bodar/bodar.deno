import {Parser, parser} from "./Parser.ts";
import {View} from "./View.ts";
import {Result} from "./Result.ts";
import {Failure} from "./Failure.ts";
import {success} from "./Success.ts";
import {map} from "../transducers/MapTransducer.ts";

export class PairParser<A, B, C> implements Parser<A, [B, C]> {
    constructor(private readonly first: Parser<A, B>,
                private readonly second: Parser<A, C>) {
    }

    parse(input: View<A>): Result<A, [B, C]> {
        const b = this.first.parse(input);
        if (b instanceof Failure) return b;

        const c = this.second.parse(b.remainder);
        if (c instanceof Failure) return c;

        return success([b.value, c.value], c.remainder);
    }
}

export function pair<A, B, C>(first: Parser<A, B>, second: Parser<A, C>): Parser<A, [B, C]> {
    return new PairParser(first, second);
}

export function then<A, B, C>(second: Parser<A, C>): (first: Parser<A, B>) => Parser<A, [B, C]> {
    return first => pair(first, second);
}

export function followedBy<A, B>(second: Parser<A, any>): (first: Parser<A, B>) => Parser<A, B> {
    return first => parser(pair(first, second), map(([b, _]:[b:B, _:any]) => b));
}

export function precededBy<A, B>(second: Parser<A, any>): (first: Parser<A, B>) => Parser<A, B> {
    return first => parser(pair(second, first), map(([_, b]:[_:any, b:B]) => b));
}