'use strict';

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Safety net: if slug is being explicitly cleared (null or empty string), preserve
    // the existing value. Manual slug changes (non-empty value) are always allowed through.
    // Reason: guards against edge cases where something sends an empty slug (e.g. a future
    // plugin or script), without blocking intentional edits.
    if (data.slug !== undefined && !data.slug) {
      const existing = await strapi.entityService.findOne(
        'api::category.category',
        where.id,
        { fields: ['slug'] }
      );
      if (existing?.slug) {
        data.slug = existing.slug;
      }
    }
  },
};
