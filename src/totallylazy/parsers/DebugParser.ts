import {Parser} from "./Parser.ts";
import {View} from "./View.ts";
import {Result} from "./Result.ts";

export class DebugParser<A,B> implements Parser<A, B> {
    constructor(private readonly parser: Parser<A, B>,
                private readonly name:string,
                private readonly log:(...data: any[]) => void = console.log) {
    }

    parse(input: View<A>): Result<A, B>{
        const result = this.parser.parse(input);
        this.log(this.name, result.toString());
        return result;
    }
}