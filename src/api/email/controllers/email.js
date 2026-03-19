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

    // Domain-specific email configuration
    const domainConfig = {
      swats:            { sender: 'EMAIL_SENDER_SWATS',    subject: 'SWAT - Alpine Armoring',        dark: '#006400', light: '#88E788' },
      rentals:          { sender: 'EMAIL_SENDER_RENTALS',  subject: 'Rental - Alpine Armoring',      dark: '#06374e', light: '#84a8cc' },
      armoring:         { sender: 'EMAIL_SENDER_ARMORING', subject: 'Armoring.com',                  dark: '#BC1948', light: '#171717' },
      condor:           { sender: 'EMAIL_SENDER_CONDOR',   subject: 'Condor - Alpine Armoring',      dark: '#E3963E', light: '#F2D2BD' },
      armoredvehicles:  { sender: 'EMAIL_SENDER_MAIN',    subject: 'ArmoredVehicles.com',            dark: '#101010', light: '#A7A7A7' },
      pitbull:          { sender: 'EMAIL_SENDER_PITBULL',  subject: 'Pit-Bull®',                     dark: '#8B0000', light: '#FFCCCB' },
      application:      { sender: 'EMAIL_SENDER_MAIN',    subject: 'Application - Alpine Armoring',  dark: '#FF3300', light: '#ffd2c7' },
    };

    const defaultConfig = { sender: 'EMAIL_SENDER_MAIN', subject: 'Alpine Armoring', dark: '#9c9477', light: '#c3bfaf' };
    const config = domainConfig[domain] || defaultConfig;
    const notMain = domain in domainConfig;

    const sender = process.env[config.sender];
    let subjectPrefix = config.subject;
    const emailColorsDark = config.dark;
    const emailColorsLight = config.light;
    let mainMessage = '';

    // Extract vehicle type from route for Pit-Bull configurator
    const extractVehicleType = (routeStr) => {
      if (!routeStr) return '';
      const match = routeStr.match(/armored-([^/]+)$/);
      return match ? match[1].toUpperCase() : '';
    };

    const isPitbullConfigurator = inquiry === 'requestPassword' || inquiry === 'requestInquiry';
    const vehicleTypeFromRoute = isPitbullConfigurator ? extractVehicleType(route) : '';

    // Pit-Bull configurator overrides subject and adds a main message
    if (domain === 'pitbull' && isPitbullConfigurator) {
      subjectPrefix = inquiry === 'requestPassword'
        ? `Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator password request`
        : `Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator inquiry`;
      mainMessage = inquiry === 'requestPassword'
        ? `Password request for the Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator`
        : `Inquiry for the Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator`;
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
        ...((notMain) ? { cc: 'sales@alpineco.com' } : {}),
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