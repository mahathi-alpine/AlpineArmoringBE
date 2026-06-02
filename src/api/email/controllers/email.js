'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body || {};

    // Guard 1: required fields must be present. The frontend forms block empty submits,
    // but direct API calls / bots bypass the frontend — so enforce it here too.
    // Reason: prevents blank junk records and blank emails to sales@.
    const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
    if (!data || isBlank(data.name) || isBlank(data.email)) {
      return ctx.badRequest('Missing required fields');
    }

    // message is required for normal contact forms, but the rentals form and the Pit-Bull
    // configurator flows (requestPassword / requestInquiry) legitimately omit it — so don't
    // require it there, otherwise those valid submissions would be wrongly rejected.
    const messageOptional =
      data.domain === 'rentals' ||
      data.inquiry === 'requestPassword' ||
      data.inquiry === 'requestInquiry';
    if (!messageOptional && isBlank(data.message)) {
      return ctx.badRequest('Missing required fields');
    }

    // Guard 2: reject submissions containing HTML/script injection.
    // Reason: blocks stored-XSS / email HTML-injection at the source.
    // dangerousPattern catches genuinely harmful content in ANY field — script/iframe/embed
    // tags, links and images (phishing / tracking pixels), javascript: URLs, and inline event
    // handlers. anyTagPattern additionally rejects any other HTML-looking tag (e.g. "<b>") in
    // the short fields. The free-text "message" is exempt from anyTagPattern so people can write
    // stray comparisons like "I want a car < $50000 > my budget"; dangerousPattern still guards it.
    const dangerousPattern = /<\s*\/?\s*(?:script|iframe|object|embed|a|img|svg|link|style|form|input|base|meta)\b|javascript:|on\w+\s*=/i;
    const anyTagPattern = /<\s*\/?\s*[a-z][^>]*>/i;
    const hasInjection = Object.entries(data).some(([key, value]) => {
      if (typeof value !== 'string') return false;
      if (dangerousPattern.test(value)) return true;
      return key !== 'message' && anyTagPattern.test(value);
    });
    if (hasInjection) {
      return ctx.badRequest('Invalid input');
    }

    const emailData = await super.create(ctx);

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
      armoredvehicles:  { sender: 'EMAIL_SENDER_ARMOREDVEHICLES',    subject: 'ArmoredVehicles.com', dark: '#101010', light: '#A7A7A7' },
      pitbull:          { sender: 'EMAIL_SENDER_PITBULL',  subject: 'Pit-Bull®',                     dark: '#8B0000', light: '#FFCCCB' },
      application:      { sender: 'EMAIL_SENDER_MAIN',    subject: 'Application - Alpine Armoring',  dark: '#FF3300', light: '#ffd2c7' },
      vans:             { sender: 'EMAIL_SENDER_VANS',   subject: 'VANS - Alpine Armoring',          dark: '#1a1d1a', light: '#f0eee9' },
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

    // Reason: exact referrer matching (e.g. === 'https://www.google.com/') misses most traffic
    // because document.referrer includes full URL path. Hostname-based matching fixes this.
    // When exact is true, hostname must match exactly (needed for short domains like 't.co'
    // to avoid substring false positives).
    const referrerIncludes = (referrer, hostname, exact = false) => {
      try {
        const host = new URL(referrer).hostname;
        return exact ? host === hostname : host.includes(hostname);
      } catch {
        return false;
      }
    };

    // Reason: most lead sources share the same pattern — match referrer hostname and exclude gclid.
    // This helper builds those check functions from a simple hostname list, reducing repetition.
    const referrerSource = (hostname, exact = false) =>
      (data) => !!(referrerIncludes(data.referrer, hostname, exact) && !data.gclid);

    const leadSources = [
      // Paid sources first — most valuable to identify
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
        name: 'Microsoft Ads',
        color: 'green',
        check: (data) => !!data.msclkid
      },
      {
        name: 'Facebook',
        color: 'blue',
        check: (data) => !!(data.fbclid && !data.gclid)
      },
      // AI tools
      { name: 'ChatGPT',          color: 'orange', check: referrerSource('chatgpt.com') },
      { name: 'Gemini',           color: 'orange', check: referrerSource('gemini.google.com') },
      { name: 'Claude',           color: 'orange', check: referrerSource('claude.ai') },
      { name: 'Perplexity',       color: 'orange', check: referrerSource('perplexity.ai') },
      { name: 'Microsoft Copilot', color: 'orange', check: referrerSource('copilot.microsoft.com') },
      // Organic search
      { name: 'Google Organic',   color: 'orange', check: referrerSource('google.com') },
      { name: 'Bing',             color: 'orange', check: referrerSource('bing.com') },
      { name: 'DuckDuckGo',       color: 'orange', check: referrerSource('duckduckgo.com') },
      { name: 'Yahoo',            color: 'orange', check: referrerSource('yahoo.com') },
      { name: 'Baidu',            color: 'orange', check: referrerSource('baidu.com') },
      { name: 'Yandex',           color: 'orange', check: referrerSource('yandex') },
      // Social media
      { name: 'YouTube',          color: 'orange', check: referrerSource('youtube.com') },
      { name: 'TikTok',           color: 'orange', check: referrerSource('tiktok.com') },
      { name: 'LinkedIn',         color: 'orange', check: referrerSource('linkedin.com') },
      {
        // Reason: 't.co' needs exact hostname match to avoid substring false positives (e.g. 'etc.com')
        name: 'Twitter/X',
        color: 'orange',
        check: (data) => !!(
          (referrerIncludes(data.referrer, 't.co', true) || referrerIncludes(data.referrer, 'x.com')) && !data.gclid
        )
      },
      { name: 'Instagram',        color: 'orange', check: referrerSource('instagram.com') },
      { name: 'Reddit',           color: 'orange', check: referrerSource('reddit.com') },
      { name: 'Pinterest',        color: 'orange', check: referrerSource('pinterest.com') },
      // Referral sites
      { name: 'f150gen14.com (Ford)',          color: 'orange', check: referrerSource('f150gen14.com') },
      { name: 'Alpine Armoring Main Website',  color: 'orange', check: referrerSource('alpineco.com') }
    ];

    const detectedLeadSource = trackingData
      ? leadSources.find(source => source.check(trackingData)) || { name: 'Direct', color: 'gray' }
      : { name: 'Direct', color: 'gray' };
      
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

              <tr>
                <td colspan="2" style="padding:1.5pt; text-align: center; color: ${detectedLeadSource.color};">
                  <p style="margin:0in;"><span><b>From ${detectedLeadSource.name}</b></span></p>
                </td>
              </tr>

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

              <tr>
                <td colspan="2" style="padding:1.5pt; text-align: center; color: ${detectedLeadSource.color};">
                  <p style="margin:0in;"><span><b>From ${detectedLeadSource.name}</b></span></p>
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