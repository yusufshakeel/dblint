import { Knex } from 'knex';
import PostgreSQLDatabaseSchema from '../../../../../src/core/database/schema/PostgreSQLDatabaseSchema';
import Configs from '../../../../../src/configs';

describe('PostgreSQLDatabaseSchema', () => {
  let raw: jest.Mock;

  beforeEach(() => {
    raw = jest.fn();
    jest.spyOn(Configs, 'ignoreTables', 'get').mockReturnValue([
      'knex_migrations', 'knex_migrations_lock'
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getTableNames', () => {
    it('should return table names', async () => {
      raw.mockReturnValue({
        rows: [
          { tableName: 'table1' },
          { tableName: 'table2' },
          { tableName: 'knex_migrations' },
          { tableName: 'knex_migrations_lock' }
        ]
      });
      const instance = { raw } as unknown as Knex;
      const result = await new PostgreSQLDatabaseSchema(instance).getTableNames();
      expect(raw).toHaveBeenCalled();
      expect(result).toStrictEqual([
        'table1',
        'table2'
      ]);
    });
  });

  describe('getColumns', () => {
    it('should return columns', async () => {
      raw.mockReturnValue({
        rows: [
          {
            columnName: 'id',
            dataType: 'integer',
            nullable: false,
            predicate: null,
            defaultValue: "nextval('knex_migrations_id_seq'::regclass)"
          }
        ]
      });
      const instance = { raw } as unknown as Knex;
      const result = await new PostgreSQLDatabaseSchema(instance).getColumns('table1');
      expect(raw).toHaveBeenCalled();
      expect(result).toStrictEqual([
        {
          name: 'id',
          dataType: 'integer',
          nullable: false,
          predicate: null,
          defaultValue: "nextval('knex_migrations_id_seq'::regclass)",
          partOf: []
        }
      ]);
    });
  });

  describe('getConstraints', () => {
    it('should return constraints', async () => {
      raw.mockReturnValue({
        rows: [
          {
            constraintName: 'all_types_demo_pkey',
            constraintType: 'PRIMARY KEY',
            columns: '{id}',
            predicate: null
          }
        ]
      });
      const instance = { raw } as unknown as Knex;
      const result = await new PostgreSQLDatabaseSchema(instance).getConstraints('table1');
      expect(raw).toHaveBeenCalled();
      expect(result).toStrictEqual([
        {
          name: 'all_types_demo_pkey',
          type: 'PRIMARY KEY',
          columns: [
            'id'
          ],
          predicate: null
        }
      ]);
    });
  });

  describe('getForeignKeys', () => {
    it('should return foreign keys', async () => {
      raw.mockReturnValue({
        rows: [
          {
            name: 'all_types_demo_group_id_foreign',
            columns: '{group_id}',
            referencedTable: 'user_group',
            referencedColumns: '{id}',
            onUpdateAction: 'NO ACTION',
            onDeleteAction: 'SET NULL'
          }
        ]
      });
      const instance = { raw } as unknown as Knex;
      const result = await new PostgreSQLDatabaseSchema(instance).getForeignKeys('table1');
      expect(raw).toHaveBeenCalled();
      expect(result).toStrictEqual([
        {
          name: 'all_types_demo_group_id_foreign',
          columns: [
            'group_id'
          ],
          referencedColumns: [
            'id'
          ],
          referencedTable: 'user_group',
          onDeleteAction: 'SET NULL',
          onUpdateAction: 'NO ACTION'
        }
      ]);
    });
  });

  describe('getIndexes', () => {
    it('should return indexes', async () => {
      raw.mockReturnValue({
        rows: [
          {
            indexName: 'all_types_demo_pkey',
            indexType: 'UNIQUE INDEX',
            columns: '{id}',
            predicate: null,
            isPrimary: true,
            isUnique: true,
            isPartial: false
          }
        ]
      });
      const instance = { raw } as unknown as Knex;
      const result = await new PostgreSQLDatabaseSchema(instance).getIndexes('table1');
      expect(raw).toHaveBeenCalled();
      expect(result).toStrictEqual([
        {
          name: 'all_types_demo_pkey',
          type: 'UNIQUE INDEX',
          columns: [
            'id'
          ],
          predicate: null,
          isPartial: false,
          isPrimary: true,
          isUnique: true
        }
      ]);
    });
  });

  describe('getViews', () => {
    it('should return views', async () => {
      raw.mockReturnValue({
        rows: [
          {
            viewName: 'v_all_types_demo_active',
            tables: '{all_types_demo,user_group}'
          }
        ]
      });
      const instance = { raw } as unknown as Knex;
      const result = await new PostgreSQLDatabaseSchema(instance).getViews();
      expect(raw).toHaveBeenCalled();
      expect(result).toStrictEqual([
        {
          name: 'v_all_types_demo_active',
          tables: [
            'all_types_demo',
            'user_group'
          ]
        }
      ]);
    });
  });

  describe('getTriggers', () => {
    it('should return triggers', async () => {
      raw.mockReturnValue({
        rows: [
          {
            triggerName: 'trg_set_updated_at',
            triggerType: 'AFTER',
            triggerEvent: '{UPDATE}',
            columns: '{}'
          }
        ]
      });
      const instance = { raw } as unknown as Knex;
      const result = await new PostgreSQLDatabaseSchema(instance).getTriggers('table1');
      expect(raw).toHaveBeenCalled();
      expect(result).toStrictEqual([
        {
          name: 'trg_set_updated_at',
          type: 'AFTER',
          event: [
            'UPDATE'
          ],
          columns: []
        }
      ]);
    });
  });

  describe('getEnrichedColumns', () => {
    it('should return enriched columns', () => {
      const instance = { raw } as unknown as Knex;
      const columns = [
        {
          name: 'id',
          dataType: 'bigint',
          nullable: false,
          predicate: null,
          defaultValue: null,
          partOf: []
        },
        {
          name: 'updated_at',
          dataType: 'timestamptz',
          nullable: false,
          predicate: null,
          defaultValue: 'CURRENT_TIMESTAMP',
          partOf: []
        }
      ];
      const constraintsAndIndexes = [
        {
          type: 'UNIQUE',
          columns: [
            'id'
          ]
        },
        {
          type: 'UNIQUE INDEX',
          columns: [
            'id'
          ]
        }
      ];
      const result = new PostgreSQLDatabaseSchema(instance).getEnrichedColumns(
        columns,
        constraintsAndIndexes
      );
      expect(result).toStrictEqual([
        {
          dataType: 'bigint',
          defaultValue: null,
          name: 'id',
          nullable: false,
          partOf: [
            'UNIQUE',
            'UNIQUE INDEX'
          ],
          predicate: null
        },
        {
          dataType: 'timestamptz',
          defaultValue: 'CURRENT_TIMESTAMP',
          name: 'updated_at',
          nullable: false,
          partOf: [],
          predicate: null
        }
      ]);
    });
  });

  describe('getSchema', () => {
    it('should return schema', async () => {
      const instance = { raw } as unknown as Knex;
      const schema = new PostgreSQLDatabaseSchema(instance);
      jest.spyOn(schema, 'getTableNames').mockResolvedValue(['table1']);
      jest.spyOn(schema, 'getColumns').mockResolvedValue([
        {
          name: 'id',
          dataType: 'bigint',
          nullable: false,
          predicate: null,
          defaultValue: null,
          partOf: []
        }
      ]);
      jest.spyOn(schema, 'getConstraints').mockResolvedValue([]);
      jest.spyOn(schema, 'getForeignKeys').mockResolvedValue([]);
      jest.spyOn(schema, 'getIndexes').mockResolvedValue([]);
      jest.spyOn(schema, 'getViews').mockResolvedValue([]);
      jest.spyOn(schema, 'getTriggers').mockResolvedValue([]);

      const result = await schema.getSchema();
      expect(result).toStrictEqual({
        tables: [
          {
            name: 'table1',
            columns: [
              {
                name: 'id',
                dataType: 'bigint',
                nullable: false,
                predicate: null,
                defaultValue: null,
                partOf: []
              }
            ],
            constraints: [],
            foreignKeys: [],
            indexes: [],
            triggers: []
          }
        ],
        views: []
      });
    });
  });
});
