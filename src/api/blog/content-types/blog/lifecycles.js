let slugify = require("slugify");
const { ApplicationError } = require("@strapi/utils").errors;

module.exports = {
  async beforeCreate(event) {
    await generateSlug(event);
  },

  async beforeUpdate(event) {

    // try {
    //   if (event.params.data.localizations?.length > 0) {    
    //     const originalEntry = await strapi.entityService.findOne(
    //       'api::blog.blog',
    //       event.params.where.id,
    //       {
    //         populate: {
    //           vehicles_we_armor: true
    //         }
    //       }
    //     );
  
    //     if (originalEntry?.vehicles_we_armor?.length > 0) {          
    //       // Update the newly created translation with the vehicles
    //       const translationId = event.params.data.localizations[0];
    //       await strapi.entityService.update(
    //         'api::blog.blog',
    //         translationId,
    //         {
    //           data: {
    //             vehicles_we_armor: {
    //               connect: originalEntry.vehicles_we_armor.map(vehicle => ({
    //                 id: vehicle.id,
    //                 position: { end: true }
    //               }))
    //             }
    //           }
    //         }
    //       );
    //     } else {
    //       console.log('No vehicles_we_armor found in original entry');
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error in beforeUpdate:', error);
    // }
    
    if (!event.params.data.title && !event.params.data.slug) {
      return;
    }

    
    if (event.params.data.publishedAt && !event.params.data.title) {
      const fullEntity = await strapi.entityService.findOne(
        'api::blog.blog',
        event.params.where.id,
        { populate: '*' }
      );
      
      if (!fullEntity.slug && fullEntity.title) {
        event.params.data.slug = generateValidSlug(fullEntity.title);
      }
      return;
    }

    await generateSlug(event);
  }
};

const generateValidSlug = (text) => {
  return slugify(text, {
    lower: true,          // Convert to lowercase
    strict: true,         // Strip special characters except replacement
    remove: /[*+~.()'"!:@]/g,  // Remove specific characters
    replacement: '-',     // Replace spaces with -
    locale: 'en'         // Force English locale to handle special characters
  });
};

const generateSlug = async (event) => {
  const { data } = event.params;

  if (!data.slug && !data.title) {
    console.log('No slug or title available - skipping slug generation');
    return;
  }

  if (data.slug) {
    data.slug = generateValidSlug(data.slug);
  }
  else if (data.title) {
    data.slug = generateValidSlug(data.title);
  }

  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (data.slug && !slugPattern.test(data.slug)) {
    throw new ApplicationError("Invalid slug format! Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.");
  }
};

const getLocale = async (id) => {
  const res = await strapi.service("api::blog.blog").findOne(id);
  return res?.locale;
};