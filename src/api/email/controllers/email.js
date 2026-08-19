'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

// --- Rate limiting ---------------------------------------------------------------------
// In-memory, per-IP. This endpoint is shared by every Alpine frontend 
// and — unlike Public role permissions — nothing stops it being hit directly, bypassing whatever per-frontend protection (reCAPTCHA, honeypot, rate-limit) each site's own contact-form route runs first. This is the backstop for that.
// Unlike a serverless function's per-instance memory, Strapi is one long-running process, so this map isn't reset on every cold start — makes it a meaningfully stronger backstop here than the same pattern is on an individual frontend's own API route.

const RATE_LIMIT_SHORT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_SHORT_MAX = 5;
const RATE_LIMIT_DAY_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_DAY_MAX = 30;

const rateLimitStore = new Map();
let lastSweepAt = 0;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function isRateLimited(ip) {
  const now = Date.now();

  // Opportunistic TTL cleanup so the map doesn't grow unbounded over the process's
  // lifetime — piggybacks on a normal request instead of needing its own timer.
  // Throttled to once per SWEEP_INTERVAL_MS so it can't become a full-map scan on
  // every single request once the store is past the size threshold.
  if (rateLimitStore.size > 2000 && now - lastSweepAt > SWEEP_INTERVAL_MS) {
    lastSweepAt = now;
    for (const [key, entryTimestamps] of rateLimitStore) {
      const kept = entryTimestamps.filter((t) => now - t < RATE_LIMIT_DAY_WINDOW_MS);
      if (kept.length === 0) rateLimitStore.delete(key);
      else rateLimitStore.set(key, kept);
    }
  }

  const timestamps = (rateLimitStore.get(ip) || []).filter((t) => now - t < RATE_LIMIT_DAY_WINDOW_MS);
  const shortWindowCount = timestamps.filter((t) => now - t < RATE_LIMIT_SHORT_WINDOW_MS).length;
  if (shortWindowCount >= RATE_LIMIT_SHORT_MAX || timestamps.length >= RATE_LIMIT_DAY_MAX) {
    rateLimitStore.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return false;
}

// Same extraction order already used by bot-blocker.js / request-tracker.js in this repo —
// kept consistent rather than introducing a third variant of the same header-fallback chain.
function getClientIp(ctx) {
  return (
    ctx.request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    ctx.request.headers['x-real-ip'] ||
    ctx.request.ip ||
    ctx.ip ||
    null
  );
}

const HONEYPOT_FIELDS = ['hp_field_b7x'];

function honeypotTripped(data) {
  return HONEYPOT_FIELDS.some(
    (field) => typeof data[field] === 'string' && data[field].trim() !== ''
  );
}

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body || {};

    const ip = getClientIp(ctx);
    if (ip && isRateLimited(ip)) {
      console.log('[email] rate-limited', { ip, path: ctx.path, domain: data?.domain || '(none)' });
      ctx.status = 429;
      ctx.body = {
        data: null,
        error: { status: 429, name: 'TooManyRequestsError', message: 'Too many requests' },
      };
      return;
    }

    if (data && honeypotTripped(data)) {
      console.log('[email] honeypot tripped — dropped silently', {
        ip,
        domain: data.domain || '(none)',
      });
      // 2xx so a scripted client doesn't learn which tell caught it — mirrors the shape
      // a real create() call returns, just with no record actually written.
      ctx.status = 200;
      ctx.body = { data: null, meta: {} };
      return;
    }

    // Enforced here too since the API can be called directly, bypassing frontend validation
    const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
    if (!data || isBlank(data.name) || isBlank(data.email)) {
      return ctx.badRequest('Missing required fields');
    }

    // message is optional for: rentals, trade-show landing forms (the-quail, pebble-beach),
    // Pit-Bull configurator (requestPassword/requestInquiry), and skipEmail submissions
    const messageOptional =
      data.domain === 'rentals' ||
      data.domain === 'the-quail' ||
      data.domain === 'pebble-beach' ||
      data.inquiry === 'requestPassword' ||
      data.inquiry === 'requestInquiry' ||
      data.skipEmail;
    if (!messageOptional && isBlank(data.message)) {
      return ctx.badRequest('Missing required fields');
    }

    // Blocks stored-XSS/HTML-injection. anyTagPattern is skipped for "message" so free text
    // like "car < $50000 > budget" isn't rejected; dangerousPattern still applies to it.
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

    // skipEmail forms: submission stored above, no notification email sent
    if (data.skipEmail) {
      console.log('[email] skipEmail set — submission stored, no email sent', {
        inquiry: data.inquiry || '(none)',
      });
      return emailData;
    }

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

    // `label` is the domain banner shown at the top of the email body
    const domainConfig = {
      swats:            { sender: 'EMAIL_SENDER_SWATS',    subject: 'SWAT - Alpine Armoring',        dark: '#006400', light: '#88E788', label: 'SWAT.COM' },
      rentals:          { sender: 'EMAIL_SENDER_RENTALS',  subject: 'Rental - Alpine Armoring',      dark: '#06374e', light: '#84a8cc', label: 'RENTALS.COM' },
      armoring:         { sender: 'EMAIL_SENDER_ARMORING', subject: 'Armoring.com',                  dark: '#BC1948', light: '#F2C6D6', label: 'ARMORING.COM' },
      condor:           { sender: 'EMAIL_SENDER_CONDOR',   subject: 'Condor - Alpine Armoring',      dark: '#E3963E', light: '#F2D2BD', label: 'CONDOR.US' },
      armoredvehicles:  { sender: 'EMAIL_SENDER_ARMOREDVEHICLES',    subject: 'ArmoredVehicles.com', dark: '#101010', light: '#A7A7A7', label: 'ARMOREDVEHICLES.COM' },
      pitbull:          { sender: 'EMAIL_SENDER_PITBULL',  subject: 'Pit-Bull®',                     dark: '#8B0000', light: '#FFCCCB', label: 'PIT-BULL.NET' },
      application:      { sender: 'EMAIL_SENDER_MAIN',    subject: 'Application - Alpine Armoring',  dark: '#FF3300', light: '#ffd2c7', label: 'APPLICATION' },
      vans:             { sender: 'EMAIL_SENDER_VANS',   subject: 'VANS - Alpine Armoring',          dark: '#FFFF00', light: '#ffffc8', label: 'ARMOREDVANS.COM' },
      'pebble-beach':   { sender: 'EMAIL_SENDER_MAIN',   subject: 'Pebble Beach - Alpine Armoring',  dark: '#1B4D3E', light: '#C9A96E', label: 'PEBBLE BEACH' },
      'the-quail':      { sender: 'EMAIL_SENDER_MAIN',   subject: 'The Quail - Alpine Armoring',     dark: '#4A2E2A', light: '#D4AF37', label: 'THE QUAIL' },
    };

    const defaultConfig = { sender: 'EMAIL_SENDER_MAIN', subject: 'Alpine Armoring', dark: '#9c9477', light: '#c3bfaf', label: 'ALPINE ARMORING (MAIN)' };
    const config = domainConfig[domain] || defaultConfig;
    const notMain = domain in domainConfig;

    const sender = process.env[config.sender];

    // Logged to CloudWatch: usually "no email received" means the sender env var isn't set
    console.log('[email] incoming submission', {
      domain: domain || '(none)',
      matchedConfig: domain in domainConfig ? domain : 'default',
      senderEnvVar: config.sender,
      senderValue: sender || '(UNDEFINED — env var not set!)',
      ccSales: domain in domainConfig,
    });
    if (!sender) {
      console.warn(`[email] WARNING: env var ${config.sender} is not set for domain "${domain}" — SES will fail or drop this message.`);
    }

    let subjectPrefix = config.subject;
    const emailColorsDark = config.dark;
    const emailColorsLight = config.light;
    const domainLabel = config.label;
    let mainMessage = '';

    const extractVehicleType = (routeStr) => {
      if (!routeStr) return '';
      const match = routeStr.match(/armored-([^/]+)$/);
      return match ? match[1].toUpperCase() : '';
    };

    const isPitbullConfigurator = inquiry === 'requestPassword' || inquiry === 'requestInquiry';
    const vehicleTypeFromRoute = isPitbullConfigurator ? extractVehicleType(route) : '';

    if (domain === 'pitbull' && isPitbullConfigurator) {
      subjectPrefix = inquiry === 'requestPassword'
        ? `Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator password request`
        : `Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator inquiry`;
      mainMessage = inquiry === 'requestPassword'
        ? `Password request for the Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator`
        : `Inquiry for the Pit-Bull ${vehicleTypeFromRoute}® vehicle configurator`;
    }

    // Hostname match, not exact string match — document.referrer includes the full path.
    // exact=true avoids substring false positives on short domains like 't.co'.
    const referrerIncludes = (referrer, hostname, exact = false) => {
      try {
        const host = new URL(referrer).hostname;
        return exact ? host === hostname : host.includes(hostname);
      } catch {
        return false;
      }
    };

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
        // 't.co' needs exact match to avoid substring false positives (e.g. 'etc.com')
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

      // Debug: log the exact envelope handed to SES so it's traceable in CloudWatch.
      console.log('[email] sending via SES', {
        domain: domain || '(none)',
        to: sender || '(UNDEFINED)',
        from: sender || '(UNDEFINED)',
        cc: notMain ? 'sales@alpineco.com' : '(none)',
        subject: emailSubject,
        leadSource: detectedLeadSource.name,
      });

      await strapi.plugins['email'].services.email.send({
        to: sender,
        from: sender,
        ...((notMain) ? { cc: 'sales@alpineco.com' } : {}),
        subject: emailSubject,
        html: isPitbullConfigurator ? `
          <table style="width:100%;border-collapse:collapse;border-spacing:0px;box-sizing:border-box;font-size:11pt;font-family:Arial,sans-serif;color:black">
            <tbody>
              <tr style="background-color:#000000;">
                <td colspan="2" style="padding:8pt;">
                  <p align="center" style="margin:0in;">
                    <span style="color:#ffffff;font-size:20pt;font-weight:bold;letter-spacing:1px;">${domainLabel}</span>
                  </p>
                </td>
              </tr>
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
              <tr style="background-color:#000000;">
                <td colspan="2" style="padding:8pt;">
                  <p align="center" style="margin:0in;">
                    <span style="color:#ffffff;font-size:20pt;font-weight:bold;letter-spacing:1px;">${domainLabel}</span>
                  </p>
                </td>
              </tr>
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
      // send() only resolves on SES acceptance; delivery failures after this are downstream
      console.log(`[email] sent successfully — domain "${domain}", to ${sender}`);
    } catch (err) {
      console.error(`[email] FAILED to send — domain "${domain}", sender env ${config.sender}=${sender || '(undefined)'}:`, err);
    }

    return emailData;
  },
}));