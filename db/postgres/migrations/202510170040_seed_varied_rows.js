/**
 * Knex migration: seed varied rows into all_types_demo (PostgreSQL)
 *
 * - Inserts 9 rows.
 * - Rows `full_one`, `full_two`, `full_three` set values for essentially all columns.
 * - Some rows skip optional columns (rely on defaults: e.g., price, fixed_char, settings, arrays, etc.).
 * - Demonstrates partial-unique email index by inserting a duplicate-lowercased email for an archived row.
 * - Assumes prior migrations created: extensions, enum `mood`, tables `user_group`, `all_types_demo`.
 */

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
    await knex.transaction(async (trx) => {
        // Ensure we have some groups to reference (safe in dev via ON CONFLICT DO NOTHING)
        const groupsToEnsure = [
            { code: 'admin' },
            { code: 'staff' },
            { code: 'guest' },
        ];

        await trx('user_group').insert(groupsToEnsure).onConflict('code').ignore();
        const groups = await trx('user_group')
            .select('id', 'code')
            .whereIn('code', groupsToEnsure.map((g) => g.code));
        const groupIdByCode = Object.fromEntries(groups.map((g) => [g.code, g.id]));

        // Helper for now() without binding per row
        const now = trx.fn.now();

        // 9 users total; first 3 are "full" rows covering virtually all columns
        const users = [
            // 1) Full row with nearly all columns
            {
                username: 'full_one',
                email: 'full.one@example.com',
                display_name: 'Full One',
                group_id: groupIdByCode.admin,
                count_num: 11,
                big_count: 1111,
                price: '1234.56', // numeric(12,2)
                ratio: 0.42, // real
                score: 97.75, // double precision
                is_active: true,
                born_on: '1985-04-12', // date
                wake_time: '06:30:00+00', // timetz
                duration: '2 hours', // interval
                ip_addr: '10.1.2.3', // inet
                network_block: '10.1.0.0/16', // cidr
                mac_address: '00:11:22:33:44:55', // macaddr
                settings: { theme: 'dark', newsletter: true, flags: { beta: true } }, // jsonb
                tags: ['full', 'demo', 'one'], // text[]
                scores: [10, 20, 30], // integer[]
                availability: '[2025-01-01 09:00:00+00,2025-01-01 17:00:00+00)', // tstzrange
                int_range: '[1,100)', // int4range
                bio: 'This is Full One, a comprehensive demo row with almost every field populated.',
                mood: 'happy',
                // pocket_money is a money type; use raw to cast
                pocket_money: trx.raw("'250.00'::money"),
                fixed_char: 'ABCDE',
                created_at: now,
                updated_at: now,
            },
            // 2) Another full row
            {
                username: 'full_two',
                email: 'full.two@example.com',
                display_name: 'Full Two',
                group_id: groupIdByCode.staff,
                count_num: 22,
                big_count: 2222,
                price: '0.00',
                ratio: 0.75,
                score: 88.125,
                is_active: false,
                born_on: '1991-07-23',
                wake_time: '07:45:00+00',
                duration: '45 minutes',
                ip_addr: '192.0.2.10',
                network_block: '192.0.2.0/24',
                mac_address: '66:77:88:99:AA:BB',
                settings: { pref: 'compact', color: 'blue' },
                tags: ['full', 'two'],
                scores: [1, 1, 2, 3, 5, 8],
                availability: '[2025-02-01 08:00:00+00,2025-02-01 12:00:00+00)',
                int_range: '[10,20)',
                bio: 'Full Two includes arrays, ranges, and network types.',
                mood: 'ok',
                pocket_money: trx.raw("'19.99'::money"),
                fixed_char: 'XYZZY',
                created_at: now,
                updated_at: now,
            },
            // 3) Third full row
            {
                username: 'full_three',
                email: 'full.three@example.com',
                display_name: 'Full Three',
                group_id: groupIdByCode.guest,
                count_num: 33,
                big_count: 3333,
                price: '99.95',
                ratio: 0.33,
                score: 66.66,
                is_active: true,
                born_on: '1979-11-30',
                wake_time: '05:15:00+00',
                duration: '1 hour',
                ip_addr: '203.0.113.77',
                network_block: '203.0.113.0/24',
                mac_address: 'AA:BB:CC:DD:EE:FF',
                settings: { locale: 'en_US', experimental: false },
                tags: ['full', 'three'],
                scores: [100, 200, 300],
                availability: '[2025-03-10 10:00:00+00,2025-03-10 18:00:00+00)',
                int_range: '[100,200)',
                bio: 'Full Three provides an extensive set of values across types.',
                mood: 'sad',
                pocket_money: trx.raw("'100.00'::money"),
                fixed_char: 'HELLO',
                created_at: now,
                updated_at: now,
            },

            // 4) Partial row: omit price, tags, scores, ranges, bio, pocket_money
            {
                username: 'partial_alpha',
                email: 'partial.alpha@example.com',
                group_id: groupIdByCode.admin,
                count_num: 5,
                big_count: 500,
                ratio: 0.5,
                score: 50.5,
                is_active: true,
                ip_addr: '10.10.10.10',
            },

            // 5) Partial row: omit many optional fields; provide mood and arrays
            {
                username: 'partial_beta',
                email: 'partial.beta@example.com',
                group_id: groupIdByCode.staff,
                count_num: 7,
                big_count: 700,
                mood: 'ok',
                tags: ['beta', 'sample'],
                scores: [2, 4, 6],
                is_active: false,
            },

            // 6) Minimal required fields plus group; let defaults handle the rest
            {
                username: 'minimal_one',
                email: 'minimal.one@example.com',
                group_id: groupIdByCode.guest,
                count_num: 1,
                big_count: 10,
            },

            // 7) Another minimal row
            {
                username: 'minimal_two',
                email: 'minimal.two@example.com',
                group_id: groupIdByCode.staff,
                count_num: 2,
                big_count: 20,
            },

            // 8) Archived row that duplicates another row's email (case-insensitive) to show partial-unique index behavior
            // Duplicate of partial.alpha@example.com but archived, so allowed by unique-partial index (which filters archived rows)
            {
                username: 'archived_dup',
                email: 'Partial.Alpha@example.com', // same as partial_alpha lowercased
                group_id: groupIdByCode.admin,
                count_num: 9,
                big_count: 900,
                archived_at: trx.fn.now(), // archived -> excluded from unique-partial constraint
                is_active: false,
            },

            // 9) Row with some network/range fields but skipping others
            {
                username: 'net_ranger',
                email: 'net.ranger@example.com',
                group_id: groupIdByCode.guest,
                count_num: 4,
                big_count: 400,
                ip_addr: '172.16.1.100',
                network_block: '172.16.0.0/16',
                int_range: '[5,15)',
                availability: '[2025-04-01 09:00:00+00,2025-04-01 12:00:00+00)',
            },
        ];

        await trx('all_types_demo').insert(users);
    });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
    await knex.transaction(async (trx) => {
        await trx('all_types_demo').whereIn('username', [
            'full_one',
            'full_two',
            'full_three',
            'partial_alpha',
            'partial_beta',
            'minimal_one',
            'minimal_two',
            'archived_dup',
            'net_ranger',
        ]).del();
    });
};