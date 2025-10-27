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
    newName: string,
    isCustomIdentifier: boolean,
    isChangeNeeded: boolean,
}

export type LintForeignKey = ForeignKey & {
    suggestion: LintSuggestion,
}

export type LintTrigger = Trigger & {
    suggestion: LintSuggestion,
}

export type LintIndex = Index & {
    suggestion: LintSuggestion,
}

export type LintConstraint = Constraint & {
    suggestion: LintSuggestion,
}

export type LintColumn = Column & {
    suggestion: LintSuggestion,
}

export type LintTable = {
    suggestion: LintSuggestion,
    name: string,
    columns: LintColumn[],
    constraints: LintConstraint[],
    foreignKeys: LintForeignKey[],
    indexes: LintIndex[],
    triggers: LintTrigger[],
    validations: Validation[]
}

export type LintView = View & {
    suggestion: LintSuggestion,
    validations: Validation[]
}

export type Lint = {
    tables: LintTable[],
    views: LintView[],
}
