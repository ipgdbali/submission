/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadRepoTestHelper = {

  async cleanTable() {
    await pool.query('DELETE FROM thread');
    await pool.query('DELETE FROM comment');
    await pool.query('DELETE FROM reply');
  },

};

module.exports = ThreadRepoTestHelper;
