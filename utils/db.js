// pool connection to db

import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'postgres',
//   host: 'immovably-manageable-yak.data-1.use1.tembo.io',
//   database: 'app',
//   password: process.env.DATABASE_PASSWORD,
//   port: 5432,
//   ssl: false,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export { pool };