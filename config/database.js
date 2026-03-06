module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {      
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT'),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      schema: env('DATABASE_SCHEMA', 'public')
    },
    pool: {
      min: 2,
      max: 10
    },
    acquireConnectionTimeout: 60000,
    debug: false,
  },
});