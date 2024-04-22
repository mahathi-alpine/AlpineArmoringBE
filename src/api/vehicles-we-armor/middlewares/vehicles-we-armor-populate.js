'use strict';

/**
 * `vehicles-we-armor-populate` middleware
 */

const populate = { 
  seo:{
    metaImage: {
      populate: true,
      fields: ['url']
    },
    metaSocial: {
      image: {
        populate: true,
        fields: ['url']
      },
    }
  }, 
  beforeAfterSlider:{
    populate: {
      before: {
        populate: true
      },    
      after: {
        populate: true
      }
    }
  },
  dimensions1:{
    populate: true
  },
  dimensions2:{
    populate: true
  },
  armoringFeatures:{
    populate: {
      image: {
        populate: true
      }
    },
  },
  conversionAccessories:{
    populate: {
      image: {
        populate: true
      }
    },
  },
  otherOptions:{
    populate: {
      image: {
        populate: true
      }
    },
  },
  communications:{
    populate: {
      image: {
        populate: true
      }
    },
  },
  stock:{
    populate: true,
    fields: ['title']
  },
  gallery:{
    populate: true
  },
  featuredImage:{
    populate: true
  },
  pdf:{
    populate: true,
    fields: ['url', 'isUrlSigned', 'provider', 'createdAt', 'ext', 'hash',  'mime', 'name', 'updatedAt', 'provider_metadata']
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
