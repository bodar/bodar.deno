import {Parser} from "./Parser.ts";
import {View} from "./View.ts";
import {Result} from "./Result.ts";
import {Failure} from "./Failure.ts";
import {success} from "./Success.ts";

export class TripleParser<A, B, C, D> implements Parser<A, [B, C, D]> {
    constructor(private readonly first: Parser<A, B>,
                private readonly second: Parser<A, C>,
                private readonly third: Parser<A, D>,
                ) {
    }

    parse(input: View<A>): Result<A, [B, C, D]> {
        const b = this.first.parse(input);
        if (b instanceof Failure) return b;

        const c = this.second.parse(b.remainder);
        if (c instanceof Failure) return c;

        const d = this.third.parse(c.remainder);
        if (d instanceof Failure) return d;

        return success([b.value, c.value, d.value], d.remainder);
    }
}

export function triple<A, B, C, D>(first: Parser<A, B>, second: Parser<A, C>, third: Parser<A, D>): Parser<A, [B, C, D]> {
    return new TripleParser(first, second, third);
}