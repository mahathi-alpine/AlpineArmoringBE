module.exports = {
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
    enabled: true,
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
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
      breakpoints: {
        xlarge: 2200,
        large: 1300,
        medium: 750,
        small: 500
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
}