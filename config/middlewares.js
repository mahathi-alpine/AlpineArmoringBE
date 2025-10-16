module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'strapi.io', 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com', 'd102sycao8uwt8.cloudfront.net'],
          'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'strapi.io', 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com', 'd102sycao8uwt8.cloudfront.net'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:3002',
        'http://localhost:1337',
        'http://localhost:3002',
        'https://alpinetesting.cloudflex-ha.com',
        'https://www.alpineco.com',
        'https://alpine-armoring-fe-kappa.vercel.app',
        'https://www.armoredautos.com',
        'https://www.armored-swat.com',
        'https://pit-bull.net',
        'https://alpine-pitbull.vercel.app'
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
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
];
