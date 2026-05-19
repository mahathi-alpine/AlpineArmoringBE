'use strict';

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    if (data.slug === undefined) return;

    // Only protect the slug when the update originates from the translate plugin.
    // Reason: translate plugin "copy" mode still pushes the source-locale slug on
    // every re-translation, overwriting any custom slug the editor set. Manual saves
    // from the admin UI must be allowed through unchanged.
    const ctx = strapi.requestContext.get();
    const requestUrl = ctx?.request?.url || '';
    const isTranslateRequest = requestUrl.includes('/translate');

    if (!isTranslateRequest) return;

    const existing = await strapi.entityService.findOne(
      'api::category.category',
      where.id,
      { fields: ['slug'] }
    );
    if (existing?.slug) {
      data.slug = existing.slug;
    }
  },
};
