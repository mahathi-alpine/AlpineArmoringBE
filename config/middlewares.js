module.exports = [
  'strapi::errors',
  'global::bot-blocker',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'strapi.io', 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com', 'd102sycao8uwt8.cloudfront.net', 'assets.alpineco.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'strapi.io', 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com', 'd102sycao8uwt8.cloudfront.net', 'assets.alpineco.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'http://localhost:1337',
        'http://localhost:3001',
        'http://localhost:8081',
        'https://alpinetesting.cloudflex-ha.com',
        'https://www.alpineco.com',
        'https://www.armoredautos.com',
        'https://www.armored-swat.com',
        'https://pit-bull.net',
        // 'https://alpine-armoring-fe-kappa.vercel.app',
        // 'https://alpine-pitbull.vercel.app'
      ],
      headers: ['*'],
      expose: ['WWW-Authenticate', 'Server-Authorization'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      maxAge: 86400,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'global::compression',
  'global::http-cache',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::request-tracker'
];
