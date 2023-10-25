import {Result} from "./Result.ts";

export class Failure<A, B> implements Result<A, B> {
    constructor(public expected: any, public actual: any) {
    }

    get value(): never {
        throw new Error(this.toString());
    }

    get remainder(): never {
        throw new Error(this.toString());
    }

    toString() {
        return "Expected " + this.expected + " but was " + this.actual;
    }

    * [Symbol.iterator](): Iterator<B> {
    }
}

export function fail(expected: any, actual: any): Result<any, any> {
    return new Failure(expected, actual);
}