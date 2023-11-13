import {Parser} from "./Parser.ts";
import {View} from "./View.ts";
import {result, Result} from "./Result.ts";
import {Mapper} from "../functions/Mapper.ts";
import {map} from "../transducers/MapTransducer.ts";

export class MappingParser<A, B, C> implements Parser<A, C> {
    constructor(private readonly parser: Parser<A, B>,
                private readonly mapper: Mapper<B, C>) {
    }

    parse(input: View<A>): Result<A, C> {
        return result(this.parser.parse(input), map(this.mapper));
    }
}