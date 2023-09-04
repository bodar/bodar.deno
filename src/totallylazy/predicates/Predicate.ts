export type Predicate<A> = (a: A) => boolean;

export interface DescriptivePredicate<A> extends Predicate<A> {
    toString(): string;
}