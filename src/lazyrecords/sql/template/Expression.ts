const NominalType = Symbol('NominalType');

/**
 * The base class for all SQL expressions.
 */
export abstract class Expression {
    /**
     * Enforce nominal typing instead of structural typing.
     */
    private readonly [NominalType] = this;
}
