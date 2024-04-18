module.exports = ({ env }) => ({
  'drag-drop-content-types': {
    enabled: true
  },
  'import-export-entries': {
    enabled: true,
    config: {
      // serverPublicHostname: 'https://res.cloudinary.com'
    },
  },
  seo: {
    enabled: true,
  },
  'sitemap': {
    enabled: false,
    config: {
      cron: '0 0 0 * * *',
      xsl: true,
      autoGenerate: false,
      caching: true,
      allowedFields: ['id', 'uid'],
    },
  },
  redirects : {
    enabled: true,
  },
  upload: {
    config: {
      provider: 'aws-s3-cloudfront',
      providerOptions: {
        // accessKeyId: env('AWS_ACCESS_KEY_ID'),
        // secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
          // CacheControl: 'public,max-age=691200,s-maxage=31536000,immutable',
        },
        cloudfrontURL: env('AWS_CLOUDFRONT_URL'),
      },
      // providerOptions: {
      //   s3Options: {
      //     region: env('AWS_REGION'),
      //     credentials: {
      //       accessKeyId: env('AWS_ACCESS_KEY_ID'),
      //       secretAccessKey: env('AWS_ACCESS_SECRET')
      //     },
      //     params: {
      //       ACL: env('AWS_ACL', 'private'),
      //       signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15*60),
      //       Bucket: env('AWS_BUCKET'),
      //     },
      //   },
      // },
      breakpoints: {
        xlarge: 2200,
        large: 1300,
        medium: 750,
        thumbnail: 500
      }
    },
  },
  email: {
    config: {
      provider: 'amazon-ses',
      providerOptions: {
        // key: env('AWS_SES_KEY'),
        // secret: env('AWS_SES_SECRET'),
        // amazon: 'https://email.us-east-1.amazonaws.com',
      },
      settings: {
        // defaultFrom: 'myemail@protonmail.com',
        // defaultReplyTo: 'myemail@protonmail.com',
      },
    },
  },
})