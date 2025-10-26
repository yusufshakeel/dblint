import { Column, Constraint, ForeignKey, Index, Schema, Trigger, View } from './database';
import { CaseType } from './case-type';

export type MaxLengthOfIdentifiers = {
    table: number,
    column: number,
    constraint: number,
    index: number,
    foreignKey: number,
    view: number,
    trigger: number,
}

export type CaseTypeOfIdentifiers = {
    table: CaseType,
    column: CaseType,
    constraint: CaseType,
    index: CaseType,
    foreignKey: CaseType,
    view: CaseType,
    trigger: CaseType,
}

export enum ValidationType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR'
}

export enum ValidationEntity {
    TABLE = 'TABLE',
    COLUMN = 'COLUMN',
    CONSTRAINT = 'CONSTRAINT',
    INDEX = 'INDEX',
    FOREIGN_KEY = 'FOREIGN_KEY',
    VIEW = 'VIEW',
    TRIGGER = 'TRIGGER',
}

export type Validation = {
    type: ValidationType,
    entity: ValidationEntity,
    identifier: string,
    message: string,
    isIgnored?: boolean,
    ignoredReason?: string,
}

export type LintSuggestion = {
    name: string,
    newName: string,
    isCustomIdentifier: boolean,
}

export type LintForeignKey = {
    suggestion: LintSuggestion,
    foreignKey: ForeignKey
}

export type LintTrigger = {
    suggestion: LintSuggestion,
    trigger: Trigger
}

export type LintIndex = {
    suggestion: LintSuggestion,
    index: Index
}

export type LintConstraint = {
    suggestion: LintSuggestion,
    constraint: Constraint
}

export type LintColumn = {
    suggestion: LintSuggestion,
    column: Column
}

export type LintTable = {
    suggestion: LintSuggestion,
    columns: LintColumn[],
    constraints: LintConstraint[],
    foreignKeys: LintForeignKey[],
    indexes: LintIndex[],
    triggers: LintTrigger[],
    validations: Validation[]
}

export type LintView = {
    suggestion: LintSuggestion,
    view: View,
    validations: Validation[]
}

export type LintedSchema = {
    tables: LintTable[],
    views: LintView[],
}

export type Lint = {
    schema: Schema,
    lintedSchema: LintedSchema,
}
