import {replace} from "../functions/replace.ts";

export function lazy(target: any, name: string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.get === 'undefined') throw new Error("@lazy can only decorate getter methods");
    return Object.defineProperty(target, name, {
        ...descriptor,
        get(): any {
            return replace(this, name, descriptor.get!.call(this))[name];
        }
    });
}