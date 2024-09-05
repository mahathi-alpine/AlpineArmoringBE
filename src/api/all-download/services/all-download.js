'use strict';

/**
 * all-download service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::all-download.all-download');
