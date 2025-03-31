'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
  async create(ctx) {
    const emailData = await super.create(ctx);

    const { data } = ctx.request.body;
    const { name, email, mobileNumber, phoneNumber, company, inquiry, preferredContact, hear, country, state, message, route, date, fromDate, toDate, mileage, driverNeeded, vehicleType, vehicleModel, domain } = data;

    function getCurrentDateTime() {
      const now = new Date();
      
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const amPm = now.getHours() < 12 ? 'AM' : 'PM';
      
      return `${month}/${day}/${now.getFullYear()} ${hours}:${minutes} ${amPm}`;
    }
    const notMain = domain === 'swats' || domain === 'rentals';

    let sender = '';
    let subjectPrefix = '';
    let emailColorsDark = '';
    let emailColorsLight = '';

    if(domain === 'swats'){
      sender = process.env.EMAIL_SENDER_SWATS;
      subjectPrefix = 'Swats Alpine Armoring';
      emailColorsDark = '#2b310a';
      emailColorsLight = '#b7baa7';
    } else if(domain === 'rentals'){
      sender = process.env.EMAIL_SENDER_RENTALS;
      subjectPrefix = 'Rental Alpine Armoring';
      emailColorsDark = '#06374e';
      emailColorsLight = '#84a8cc';
    } else {
      sender = process.env.EMAIL_SENDER_MAIN;
      subjectPrefix = 'Alpine Armoring';
      emailColorsDark = '#9c9477';
      emailColorsLight = '#c3bfaf';
    }

    try {
      await strapi.plugins['email'].services.email.send({
        to: sender, 
        from: sender,
        ...((notMain) ? { cc: 'sales@alpineco.com' } : {}), 
        subject: `${subjectPrefix} - Inquiry${domain === 'rentals' ? ` from ${name} (${state})` : ` about ${inquiry} from ${name} (${state} ${country})`}`,
        html: `
          <table style="width:100%;border-collapse:collapse;border-spacing:0px;box-sizing:border-box;font-size:11pt;font-family:Arial,sans-serif;color:black">
            <tbody>

              <tr style="background-color:${emailColorsDark}; ${notMain ? 'color: white;' : `color: black;`}">
                <td colspan="2" style="padding:1.5pt">
                  <p align="center" style="margin:0in;">
                    <b>Website submission ${getCurrentDateTime()}</b>
                  </p>
                </td>
              </tr>

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Name:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${name}</span></p>
                </td>
              </tr>

              ${domain !== 'rentals' ? `
              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Country:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${country}</span></p>
                </td>
              </tr>
              ` : `
              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Mileage:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${mileage}</span></p>
                </td>
              </tr>
              `}

              <tr style="background-color:${emailColorsLight};">
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

              <tr style="background-color:${emailColorsLight};">
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

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Email:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u><a href="mailto:${email}" style="color:black;margin-top:0px;margin-bottom:0px" target="_blank">${email}</a></u></span></p>
                </td>
              </tr>

              ${domain !== 'rentals' ? `
              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Inquiry:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${inquiry}</span></p>
                </td>
              </tr>
              ` : `
              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Driver Needed:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${driverNeeded}</span></p>
                </td>
              </tr>
              `}

              ${domain !== 'rentals' ? `
              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>I Prefer To Be Contacted Via:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${preferredContact}</span></p>
                </td>
              </tr>
              ` : `
              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Vehicle Type:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${vehicleType}</span></p>
                </td>
              </tr>
              `}

              ${domain !== 'rentals' ? `
              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>How Did You Hear About Us?</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${hear}</span></p>
                </td>
              </tr>
              ` : `
              <tr>
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Vehicle Model:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${vehicleModel}</span></p>
                </td>
              </tr>
              `}

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Comments:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${message}</span></p>
                </td>
              </tr>

              ${domain === 'rentals' ? `
                <tr>
                  <td style="padding:1.5pt;width: 20%;">
                    <p style="margin:0in;"><span><b>Projected dates:</b></span></p>
                  </td>
                  <td style="padding:1.5pt">
                    <p style="margin:0in;"><span>From: <b>${fromDate}</b>  To: <b>${toDate}</b></span></p>
                  </td>
                </tr>
              ` : null }

              <tr style="background-color:${emailColorsDark}; ${notMain ? 'color: white;' : `color: black;`}">
                <td style="padding:1.5pt;width: 20%;">
                  <p style="margin:0in;"><span><b>Referrer page:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u>
                    <a href="${route}" style="${notMain ? 'color: white;' : `color: black;`} margin-top:0px;margin-bottom:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${route}&amp;source=gmail&amp;ust=1726743921528000&amp;usg=AOvVaw21rcKaKVWd5eFzmb8o8PuT">${route}</a>
                  </u></span></p>
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