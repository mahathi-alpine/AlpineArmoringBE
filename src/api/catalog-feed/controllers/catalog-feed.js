'use strict';

/**
 * Escapes a CSV field value.
 * Wraps in double quotes if it contains commas, quotes, or newlines.
 * Internal double quotes are doubled per RFC 4180.
 */
const escapeCsvField = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Strips HTML tags from a string.
 */
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Maps inventory flag to Meta availability value.
 * Reason: Meta expects "in stock" / "out of stock" — we only feed available vehicles,
 * so all included items map to "in stock".
 */
const getAvailability = () => {
  // Reason: "sold" and "coming soon" are filtered out before this point,
  // so "export only", "pre-owned", and null all mean the vehicle is available
  return 'in stock';
};

/**
 * Maps inventory flag to Meta condition value.
 * Reason: "pre-owned" vehicles are used/refurbished; everything else is new.
 */
const getCondition = (flag) => {
  if (flag === 'pre-owned') return 'Used (like new)';
  return 'New';
};

module.exports = {
  index: async (ctx) => {
    try {
      // Using limit: 10000 instead of -1 because -1 gets clamped by config/api.js maxLimit (100).
      const entries = await strapi.entityService.findMany('api::inventory.inventory', {
        filters: {
          publishedAt: { $notNull: true },
          $and: [
            {
              // Reason: hide is a nullable boolean — NULL means "not hidden",
              // but PostgreSQL's `NULL <> true` evaluates to NULL (falsy), excluding those rows
              $or: [
                { hide: { $null: true } },
                { hide: false },
              ],
            },
            {
              // Reason: same NULL issue — flag is null for regular available stock
              $or: [
                { flag: { $null: true } },
                { flag: { $notIn: ['sold', 'coming soon'] } },
              ],
            },
          ],
        },
        locale: 'en',
        populate: {
          featuredImage: true,
          categories: { fields: ['title', 'slug'] },
          vehicles_we_armor: {
            fields: ['title'],
            populate: {
              make: { fields: ['title'] },
            },
          },
        },
        limit: 10000,
      });

      const CSV_HEADERS = [
        'id',
        'title',
        'description',
        'availability',
        'condition',
        'price',
        'link',
        'image_link',
        'brand',
        'vehicle_year',
        'color',
        'mileage',
      ];

      const rows = entries.map((item) => {
        // Determine unique ID: vehicleID → VIN → Strapi id
        const id = item.vehicleID || item.VIN || String(item.id);

        // Description: prefer shortDescription, fallback to stripped richtext
        const description = item.shortDescription || stripHtml(item.description) || '';

        // Build product page URL
        const link = item.slug
          ? `https://www.alpineco.com/available-now/${item.slug}`
          : '';

        // Featured image URL (already includes CDN prefix from S3 provider)
        const imageLink = item.featuredImage?.url || '';

        // Brand: try vehicles_we_armor relation → make → title, then vehicle title, then fallback
        const vehicleModel = item.vehicles_we_armor?.[0];
        const brand = vehicleModel?.make?.title
          || vehicleModel?.title
          || 'Alpine Armoring';

        // Reason: title is a `text` DB field that may contain literal \n characters
        // (e.g. "Armored Toyota\nLand Cruiser 300") — strip them so each CSV row stays on one line
        const title = (item.title || '').replace(/[\r\n]+/g, ' ').trim();

        return [
          id,
          title,
          description,
          getAvailability(item.flag),
          getCondition(item.flag),
          '0.00 USD',
          link,
          imageLink,
          brand,
          item.year || '',
          item.color_ext || '',
          item.miles || '',
        ].map(escapeCsvField).join(',');
      });

      // Reason: UTF-8 BOM (\uFEFF) tells consumers (Excel, WhatsApp) to parse as UTF-8
      // instead of defaulting to Latin-1, which would mangle characters like ®
      const csv = '\uFEFF' + [CSV_HEADERS.join(','), ...rows].join('\n');

      ctx.set('Content-Type', 'text/csv; charset=utf-8');
      ctx.set('Content-Disposition', 'inline; filename="catalog-feed.csv"');
      ctx.body = csv;
    } catch (error) {
      strapi.log.error('catalog-feed error:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to generate catalog feed' };
    }
  },
};
