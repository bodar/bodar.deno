import {replace} from "../functions/replace.ts";

export function lazy(_target: any, name: string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.get === 'undefined') throw new Error("@lazy can only decorate getter methods");
    return {
        ...descriptor,
        get(): any {
            const result = descriptor.get!.call(this);
            replace(this as any, name, result);
            return result;
        }
    };
}