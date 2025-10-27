export const report = {
  "tables": [
    {
      "suggestion": {
        "newName": "all_types_demos",
        "isCustomIdentifier": false,
        "isChangeNeeded": true
      },
      "name": "all_types_demo",
      "columns": [
        {
          "suggestion": {
            "newName": "id",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "id",
          "dataType": "bigint",
          "nullable": false,
          "predicate": null,
          "defaultValue": null,
          "partOf": [
            "PRIMARY KEY",
            "UNIQUE INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "public_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "public_id",
          "dataType": "uuid",
          "nullable": false,
          "predicate": null,
          "defaultValue": "gen_random_uuid()",
          "partOf": [
            "EXCLUDE",
            "UNIQUE",
            "UNIQUE INDEX",
            "PARTIAL INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "group_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "group_id",
          "dataType": "smallint",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": [
            "UNIQUE PARTIAL INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "username",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "username",
          "dataType": "varchar(32)",
          "nullable": false,
          "predicate": "(((username)::text ~ '^[a-zA-Z0-9_]+$'::text))",
          "defaultValue": null,
          "partOf": [
            "CHECK",
            "UNIQUE",
            "UNIQUE PARTIAL INDEX",
            "UNIQUE INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "email",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "email",
          "dataType": "citext",
          "nullable": false,
          "predicate": null,
          "defaultValue": null,
          "partOf": [
            "UNIQUE PARTIAL INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "display_name",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "display_name",
          "dataType": "text",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "fixed_char",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "fixed_char",
          "dataType": "char(5)",
          "nullable": false,
          "predicate": null,
          "defaultValue": "'abcde'::bpchar",
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "tiny_count",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "tiny_count",
          "dataType": "smallint",
          "nullable": false,
          "predicate": null,
          "defaultValue": "'0'::smallint",
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "count_num",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "count_num",
          "dataType": "integer",
          "nullable": false,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "big_count",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "big_count",
          "dataType": "bigint",
          "nullable": false,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "price",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "price",
          "dataType": "numeric(12,2)",
          "nullable": false,
          "predicate": "((price >= (0)::numeric))",
          "defaultValue": "0.00",
          "partOf": [
            "CHECK",
            "REGULAR INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "ratio",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "ratio",
          "dataType": "float4",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "score",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "score",
          "dataType": "float8",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "is_active",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "is_active",
          "dataType": "boolean",
          "nullable": false,
          "predicate": null,
          "defaultValue": "true",
          "partOf": [
            "PARTIAL INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "created_at",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "created_at",
          "dataType": "timestamptz",
          "nullable": false,
          "predicate": null,
          "defaultValue": "CURRENT_TIMESTAMP",
          "partOf": [
            "REGULAR INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "updated_at",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "updated_at",
          "dataType": "timestamptz",
          "nullable": false,
          "predicate": null,
          "defaultValue": "CURRENT_TIMESTAMP",
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "archived_at",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "archived_at",
          "dataType": "timestamptz",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "born_on",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "born_on",
          "dataType": "date",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "wake_time",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "wake_time",
          "dataType": "timetz",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "duration",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "duration",
          "dataType": "interval",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "ip_addr",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "ip_addr",
          "dataType": "inet",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "network_block",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "network_block",
          "dataType": "cidr",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "mac_address",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "mac_address",
          "dataType": "macaddr",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "settings",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "settings",
          "dataType": "jsonb",
          "nullable": false,
          "predicate": null,
          "defaultValue": "'{}'::jsonb",
          "partOf": [
            "REGULAR INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "tags",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "tags",
          "dataType": "text[]",
          "nullable": false,
          "predicate": null,
          "defaultValue": "'{}'::text[]",
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "scores",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "scores",
          "dataType": "integer[]",
          "nullable": false,
          "predicate": "(((array_length(scores, 1) IS NULL) OR (array_length(scores, 1) <= 100)))",
          "defaultValue": "'{}'::integer[]",
          "partOf": [
            "CHECK"
          ]
        },
        {
          "suggestion": {
            "newName": "availability",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "availability",
          "dataType": "tstzrange",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": [
            "EXCLUDE",
            "PARTIAL INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "int_range",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "int_range",
          "dataType": "int4range",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "bio",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "bio",
          "dataType": "text",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "bio_tsv",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "bio_tsv",
          "dataType": "tsvector",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": [
            "REGULAR INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "mood",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "mood",
          "dataType": "mood",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "pocket_money",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "pocket_money",
          "dataType": "money",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "suggestion": {
            "newName": "full_name",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "full_name",
          "dataType": "text",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        }
      ],
      "constraints": [
        {
          "suggestion": {
            "newName": "ck_all_types_demos_price",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "ck_price_nonnegative",
          "type": "CHECK",
          "columns": [
            "price"
          ],
          "predicate": "price >= 0::numeric"
        },
        {
          "suggestion": {
            "newName": "ck_all_types_demos_scores",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "ck_scores_small",
          "type": "CHECK",
          "columns": [
            "scores"
          ],
          "predicate": "array_length(scores, 1) IS NULL OR array_length(scores, 1) <= 100"
        },
        {
          "suggestion": {
            "newName": "ck_all_types_demos_username",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "ck_username_valid",
          "type": "CHECK",
          "columns": [
            "username"
          ],
          "predicate": "username::text ~ '^[a-zA-Z0-9_]+$'::text"
        },
        {
          "suggestion": {
            "newName": "ex_all_types_demos_public_id_availability",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "ex_no_overlap_availability",
          "type": "EXCLUDE",
          "columns": [
            "public_id",
            "availability"
          ],
          "predicate": "availability IS NOT NULL"
        },
        {
          "suggestion": {
            "newName": "pk_all_types_demos_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "all_types_demo_pkey",
          "type": "PRIMARY KEY",
          "columns": [
            "id"
          ],
          "predicate": null
        },
        {
          "suggestion": {
            "newName": "un_all_types_demos_public_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "all_types_demo_public_id_unique",
          "type": "UNIQUE",
          "columns": [
            "public_id"
          ],
          "predicate": null
        },
        {
          "suggestion": {
            "newName": "un_all_types_demos_username",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "uq_username",
          "type": "UNIQUE",
          "columns": [
            "username"
          ],
          "predicate": null
        }
      ],
      "foreignKeys": [
        {
          "suggestion": {
            "newName": "fk_all_types_demos_group_id_user_groups_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "all_types_demo_group_id_foreign",
          "columns": [
            "group_id"
          ],
          "referencedTable": "user_group",
          "referencedColumns": [
            "id"
          ],
          "onUpdateAction": "NO ACTION",
          "onDeleteAction": "SET NULL"
        }
      ],
      "indexes": [
        {
          "suggestion": {
            "newName": "uidx_all_types_demos_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "all_types_demo_pkey",
          "type": "UNIQUE INDEX",
          "columns": [
            "id"
          ],
          "predicate": null,
          "isPrimary": true,
          "isUnique": true,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "uidx_all_types_demos_public_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "all_types_demo_public_id_unique",
          "type": "UNIQUE INDEX",
          "columns": [
            "public_id"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": true,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "upidx_all_types_demos_email",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "uq_all_types_demo_email_active",
          "type": "UNIQUE PARTIAL INDEX",
          "columns": [
            "email"
          ],
          "predicate": "(archived_at IS NULL)",
          "isPrimary": false,
          "isUnique": true,
          "isPartial": true
        },
        {
          "suggestion": {
            "newName": "upidx_all_types_demos_username_group_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "uq_user_group_active",
          "type": "UNIQUE PARTIAL INDEX",
          "columns": [
            "username",
            "group_id"
          ],
          "predicate": "(archived_at IS NULL)",
          "isPrimary": false,
          "isUnique": true,
          "isPartial": true
        },
        {
          "suggestion": {
            "newName": "uidx_all_types_demos_username",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "uq_username",
          "type": "UNIQUE INDEX",
          "columns": [
            "username"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": true,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "pidx_all_types_demos_public_id_availability",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "ex_no_overlap_availability",
          "type": "PARTIAL INDEX",
          "columns": [
            "public_id",
            "availability"
          ],
          "predicate": "(availability IS NOT NULL)",
          "isPrimary": false,
          "isUnique": false,
          "isPartial": true
        },
        {
          "suggestion": {
            "newName": "pidx_all_types_demos_is_active",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "idx_all_types_demo_active",
          "type": "PARTIAL INDEX",
          "columns": [
            "is_active"
          ],
          "predicate": "(archived_at IS NULL)",
          "isPrimary": false,
          "isUnique": false,
          "isPartial": true
        },
        {
          "suggestion": {
            "newName": "idx_all_types_demos_bio_tsv",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "idx_all_types_demo_bio_tsv",
          "type": "REGULAR INDEX",
          "columns": [
            "bio_tsv"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": false,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "idx_all_types_demos_created_at",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "idx_all_types_demo_created_at",
          "type": "REGULAR INDEX",
          "columns": [
            "created_at"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": false,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "idx_all_types_demos_created_at",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "idx_all_types_demo_created_at_brin",
          "type": "REGULAR INDEX",
          "columns": [
            "created_at"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": false,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "idx_all_types_demos_price",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "idx_all_types_demo_price",
          "type": "REGULAR INDEX",
          "columns": [
            "price"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": false,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "idx_all_types_demos_settings",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "idx_all_types_demo_settings_gin",
          "type": "REGULAR INDEX",
          "columns": [
            "settings"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": false,
          "isPartial": false
        }
      ],
      "triggers": [
        {
          "suggestion": {
            "newName": "trg_all_types_demos_before_update",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "trg_set_updated_at",
          "timing": "BEFORE",
          "level": "ROW",
          "events": [
            "UPDATE"
          ],
          "columns": [],
          "definition": "CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON all_types_demo FOR EACH ROW EXECUTE FUNCTION set_updated_at()"
        }
      ],
      "validations": [
        {
          "type": "ERROR",
          "entity": "TABLE",
          "identifier": "all_types_demo",
          "message": "Change the table name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "ck_price_nonnegative",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "ck_scores_small",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "ck_username_valid",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "ex_no_overlap_availability",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "all_types_demo_pkey",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "all_types_demo_public_id_unique",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "uq_username",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "all_types_demo_pkey",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "all_types_demo_public_id_unique",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "uq_all_types_demo_email_active",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "uq_user_group_active",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "uq_username",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "ex_no_overlap_availability",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "idx_all_types_demo_active",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "idx_all_types_demo_bio_tsv",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "idx_all_types_demo_created_at",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "idx_all_types_demo_created_at_brin",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "idx_all_types_demo_price",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "idx_all_types_demo_settings_gin",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "TRIGGER",
          "identifier": "trg_set_updated_at",
          "message": "Change the trigger name."
        },
        {
          "type": "ERROR",
          "entity": "FOREIGN_KEY",
          "identifier": "all_types_demo_group_id_foreign",
          "message": "Change the foreign key name."
        }
      ]
    },
    {
      "suggestion": {
        "newName": "user_groups",
        "isCustomIdentifier": false,
        "isChangeNeeded": true
      },
      "name": "user_group",
      "columns": [
        {
          "suggestion": {
            "newName": "id",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "id",
          "dataType": "smallint",
          "nullable": false,
          "predicate": null,
          "defaultValue": "nextval('user_group_id_seq'::regclass)",
          "partOf": [
            "PRIMARY KEY",
            "UNIQUE INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "code",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "code",
          "dataType": "text",
          "nullable": false,
          "predicate": null,
          "defaultValue": null,
          "partOf": [
            "UNIQUE",
            "UNIQUE INDEX"
          ]
        },
        {
          "suggestion": {
            "newName": "created_at",
            "isCustomIdentifier": false,
            "isChangeNeeded": false
          },
          "name": "created_at",
          "dataType": "timestamptz",
          "nullable": false,
          "predicate": null,
          "defaultValue": "CURRENT_TIMESTAMP",
          "partOf": []
        }
      ],
      "constraints": [
        {
          "suggestion": {
            "newName": "pk_user_groups_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "user_group_pkey",
          "type": "PRIMARY KEY",
          "columns": [
            "id"
          ],
          "predicate": null
        },
        {
          "suggestion": {
            "newName": "un_user_groups_code",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "user_group_code_unique",
          "type": "UNIQUE",
          "columns": [
            "code"
          ],
          "predicate": null
        }
      ],
      "foreignKeys": [],
      "indexes": [
        {
          "suggestion": {
            "newName": "uidx_user_groups_id",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "user_group_pkey",
          "type": "UNIQUE INDEX",
          "columns": [
            "id"
          ],
          "predicate": null,
          "isPrimary": true,
          "isUnique": true,
          "isPartial": false
        },
        {
          "suggestion": {
            "newName": "uidx_user_groups_code",
            "isCustomIdentifier": false,
            "isChangeNeeded": true
          },
          "name": "user_group_code_unique",
          "type": "UNIQUE INDEX",
          "columns": [
            "code"
          ],
          "predicate": null,
          "isPrimary": false,
          "isUnique": true,
          "isPartial": false
        }
      ],
      "triggers": [],
      "validations": [
        {
          "type": "ERROR",
          "entity": "TABLE",
          "identifier": "user_group",
          "message": "Change the table name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "user_group_pkey",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "CONSTRAINT",
          "identifier": "user_group_code_unique",
          "message": "Change the constraint name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "user_group_pkey",
          "message": "Change the index name."
        },
        {
          "type": "ERROR",
          "entity": "INDEX",
          "identifier": "user_group_code_unique",
          "message": "Change the index name."
        }
      ]
    }
  ],
  "views": [
    {
      "suggestion": {
        "newName": "v_all_types_demos_user_groups",
        "isCustomIdentifier": false,
        "isChangeNeeded": true
      },
      "name": "v_all_types_demo_active",
      "tableNames": [
        "all_types_demo",
        "user_group"
      ],
      "definition": " SELECT a.id,\n    a.public_id,\n    a.username,\n    a.email,\n    lower(a.email::text) AS email_lower,\n    a.display_name,\n    a.full_name,\n    a.group_id,\n    g.code AS group_code,\n    a.is_active,\n    a.created_at,\n    a.updated_at,\n    a.price,\n    a.settings,\n    a.tags,\n    array_length(a.scores, 1) AS scores_count,\n    a.bio,\n    a.bio_tsv\n   FROM all_types_demo a\n     LEFT JOIN user_group g ON g.id = a.group_id\n  WHERE a.archived_at IS NULL AND a.is_active = true;",
      "validations": [
        {
          "type": "ERROR",
          "entity": "VIEW",
          "identifier": "v_all_types_demo_active",
          "message": "Change the view name."
        }
      ]
    }
  ]
}