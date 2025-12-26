let slugify = require("slugify");
const { ApplicationError } = require("@strapi/utils").errors;

// Lazy load pushApiClient to avoid ES6 import issues
let pushApiClient;
const getPushApiClient = async () => {
  if (pushApiClient === undefined) {
    try {
      // Use dynamic import() for ES6 modules
      const module = await import('../../../../utils/pushApiClient.js');
      pushApiClient = module.pushApiClient || module.default;
    } catch (error) {
      console.warn('Push notification client not available:', error.message);
      pushApiClient = null;
    }
  }
  return pushApiClient;
};

module.exports = {
  async beforeCreate(event) {
    await generateSlug(event);
  },

  async beforeUpdate(event) {

    try {
      // Check if this update contains a new localization
      if (event.params.data.localizations?.length > 0) {        
        // Get the original entry with its relationships
        const originalEntry = await strapi.entityService.findOne(
          'api::inventory.inventory',
          event.params.where.id,
          {
            populate: {
              vehicles_we_armor: true
            }
          }
        );
  
        if (originalEntry?.vehicles_we_armor?.length > 0) {
          // Update the newly created translation with the vehicles
          const translationId = event.params.data.localizations[0];
          // Use db.query to bypass lifecycle hooks and prevent infinite loop
          await strapi.db.query('api::inventory.inventory').update({
            where: { id: translationId },
            data: {
              vehicles_we_armor: {
                connect: originalEntry.vehicles_we_armor.map(vehicle => ({
                  id: vehicle.id,
                  position: { end: true }
                }))
              }
            }
          });
        } else {
          console.log('No vehicles_we_armor found in original entry');
        }
      }
    } catch (error) {
      console.error('Error in beforeUpdate:', error);
    }
    
    // Skip slug generation if we don't have title or slug in the update data
    if (!event.params.data.title && !event.params.data.slug) {
      // console.log('Skipping slug generation - no title or slug in update data');
      return;
    }

    // If this is a publish action (data only contains publishedAt and updates)
    if (event.params.data.publishedAt && !event.params.data.title) {
      const fullEntity = await strapi.entityService.findOne(
        'api::inventory.inventory',
        event.params.where.id,
        { populate: '*' }
      );
      
      if (!fullEntity.slug && fullEntity.title) {
        event.params.data.slug = generateValidSlug(fullEntity.title);
        // console.log('Generated slug on publish:', event.params.data.slug);
      }
      return;
    }

    await generateSlug(event);
  },

  async afterFindOne(event) {
    filterImageFormats(event.result);
  },

  async afterFindMany(event) {
    if (event.result?.results) {
      event.result.results.forEach(item => filterImageFormats(item));
    } else if (Array.isArray(event.result)) {
      event.result.forEach(item => filterImageFormats(item));
    }
  },

  async afterCreate(event) {
    // Send notification if vehicle was published on creation
    if (event.result?.publishedAt) {
      await sendInventoryNotification(event.result);
    }
  },

  async afterUpdate(event) {
    // Only send notification if this update is publishing a draft (publishedAt was just added)
    if (event.params.data.publishedAt !== undefined) {
      // Fetch the full entry to get the actual current state
      const fullEntry = await strapi.entityService.findOne(
        'api::inventory.inventory',
        event.result.id,
        {
          fields: ['title', 'slug', 'locale', 'publishedAt']
        }
      );

      // Check if publishedAt exists in the fetched entry (meaning it's now published)
      if (fullEntry?.publishedAt) {
        await sendInventoryNotification(fullEntry);
      }
    }
  }
};

// Helper function to filter image formats
const filterImageFormats = (data) => {
  if (!data) return;

  // Process featuredImage - keep thumbnail and medium
  if (data.featuredImage?.formats) {
    const { thumbnail, medium } = data.featuredImage.formats;
    data.featuredImage.formats = {};
    if (thumbnail) data.featuredImage.formats.thumbnail = thumbnail;
    if (medium) data.featuredImage.formats.medium = medium;
  }

  // Process rentalsFeaturedImage - keep thumbnail and medium
  if (data.rentalsFeaturedImage?.formats) {
    const { thumbnail, medium } = data.rentalsFeaturedImage.formats;
    data.rentalsFeaturedImage.formats = {};
    if (thumbnail) data.rentalsFeaturedImage.formats.thumbnail = thumbnail;
    if (medium) data.rentalsFeaturedImage.formats.medium = medium;
  }

  // Process transparentImage - keep thumbnail and medium
  if (data.transparentImage?.formats) {
    const { thumbnail, medium } = data.transparentImage.formats;
    data.transparentImage.formats = {};
    if (thumbnail) data.transparentImage.formats.thumbnail = thumbnail;
    if (medium) data.transparentImage.formats.medium = medium;
  }

  // Process gallery - keep large and thumbnail formats
  if (Array.isArray(data.gallery)) {
    data.gallery.forEach(image => {
      if (image?.formats) {
        const { large, thumbnail } = image.formats;
        image.formats = {};
        if (large) image.formats.large = large;
        if (thumbnail) image.formats.thumbnail = thumbnail;
      }
    });
  }

  // Process rentalsGallery - keep large and thumbnail formats
  if (Array.isArray(data.rentalsGallery)) {
    data.rentalsGallery.forEach(image => {
      if (image?.formats) {
        const { large, thumbnail } = image.formats;
        image.formats = {};
        if (large) image.formats.large = large;
        if (thumbnail) image.formats.thumbnail = thumbnail;
      }
    });
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
  
  // console.log('Current data:', data);

  // Only proceed if we have either a slug or title to work with
  if (!data.slug && !data.title) {
    console.log('No slug or title available - skipping slug generation');
    return;
  }

  // If there's already a slug (like from translation), format it properly
  if (data.slug) {
    data.slug = generateValidSlug(data.slug);
  }
  // Otherwise generate from title if available
  else if (data.title) {
    data.slug = generateValidSlug(data.title);
  }

  // console.log('Generated/formatted slug:', data.slug);

  // Validate that the slug matches the required pattern
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (data.slug && !slugPattern.test(data.slug)) {
    throw new ApplicationError("Invalid slug format! Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.");
  }
};

const getLocale = async (id) => {
  const res = await strapi.service("api::inventory.inventory").findOne(id);
  // console.log('Found locale:', res?.locale);
  return res?.locale;
};

const sendInventoryNotification = async (entry) => {
  try {
    // Dynamically load push notification client
    const client = await getPushApiClient();

    // Skip if push notification client is not available
    if (!client) {
      return;
    }

    // Only send for EN-US locale
    if (entry.locale !== 'en') {
      return;
    }

    // Only send if published
    if (!entry.publishedAt) {
      return;
    }

    // Only send if we have required fields
    if (!entry.title || !entry.slug) {
      strapi.log.warn('Cannot send notification - missing title or slug');
      return;
    }

    const result = await client.sendGlobalNotification(
      "New Vehicle Available for immediate shipping",
      `Check out the ${entry.title}`,
      JSON.stringify({ vehicleSlug: entry.slug })
    );

    if (result.success) {
      strapi.log.info(`Push notification sent for inventory: ${entry.title} (${result.data?.totalDevices || 0} devices)`);
    } else {
      strapi.log.error(`Failed to send push notification: ${result.message}`);
    }
  } catch (error) {
    // Log error but don't throw - notification failures shouldn't block publishing
    strapi.log.error('Error sending push notification:', error);
  }
};