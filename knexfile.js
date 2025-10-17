// Update with your config settings.
const postgres = require('./db/postgres/configs/config');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    ...postgres
  }
};
