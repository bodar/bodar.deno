import {Result} from "./Result.ts";
import {Segment} from "../collections/Segment.ts";

export class Success<A, B> implements Result<A, B> {
    constructor(public value: B, public remainder: Segment<A>) {
    }
}

export function success<A, B>(value: B, remainder: Segment<A>): Result<A, B> {
    return new Success(value, remainder);
}