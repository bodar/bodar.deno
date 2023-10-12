import {Mapper} from "../functions/Mapper.ts";
import {Transducer} from "./Transducer.ts";

/**
 * A transducer that maps the given iterable by the given mapper
 */
export interface MapTransducer<A, B> extends Transducer<A, B> {
    /**
     * The mapper to map by
     */
    readonly mapper: Mapper<A, B>;
}

/**
 * Creates a transducer that maps the given iterable by the given mapper
 */
export function map<A, B>(mapper: Mapper<A, B>): MapTransducer<A, B> {
    return Object.assign(function* map(iterable: Iterable<A>) {
        for (const a of iterable) {
            yield mapper(a);
        }
    }, {
        mapper,
        toString: () => `map(${mapper})`
    });
}

export function isMapTransducer(value: any): value is MapTransducer<any, any> {
    return typeof value === 'function' && value.name === 'map' && Object.hasOwn(value, 'mapper');
}