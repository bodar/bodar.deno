import {Segment} from "../collections/Segment.ts";

export interface Result<A, B> extends Iterable<B> {
    value: B;
    remainder: Segment<A>;
}