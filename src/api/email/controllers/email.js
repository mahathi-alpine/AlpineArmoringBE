// 'use strict';

// /**
//  * email controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::email.email');

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
 async create(ctx) {
    // Call the original create method to save the email data
    const emailData = await strapi.service('api::email.email').create(ctx.request.body);

    // Extract necessary data from the request body
    const { email, name, message } = ctx.request.body;
    console.log(email)


    // Send the email using the configured email provider
    // await strapi.plugins['email'].services.email.send({
    //   to: 'recipient@example.com', 
    //   from: 'your-email@example.com', 
    //   subject: 'New Contact Form Submission',
    //   text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    // });

    // Return the saved email data
    ctx.send(emailData);
 },
}));