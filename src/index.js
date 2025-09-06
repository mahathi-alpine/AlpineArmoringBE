'use strict';

// URL mappings for different locales
const URL_MAPPINGS = {
  'es': {
    '/contact': '/es/contacto',
    '/about-us': '/es/hacerca-de-nosotros',
    '/all-downloads': '/es/todas-las-descargas',
    '/armored-vehicles-for-sale': '/es/vehiculos-blindados-en-venta',
    '/vehicles-we-armor': '/es/vehiculos-que-blindamos',
    '/ballistic-chart': '/es/tabla-balistica',
    '/ballistic-testing': '/es/pruebas-balisticas',
    '/become-a-dealer': '/es/conviertase-en-distribuidor',
    '/blog': '/es/blog',
    '/design-and-engineering': '/es/diseno-e-ingenieria',
    '/manufacturing': '/es/fabricacion',
    '/locations-we-serve': '/es/ubicaciones-que-servimos',
    '/media': '/es/medios',
    '/media/videos': '/es/medios/videos',
    '/media/trade-shows': '/es/medios/ferias-comerciales',
    '/news': '/es/noticias',
    '/privacy-policy': '/es/politica-de-privacidad',
    '/rental-vehicles': '/es/vehiculos-de-renta',
    '/shipping-and-logistics': '/es/envio-y-logistica',
    '/sold-vehicles': '/es/vehiculos-vendidos',
    '/faqs': '/es/preguntas-frecuentes',
    '/blog/understanding-armor-levels-in-vehicles-nij-cen-and-vpam-standards-explained': '/es/blog/comprension-de-niveles-de-blindaje-en-vehiculos-nij-cen-y-vpam-normas-explicadas',
    '/vehicles-we-armor/armored-mercedes-benz-s580-s-class': '/es/vehiculos-que-blindamos/blindado-mercedes-benz-s580-s-class',
    '/available-now/armored-mercedes-benz-s580-5179': '/es/disponible-ahora/armored-mercedes-benz-s580-5179',
    '/available-now/armored-mercedes-benz-s560-5805': '/es/disponible-ahora/armored-mercedes-benz-s560-5805',
    '/vehicles-we-armor/armored-mercedes-maybach-s-class': '/es/vehiculos-que-blindamos/blindado-mercedes-maybach-s-class',
    '/available-now/armored-mercedes-benz-s580-8905bach': '/es/disponible-ahora/armored-mercedes-benz-s580-8905bach',
    '/vehicles-we-armor/armored-bmw-xm': '/es/vehiculos-que-blindamos/blindado-bmw-xm',
    '/vehicles-we-armor/armored-cadillac-escalade-esv': '/es/vehiculos-que-blindamos/blindado-cadillac-escalade-esv',
    '/vehicles-we-armor/armored-cadillac-escalade-v': '/es/vehiculos-que-blindamos/blindado-cadillac-escalade-v',
    '/vehicles-we-armor/armored-chevrolet-suburban': '/es/vehiculos-que-blindamos/blindado-chevrolet-suburban',
    '/vehicles-we-armor/armored-range-rover': '/es/vehiculos-que-blindamos/telescopico-blindado',
    '/vehicles-we-armor?make=range-rover': '/es/vehiculos-que-blindamos?make=range-rover',
    '/available-now/armored-mercedes-benz-g63-amg-6773': '/es/vehiculos-que-blindamos/armored-mercedes-benz-g63-amg-6773',
    '/vehicles-we-armor/armored-ford-f-350': '/es/vehiculos-que-blindamos/blindado-ford-f-350',
    '/available-now/armored-ford-f-350-lariat-0101': '/es/disponible-ahora/armored-ford-f-350-lariat-0101',
    '/vehicles-we-armor/armored-mastiff-50-cal-truck': '/es/vehiculos-que-blindamos/camion-blindado-mastiff-50-cal'
  }
};

function fixMarkdownLinks(text, locale) {
  if (!text || typeof text !== 'string') return text;
  
  // Fix the bracket issue: [text](</url>) -> [text](/url)
  let fixedText = text.replace(/\]\(<([^>]+)>\)/g, ']($1)');
  
  // Apply URL translations
  const mappings = URL_MAPPINGS[locale];
  if (mappings) {
    // First, handle markdown links: [text](url)
    fixedText = fixedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      const translatedUrl = mappings[url] || url;
      return `[${linkText}](${translatedUrl})`;
    });
    
    // Then, handle standalone URLs
    Object.keys(mappings).forEach(originalUrl => {
      const translatedUrl = mappings[originalUrl];
      if (fixedText.includes(originalUrl)) {
        // Replace only if it's not already inside a markdown link
        fixedText = fixedText.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), (match, offset) => {
          // Check if this URL is inside a markdown link by looking backwards for ](
          const beforeMatch = fixedText.substring(Math.max(0, offset - 20), offset);
          if (beforeMatch.includes('](')) {
            return match; // Don't replace if inside markdown link
          }
          return translatedUrl;
        });
      }
    });
  }
  
  return fixedText;
}

function processContentRecursively(content, locale) {
  if (!content) return content;
  
  if (typeof content === 'string') {
    return fixMarkdownLinks(content, locale);
  }
  
  if (Array.isArray(content)) {
    return content.map(item => processContentRecursively(item, locale));
  }
  
  if (typeof content === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(content)) {
      // Skip system fields, relations, and IDs that shouldn't be processed
      if (['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations', 'created_by_id', 'updated_by_id'].includes(key)) {
        processed[key] = value;
      } else if (key.endsWith('_id') || key.endsWith('Id')) {
        // Skip ID fields completely - don't process them
        processed[key] = value;
      } else if (key === '__component') {
        // Preserve the __component field for dynamic zone components
        processed[key] = value;
      } else {
        processed[key] = processContentRecursively(value, locale);
      }
    }
    return processed;
  }
  
  return content;
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    // Register function runs before initialization
    // Lifecycle hooks should be registered in bootstrap
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {        
    // Keep track of entries being processed to avoid infinite loops
    const processingEntries = new Set();
    
    // Get all content types that have i18n enabled
    const allContentTypes = Object.keys(strapi.contentTypes);
    const i18nContentTypes = allContentTypes.filter(uid => {
      const contentType = strapi.contentTypes[uid];
      // Check if the content type has i18n plugin enabled
      return contentType.pluginOptions?.i18n?.localized === true;
    });
    
    if (i18nContentTypes.length === 0) {
      return;
    }
    
    // Register lifecycle hooks for all i18n enabled content types
    i18nContentTypes.forEach(contentType => {
      
      strapi.db.lifecycles.subscribe({
        models: [contentType],
        
        async afterCreate(event) {
          const { result } = event;
          const entryKey = `${contentType}-${result.id}`;
          
          // Only process non-default locales (assuming 'en' is your default)
          if (result.locale && result.locale !== 'en') {
            
            // Skip if already processing this entry
            if (processingEntries.has(entryKey)) {
              return;
            }
            
            try {
              // Mark entry as being processed
              processingEntries.add(entryKey);
              
              // Fetch the full entry with populated components
              const fullEntry = await strapi.db.query(contentType).findOne({
                where: { id: result.id },
                populate: true
              });
              
              // Process the content after translation
              const processedData = processContentRecursively(fullEntry, result.locale);
              
              // Create a clean data object with only the fields that need updating
              const updateData = {};
              for (const [key, value] of Object.entries(processedData)) {
                // Skip system fields, relations, and any ID fields
                if (!['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations', 'created_by_id', 'updated_by_id'].includes(key) && !key.endsWith('_id') && !key.endsWith('Id')) {
                  // Only include if the value is different from original
                  if (JSON.stringify(value) !== JSON.stringify(fullEntry[key])) {
                    updateData[key] = value;
                  }
                }
              }
              
              if (Object.keys(updateData).length > 0) {
                // Use Entity Service API instead of db.query for component updates
                await strapi.entityService.update(contentType, result.id, {
                  data: updateData
                });
                
                strapi.log.info(`Processed translation links for ${contentType} ID: ${result.id}, locale: ${result.locale}`);
              }
            } catch (error) {
              strapi.log.error(`Error processing translation links for ${contentType}:`, error);
            } finally {
              // Remove from processing set
              processingEntries.delete(entryKey);
            }
          }
        },
        
        async afterUpdate(event) {
          const { result } = event;
          const entryKey = `${contentType}-${result.id}`;
          
          // Only process non-default locales
          if (result.locale && result.locale !== 'en') {
            
            // Skip if already processing this entry
            if (processingEntries.has(entryKey)) {
              return;
            }
            
            try {
              // Mark entry as being processed
              processingEntries.add(entryKey);
              
              // Fetch the full entry with populated components
              const fullEntry = await strapi.db.query(contentType).findOne({
                where: { id: result.id },
                populate: true
              });
              
              // Process the content after translation
              const processedData = processContentRecursively(fullEntry, result.locale);
              
              // Create a clean data object with only the fields that need updating
              const updateData = {};
              for (const [key, value] of Object.entries(processedData)) {
                // Skip system fields, relations, and any ID fields
                const shouldSkip = ['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations', 'created_by_id', 'updated_by_id'].includes(key) || key.endsWith('_id') || key.endsWith('Id');
                
                if (!shouldSkip) {
                  // Only include if the value is different from original
                  if (JSON.stringify(value) !== JSON.stringify(fullEntry[key])) {
                    updateData[key] = value;
                  }
                }
              }
              
              // Only update if there are actual changes
              if (Object.keys(updateData).length > 0) {
                // Use Entity Service API instead of db.query for component updates
                await strapi.entityService.update(contentType, result.id, {
                  data: updateData
                });
                
                strapi.log.info(`Processed translation links for ${contentType} ID: ${result.id}, locale: ${result.locale}`);
              }
            } catch (error) {
              strapi.log.error(`Error processing translation links for ${contentType}:`, error);
            } finally {
              // Remove from processing set
              processingEntries.delete(entryKey);
            }
          }
        }
      });
    });
  },
};