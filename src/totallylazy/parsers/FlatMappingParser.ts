import {Parser} from "./Parser.ts";
import {Mapper} from "../functions/Mapper.ts";
import {result, Result} from "./Result.ts";
import {View} from "./View.ts";
import {flatMap} from "../transducers/FlatMapTransducer.ts";

export class FlatMappingParser<A, B, C> implements Parser<A, C> {
    constructor(private readonly parser: Parser<A, B>,
                private readonly mapper: Mapper<B, Result<A, C>>) {
    }

    parse(input: View<A>): Result<A, C> {
        return result(this.parser.parse(input), flatMap(this.mapper));
    }
}