import { Schema, Table } from '../../../../../src/types/database';
import PostgreSQLLinter, {
  getLintedColumns,
  getLintedConstraints, getLintedForeignKeys, getLintedIndexes, getLintedTriggers,
  getLintedViews
} from '../../../../../src/core/lint/PostgreSQL/PostgreSQLLinter';
import { OldToNewColumnNameMapType, OldToNewTableNameMapType } from '../../../../../src/types/lint';
import * as GetSchema from '../../../../../src/core/database/schema/schema';
import { schema as sampleSchema } from '../../../../../data/PostgreSQL/schema';
import { report as sampleReport } from '../../../../../data/PostgreSQL/report';

describe('PostgreSQLLinter', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
    
  describe('lint', () => {
    it('should be able to lint a schema', async () => {
      jest.spyOn(GetSchema, 'getSchema').mockResolvedValue(sampleSchema as Schema);
      const report = await new PostgreSQLLinter().lint();
      expect(report).toStrictEqual(sampleReport);
    });
  });
    
  describe('getLintedForeignKeys', () => {
    it('should return linted foreign keys', () => {
      const table = {
        name: 'all_types_demo',
        foreignKeys: [
          {
            name: 'all_types_demo_group_id_foreign',
            columns: [
              'group_id'
            ],
            referencedTable: 'user_group',
            referencedColumns: [
              'id'
            ],
            onUpdateAction: 'NO ACTION',
            onDeleteAction: 'SET NULL'
          }
        ]
      } as unknown as Table;

      const oldToNewColumnNameMap = {
        all_types_demo: { group_id: { newName: 'group_id', isCustomIdentifier: false } },
        user_group: { id: { newName: 'id', isCustomIdentifier: false } }
      } as OldToNewColumnNameMapType;

      const oldToNewTableNameMap = {
        all_types_demo: { newName: 'all_types_demos', isCustomIdentifier: false },
        user_group: { newName: 'user_groups', isCustomIdentifier: false }
      } as OldToNewTableNameMapType;

      expect(
        getLintedForeignKeys(table, 'all_type_demos', oldToNewTableNameMap, oldToNewColumnNameMap)
      ).toStrictEqual({
        lintedForeignKeys: [
          {
            suggestion: {
              isChangeNeeded: true,
              isCustomIdentifier: false,
              newName: 'fk_all_type_demos_group_id_user_groups_id'
            },
            name: 'all_types_demo_group_id_foreign',
            columns: [
              'group_id'
            ],
            referencedTable: 'user_group',
            referencedColumns: [
              'id'
            ],
            onUpdateAction: 'NO ACTION',
            onDeleteAction: 'SET NULL'
          }
        ],
        validations: [
          {
            entity: 'FOREIGN_KEY',
            identifier: 'all_types_demo_group_id_foreign',
            message: 'Change the foreign key name.',
            type: 'ERROR'
          }
        ]
      });
    });
  });

  describe('getLintedTriggers', () => {
    it('should return linted triggers', () => {
      const table = {
        name: 'all_types_demo',
        triggers: [
          {
            name: 'trg_set_updated_at',
            timing: 'BEFORE',
            level: 'ROW',
            events: [
              'UPDATE'
            ],
            columns: [
              'id'
            ],
            definition: 'Some trigger definition'
          }
        ]
      } as unknown as Table;

      const oldToNewColumnNameMap = {
        all_types_demo: { id: { newName: 'id', isCustomIdentifier: false } }
      } as OldToNewColumnNameMapType;

      expect(getLintedTriggers(table, 'all_types_demos', oldToNewColumnNameMap)).toStrictEqual({
        lintedTriggers: [
          {
            suggestion: {
              newName: 'trg_all_types_demos_before_update_id',
              isCustomIdentifier: false,
              isChangeNeeded: true
            },
            name: 'trg_set_updated_at',
            timing: 'BEFORE',
            level: 'ROW',
            events: [
              'UPDATE'
            ],
            columns: [
              'id'
            ],
            definition: 'Some trigger definition'
          }
        ],
        validations: [
          {
            entity: 'TRIGGER',
            identifier: 'trg_set_updated_at',
            message: 'Change the trigger name.',
            type: 'ERROR'
          },
          {
            entity: 'TABLE',
            identifier: 'all_types_demo',
            message: 'Table has trigger(s). Do re-check the trigger(s) if you have changed the table and/or column(s).',
            type: 'INFO'
          }
        ]
      });
    });
  });

  describe('getLintedIndexes', () => {
    it('should return linted indexes', () => {
      const table = {
        name: 'all_types_demo',
        indexes: [
          {
            name: 'all_types_demo_pkey',
            type: 'UNIQUE INDEX',
            columns: [
              'id'
            ],
            predicate: null,
            isPrimary: true,
            isUnique: true,
            isPartial: false
          }
        ]
      } as unknown as Table;

      const oldToNewColumnNameMap = {
        all_types_demo: { id: { newName: 'id', isCustomIdentifier: false } }
      } as OldToNewColumnNameMapType;

      expect(getLintedIndexes(table, 'all_types_demos', oldToNewColumnNameMap)).toStrictEqual({
        lintedIndexes: [
          {
            suggestion: {
              isChangeNeeded: true,
              isCustomIdentifier: false,
              newName: 'uidx_all_types_demos_id'
            },
            name: 'all_types_demo_pkey',
            type: 'UNIQUE INDEX',
            columns: [
              'id'
            ],
            predicate: null,
            isPrimary: true,
            isUnique: true,
            isPartial: false
          }
        ],
        validations: [
          {
            entity: 'INDEX',
            identifier: 'all_types_demo_pkey',
            message: 'Change the index name.',
            type: 'ERROR'
          }
        ]
      });
    });
  });
    
  describe('getLintedConstraints', () => {
    it('should return linted constraints', () => {
      const table = {
        name: 'users',
        constraints: [
          {
            name: 'ck_price_nonnegative',
            type: 'CHECK',
            columns: [
              'price'
            ],
            predicate: 'price >= 0::numeric'
          }
        ]
      } as unknown as Table;

      const oldToNewColumnNameMap = {
        users: { price: { newName: 'price', isCustomIdentifier: false } }
      } as OldToNewColumnNameMapType;

      expect(getLintedConstraints(table, 'users', oldToNewColumnNameMap)).toStrictEqual({
        lintedConstraints: [
          {
            suggestion: {
              newName: 'ck_users_price',
              isCustomIdentifier: false,
              isChangeNeeded: true
            },
            name: 'ck_price_nonnegative',
            type: 'CHECK',
            columns: [
              'price'
            ],
            predicate: 'price >= 0::numeric'
          }
        ],
        validations: [
          {
            entity: 'CONSTRAINT',
            identifier: 'ck_price_nonnegative',
            message: 'Change the constraint name.',
            type: 'ERROR'
          }
        ]
      });
    });
  });

  describe('getLintedColumns', () => {
    it('should return linted columns', () => {
      const table = {
        name: 'users',
        columns: [
          {
            name: 'id',
            dataType: 'bigint',
            nullable: false,
            predicate: null,
            defaultValue: null,
            partOf: [
              'PRIMARY KEY',
              'UNIQUE INDEX'
            ]
          }
        ]
      } as unknown as Table;

      const oldToNewColumnNameMap = {
        users: { id: { newName: 'id', isCustomIdentifier: false } }
      } as OldToNewColumnNameMapType;

      expect(getLintedColumns(table, oldToNewColumnNameMap)).toStrictEqual({
        lintedColumns: [
          {
            suggestion: {
              newName: 'id',
              isCustomIdentifier: false,
              isChangeNeeded: false
            },
            name: 'id',
            dataType: 'bigint',
            nullable: false,
            predicate: null,
            defaultValue: null,
            partOf: [
              'PRIMARY KEY',
              'UNIQUE INDEX'
            ]
          }
        ],
        validations: []
      });
    });
  });

  describe('getLintedViews', () => {
    it('should return linted view', () => {
      const schema = {
        views: [
          {
            name: 'v_all_types_demo_active',
            tableNames: [
              'all_types_demo',
              'user_group'
            ],
            definition: 'Some view definition'
          }
        ]
      } as unknown as Schema;

      const oldToNewTableNameMap = {
        all_types_demo: { newName: 'all_types_demos', isCustomIdentifier: false },
        user_group: { newName: 'user_groups', isCustomIdentifier: false }
      } as OldToNewTableNameMapType;

      expect(getLintedViews(schema, oldToNewTableNameMap)).toStrictEqual([
        {
          name: 'v_all_types_demo_active',
          suggestion: {
            newName: 'v_all_types_demos_user_groups',
            isCustomIdentifier: false,
            isChangeNeeded: true
          },
          tableNames: [
            'all_types_demo',
            'user_group'
          ],
          definition: 'Some view definition',
          validations: [
            {
              entity: 'VIEW',
              identifier: 'v_all_types_demo_active',
              message: 'Change the view name.',
              type: 'ERROR'
            }
          ],
          stats: {
            validations: {
              info: 0,
              warning: 0,
              error: 1,
              ignoredError: 0
            }
          }
        }
      ]);
    });
  });
});
