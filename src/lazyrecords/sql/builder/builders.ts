import {select, SelectExpression, SelectList} from "../ansi/SelectExpression.ts";
import {from, FromClause} from "../ansi/FromClause.ts";
import {table} from "../ansi/Table.ts";
import {SetQuantifier} from "../ansi/SetQuantifier.ts";
import {Mapper} from "../../../totallylazy/functions/Mapper.ts";
import {where, WhereClause} from "../ansi/WhereClause.ts";
import {Transducer} from "../../../totallylazy/transducers/Transducer.ts";
import {isFilterTransducer} from "../../../totallylazy/transducers/FilterTransducer.ts";
import {isMapTransducer} from "../../../totallylazy/transducers/MapTransducer.ts";
import {isSelect} from "../../../totallylazy/functions/Select.ts";
import {Column, column, star} from "../ansi/Column.ts";
import {isWherePredicate} from "../../../totallylazy/predicates/WherePredicate.ts";
import {Predicate} from "../../../totallylazy/predicates/Predicate.ts";
import {isProperty, Property} from "../../../totallylazy/functions/Property.ts";
import {PredicateExpression} from "../ansi/PredicateExpression.ts";
import {isIsPredicate} from "../../../totallylazy/predicates/IsPredicate.ts";
import {is} from "../ansi/IsExpression.ts";

export interface Definition<A> {
    name: string;
}

export function definition<A>(name: string): Definition<A> {
    return {name};
}

export function selectExpression<A>(definition: Definition<A>): SelectExpression;
export function selectExpression<A, B>(definition: Definition<A>, b: Transducer<A, B>): SelectExpression;
export function selectExpression<A, B, C>(definition: Definition<A>, b: Transducer<A, B>, c: Transducer<B, C>): SelectExpression;
export function selectExpression<A, B, C, D>(definition: Definition<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>): SelectExpression;
export function selectExpression<A, B, C, D, E>(definition: Definition<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>, e: Transducer<D, E>): SelectExpression;
export function selectExpression<A, B, C, D, E, F>(definition: Definition<A>, b: Transducer<A, B>, c: Transducer<B, C>, d: Transducer<C, D>, e: Transducer<D, E>, f: Transducer<E, F>): SelectExpression;
export function selectExpression(definition: Definition<any>, ...transducers: readonly Transducer<any, any>[]): SelectExpression;
export function selectExpression(definition: Definition<any>, ...transducers: readonly Transducer<any, any>[]): SelectExpression {
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

export function selectList(mapper: Mapper<unknown, unknown>): SelectList {
    if (isSelect(mapper)) {
        return mapper.properties.map(toColumn);
    }
    throw new Error(`Unsupported mapper: ${mapper}`);
}

export function toColumn(property: Property<any, any>): Column {
    return column(String(property.key));
}

export function fromClause<A>(definition: Definition<A>): FromClause {
    return from(table(definition.name));
}

export function whereClause(predicate: Predicate<unknown>): WhereClause {
    if (isWherePredicate(predicate) && isProperty(predicate.mapper)) {
        return where(toColumn(predicate.mapper), predicateExpression(predicate.predicate))
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}

export function predicateExpression(predicate: Predicate<unknown>): PredicateExpression {
    if (isIsPredicate(predicate)) {
        return is(predicate.value);
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}