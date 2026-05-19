'use strict';

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // If a slug is being written, check whether this entry already has a slug set.
    // If so, preserve it — prevents auto-translation (translate plugin "copy" mode)
    // from overwriting a manually-set slug on re-translation.
    // Reason: the translate plugin always pushes a fresh copy of the source slug,
    // so the only reliable way to protect an existing custom slug is at the lifecycle level.
    if (data.slug !== undefined) {
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
