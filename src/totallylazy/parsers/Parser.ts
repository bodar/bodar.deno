import {result, Result} from "./Result.ts";
import {View} from "./View.ts";
import {Transducer} from "../transducers/Transducer.ts";

export interface Parser<A, B> {
    parse(input: View<A>): Result<A, B>;
}

export class TransducingParser<A, B> implements Parser<A, B> {
    constructor(private readonly parser: Parser<any, any>,
                private readonly transducers: readonly Transducer<any, any>[]) {
    }

    parse(input: View<A>): Result<A, B> {
        return result(this.parser.parse(input), ...this.transducers);
    }
}


export function parser<A, B>(a: Parser<A, B>): Parser<A, B>;
export function parser<A, B, C>(a: Parser<A, B>, b: Transducer<B, C>): Parser<A, C>;
export function parser<A, B, C, D>(a: Parser<A, B>, b: Transducer<B, C>, c: Transducer<C, D>): Parser<A, D>;
export function parser<A, B, C, D, E>(a: Parser<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>): Parser<A, E>;
export function parser<A, B, C, D, E, F>(a: Parser<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, f: Transducer<E, F>): Parser<A, F>;
export function parser<A, B, C, D, E, F, G>(a: Parser<A, B>, b: Transducer<B, C>, c: Transducer<C, D>, d: Transducer<D, E>, f: Transducer<E, F>, g: Transducer<F, G>): Parser<A, G>;
export function parser(source: Parser<any, any>, ...transducers: readonly Transducer<any, any>[]): Parser<any, any>;
export function parser(source: Parser<any, any>, ...transducers: readonly Transducer<any, any>[]): Parser<any, any> {
    return new TransducingParser(source, transducers);
}

