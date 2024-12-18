'use strict';

/**
 * `list-inventory-populate` middleware
 */
const populate = { 
  banner:{
    populate: {
      media: {
        fields: ['url', 'mime', 'alternativeText', 'width', 'height', 'formats']
      },
      imageMobile: {
        fields: ['url', 'mime', 'alternativeText', 'width', 'height', 'formats']
      },
      mediaMP4: {
        fields: ['url', 'mime', 'width', 'height']
      },
    },
  },  
  seo:{
    populate: {
      metaImage: {
        populate: {
          image: {
            populate: true
          }
        },
      },
      metaSocial: {
        populate: {
          image: {
            populate: true
          }
        },
      }
    }
  },
}

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In list-inventory-populate middleware.');

    ctx.query = {
      populate,
      ...ctx.query
    }

    await next();
  };
};
