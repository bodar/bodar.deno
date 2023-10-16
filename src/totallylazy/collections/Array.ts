export type ArrayContains<A, B> = Extract<A | B, B>[];
export type ReadonlyArrayContains<A, B> = readonly Extract<A | B, B>[];
