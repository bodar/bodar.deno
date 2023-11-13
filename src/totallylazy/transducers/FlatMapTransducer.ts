import {Mapper} from "../functions/Mapper.ts";
import {Transducer} from "./Transducer.ts";

/**
 * A transducer that flat map the given iterable by the given mapper
 */
export interface FlatMapTransducer<A, B> extends Transducer<A, B> {
    /**
     * The mapper to map by
     */
    readonly mapper: Mapper<A, Iterable<B>>;
}

/**
 * Creates a transducer that flat maps the given iterable by the given mapper
 */
export function flatMap<A, B>(mapper: Mapper<A, Iterable<B>>): FlatMapTransducer<A, B> {
    return Object.assign(function* flatMap(iterable: Iterable<A>) {
        for (const a of iterable) {
            yield* mapper(a);
        }
    }, {
        mapper,
        toString: () => `flatMap(${mapper})`
    });
}

export function isFlatMapTransducer(value: any): value is FlatMapTransducer<any, any> {
    return typeof value === 'function' && value.name === 'flatMap' && Object.hasOwn(value, 'mapper');
}