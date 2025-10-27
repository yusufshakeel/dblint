export const schema = {
  "tables": [
    {
      "name": "all_types_demo",
      "columns": [
        {
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
          "name": "display_name",
          "dataType": "text",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "fixed_char",
          "dataType": "char(5)",
          "nullable": false,
          "predicate": null,
          "defaultValue": "'abcde'::bpchar",
          "partOf": []
        },
        {
          "name": "tiny_count",
          "dataType": "smallint",
          "nullable": false,
          "predicate": null,
          "defaultValue": "'0'::smallint",
          "partOf": []
        },
        {
          "name": "count_num",
          "dataType": "integer",
          "nullable": false,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "big_count",
          "dataType": "bigint",
          "nullable": false,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
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
          "name": "ratio",
          "dataType": "float4",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "score",
          "dataType": "float8",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
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
          "name": "updated_at",
          "dataType": "timestamptz",
          "nullable": false,
          "predicate": null,
          "defaultValue": "CURRENT_TIMESTAMP",
          "partOf": []
        },
        {
          "name": "archived_at",
          "dataType": "timestamptz",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "born_on",
          "dataType": "date",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "wake_time",
          "dataType": "timetz",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "duration",
          "dataType": "interval",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "ip_addr",
          "dataType": "inet",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "network_block",
          "dataType": "cidr",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "mac_address",
          "dataType": "macaddr",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
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
          "name": "tags",
          "dataType": "text[]",
          "nullable": false,
          "predicate": null,
          "defaultValue": "'{}'::text[]",
          "partOf": []
        },
        {
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
          "name": "int_range",
          "dataType": "int4range",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "bio",
          "dataType": "text",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
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
          "name": "mood",
          "dataType": "mood",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
          "name": "pocket_money",
          "dataType": "money",
          "nullable": true,
          "predicate": null,
          "defaultValue": null,
          "partOf": []
        },
        {
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
          "name": "ck_price_nonnegative",
          "type": "CHECK",
          "columns": [
            "price"
          ],
          "predicate": "price >= 0::numeric"
        },
        {
          "name": "ck_scores_small",
          "type": "CHECK",
          "columns": [
            "scores"
          ],
          "predicate": "array_length(scores, 1) IS NULL OR array_length(scores, 1) <= 100"
        },
        {
          "name": "ck_username_valid",
          "type": "CHECK",
          "columns": [
            "username"
          ],
          "predicate": "username::text ~ '^[a-zA-Z0-9_]+$'::text"
        },
        {
          "name": "ex_no_overlap_availability",
          "type": "EXCLUDE",
          "columns": [
            "public_id",
            "availability"
          ],
          "predicate": "availability IS NOT NULL"
        },
        {
          "name": "all_types_demo_pkey",
          "type": "PRIMARY KEY",
          "columns": [
            "id"
          ],
          "predicate": null
        },
        {
          "name": "all_types_demo_public_id_unique",
          "type": "UNIQUE",
          "columns": [
            "public_id"
          ],
          "predicate": null
        },
        {
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
          "name": "trg_set_updated_at",
          "timing": "BEFORE",
          "level": "ROW",
          "events": [
            "UPDATE"
          ],
          "columns": [],
          "definition": "CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON all_types_demo FOR EACH ROW EXECUTE FUNCTION set_updated_at()"
        }
      ]
    },
    {
      "name": "user_group",
      "columns": [
        {
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
          "name": "user_group_pkey",
          "type": "PRIMARY KEY",
          "columns": [
            "id"
          ],
          "predicate": null
        },
        {
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
      "triggers": []
    }
  ],
  "views": [
    {
      "name": "v_all_types_demo_active",
      "tableNames": [
        "all_types_demo",
        "user_group"
      ],
      "definition": " SELECT a.id,\n    a.public_id,\n    a.username,\n    a.email,\n    lower(a.email::text) AS email_lower,\n    a.display_name,\n    a.full_name,\n    a.group_id,\n    g.code AS group_code,\n    a.is_active,\n    a.created_at,\n    a.updated_at,\n    a.price,\n    a.settings,\n    a.tags,\n    array_length(a.scores, 1) AS scores_count,\n    a.bio,\n    a.bio_tsv\n   FROM all_types_demo a\n     LEFT JOIN user_group g ON g.id = a.group_id\n  WHERE a.archived_at IS NULL AND a.is_active = true;"
    }
  ]
}