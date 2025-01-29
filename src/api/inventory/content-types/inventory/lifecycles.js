let slugify = require("slugify");
const { ApplicationError } = require("@strapi/utils").errors;

module.exports = {
  async beforeCreate(event) {
    await generateSlug(event);
  },

  async beforeUpdate(event) {
    console.log('Update/Publish event triggered');
    
    // Skip slug generation if we don't have title or slug in the update data
    if (!event.params.data.title && !event.params.data.slug) {
      console.log('Skipping slug generation - no title or slug in update data');
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
        console.log('Generated slug on publish:', event.params.data.slug);
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
  
  console.log('Current data:', data);

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

  console.log('Generated/formatted slug:', data.slug);

  // Validate that the slug matches the required pattern
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (data.slug && !slugPattern.test(data.slug)) {
    throw new ApplicationError("Invalid slug format! Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.");
  }
};

const getLocale = async (id) => {
  const res = await strapi.service("api::inventory.inventory").findOne(id);
  console.log('Found locale:', res?.locale);
  return res?.locale;
};