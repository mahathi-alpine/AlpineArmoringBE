'use strict';

/**
 * list-inventory service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::list-inventory.list-inventory');
