import {parser, Parser} from "./Parser.ts";
import {map} from "../transducers/MapTransducer.ts";
import {pair, triple} from "./TupleParser.ts";

export function then<A, B, C>(second: Parser<A, C>): (first: Parser<A, B>) => Parser<A, [B, C]> {
    return first => pair(first, second);
}

export function followedBy<A, B>(second: Parser<A, any>): (first: Parser<A, B>) => Parser<A, B> {
    return first => parser(pair(first, second), map(([b, _]) => b));
}

export function precededBy<A, B>(second: Parser<A, any>): (first: Parser<A, B>) => Parser<A, B> {
    return first => parser(pair(second, first), map(([_, b]) => b));
}

export function between<A, B>(before: Parser<A, any>, after: Parser<A, any> = before): (first: Parser<A, B>) => Parser<A, B> {
    return instance => parser(triple(before, instance, after), map(([_, b, __]) => b));
}

export function surroundedBy<A, B>(second: Parser<A, any>): (first: Parser<A, B>) => Parser<A, B> {
    return between(second);
}

export function returns<A, T>(value: T): (first: Parser<A, any>) => Parser<A, T> {
    return instance => parser(instance, map(() => value));
}

export function ignore<A>(): (first: Parser<A, any>) => Parser<A, undefined> {
    return returns(undefined);
}