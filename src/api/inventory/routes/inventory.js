'use strict';

/**
 * inventory router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::inventory.inventory', {
    config: {
        find: {
            middlewares: ['api::inventory.inventory-populate']
        }, findOne: {
            middlewares: ['api::inventory.inventory-populate']
        }
    }
});
