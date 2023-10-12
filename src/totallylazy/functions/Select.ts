import {Mapper} from "./Mapper.ts";
import {Property, property} from "./Property.ts";

/**
 * The Select function can be used to extract a subset of properties from an object
 */
export interface Select<A> extends Mapper<A, Partial<A>> {
    /**
     * The properties to extract
     */
    readonly properties: readonly Property<A, keyof A>[];
}

/**
 * Creates a Select that extracts the given properties from an object
 */
export function select<A>(...properties: readonly (Property<A, keyof A> | keyof A)[]): Select<A> {
    const converted: Property<A, keyof A>[] = properties.map(p => typeof p === "function" ? p : property(p));
    return Object.assign(function select(a: A) {
        const result: Partial<A> = {};
        for (const p of converted) {
            result[p.key] = p(a);
        }
        return result;
    }, {
        properties: converted,
        toString: () => `select(${properties})`
    });
}

export function isSelect(value: any): value is Select<any> {
    return value && typeof value === 'function' && value.name === 'select' && Object.hasOwn(value, 'properties');
}