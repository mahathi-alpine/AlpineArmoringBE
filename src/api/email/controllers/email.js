'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
  async create(ctx) {
    const emailData = await super.create(ctx);

    const { data } = ctx.request.body;
    const { name, email, mobileNumber, phoneNumber, company, inquiry, preferredContact, hear, country, state, message, route, date } = data;

    try {
      await strapi.plugins['email'].services.email.send({
        to: 'sales@alpineco.com', 
        subject: `Alpine Armoring - Inquiry about ${inquiry} from ${name} (${state} ${country})`,
        text: `
          Name: ${name}
          Email: ${email}
          Mobile Number: ${mobileNumber}
          Phone Number: ${phoneNumber}
          Customer Type: ${company}          
          Inquiry: ${inquiry}        
          I Prefer To Be Contacted Via: ${preferredContact}
          How Did You Hear About Us? ${hear}   
          Country: ${country}
          State: ${state}
          Comments: ${message}
          Referrer page: https://www.alpineco.com/${route}
        `,
      });
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Error sending email:', err);
    }

    return emailData;
  },
}));