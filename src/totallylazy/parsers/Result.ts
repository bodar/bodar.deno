import {Segment} from "../collections/Segment.ts";

export interface Result<A, B> {
    value: B;
    remainder: Segment<A>;
}