'use strict';

/**
 * list-inventory router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::list-inventory.list-inventory', {
    config: {
        find: {
            middlewares: ['api::list-inventory.list-inventory-populate']
        }, findOne: {
            middlewares: ['api::list-inventory.list-inventory-populate']
        }
    }
});

