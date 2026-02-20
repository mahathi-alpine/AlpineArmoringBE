'use strict';

// Mapping of EN vehicle type slugs to ES equivalents (used by regex pass for type+make combos)
const VEHICLE_TYPE_MAP = {
  'special-of-the-month': 'especial-del-mes',
  'armored-suvs': 'suvs-blindados',
  'armored-sedans': 'sedanes-blindados',
  'armored-pickup-trucks': 'camionetas-blindadas',
  'armored-law-enforcement': 'fuerzas-del-orden-blindadas',
  'armored-cash-in-transit-cit': 'transporte-blindado-valores-cit',
  'armored-specialty-vehicles': 'vehiculos-blindados-especiales',
  'armored-pre-owned': 'blindados-pre-usados',
  'recently-sold-armored-vehicles': 'vehiculos-blindados-vendidos-recientemente',
  'armored-rental': 'alquiler-blindados',
  'armored-vans-and-buses': 'furgonetas-y-autobuses-blindados',
};

const SKIP_FIELDS = new Set([
  'id', 'createdAt', 'updatedAt', 'publishedAt',
  'locale', 'localizations', 'created_by_id', 'updated_by_id',
]);

// URL mappings for different locales
const URL_MAPPINGS = {
  'es': {
    // Static / Informational Pages
    '/contact': '/es/contacto',
    '/about-us': '/es/hacerca-de-nosotros',
    '/all-downloads': '/es/todas-las-descargas',
    '/ballistic-chart': '/es/tabla-balistica',
    '/ballistic-testing': '/es/pruebas-balisticas',
    '/become-a-dealer': '/es/conviertase-en-distribuidor',
    '/design-and-engineering': '/es/diseno-e-ingenieria',
    '/manufacturing': '/es/fabricacion',
    '/privacy-policy': '/es/politica-de-privacidad',
    '/shipping-and-logistics': '/es/envio-y-logistica',
    '/sold-vehicles': '/es/vehiculos-vendidos',

    // Media
    '/media': '/es/medios',
    '/media/videos': '/es/medios/videos',
    '/media/trade-shows': '/es/medios/ferias-comerciales',

    // Authors
    '/author/laila-asbergs': '/es/autora/laila-asbergs',
    '/author/dan-diana': '/es/autora/dan-diana',

    // Vehicles We Armor – Listing + Make Filters
    '/vehicles-we-armor': '/es/vehiculos-que-blindamos',
    '/vehicles-we-armor?make=audi': '/es/vehiculos-que-blindamos?make=audi',
    '/vehicles-we-armor?make=bentley': '/es/vehiculos-que-blindamos?make=bentley',
    '/vehicles-we-armor?make=bmw': '/es/vehiculos-que-blindamos?make=bmw',
    '/vehicles-we-armor?make=bulldog': '/es/vehiculos-que-blindamos?make=bulldog',
    '/vehicles-we-armor?make=cadillac': '/es/vehiculos-que-blindamos?make=cadillac',
    '/vehicles-we-armor?make=chevrolet': '/es/vehiculos-que-blindamos?make=chevrolet',
    '/vehicles-we-armor?make=cuda': '/es/vehiculos-que-blindamos?make=cuda',
    '/vehicles-we-armor?make=cyclone': '/es/vehiculos-que-blindamos?make=cyclone',
    '/vehicles-we-armor?make=ford': '/es/vehiculos-que-blindamos?make=ford',
    '/vehicles-we-armor?make=genesis': '/es/vehiculos-que-blindamos?make=genesis',
    '/vehicles-we-armor?make=gmc': '/es/vehiculos-que-blindamos?make=gmc',
    '/vehicles-we-armor?make=honda': '/es/vehiculos-que-blindamos?make=honda',
    '/vehicles-we-armor?make=hummer': '/es/vehiculos-que-blindamos?make=hummer',
    '/vehicles-we-armor?make=infiniti': '/es/vehiculos-que-blindamos?make=infiniti',
    '/vehicles-we-armor?make=ineos': '/es/vehiculos-que-blindamos?make=ineos',
    '/vehicles-we-armor?make=international': '/es/vehiculos-que-blindamos?make=international',
    '/vehicles-we-armor?make=jeep': '/es/vehiculos-que-blindamos?make=jeep',
    '/vehicles-we-armor?make=lamborghini': '/es/vehiculos-que-blindamos?make=lamborghini',
    '/vehicles-we-armor?make=land-rover': '/es/vehiculos-que-blindamos?make=land-rover',
    '/vehicles-we-armor?make=lexus': '/es/vehiculos-que-blindamos?make=lexus',
    '/vehicles-we-armor?make=lincoln': '/es/vehiculos-que-blindamos?make=lincoln',
    '/vehicles-we-armor?make=mastiff': '/es/vehiculos-que-blindamos?make=mastiff',
    '/vehicles-we-armor?make=maybach': '/es/vehiculos-que-blindamos?make=maybach',
    '/vehicles-we-armor?make=mercedes-benz': '/es/vehiculos-que-blindamos?make=mercedes-benz',
    '/vehicles-we-armor?make=nissan': '/es/vehiculos-que-blindamos?make=nissan',
    '/vehicles-we-armor?make=omicron': '/es/vehiculos-que-blindamos?make=omicron',
    '/vehicles-we-armor?make=pit-bull': '/es/vehiculos-que-blindamos?make=pit-bull',
    '/vehicles-we-armor?make=pointer': '/es/vehiculos-que-blindamos?make=pointer',
    '/vehicles-we-armor?make=range-rover': '/es/vehiculos-que-blindamos?make=range-rover',
    '/vehicles-we-armor?make=rolls-royce': '/es/vehiculos-que-blindamos?make=rolls-royce',
    '/vehicles-we-armor?make=tesla': '/es/vehiculos-que-blindamos?make=tesla',
    '/vehicles-we-armor?make=toyota': '/es/vehiculos-que-blindamos?make=toyota',
    '/vehicles-we-armor?make=typhoon': '/es/vehiculos-que-blindamos?make=typhoon',

    // Vehicles We Armor – Type Categories
    '/vehicles-we-armor/type/special-of-the-month': '/es/vehiculos-que-blindamos/tipo/especial-del-mes',
    '/vehicles-we-armor/type/armored-suvs': '/es/vehiculos-que-blindamos/tipo/suvs-blindados',
    '/vehicles-we-armor/type/armored-sedans': '/es/vehiculos-que-blindamos/tipo/sedanes-blindados',
    '/vehicles-we-armor/type/armored-pickup-trucks': '/es/vehiculos-que-blindamos/tipo/camionetas-blindadas',
    '/vehicles-we-armor/type/armored-law-enforcement': '/es/vehiculos-que-blindamos/tipo/fuerzas-del-orden-blindadas',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit': '/es/vehiculos-que-blindamos/tipo/transporte-blindado-valores-cit',
    '/vehicles-we-armor/type/armored-specialty-vehicles': '/es/vehiculos-que-blindamos/tipo/vehiculos-blindados-especiales',
    '/vehicles-we-armor/type/armored-pre-owned': '/es/vehiculos-que-blindamos/tipo/blindados-pre-usados',
    '/vehicles-we-armor/type/recently-sold-armored-vehicles': '/es/vehiculos-que-blindamos/tipo/vehiculos-blindados-vendidos-recientemente',
    '/vehicles-we-armor/type/armored-rental': '/es/vehiculos-que-blindamos/tipo/alquiler-blindados',
    '/vehicles-we-armor/type/armored-vans-and-buses': '/es/vehiculos-que-blindamos/tipo/furgonetas-y-autobuses-blindados',

    // Vehicles We Armor – Individual Vehicles
    '/vehicles-we-armor/armored-audi-a8': '/es/vehiculos-que-blindamos/blindado-audi-a8',
    '/vehicles-we-armor/armored-audi-q7': '/es/vehiculos-que-blindamos/blindado-audi-q7',
    '/vehicles-we-armor/armored-audi-q8': '/es/vehiculos-que-blindamos/blindado-audi-q8',
    '/vehicles-we-armor/armored-audi-s8': '/es/vehiculos-que-blindamos/blindado-audi-s8',
    '/vehicles-we-armor/armored-bentley-bentayga': '/es/vehiculos-que-blindamos/blindado-bentley-bentayga',
    '/vehicles-we-armor/armored-bentley-flying-spur': '/es/vehiculos-que-blindamos/espuela-volante-bentley-blindada',
    '/vehicles-we-armor/armored-bmw-7-series': '/es/vehiculos-que-blindamos/blindado-bmw-serie-7',
    '/vehicles-we-armor/armored-bmw-i7': '/es/vehiculos-que-blindamos/blindado-bmw-i7',
    '/vehicles-we-armor/armored-bmw-x5': '/es/vehiculos-que-blindamos/blindado-bmw-x5',
    '/vehicles-we-armor/armored-bmw-x7': '/es/vehiculos-que-blindamos/blindado-bmw-x7',
    '/vehicles-we-armor/armored-bmw-xm': '/es/vehiculos-que-blindamos/blindado-bmw-xm',
    '/vehicles-we-armor/armored-bulldog-swat-truck': '/es/vehiculos-que-blindamos/blindado-bulldog-swat-truck',
    '/vehicles-we-armor/armored-cadillac-escalade': '/es/vehiculos-que-blindamos/blindado-cadillac-escalade',
    '/vehicles-we-armor/armored-cadillac-escalade-esv': '/es/vehiculos-que-blindamos/blindado-cadillac-escalade-esv',
    '/vehicles-we-armor/armored-cadillac-escalade-iq': '/es/vehiculos-que-blindamos/blindado-cadillac-escalade-iq',
    '/vehicles-we-armor/armored-cadillac-escalade-v': '/es/vehiculos-que-blindamos/blindado-cadillac-escalade-v',
    '/vehicles-we-armor/armored-chevrolet-silverado-1500': '/es/vehiculos-que-blindamos/blindado-chevrolet-silverado-1500',
    '/vehicles-we-armor/armored-chevrolet-silverado-3500': '/es/vehiculos-que-blindamos/blindado-chevrolet-silverado-3500',
    '/vehicles-we-armor/armored-chevrolet-suburban': '/es/vehiculos-que-blindamos/blindado-chevrolet-suburban',
    '/vehicles-we-armor/armored-chevrolet-tahoe': '/es/vehiculos-que-blindamos/blindado-chevrolet-tahoe',
    '/vehicles-we-armor/armored-chevy-express-cit-van': '/es/vehiculos-que-blindamos/blindado-chevy-express-cit-van',
    '/vehicles-we-armor/armored-condor-tactical-suv': '/es/vehiculos-que-blindamos/blindado-condor-tactico-suv',
    '/vehicles-we-armor/armored-cuda-apc-swat': '/es/vehiculos-que-blindamos/blindado-cuda-apc-swat',
    '/vehicles-we-armor/armored-cyclone': '/es/vehiculos-que-blindamos/ciclon-blindado',
    '/vehicles-we-armor/armored-ford-expedition': '/es/vehiculos-que-blindamos/blindado-ford-expedition',
    '/vehicles-we-armor/armored-ford-explorer': '/es/vehiculos-que-blindamos/explorador-blindado',
    '/vehicles-we-armor/armored-ford-explorer-interceptor-ppv': '/es/vehiculos-que-blindamos/blindado-ford-explorer-interceptor-ppv',
    '/vehicles-we-armor/armored-ford-f-150': '/es/vehiculos-que-blindamos/blindado-ford-f-150',
    '/vehicles-we-armor/armored-ford-f-350': '/es/vehiculos-que-blindamos/blindado-ford-f-350',
    '/vehicles-we-armor/armored-ford-f-350-cit-truck': '/es/vehiculos-que-blindamos/camion-cit-ford-f-350-blindado',
    '/vehicles-we-armor/armored-ford-transit-cit': '/es/vehiculos-que-blindamos/blindado-para-transito-cit',
    '/vehicles-we-armor/armored-genesis-g90': '/es/vehiculos-que-blindamos/blindado-genesis-g90',
    '/vehicles-we-armor/armored-genesis-gv-80': '/es/vehiculos-que-blindamos/blindado-genesis-gv-80',
    '/vehicles-we-armor/armored-gmc-savana-cit-van': '/es/vehiculos-que-blindamos/armored-gmc-savana-cit-van',
    '/vehicles-we-armor/armored-gmc-sierra-1500': '/es/vehiculos-que-blindamos/armored-gmc-sierra-1500',
    '/vehicles-we-armor/armored-gmc-yukon': '/es/vehiculos-que-blindamos/armored-gmc-yukon',
    '/vehicles-we-armor/armored-gmc-yukon-xl': '/es/vehiculos-que-blindamos/armored-gmc-yukon-xl',
    '/vehicles-we-armor/armored-grand-wagoneer': '/es/vehiculos-que-blindamos/armored-grand-wagoneer',
    '/vehicles-we-armor/armored-honda-odyssey': '/es/vehiculos-que-blindamos/blindado-honda-odyssey',
    '/vehicles-we-armor/armored-hummer-ev-suv': '/es/vehiculos-que-blindamos/armored-hummer-ev-suv',
    '/vehicles-we-armor/armored-ineos-grenadier': '/es/vehiculos-que-blindamos/armored-ineos-grenadier',
    '/vehicles-we-armor/armored-infiniti-qx-80': '/es/vehiculos-que-blindamos/blindado-infiniti-qx-80',
    '/vehicles-we-armor/armored-international-mv-series-cit-truck': '/es/vehiculos-que-blindamos/blindado-international-mv-series-cit-truck',
    '/vehicles-we-armor/armored-jeep-grand-cherokee': '/es/vehiculos-que-blindamos/blindado-jeep-grand-cherokee',
    '/vehicles-we-armor/armored-jeep-grand-cherokee-l': '/es/vehiculos-que-blindamos/armored-jeep-grand-cherokee-l',
    '/vehicles-we-armor/armored-lamborghini-urus': '/es/vehiculos-que-blindamos/armored-lamborghini-urus',
    '/vehicles-we-armor/armored-land-rover-defender-110': '/es/vehiculos-que-blindamos/blindado-land-rover-defender-110',
    '/vehicles-we-armor/armored-lexus-ls500': '/es/vehiculos-que-blindamos/blindado-lexus-ls500',
    '/vehicles-we-armor/armored-lexus-lx': '/es/vehiculos-que-blindamos/blindado-lexus-lx',
    '/vehicles-we-armor/armored-lincoln-aviator': '/es/vehiculos-que-blindamos/armored-lincoln-aviator',
    '/vehicles-we-armor/armored-lincoln-navigator': '/es/vehiculos-que-blindamos/armored-lincoln-navigator',
    '/vehicles-we-armor/armored-mastiff-50-cal-truck': '/es/vehiculos-que-blindamos/camion-blindado-mastiff-50-cal',
    '/vehicles-we-armor/armored-mercedes-benz-g-class': '/es/vehiculos-que-blindamos/blindado-mercedes-benz-clase-g',
    '/vehicles-we-armor/armored-mercedes-benz-g580-ev': '/es/vehiculos-que-blindamos/blindado-mercedes-benz-g580-ev',
    '/vehicles-we-armor/armored-mercedes-benz-gle': '/es/vehiculos-que-blindamos/armored-mercedes-benz-gle',
    '/vehicles-we-armor/armored-mercedes-benz-gls': '/es/vehiculos-que-blindamos/blindado-mercedes-benz-gls',
    '/vehicles-we-armor/armored-mercedes-benz-s580-s-class': '/es/vehiculos-que-blindamos/blindado-mercedes-benz-s580-s-class',
    '/vehicles-we-armor/armored-mercedes-maybach-gls': '/es/vehiculos-que-blindamos/blindado-mercedes-maybach-gls',
    '/vehicles-we-armor/armored-mercedes-maybach-s-class': '/es/vehiculos-que-blindamos/blindado-mercedes-maybach-s-class',
    '/vehicles-we-armor/armored-nissan-patrol': '/es/vehiculos-que-blindamos/blindado-nissan-patrol',
    '/vehicles-we-armor/armored-omicron-ambulance': '/es/vehiculos-que-blindamos/armored-omicron-ambulance',
    '/vehicles-we-armor/armored-pit-bull-vx': '/es/vehiculos-que-blindamos/blindado-pit-bull-vx',
    '/vehicles-we-armor/armored-pit-bull-vx-50-cal': '/es/vehiculos-que-blindamos/blindado-pit-bull-vx-50-cal',
    '/vehicles-we-armor/armored-pit-bull-vxt': '/es/vehiculos-que-blindamos/blindado-pit-bull-vxt',
    '/vehicles-we-armor/armored-pit-bull-vxt-50-cal': '/es/vehiculos-que-blindamos/blindado-pit-bull-vxt-50-cal',
    '/vehicles-we-armor/armored-pointer-mobile-command': '/es/vehiculos-que-blindamos/mando-movil-puntero-blindado',
    '/vehicles-we-armor/armored-pointer-swat-van-sprinter': '/es/vehiculos-que-blindamos/armored-pointer-swat-van-sprinter',
    '/vehicles-we-armor/armored-pointer-swat-van-transit': '/es/vehiculos-que-blindamos/armored-pointer-swat-van-transit',
    '/vehicles-we-armor/armored-range-rover': '/es/vehiculos-que-blindamos/telescopico-blindado',
    '/vehicles-we-armor/armored-range-rover-sport': '/es/vehiculos-que-blindamos/blindado-range-rover-sport',
    '/vehicles-we-armor/armored-riot-control-tactical-swat-apc-truck': '/es/vehiculos-que-blindamos/camion-blindado-antidisturbios-tactico',
    '/vehicles-we-armor/armored-rivian-r1s': '/es/vehiculos-que-blindamos/blindado-riviano-r1s',
    '/vehicles-we-armor/armored-rivian-r1t': '/es/vehiculos-que-blindamos/blindado-riviano-r1t',
    '/vehicles-we-armor/armored-rolls-royce-cullinan': '/es/vehiculos-que-blindamos/rollos-blindados-royce-cullinan',
    '/vehicles-we-armor/armored-rolls-royce-ghost': '/es/vehiculos-que-blindamos/rollos-blindados-royce-ghost',
    '/vehicles-we-armor/armored-rolls-royce-phantom': '/es/vehiculos-que-blindamos/rollos-blindados-royce-phantom',
    '/vehicles-we-armor/armored-tesla-cybertruck': '/es/vehiculos-que-blindamos/blindado-tesla-cybertruck',
    '/vehicles-we-armor/armored-tesla-model-s': '/es/vehiculos-que-blindamos/blindado-tesla-modelo-s',
    '/vehicles-we-armor/armored-tesla-model-y': '/es/vehiculos-que-blindamos/blindado-tesla-modelo-y',
    '/vehicles-we-armor/armored-toyota-4-runner': '/es/vehiculos-que-blindamos/blindado-toyota-4-runner',
    '/vehicles-we-armor/armored-toyota-ambulance': '/es/vehiculos-que-blindamos/blindado-toyota-ambulancia',
    '/vehicles-we-armor/armored-toyota-camry': '/es/vehiculos-que-blindamos/blindado-toyota-camry',
    '/vehicles-we-armor/armored-toyota-coaster': '/es/vehiculos-que-blindamos/armored-toyota-coaster',
    '/vehicles-we-armor/armored-toyota-fortuner': '/es/vehiculos-que-blindamos/blindado-toyota-fortuner',
    '/vehicles-we-armor/armored-toyota-hiace': '/es/vehiculos-que-blindamos/armored-toyota-hiace',
    '/vehicles-we-armor/armored-toyota-hilux': '/es/vehiculos-que-blindamos/armored-toyota-hilux',
    '/vehicles-we-armor/armored-toyota-land-cruiser-300': '/es/vehiculos-que-blindamos/blindado-toyota-land-cruiser-300',
    '/vehicles-we-armor/armored-toyota-land-cruiser-76': '/es/vehiculos-que-blindamos/blindado-toyota-land-cruiser-76',
    '/vehicles-we-armor/armored-toyota-land-cruiser-78': '/es/vehiculos-que-blindamos/blindado-toyota-land-cruiser-78',
    '/vehicles-we-armor/armored-toyota-land-cruiser-79': '/es/vehiculos-que-blindamos/blindado-toyota-land-cruiser-79',
    '/vehicles-we-armor/armored-toyota-land-cruiser-us': '/es/vehiculos-que-blindamos/blindado-toyota-land-cruiser-us',
    '/vehicles-we-armor/armored-toyota-prado': '/es/vehiculos-que-blindamos/blindado-toyota-prado',
    '/vehicles-we-armor/armored-toyota-sequoia': '/es/vehiculos-que-blindamos/armored-toyota-sequoia',
    '/vehicles-we-armor/armored-toyota-tacoma': '/es/vehiculos-que-blindamos/blindado-toyota-tacoma',
    '/vehicles-we-armor/armored-toyota-tundra': '/es/vehiculos-que-blindamos/armored-toyota-tundra',
    '/vehicles-we-armor/armored-typhoon': '/es/vehiculos-que-blindamos/blindado-tifon',
    '/vehicles-we-armor/armored-volkswagen-atlas': '/es/vehiculos-que-blindamos/armored-volkswagen-atlas',

    // Available Now – Listing
    '/armored-vehicles-for-sale': '/es/vehiculos-blindados-en-venta',

    // Available Now – Type Categories
    '/available-now/type/special-of-the-month': '/es/disponible-ahora/tipo/especial-del-mes',
    '/available-now/type/armored-suvs': '/es/disponible-ahora/tipo/suvs-blindados',
    '/available-now/type/armored-sedans': '/es/disponible-ahora/tipo/sedanes-blindados',
    '/available-now/type/armored-pickup-trucks': '/es/disponible-ahora/tipo/camionetas-blindadas',
    '/available-now/type/armored-law-enforcement': '/es/disponible-ahora/tipo/fuerzas-del-orden-blindadas',
    '/available-now/type/armored-cash-in-transit-cit': '/es/disponible-ahora/tipo/transporte-blindado-valores-cit',
    '/available-now/type/armored-specialty-vehicles': '/es/disponible-ahora/tipo/vehiculos-blindados-especiales',
    '/available-now/type/armored-pre-owned': '/es/disponible-ahora/tipo/blindados-pre-usados',
    '/available-now/type/recently-sold-armored-vehicles': '/es/disponible-ahora/tipo/vehiculos-blindados-vendidos-recientemente',
    '/available-now/type/armored-rental': '/es/disponible-ahora/tipo/alquiler-blindados',
    '/available-now/type/armored-vans-and-buses': '/es/disponible-ahora/tipo/furgonetas-y-autobuses-blindados',

    // Available Now – Individual Vehicles
    '/available-now/armored-cadillac-escalade-esv-4wd-3601': '/es/disponible-ahora/blindado-cadillac-escalade-esv-4wd-3601',
    '/available-now/armored-chevrolet-suburban-high-country-2562': '/es/disponible-ahora/blindado-chevrolet-suburban-high-country-2562',
    '/available-now/armored-condor-6300': '/es/disponible-ahora/armored-condor-6300',
    '/available-now/armored-ford-f-350-lariat-0101': '/es/disponible-ahora/armored-ford-f-350-lariat-0101',
    '/available-now/armored-ford-f-350-lariat-3964': '/es/disponible-ahora/armored-ford-f-350-lariat-3964',
    '/available-now/armored-gmc-yukon-denali-xl-3329': '/es/disponible-ahora/armored-gmc-yukon-denali-xl-3329',
    '/available-now/armored-mercedes-benz-g63-amg-6773': '/es/disponible-ahora/armored-mercedes-benz-g63-amg-6773',
    '/available-now/armored-mercedes-benz-s580-5179': '/es/disponible-ahora/armored-mercedes-benz-s580-5179',
    '/available-now/armored-mercedes-benz-s560-5805': '/es/disponible-ahora/armored-mercedes-benz-s560-5805',
    '/available-now/armored-mercedes-benz-s580-8905bach': '/es/disponible-ahora/armored-mercedes-benz-s580-8905bach',
    '/available-now/armored-mercedes-benz-s580-maybach-7643': '/es/disponible-ahora/armored-mercedes-benz-s580-maybach-7643',
    '/available-now/armored-pointer-van-1600': '/es/disponible-ahora/armored-pointer-van-1600',
    '/available-now/armored-range-rover-autobiography-lwb-0058': '/es/disponible-ahora/armored-range-rover-autobiography-lwb-0058',
    '/available-now/armored-swat-truck-pit-bull-vx-2558': '/es/disponible-ahora/armored-swat-truck-pit-bull-vx-2558',
    '/available-now/armored-swat-truck-pit-bull-vx-4370': '/es/disponible-ahora/armored-swat-truck-pit-bull-vx-4370',
    '/available-now/armored-toyota-land-cruiser-300-1723': '/es/disponible-ahora/armored-toyota-land-cruiser-300-gxr-1723',
    '/available-now/armored-toyota-land-cruiser-300-5978': '/es/disponible-ahora/armored-toyota-land-cruiser-300-gxr-5978',
    '/available-now/tactical-armored-apc-cuda-5017': '/es/disponible-ahora/tactical-armored-apc-cuda-5017',

    // Rental Vehicles
    '/rental-vehicles': '/es/vehiculos-de-renta',
    '/rental-vehicles/armored-range-rover-autobiography-lwb-0058': '/es/vehiculos-de-renta/armored-range-rover-autobiography-lwb-0058',

    // Blog
    '/blog': '/es/blog',
    '/blog/3-reasons-to-consider-purchasing-an-armored-vehicle': '/es/blog/3-razones-para-considerar-la-compra-de-un-vehiculo-acorazado',
    '/blog/alpine-armoring-pit-bull': '/es/blog/alpine-armoring-pit-bull',
    '/blog/armored-vehicles-3-steps-to-help-you-find-the-right-one': '/es/blog/vehiculos-blindados-3-pasos-para-encontrar-el-vehiculo-adecuado',
    '/blog/bridging-the-gap-between-tactical-requirements-and-luxury-expectations': '/es/blog/salvar-la-distancia-entre-los-requisitos-tacticos-y-las-expectativas-de-lujo',
    '/blog/bulletproof-mercedes-amg-g63': '/es/blog/a-prueba-de-balas-mercedes-amg-g63',
    '/blog/how-armored-vehicles-provide-peace-of-mind-for-families': '/es/blog/como-los-vehiculos-acorazados-brindan-tranquilidad-a-las-familias',
    '/blog/how-bulletproof-glass-works': '/es/blog/como-funciona-el-cristal-antibalas',
    '/blog/how-run-flat-tires-keep-you-moving-in-a-crisis': '/es/blog/como-los-neumaticos-de-bloqueo-te-mueven-en-la-crisis',
    '/blog/top-10-bulletproof-cars-the-most-desired-armored-vehicles-in-the-world': '/es/blog/top-10-coches-antibalas-los-vehiculos-acorazados-mas-deseados-del-mundo',
    '/blog/top-security-measures': '/es/blog/medidas-de-maxim-seguridad',
    '/blog/understanding-armor-levels-in-vehicles-nij-cen-and-vpam-standards-explained': '/es/blog/comprension-de-niveles-de-blindaje-en-vehiculos-nij-cen-y-vpam-normas-explicadas',
    '/blog/what-makes-an-armored-car-more-secure-than-other-cars': '/es/blog/por-que-un-coche-blindado-es-mas-seguro-que-otros-coches',
    '/blog/what-you-should-know-about-armored-cars': '/es/blog/lo-que-debe-saber-sobre-los-coches-blindados',
    '/blog/why-the-ultra-wealthy-choose-custom-armored-vehicles': '/es/blog/por-que-los-ultra-salvajes-eligen-vehiculos-blindados-a-medida',

    // News
    '/news': '/es/noticias',
    '/news/alpine-armoring-featured-autoevolution': '/es/noticias/alpine-armoring-featured-autoevolution',
    '/news/alpine-armoring-featured-in-car-and-driver-magazine': '/es/noticias/alpine-armoring-aparece-en-la-revista-car-and-driver',
    '/news/alpine-armoring-featured-in-motortrend': '/es/noticias/alpine-armoring-en-motortrend',
    '/news/alpine-armoring-featured-on-the-drive-com': '/es/noticias/alpine-armoring-en-the-drive-com',
    '/news/alpine-armoring-mastiff-featured-on-hot-cars-com': '/es/noticias/mastin-alpino-blindado-presentado-en-hot-cars-com',
    '/news/alpine-ceo-featured-in-cbs-money-watch-article': '/es/noticias/el-director-ejecutivo-de-alpine-aparece-en-un-articulo-de-cbs-money-watch',
    '/news/alpine-donates-pit-bull-vx-to-tunisia': '/es/noticias/alpine-dona-un-pitbull-vx-a-tunez',
    '/news/alpine-featured-on-hot-cars-com': '/es/noticias/alpine-aparece-en-hot-cars-com',
    '/news/alpine-pit-bull-featured-in-car-and-driver': '/es/noticias/pitbull-alpino-en-car-and-driver',
    '/news/armored-rolls-royce-cullinan': '/es/noticias/rollos-blindados-royce-cullinan',
    '/news/armored-tesla-model-s-withstands-live-fire-ballistic-testing': '/es/noticias/el-tesla-modelo-s-blindado-resiste-pruebas-balisticas-con-fuego-real',
    '/news/iacp-press-release': '/es/noticias/iacp-comunicado-de-prensa',
    '/news/introducing-mastiff': '/es/noticias/introduccion-mastiff',
    '/news/motor-trend-highlights-alpine-armoring': '/es/noticias/motor-trend-aspectos-destacados-del-blindaje-alpino',
    '/news/next-gen-pitbull-vxt-press-release': '/es/noticias/nueva-generacion-pitbull-vxt-comunicado-de-prensa',
    '/news/pitbull-autoevolution-feature': '/es/noticias/pitbull-autoevolution-feature',
    '/news/richmond-police-department-unveils-pit-bull-vx': '/es/noticias/el-departamento-de-policia-de-richmond-presenta-el-pitbull-vx',
    '/news/roswell-pds-newest-addition-alpine-armoring-pit-bull-vx': '/es/noticias/policia-de-roswell-alpine-armoring-pit-bull-vx',
    '/news/typhoon-pressrelease': '/es/noticias/typhoon-comunicado-de-prensa',

    // FAQs – Categories
    '/faqs': '/es/preguntas-frecuentes',
    '/faqs/product-information': '/es/preguntas-frecuentes/informacion-sobre-el-producto',
    '/faqs/safety-and-security': '/es/preguntas-frecuentes/seguridad-y-proteccion',
    '/faqs/purchasing-and-ordering': '/es/preguntas-frecuentes/compras-y-pedidos',
    '/faqs/customization': '/es/preguntas-frecuentes/personalizacion',
    '/faqs/ballistic-protection': '/es/preguntas-frecuentes/proteccion-balistica',
    '/faqs/maintenance-and-support': '/es/preguntas-frecuentes/mantenimiento-y-asistencia',

    // FAQs – Individual Articles
    '/faqs/are-the-suspension-and-brakes-upgraded-to-allow-for-the-extra-weight': '/es/preguntas-frecuentes/estan-las-suspensiones-y-los-frenos-mejorados-para-soportar-el-peso-extra',
    '/faqs/can-civilians-buy-armored-vehicles-in-the-usa': '/es/preguntas-frecuentes/pueden-los-civiles-comprar-vehiculos-blindados-en-us',
    '/faqs/can-i-bulletproof-any-vehicle': '/es/preguntas-frecuentes/puedo-blindar-cualquier-vehiculo',
    '/faqs/can-i-just-add-bulletproof-glass-to-my-vehicle': '/es/preguntas-frecuentes/puedo-anadir-gafas-antibalas-a-mi-vehiculo',
    '/faqs/can-i-send-you-my-vehicle-to-armor': '/es/preguntas-frecuentes/puedo-enviarte-mi-vehiculo-para-armarme',
    '/faqs/do-i-need-a-special-license-to-drive-an-armored-car-in-the-united-states': '/es/preguntas-frecuentes/necesito-un-permiso-especial-para-conducir-un-coche-blindado-en-estados-unidos',
    '/faqs/do-i-need-an-export-license-to-ship-armored-vehicles-outside-of-the-united-states': '/es/preguntas-frecuentes/necesito-una-licencia-de-exportacion-para-transportar-vehiculos-blindados-fuera-de-los-estados-unidos',
    '/faqs/how-do-i-insure-my-armored-car': '/es/preguntas-frecuentes/como-asegurar-mi-coche-blindado',
    '/faqs/how-do-i-know-what-protection-level-i-need': '/es/preguntas-frecuentes/como-se-que-nivel-de-proteccion-necesito',
    '/faqs/how-do-i-pay-for-a-vehicle-and-does-alpine-offer-financing': '/es/preguntas-frecuentes/como-pago-un-vehiculo-y-ofrece-alpine-financiacion',
    '/faqs/how-does-a-warranty-work-on-the-vehicle-itself-and-the-armoring-parts': '/es/preguntas-frecuentes/como-funciona-una-garantia-para-el-vehiculo-y-sus-piezas',
    '/faqs/how-local-police-can-apply-for-federal-or-homeland-security-grants': '/es/preguntas-frecuentes/si-somos-una-jurisdiccion-de-policia-local-como-solicitamos-una-subvencion-federal-estatal-seguridad-hogar-etc',
    '/faqs/how-long-does-it-take-to-have-a-vehicle-armored': '/es/preguntas-frecuentes/cuanto-tiempo-se-necesita-para-tener-un-vehiculo-blindado',
    '/faqs/how-much-armored-weight-is-usually-added-to-these-vehicles': '/es/preguntas-frecuentes/cuanto-peso-adicional-se-suele-anadir-a-estos-vehiculos',
    '/faqs/how-much-does-it-cost-to-get-an-armored-vehicle': '/es/preguntas-frecuentes/cuanto-cuesta-adquirir-un-vehiculo-blindado',
    '/faqs/how-thick-is-bulletproof-glass': '/es/preguntas-frecuentes/que-grosor-tiene-el-cristal-antibalas',
    '/faqs/is-there-a-training-course-that-i-can-take-to-learn-to-operate-an-armored-car': '/es/preguntas-frecuentes/existe-un-curso-de-formacion-para-aprender-a-manejar-un-vehiculo-blindado',
    '/faqs/what-do-people-mean-by-armored-vehicles': '/es/preguntas-frecuentes/que-entiende-la-gente-por-vehiculos-armados',
    '/faqs/why-do-people-need-armored-cars': '/es/preguntas-frecuentes/por-que-necesitan-las-personas-coches-blindados',

    // Locations – Listing only (individual locations handled by regex)
    '/locations-we-serve': '/es/ubicaciones-que-servimos',
  },
};

function fixMarkdownLinks(text, locale) {
  if (!text || typeof text !== 'string') return text;

  // Fix the bracket issue: [text](</url>) -> [text](/url)
  let fixedText = text.replace(/\]\(<([^>]+)>\)/g, ']($1)');

  const mappings = URL_MAPPINGS[locale];
  if (!mappings) return fixedText;

  // Build a single regex that handles markdown links and standalone URLs in one pass.
  // Longest URLs first so longer paths aren't partially matched by shorter ones.
  const escapedUrls = Object.keys(mappings)
    .sort((a, b) => b.length - a.length)
    .map(url => url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  const urlPattern = escapedUrls.join('|');

  // Reason: matching markdown links as the first alternative ensures the entire
  // [text](url) is consumed before the standalone alternative can see the URL.
  const combinedRegex = new RegExp(
    `(\\[[^\\]]+\\]\\()(${urlPattern})(\\))|(${urlPattern})`,
    'g'
  );

  fixedText = fixedText.replace(combinedRegex, (match, linkPrefix, linkUrl, linkSuffix, standaloneUrl) => {
    if (linkPrefix) {
      // Markdown link – translate only the URL portion
      return `${linkPrefix}${mappings[linkUrl] || linkUrl}${linkSuffix}`;
    }
    // Standalone URL
    return mappings[standaloneUrl] || standaloneUrl;
  });

  // Regex passes for ES locale: patterns that can't be covered by static URL_MAPPINGS
  if (locale === 'es') {
    // Translate /locations-we-serve/<slug> URLs (200+ locations handled automatically)
    fixedText = fixedText.replace(
      /\/locations-we-serve\/([^")\s]+)/g,
      '/es/ubicaciones-que-servimos/$1'
    );

    // Translate /vehicles-we-armor/type/<type>?<query> URLs (type+make filter combos)
    fixedText = fixedText.replace(
      /\/vehicles-we-armor\/type\/([\w-]+)(\?[^")\s]*)/g,
      (match, typeSlug, query) => {
        const esType = VEHICLE_TYPE_MAP[typeSlug];
        if (esType) return `/es/vehiculos-que-blindamos/tipo/${esType}${query}`;
        return match;
      }
    );
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
    const { getFullPopulateObject } = require('strapi-plugin-populate-deep/server/helpers');

    // Keep track of entries being processed to avoid infinite loops
    const processingEntries = new Set();

    // Shared handler for afterCreate and afterUpdate
    const processTranslationLinks = async (contentType, result) => {
      const entryKey = `${contentType}-${result.id}`;

      // Only process non-default locales (assuming 'en' is the default)
      if (!result.locale || result.locale === 'en') return;

      // Skip if already processing this entry
      if (processingEntries.has(entryKey)) return;

      try {
        processingEntries.add(entryKey);

        // Reason: getFullPopulateObject returns { populate: { ... } } wrapper —
        // unwrap it so entityService.findOne receives the correct params shape.
        const modelObject = getFullPopulateObject(contentType, 5);
        const populateConfig = modelObject?.populate || modelObject;
        const fullEntry = await strapi.entityService.findOne(contentType, result.id, {
          populate: populateConfig === true ? {} : populateConfig,
        });

        const processedData = processContentRecursively(fullEntry, result.locale);

        // Build update payload with only changed fields
        const updateData = {};
        for (const [key, value] of Object.entries(processedData)) {
          if (SKIP_FIELDS.has(key) || key.endsWith('_id') || key.endsWith('Id')) continue;
          if (JSON.stringify(value) !== JSON.stringify(fullEntry[key])) {
            updateData[key] = value;
          }
        }

        if (Object.keys(updateData).length > 0) {
          // Reason: entityService.update handles dynamic zones (stored in separate
          // component tables) that db.query would silently skip. The processingEntries
          // Set guard above prevents the infinite loop when afterUpdate re-fires.
          await strapi.entityService.update(contentType, result.id, {
            data: updateData,
          });

          strapi.log.info(`Processed translation links for ${contentType} ID: ${result.id}, locale: ${result.locale}`);
        }
      } catch (error) {
        strapi.log.error(`Error processing translation links for ${contentType}:`, error);
      } finally {
        processingEntries.delete(entryKey);
      }
    };

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
          await processTranslationLinks(contentType, event.result);
        },

        async afterUpdate(event) {
          await processTranslationLinks(contentType, event.result);
        }
      });
    });
  },
};
