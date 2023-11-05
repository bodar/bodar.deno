import {Result} from "./Result.ts";
import {View} from "./View.ts";

export interface Parser<A, B> {
    parse(input: View<A>): Result<A, B>;
}

