import {replace} from "../functions/replace.ts";

/**
 *  Ideally we could use this on both the parameter and the return type, but TypeScript doesn't support
 *  detecting the target property has a getter.
*/
interface GetterPropertyDescriptor<T, V> {
    get: (this: T) => V;
}

export function lazy<T extends object, K extends keyof T, V extends T[K]>(_target: T, name: K, descriptor: TypedPropertyDescriptor<V> /* GetterPropertyDescriptor<T, V> */): GetterPropertyDescriptor<T, V> {
    if (typeof descriptor.get === 'undefined') throw new Error("@lazy can only decorate getter methods");
    return {
        ...descriptor,
        get(this: T): V {
            const result: V = descriptor.get!.call(this);
            replace(this, name, result);
            return result;
        }
    };
}