import {Mapper} from "./Mapper.ts";
import {Property} from "./Property.ts";

/**
 * The Select function can be used to extract a subset of properties from an object
 */
export interface Select<A> extends Mapper<A, Partial<A>> {
    /**
     * The properties to extract
     */
    readonly properties: ReadonlyArray<Property<A, keyof A>>;
}

/**
 * Creates a Select that extracts the given properties from an object
 */
export function select<A>(...properties: readonly Property<A, keyof A>[]): Select<A> {
    return Object.assign((a: A) => {
        const result: Partial<A> = {};
        for (const property of properties) {
            result[property.key] = property(a);
        }
        return result;
    }, {
        properties,
        toString: () => `select(${properties})`
    });
}