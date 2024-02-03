'use strict';

/**
 * `vehicles-we-armor-populate` middleware
 */

const populate = {  
  beforeAfterSlider:{
    populate: {
      before: {
        populate: true,
        fields: ['url', 'alternativeText']
      },    
      after: {
        populate: true,
        fields: ['url', 'alternativeText']
      }
    }
  },
  dimensions1:{
    populate: true,
    fields: ['url', 'alternativeText', 'width', 'height']
  },
  dimensions2:{
    populate: true,
    fields: ['url', 'alternativeText', 'width', 'height']
  },
  specs:{
    populate: {
      image: {
        populate: true,
        fields: ['url', 'alternativeText', 'width', 'height', 'formats']
      }
    },
  },
  equipment:{
    populate: {
      image: {
        populate: true,
        fields: ['url', 'alternativeText', 'width', 'height', 'formats']
      }
    },
  },
  stock:{
    populate: true,
    fields: ['title']
  },
  gallery:{
    populate: true,
    fields: ['url', 'alternativeText', 'width', 'height', 'formats']
  },
  featuredImage:{
    populate: true,
    fields: ['url', 'alternativeText', 'width', 'height', 'formats']
  },
  pdf:{
    populate: true,
    fields: ['url']
  },
  videoUpload:{
    populate: true,
    fields: ['url']
  },
}

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In vehicles-we-armor-populate middleware.');

    ctx.query = {
      populate,
      ...ctx.query
    }

    await next();
  };
};
