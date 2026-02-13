'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
  async create(ctx) {
    const emailData = await super.create(ctx);

    const { data } = ctx.request.body;
    const { name, email, mobileNumber, phoneNumber, company, inquiry, preferredContact, hear, country, state, message, route, date, fromDate, toDate, mileage, driverNeeded, vehicleType, vehicleModel, domain, trackingData } = data;

    function getCurrentDateTime() {
      const now = new Date();

      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      const amPm = now.getHours() < 12 ? 'AM' : 'PM';

      return `${month}/${day}/${now.getFullYear()} ${hours}:${minutes} ${amPm}`;
    }

    const formatMessageToHtml = (text) => {
      if (!text) return '';

      return text
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.+?)\*/g, '<i>$1</i>')
        .replace(/\n/g, '<br/>');
    };

    const notMain = domain === 'swats' || domain === 'rentals' || domain === 'pitbull' || domain === 'armoring' || domain === 'condor';
    
    let sender = '';
    let subjectPrefix = '';
    let emailColorsDark = '';
    let emailColorsLight = '';
    let mainMessage = '';

    // Extract vehicle type from route for Pit-Bull configurator
    const extractVehicleType = (routeStr) => {
      if (!routeStr) return '';
      const match = routeStr.match(/armored-([^/]+)$/);
      return match ? match[1].toUpperCase() : '';
    };

    const isPitbullConfigurator = inquiry === 'requestPassword' || inquiry === 'requestInquiry';
    const vehicleTypeFromRoute = isPitbullConfigurator ? extractVehicleType(route) : '';

    if(domain === 'swats'){
      sender = process.env.EMAIL_SENDER_SWATS;
      subjectPrefix = 'SWAT - Alpine Armoring';
      emailColorsDark = '#006400';
      emailColorsLight = '#88E788';
    } else if(domain === 'rentals'){
      sender = process.env.EMAIL_SENDER_RENTALS;
      subjectPrefix = 'Rental - Alpine Armoring';
      emailColorsDark = '#06374e';
      emailColorsLight = '#84a8cc';
    } else if(domain === 'armoring'){
      sender = process.env.EMAIL_SENDER_ARMORING;
      subjectPrefix = 'Armoring.com';
      emailColorsDark = '#06374e';
      emailColorsLight = '#84a8cc';
    } else if(domain === 'condor'){
      sender = process.env.EMAIL_SENDER_CONDOR;
      subjectPrefix = 'Condor - Alpine Armoring';
      emailColorsDark = '#06374e';
      emailColorsLight = '#84a8cc';
    } else if(domain === 'pitbull'){
      sender = process.env.EMAIL_SENDER_PITBULL;
      if (isPitbullConfigurator) {
        subjectPrefix = inquiry === 'requestPassword'
          ? `Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator password request`
          : `Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator inquiry`;
        mainMessage = inquiry === 'requestPassword'
          ? `Password request for the Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator`
          : `Inquiry for the Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator`;
      } else {
        subjectPrefix = 'Pit-Bull®';
      }
      emailColorsDark = '#8B0000';
      emailColorsLight = '#FFCCCB';
    } else if(domain === 'application'){
      sender = 'stefaneste93@gmail.com';
      subjectPrefix = 'Application - Alpine Armoring';
      emailColorsDark = '#06374e';
      emailColorsLight = '#84a8cc';
    } else {
      sender = process.env.EMAIL_SENDER_MAIN;
      subjectPrefix = 'Alpine Armoring';
      emailColorsDark = '#9c9477';
      emailColorsLight = '#c3bfaf';
    }

    const leadSources = [
      {
        name: 'Google Ads',
        color: 'green',
        check: (data) => !!(
          data.gclid ||
          data.gad_source ||
          data.gbraid ||
          data.wbraid ||
          (data.utm_source && data.utm_source.toLowerCase() === 'google' && data.utm_medium && data.utm_medium.toLowerCase() === 'cpc')
        )
      },
      {
        name: 'Google Organic',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://www.google.com/' && !data.gclid)
      },
      {
        name: 'Bing',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://www.bing.com/' && !data.gclid)
      },
      {
        name: 'DuckDuckGo',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://duckduckgo.com/' && !data.gclid)
      },
      {
        name: 'Facebook',
        color: 'orange',
        check: (data) => !!(data.fbclid && !data.gclid)
      },
      {
        name: 'UK search Yahoo',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://uk.search.yahoo.com/' && !data.gclid)
      },
      {
        name: 'Chat GPT',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://chatgpt.com/' && !data.gclid)
      },
      {
        name: 'f150gen14.com (Ford)',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://www.f150gen14.com/' && !data.gclid)
      },
      {
        name: 'Youtube',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://www.youtube.com/' && !data.gclid)
      },
      {
        name: 'Tiktok',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://www.tiktok.com/' && !data.gclid)
      },
      {
        name: 'Alpine Armoring Main Website',
        color: 'orange',
        check: (data) => !!(data.referrer === 'https://www.alpineco.com/' && !data.gclid)
      }
    ];

    const detectedLeadSource = trackingData
      ? leadSources.find(source => source.check(trackingData))
      : null;      
      
    try {
      let emailSubject;
      if (isPitbullConfigurator) {
        emailSubject = subjectPrefix;
      } else if (domain === 'rentals') {
        emailSubject = `${subjectPrefix} - Inquiry from ${name} (${state})`;
      } else {
        emailSubject = `${subjectPrefix} - Inquiry about ${inquiry} from ${name} (${state} ${country})`;
      }

      await strapi.plugins['email'].services.email.send({
        to: sender,
        from: sender,
        ...((notMain && domain !== 'application') ? { cc: 'sales@alpineco.com' } : {}),
        subject: emailSubject,
        html: isPitbullConfigurator ? `
          <table style="width:100%;border-collapse:collapse;border-spacing:0px;box-sizing:border-box;font-size:11pt;font-family:Arial,sans-serif;color:black">
            <tbody>
              <tr style="background-color:${emailColorsDark}; color: white;">
                <td colspan="2" style="padding:1.5pt">
                  <p align="center" style="margin:0in;">
                    <b>Website submission ${getCurrentDateTime()}</b>
                  </p>
                </td>
              </tr>
              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Name:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${name}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Company:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${company}</span></p>
                </td>
              </tr>

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Phone:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${phoneNumber || mobileNumber}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Email:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u><a href="mailto:${email}" style="color:black;margin-top:0px;margin-bottom:0px" target="_blank">${email}</a></u></span></p>
                </td>
              </tr>

              ${inquiry !== 'requestPassword' ? `
              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Selected Options:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${formatMessageToHtml(message)}</span></p>
                </td>
              </tr>
              ` : ''}

              <tr style="background-color:${emailColorsDark}; color: white;">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Referrer page:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u>
                    <a href="${route}" style="color: white; margin-top:0px;margin-bottom:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${route}&amp;source=gmail&amp;ust=1726743921528000&amp;usg=AOvVaw21rcKaKVWd5eFzmb8o8PuT">${route}</a>
                  </u></span></p>
                </td>
              </tr>

              <tr>
                <td colspan="2" style="padding:1.5pt; text-align: center;">
                  <p style="margin:0in;"><span><b>${mainMessage}</b></span></p>
                </td>
              </tr>

              ${detectedLeadSource ? `
                <tr>
                  <td colspan="2" style="padding:1.5pt; text-align: center; color: ${detectedLeadSource.color};">
                    <p style="margin:0in;"><span><b>From ${detectedLeadSource.name}</b></span></p>
                  </td>
                </tr>
              ` : ''}

            </tbody>
          </table>
        ` : `
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
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Name:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${name}</span></p>
                </td>
              </tr>

              ${domain !== 'rentals' ? `
              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Country:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${country}</span></p>
                </td>
              </tr>
              ` : `
              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Mileage:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${mileage}</span></p>
                </td>
              </tr>
              `}

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>State:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${state}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Customer Type:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${company}</span></p>
                </td>
              </tr>

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span"><b>Mobile #:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${mobileNumber}</span></p>
                </td>
              </tr>

              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Phone #:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${phoneNumber}</span></p>
                </td>
              </tr>

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Email:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u><a href="mailto:${email}" style="color:black;margin-top:0px;margin-bottom:0px" target="_blank">${email}</a></u></span></p>
                </td>
              </tr>

              ${domain !== 'rentals' ? `
              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Inquiry:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${inquiry}</span></p>
                </td>
              </tr>
              ` : `
              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Driver Needed:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${driverNeeded}</span></p>
                </td>
              </tr>
              `}

              ${domain !== 'rentals' ? `
              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Contact me via:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${preferredContact}</span></p>
                </td>
              </tr>
              ` : `
              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Vehicle Type:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${vehicleType}</span></p>
                </td>
              </tr>
              `}

              ${domain !== 'rentals' ? `
              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Found via:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${hear}</span></p>
                </td>
              </tr>
              ` : `
              <tr>
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Vehicle Model:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${vehicleModel}</span></p>
                </td>
              </tr>
              `}

              <tr style="background-color:${emailColorsLight};">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Message:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span>${message || ''}</span></p>
                </td>
              </tr>

              ${domain === 'rentals' ? `
                <tr>
                  <td style="padding:1.5pt;width: 120px;">
                    <p style="margin:0in;"><span><b>Projected dates:</b></span></p>
                  </td>
                  <td style="padding:1.5pt">
                    <p style="margin:0in;"><span>From: <b>${fromDate}</b>  To: <b>${toDate}</b></span></p>
                  </td>
                </tr>
              ` : '' }

              <tr style="background-color:${emailColorsDark}; ${notMain ? 'color: white;' : `color: black;`}">
                <td style="padding:1.5pt;width: 120px;">
                  <p style="margin:0in;"><span><b>Referrer page:</b></span></p>
                </td>
                <td style="padding:1.5pt">
                  <p style="margin:0in;"><span style="color:rgb(5,99,193)"><u>
                    <a href="${route}" style="${notMain ? 'color: white;' : `color: black;`} margin-top:0px;margin-bottom:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${route}&amp;source=gmail&amp;ust=1726743921528000&amp;usg=AOvVaw21rcKaKVWd5eFzmb8o8PuT">${route}</a>
                  </u></span></p>
                </td>
              </tr>

              ${detectedLeadSource ? `
                <tr>
                  <td colspan="2" style="padding:1.5pt; text-align: center; color: ${detectedLeadSource.color};">
                    <p style="margin:0in;"><span><b>From ${detectedLeadSource.name}</b></span></p>
                  </td>
                </tr>
              ` : ''}

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