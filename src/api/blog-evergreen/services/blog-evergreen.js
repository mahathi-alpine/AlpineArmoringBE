'use strict';

/**
 * blog-evergreen service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blog-evergreen.blog-evergreen');
