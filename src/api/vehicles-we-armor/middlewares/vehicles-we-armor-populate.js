'use strict';

/**
 * `vehicles-we-armor-populate` middleware
 * Smart populate: detects detail vs listing requests.
 * - Slug filter present (detail page) or findOne → full populate (~20 JOINs)
 * - No slug filter (listing page / bots) → lean populate (~5 JOINs)
 */

// Reason: Full populate for detail/slug pages — all sections needed for the vehicle detail view.
const fullPopulate = {
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
  category:{
    fields: ['title', 'slug']
  },
  make:{
    fields: ['title']
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
    fields: ['title', 'flag', 'hide']
  },
  gallery:{
    populate: true
  },
  featuredImage:{
    populate: true
  },
  pdf:{
    populate: true,
    fields: ['url', 'isUrlSigned', 'provider', 'createdAt', 'ext', 'hash', 'mime', 'name', 'updatedAt', 'provider_metadata']
  },
  mediaPassword:{
    populate: {
      media: {
        populate: true
      }
    },
  },
  videoUpload:{
    populate: true,
    fields: ['url', 'mime']
  },
  videoMP4:{
    populate: true,
    fields: ['url', 'mime']
  },
  faqs:{
    populate: true
  },
  localizations:{
    populate: true,
    fields: ['slug', 'locale', 'hide', 'title']
  }
};

// Reason: Lean populate for listing pages — only card-level fields to reduce JOINs from ~20 to ~5.
const leanPopulate = {
  featuredImage: {
    populate: true
  },
  category: {
    fields: ['title', 'slug']
  },
  make: {
    fields: ['title']
  },
  stock: {
    fields: ['title', 'flag', 'hide']
  },
  localizations: {
    fields: ['slug', 'locale', 'hide', 'title']
  }
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Reason: Detail page uses find with filters[slug][$eq]=xxx,
    // so we detect slug filter to serve full populate for detail requests.
    const isDetailRequest = !!ctx.query?.filters?.slug;
    const populate = isDetailRequest ? fullPopulate : leanPopulate;

    // Reason: Spread ctx.query first so our populate always wins,
    // preventing clients from sending populate=deep to trigger massive JOINs.
    ctx.query = {
      ...ctx.query,
      populate
    };

    await next();
  };
};
