'use strict';

/**
 * `homepage-populate` middleware
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
  quote:{
    populate: true
  },
  allVehiclesImage:{
    populate: true,
    fields: ['url', 'alternativeText']
  },
  hpMiddleText:{
    populate: true
  },
  tabSection:{
    populate: {
      image: {
        populate: true,
        fields: ['url', 'alternativeText', 'mime']
      }
    }
  },
  ballistingTestingsMedia:{
    populate: {
      image: {
        populate: true,
        fields: ['formats', 'url', 'mime', 'alternativeText', 'width', 'height', 'previewUrl']
      }
    }
  },
  blogs:{
    populate: {
      thumbnail: {
        populate: true,
        fields: ['url', 'alternativeText', 'width', 'height', 'formats']
      },    
      categories: {
        populate: true
      }
    }
  },
  industryPartners:{
    populate: true,
    fields: ['url', 'alternativeText', 'width', 'height', 'formats']
  }
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In homepage-populate middleware.');
    
    ctx.query = {
      populate,
      ...ctx.query
    }

    await next();
  };
};
