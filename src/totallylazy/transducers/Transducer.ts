/**
 * A transducer that can be applied synchronously
 */
export interface Transducer<A, B>  {
    /**
     * Applies the transducer to the given iterable
     */
    (iterable: Iterable<A>): Iterable<B>;

    /**
     * Returns a string representation of the transducer
     */
    toString(): string;

    readonly [Transducer.type]: string;
}

export class Transducer<A, B> {
    static readonly type = Symbol('Transducer');

    static [Symbol.hasInstance](value: any): boolean {
        return typeof value === 'function' && value.length === 1 && Object.hasOwn(value, Transducer.type);
    }
}

export function transducer<N extends string, T extends object, U extends object>(name: N, target: T, source: U) {
    return Object.assign(target, source, {[Transducer.type]: name});
}

