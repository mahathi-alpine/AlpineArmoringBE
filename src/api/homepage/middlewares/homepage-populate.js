'use strict';

/**
 * `homepage-populate` middleware
 */

const populate = {
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
  bannerVideo:{
    populate: {
      video_webm: {
        populate: true
      },    
      video_mp4: {
        populate: true
      }
    }
  },
  quote:{
    populate: true
  },
  allVehiclesImage:{
    populate: true
  },
  hpMiddleText:{
    populate: true
  },
  tabSection:{
    populate: {
      image: {
        populate: true
      }
    }
  },
  ballistingTestingsMedia:{
    populate: {
      image: {
        populate: true
      }
    }
  },
  blogs:{
    populate: {
      thumbnail: {
        populate: true
      },    
      categories: {
        populate: true
      }
    }
  },
  industryPartners: {
    populate: {
      image: {
        populate: true
      }
    }
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
