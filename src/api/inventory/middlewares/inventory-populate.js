'use strict';

/**
 * `inventory-populate` middleware
 */

const populate = {
  specifications:{
    populate: {
      media: {
        populate: true,
        fields: ['url']
      }
    },
  },
  accessories:{
    populate: {
      media: {
        populate: true,
        fields: ['url']
      }
    },
  },
  gallery:{
    populate: true,
    fields: ['url', 'alternativeText']
  }
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
