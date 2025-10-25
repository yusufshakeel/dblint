export enum DatabaseType {
    postgres = 'postgres'
}

export type DatabaseConfig = {
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort: number;
    dbType: DatabaseType;
};

export type Column = {
    name: string;
    dataType: string;
    nullable: boolean;
    predicate: string | null;
    defaultValue: string | null;
    partOf: string[];
};

export enum ConstraintType {
    PRIMARY_KEY = 'PRIMARY KEY',
    UNIQUE = 'UNIQUE',
    EXCLUDE = 'EXCLUDE',
    CHECK = 'CHECK',
    CONSTRAINT_TRIGGER = 'CONSTRAINT TRIGGER',
    FOREIGN_KEY = 'FOREIGN KEY',
}

export enum IndexType {
    UNIQUE_INDEX = 'UNIQUE INDEX',
    UNIQUE_PARTIAL_INDEX = 'UNIQUE PARTIAL INDEX',
    PARTIAL_INDEX = 'PARTIAL INDEX',
    REGULAR_INDEX = 'REGULAR INDEX',
}

export type Constraint = {
    name: string;
    type: ConstraintType;
    columns: string[];
    predicate: string | null;
};

export type ForeignKey = {
    name: string;
    columns: string[];
    referencedTable: string;
    referencedColumns: string[];
    onUpdateAction: string;
    onDeleteAction: string;
};

export type Index = {
    name: string;
    type: IndexType;
    columns: string[];
    predicate: string | null;
    isUnique: boolean;
    isPrimary: boolean;
    isPartial: boolean;
}

export enum TriggerTiming {
    BEFORE = 'BEFORE',
    AFTER = 'AFTER',
    INSTEAD_OF = 'INSTEAD OF',
}

export enum TriggerEvent {
    INSERT = 'INSERT',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    TRUNCATE = 'TRUNCATE',
}

export enum TriggerLevel {
    STATEMENT = 'STATEMENT',
    ROW = 'ROW',
}

export type Trigger = {
    name: string;
    timing: TriggerTiming;
    level: TriggerLevel;
    events: TriggerEvent;
    columns: string[];
    definition: string;
};

export type Table = {
    name: string;
    columns: Column[];
    constraints: Constraint[];
    foreignKeys: ForeignKey[];
    indexes: Index[];
    triggers: Trigger[];
};

export type View = {
    name: string;
    tables: string[];
};

export type Schema = {
    tables: Table[];
    views: View[];
};
