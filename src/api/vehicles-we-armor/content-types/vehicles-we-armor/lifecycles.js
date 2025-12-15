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
        'api::vehicles-we-armor.vehicles-we-armor',
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

  console.log('Generated/formatted slug:', data.slug);

  // Validate that the slug matches the required pattern
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (data.slug && !slugPattern.test(data.slug)) {
    throw new ApplicationError("Invalid slug format! Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.");
  }
};

// Helper function to filter image formats
const filterImageFormats = (data) => {
  if (!data) return;

  // Process beforeAfterSlider - before and after images should have only large format
  if (data.beforeAfterSlider?.before?.formats) {
    const { large } = data.beforeAfterSlider.before.formats;
    data.beforeAfterSlider.before.formats = {};
    if (large) data.beforeAfterSlider.before.formats.large = large;
  }
  if (data.beforeAfterSlider?.after?.formats) {
    const { large } = data.beforeAfterSlider.after.formats;
    data.beforeAfterSlider.after.formats = {};
    if (large) data.beforeAfterSlider.after.formats.large = large;
  }

  // Process dimensions1 and dimensions2 - shouldn't have any format
  if (data.dimensions1?.formats) {
    data.dimensions1.formats = {};
  }
  if (data.dimensions2?.formats) {
    data.dimensions2.formats = {};
  }

  // Process featuredImage - large, medium and thumbnail format
  if (data.featuredImage?.formats) {
    const { large, medium, thumbnail } = data.featuredImage.formats;
    data.featuredImage.formats = {};
    if (large) data.featuredImage.formats.large = large;
    if (medium) data.featuredImage.formats.medium = medium;
    if (thumbnail) data.featuredImage.formats.thumbnail = thumbnail;
  }

  // Process gallery - thumbnail and large
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

  // Process communications - image should have only thumbnail format
  if (Array.isArray(data.communications)) {
    data.communications.forEach(item => {
      if (item?.image?.formats) {
        const { thumbnail } = item.image.formats;
        item.image.formats = {};
        if (thumbnail) item.image.formats.thumbnail = thumbnail;
      }
    });
  }

  // Process otherOptions - image should have only thumbnail format
  if (Array.isArray(data.otherOptions)) {
    data.otherOptions.forEach(item => {
      if (item?.image?.formats) {
        const { thumbnail } = item.image.formats;
        item.image.formats = {};
        if (thumbnail) item.image.formats.thumbnail = thumbnail;
      }
    });
  }

  // Process conversionAccessories - image should have only thumbnail format
  if (Array.isArray(data.conversionAccessories)) {
    data.conversionAccessories.forEach(item => {
      if (item?.image?.formats) {
        const { thumbnail } = item.image.formats;
        item.image.formats = {};
        if (thumbnail) item.image.formats.thumbnail = thumbnail;
      }
    });
  }

  // Process armoringFeatures - image should have only thumbnail format
  if (Array.isArray(data.armoringFeatures)) {
    data.armoringFeatures.forEach(item => {
      if (item?.image?.formats) {
        const { thumbnail } = item.image.formats;
        item.image.formats = {};
        if (thumbnail) item.image.formats.thumbnail = thumbnail;
      }
    });
  }
};

const getLocale = async (id) => {
  const res = await strapi.service("api::vehicles-we-armor.vehicles-we-armor").findOne(id);
  console.log('Found locale:', res?.locale);
  return res?.locale;
};