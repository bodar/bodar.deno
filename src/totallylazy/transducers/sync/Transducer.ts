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