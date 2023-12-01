module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'postgres'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', 'novasifra93'),
      schema: env('DATABASE_SCHEMA', 'public'), 
    },
    debug: false,
  },
});
// module.exports = ({ env }) => ({
//   connection: {
//     client: 'postgres',
//     connection: {
//       host: env('DATABASE_HOST', 'ec2-44-213-228-107.compute-1.amazonaws.com'),
//       port: env.int('DATABASE_PORT', 5432),
//       database: env('DATABASE_NAME', 'd8k8r86u82vr95'),
//       user: env('DATABASE_USERNAME', 'hgdadjkdcvojqu'),
//       password: env('DATABASE_PASSWORD', 'e567e23f477eb458a06cbbeb1f421576e08bb5901ecb2402e7ec4ddc41341ac5'),
//       schema: env('DATABASE_SCHEMA', 'public'), 
//     },
//     debug: false,
//   },
// });