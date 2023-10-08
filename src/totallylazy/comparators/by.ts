import {Comparator} from "./Comparator.ts";
import {Mapper} from "../functions/Mapper.ts";
import {ascending} from "./ascending.ts";
import {property} from "../functions/Property.ts";

export interface ByComparator<A, B> extends Comparator<A> {
    readonly mapper: Mapper<A, B>;
    readonly comparator: Comparator<B>;
}

export function by<A, K extends keyof A>(key: K, comparator?: Comparator<A[K]>): ByComparator<A, A[K]>;
export function by<A, B>(mapper: Mapper<A, B>, comparator?: Comparator<B>): ByComparator<A, B>;
export function by(mapperOfKey: any, comparator: Comparator<any> = ascending): ByComparator<any, any> {
    const mapper = typeof mapperOfKey === "function" ? mapperOfKey : property<any, any>(mapperOfKey);
    return Object.assign((a: any, b: any) => {
        return comparator(mapper(a), mapper(b));
    }, {
        mapper,
        comparator,
        toString: () => `by(${mapper}, ${comparator})`
    });
}

