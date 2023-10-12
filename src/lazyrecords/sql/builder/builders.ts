import {select, SelectExpression, SelectList} from "../ansi/SelectExpression.ts";
import {from, FromClause} from "../ansi/FromClause.ts";
import {table} from "../ansi/Table.ts";
import {SetQuantifier} from "../ansi/SetQuantifier.ts";
import {Mapper} from "../../../totallylazy/functions/Mapper.ts";
import {Predicand, where, WhereClause} from "../ansi/WhereClause.ts";
import {Transducer} from "../../../totallylazy/transducers/Transducer.ts";
import {FilterTransducer, isFilterTransducer} from "../../../totallylazy/transducers/FilterTransducer.ts";
import {isMapTransducer, MapTransducer} from "../../../totallylazy/transducers/MapTransducer.ts";
import {isSelect} from "../../../totallylazy/functions/Select.ts";
import {Column, column, star} from "../ansi/Column.ts";
import {isWherePredicate} from "../../../totallylazy/predicates/WherePredicate.ts";
import {isProperty, Property} from "../../../totallylazy/functions/Property.ts";
import {PredicateExpression} from "../ansi/PredicateExpression.ts";
import {isIsPredicate} from "../../../totallylazy/predicates/IsPredicate.ts";
import {is} from "../ansi/IsExpression.ts";
import {Predicate} from "../../../totallylazy/predicates/Predicate.ts";

export interface Definition<A> {
    name: string;
}

export function definition<A>(name: string): Definition<A> {
    return {name};
}

export type Supported<A> = FilterTransducer<A> | MapTransducer<A, Partial<A>>;

export function selectExpression<A>(definition: Definition<A>): SelectExpression;
export function selectExpression<A, B>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>): SelectExpression;
export function selectExpression<A, B, C>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>): SelectExpression;
export function selectExpression<A, B, C, D>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>, d: Transducer<C, D> & Supported<C>): SelectExpression;
export function selectExpression<A, B, C, D, E>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>, d: Transducer<C, D> & Supported<C>, e: Transducer<D, E> & Supported<D>): SelectExpression;
export function selectExpression<A, B, C, D, E, F>(definition: Definition<A>, b: Transducer<A, B> & Supported<A>, c: Transducer<B, C> & Supported<B>, d: Transducer<C, D> & Supported<C>, e: Transducer<D, E> & Supported<D>, f: Transducer<E, F> & Supported<E>): SelectExpression;
export function selectExpression<A>(definition: Definition<A>, ...transducers: readonly Supported<A>[]): SelectExpression ;
export function selectExpression<A>(definition: Definition<A>, ...transducers: readonly Supported<A>[]): SelectExpression {
    return transducers.reduce((expression, transducer) => {
        if (isMapTransducer(transducer)) {
            return select(expression.setQuantifier, selectList(transducer.mapper), expression.fromClause, expression.whereClause);
        }
        if (isFilterTransducer(transducer)) {
            return select(expression.setQuantifier, expression.selectList, expression.fromClause, whereClause(transducer.predicate));
        }

        return expression;
    }, select(SetQuantifier.All, star, fromClause(definition)));
}

export function selectList<A>(mapper: Mapper<A, keyof A>): SelectList {
    if (isSelect(mapper)) {
        return mapper.properties.map(toColumn);
    }
    throw new Error(`Unsupported mapper: ${mapper}`);
}

export function toColumn<A>(property: Property<A, keyof A>): Column {
    return column(String(property.key));
}

export function fromClause<A>(definition: Definition<A>): FromClause {
    return from(table(definition.name));
}

export function toPredicand<A>(mapper: Mapper<A, keyof A>): Predicand {
    if (isProperty(mapper)) {
        return toColumn(mapper);
    }
    throw new Error(`Unsupported Mapper: ${mapper}`);
}

export function whereClause<A>(predicate: Predicate<A>): WhereClause {
    if (isWherePredicate(predicate)) {
        return where(toPredicand(predicate.mapper), predicateExpression(predicate.predicate))
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}

export function predicateExpression<A>(predicate: Predicate<A>): PredicateExpression {
    if (isIsPredicate(predicate)) {
        return is(predicate.value);
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}