const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env("DATABASE_URL"));
  
  return {
    connection: {
      client: 'postgres',
      connection: {
        host,
        port,
        database,
        user,
        password,
        ssl: { rejectUnauthorized: false },
      },
      pool: {
        min: 2,
        max: 30,
        // Reason: Kill any SQL query exceeding 30s to prevent runaway queries
        // from exhausting the connection pool
        afterCreate: (conn, done) => {
          conn.query('SET statement_timeout = 30000', (err) => {
            done(err, conn);
          });
        },
        acquireTimeoutMillis: 60000
      },
      acquireConnectionTimeout: 60000,
      debug: false,
    },
  }
};