import {Segment} from "../collections/Segment.ts";
import {Result} from "./Result.ts";

export interface Parser<A, B> {
    parse(segment: Segment<A>): Result<A, B>;
}

