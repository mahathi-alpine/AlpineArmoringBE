'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
  async create(ctx) {
    const emailData = await super.create(ctx);

    const { data } = ctx.request.body;
    const { dates, name, email, mobileNumber, phoneNumber, company, inquiry, preferredContact, hear, country, state, message, route, date } = data;

    // console.log(data)

    function getCurrentDateTime() {
      const now = new Date();
      
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const amPm = now.getHours() < 12 ? 'AM' : 'PM';
      
      return `${month}/${day}/${now.getFullYear()} ${hours}:${minutes} ${amPm}`;
    }
    
    // const emailDomain = testField ? 'rental@armoredautos.com' : 'sales@alpineco.com';
    const emailDomain = dates ? 'stefaneste93@gmail.com' : 'sales@alpineco.com';

    try {
      await strapi.plugins['email'].services.email.send({
        to: emailDomain, 
        subject: `Alpine Armoring - Inquiry about ${inquiry} from ${name} (${state} ${country})`,
        html: `
          <table style="width:100%;border-collapse:collapse;border-spacing:0px;box-sizing:border-box;font-size:11pt;font-family:Arial,sans-serif;color:black">
            <tbody>

              <tr style="background-color:rgb(156,148,119);">
                <td colspan="2" style="padding:1.5pt">
                  <p align="center" style="margin:0in;">
                    <span><b>Website submission ${getCurrentDateTime()}</b></span>
                  </p>
                </td>
              </tr>

              <tr style="background-color:rgb(195,191,175);">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Name:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${name}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Country:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${country}</span></p>
                </td>
              </tr>

              <tr style="background-color:rgb(195,191,175);">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>State:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${state}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Customer Type:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${company}</span></p>
                </td>
              </tr>

              <tr style="background-color:rgb(195,191,175);">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span"><b>Mobile Number:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${mobileNumber}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Phone Number:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${phoneNumber}</span></p>
                </td>
              </tr>

              <tr style="background-color:rgb(195,191,175);">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Email:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u><a href="mailto:${email}" style="color:rgb(5,99,193);margin-top:0px;margin-bottom:0px" target="_blank">${email}</a></u></span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Inquiry:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${inquiry}</span></p>
                </td>
              </tr>

              <tr style="background-color:rgb(195,191,175);">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>I Prefer To Be Contacted Via:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${preferredContact}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>How Did You Hear About Us?</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${hear}</span></p>
                </td>
              </tr>

              <tr style="background-color:rgb(195,191,175);">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Comments:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${message}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Referrer page:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u><a href="https://www.alpineco.com/${route}" style="color:rgb(5,99,193);margin-top:0px;margin-bottom:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.alpineco.com/${route}&amp;source=gmail&amp;ust=1726743921528000&amp;usg=AOvVaw21rcKaKVWd5eFzmb8o8PuT">https://www.alpineco.com/<wbr>${route}</a></u></span></p>
                </td>
              </tr>

            </tbody>
          </table>
        `
      });
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Error sending email:', err);
    }

    return emailData;
  },
}));