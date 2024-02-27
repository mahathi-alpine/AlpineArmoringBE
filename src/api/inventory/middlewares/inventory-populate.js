'use strict';

/**
 * `inventory-populate` middleware
 */

const populate = {
  specifications:{
    populate: {
      image: {
        populate: true,
        fields: ['url', 'alternativeText', 'width', 'height', 'formats']
      }
    },
  },
  accessories:{
    populate: {
      image: {
        populate: true,
        fields: ['url', 'alternativeText', 'width', 'height', 'formats']
      }
    },
  },
  gallery:{
    populate: true,
    fields: ['url', 'alternativeText', 'height', 'width', 'formats']
  },
  video:{
    populate: true,
    fields: ['url']
  },
  categories:{
    populate: true,
    fields: ['title', 'slug']
  },
  featuredImage:{
    populate: true,
    fields: ['url', 'alternativeText', 'height', 'width', 'formats']
  },
  OEM:{
    populate: true,
    fields: ['url']
  },
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In inventory-populate middleware.');

    ctx.query = {
      populate,
      ...ctx.query
    }

    await next();
  };
};
