import {select, SelectExpression, SelectList} from "../ansi/SelectExpression.ts";
import {from, FromClause} from "../ansi/FromClause.ts";
import {table} from "../ansi/Table.ts";
import {SetQuantifier} from "../ansi/SetQuantifier.ts";
import {Mapper} from "../../../totallylazy/functions/Mapper.ts";
import {Predicand, PredicatePair, WhereClause} from "../ansi/WhereClause.ts";
import {Transducer} from "../../../totallylazy/transducers/Transducer.ts";
import {FilterTransducer, isFilterTransducer} from "../../../totallylazy/transducers/FilterTransducer.ts";
import {isMapTransducer, MapTransducer} from "../../../totallylazy/transducers/MapTransducer.ts";
import {isSelect} from "../../../totallylazy/functions/Select.ts";
import {Column, column, star} from "../ansi/Column.ts";
import {isWherePredicate} from "../../../totallylazy/predicates/WherePredicate.ts";
import {isProperty, Property} from "../../../totallylazy/functions/Property.ts";
import {isIsPredicate} from "../../../totallylazy/predicates/IsPredicate.ts";
import {is} from "../ansi/IsExpression.ts";
import {Predicate} from "../../../totallylazy/predicates/Predicate.ts";
import {isAndPredicate} from "../../../totallylazy/predicates/AndPredicate.ts";
import {and, between, Compound, not, or} from "../template/Compound.ts";
import {isOrPredicate} from "../../../totallylazy/predicates/OrPredicate.ts";
import {isNotPredicate} from "../../../totallylazy/predicates/NotPredicate.ts";
import { isBetweenPredicate } from "../../../totallylazy/predicates/BetweenPredicate.ts";

export interface Definition<A> {
    name: string;
}

export function definition<A>(name: string): Definition<A> {
    return {name};
}


export type Supported<A> = FilterTransducer<A> | MapTransducer<A, Partial<A>>;

export function toSelect<A>(definition: Definition<A>): SelectExpression;
export function toSelect<A, B>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>): SelectExpression;
export function toSelect<A, B, C>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>): SelectExpression;
export function toSelect<A, B, C, D>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>, d: Transducer<C, D> & Supported<C>): SelectExpression;
export function toSelect<A, B, C, D, E>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>, d: Transducer<C, D> & Supported<C>, e: Transducer<D, E> & Supported<D>): SelectExpression;
export function toSelect<A, B, C, D, E, F>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>, d: Transducer<C, D> & Supported<C>, e: Transducer<D, E> & Supported<D>, f: Transducer<E, F> & Supported<E>): SelectExpression;
export function toSelect<A>(definition: Definition<A>, ...transducers: readonly Supported<A>[]): SelectExpression ;

export function toSelect<A>(definition: Definition<A>, ...transducers: readonly Supported<A>[]): SelectExpression {
    return transducers.reduce((expression, transducer) => {
        if (isMapTransducer(transducer)) {
            return select(expression.setQuantifier, toSelectList(transducer.mapper), expression.fromClause, expression.whereClause);
        }
        if (isFilterTransducer(transducer)) {
            return select(expression.setQuantifier, expression.selectList, expression.fromClause, mergeWhereClause(expression.whereClause, toCompound(transducer.predicate)));
        }

        return expression;
    }, select(SetQuantifier.All, star, toFromClause(definition)));
}

export function toSelectList<A>(mapper: Mapper<A, keyof A>): SelectList {
    if (isSelect(mapper)) {
        return mapper.properties.map(toColumn);
    }
    throw new Error(`Unsupported mapper: ${mapper}`);
}

export function toColumn<A>(property: Property<A, keyof A>): Column {
    return column(String(property.key));
}

export function toFromClause<A>(definition: Definition<A>): FromClause {
    return from(table(definition.name));
}

export function toPredicand<A>(mapper: Mapper<A, keyof A>): Predicand {
    if (isProperty(mapper)) {
        return toColumn(mapper);
    }
    throw new Error(`Unsupported Mapper: ${mapper}`);
}

function mergeWhereClause(oldClause: WhereClause | undefined, newCompound: Compound): WhereClause {
    if (!oldClause) return new WhereClause(newCompound);
    return new WhereClause(and(oldClause.expression, newCompound));
}

export function toCompound<A>(predicate: Predicate<A>): Compound {
    if (isWherePredicate(predicate)) {
        return new PredicatePair(toPredicand(predicate.mapper), toCompound(predicate.predicate));
    }
    if (isAndPredicate(predicate)) {
        return and(...predicate.predicates.map(toCompound));
    }
    if (isOrPredicate(predicate)) {
        return or(...predicate.predicates.map(toCompound));
    }
    if (isNotPredicate(predicate)) {
        return not(toCompound(predicate.predicate));
    }
    if (isIsPredicate(predicate)) {
        return is(predicate.value);
    }
    if (isBetweenPredicate(predicate)) {
        return between(predicate.start, predicate.end);
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}
