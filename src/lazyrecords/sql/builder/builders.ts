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
import {PredicateExpression} from "../ansi/PredicateExpression.ts";
import {isIsPredicate} from "../../../totallylazy/predicates/IsPredicate.ts";
import {is} from "../ansi/IsExpression.ts";
import {Predicate} from "../../../totallylazy/predicates/Predicate.ts";
import {isAndPredicate} from "../../../totallylazy/predicates/AndPredicate.ts";
import {and, or} from "../template/Compound.ts";
import {isOrPredicate} from "../../../totallylazy/predicates/OrPredicate.ts";

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
            return select(expression.setQuantifier, expression.selectList, expression.fromClause, mergeWhereClause(expression.whereClause, toWhereClause(transducer.predicate)));
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

function mergeWhereClause(oldClause: WhereClause | undefined, newClause: WhereClause): WhereClause {
    if (!oldClause) return newClause;
    return new WhereClause(and(oldClause.expression, newClause.expression));
}

export function toWhereClause<A>(predicate: Predicate<A>): WhereClause {
    if (isWherePredicate(predicate)) {
        return new WhereClause(toPredicatePair(predicate));
    }
    if (isAndPredicate(predicate)) {
        return new WhereClause(and(...predicate.predicates.map(toPredicatePair)));
    }
    if (isOrPredicate(predicate)) {
        return new WhereClause(or(...predicate.predicates.map(toPredicatePair)));
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}

export function toPredicatePair<A>(predicate: Predicate<A>): PredicatePair {
    if (isWherePredicate(predicate)) {
        return new PredicatePair(toPredicand(predicate.mapper), toPredicateExpression(predicate.predicate));
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}

export function toPredicateExpression<A>(predicate: Predicate<A>): PredicateExpression {
    if (isIsPredicate(predicate)) {
        return is(predicate.value);
    }
    throw new Error(`Unsupported Predicate: ${predicate}`);
}