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
}

/**
 * Returns true if the given value is a transducer
 *
 * TODO: work out way to make this more specific, maybe using a symbol?
 */
export function isTransducer(value: any): value is Transducer<any, any> {
    return typeof value === 'function' && value.length === 1 && Object.hasOwn(value, 'toString');
}