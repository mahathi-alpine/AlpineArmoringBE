'use strict';

/**
 * application-about service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::application-about.application-about');
