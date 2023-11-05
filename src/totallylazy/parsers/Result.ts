import {View} from "./View.ts";

export interface Result<A, B> extends Iterable<B> {
    value: B;
    remainder: View<A>;
}