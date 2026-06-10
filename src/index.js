'use strict';

// Mapping of EN vehicle type slugs to localized equivalents (used by regex pass for type+make combos)
const VEHICLE_TYPE_MAP = {
  es: {
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
  },
  fr: {
    'special-of-the-month': 'offre-du-mois',
    'armored-suvs': 'vus-blindes',
    'armored-sedans': 'berlines-blindees',
    'armored-pickup-trucks': 'camionnettes-blindees',
    'armored-law-enforcement': 'forces-de-lordre-blindees',
    'armored-cash-in-transit-cit': 'transport-de-fonds-blinde',
    'armored-specialty-vehicles': 'vehicules-specialises-blindes',
    'armored-pre-owned': 'blindes-doccasion',
    'recently-sold-armored-vehicles': 'vehicules-blindes-vendus-recemment',
    'armored-rental': 'location-blindee',
    'armored-vans-and-buses': 'fourgons-et-autobus-blindes',
  },
};

// Per-locale prefixes for the regex passes (slugs too numerous for static URL_MAPPINGS).
// Reason: the path segment differs by locale — ES uses /tipo/, FR uses /type/.
const LOCALE_REGEX_CONFIG = {
  es: {
    locationsPrefix: '/es/ubicaciones-que-servimos',
    vehiclesTypePrefix: '/es/vehiculos-que-blindamos/tipo',
  },
  fr: {
    locationsPrefix: '/fr/regions-desservies',
    vehiclesTypePrefix: '/fr/vehicules-que-nous-blindons/type',
  },
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
    '/blog/how-much-does-an-armored-vehicle-cost': '/es/blog/cuanto-cuesta-un-vehiculo-armado',
    '/blog/armored-electric-vehicles-guide': '/es/blog/guia-de-vehiculos-electricos-blindados',

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
  'fr': {
    // Static / Informational Pages
    '/contact': '/fr/contact',
    '/about-us': '/fr/a-propos',
    '/all-downloads': '/fr/tous-les-telechargements',
    '/ballistic-chart': '/fr/tableau-balistique',
    '/ballistic-testing': '/fr/tests-balistiques',
    '/become-a-dealer': '/fr/devenir-concessionnaire',
    '/design-and-engineering': '/fr/conception-et-ingenierie',
    '/manufacturing': '/fr/fabrication',
    '/privacy-policy': '/fr/politique-de-confidentialite',
    '/shipping-and-logistics': '/fr/expedition-et-logistique',
    '/sold-vehicles': '/fr/vehicules-vendus',

    // Media
    '/media': '/fr/medias',
    '/media/videos': '/fr/medias/videos',
    '/media/trade-shows': '/fr/medias/salons-professionnels',

    // Authors
    '/author/laila-asbergs': '/fr/auteur/laila-asbergs',
    '/author/dan-diana': '/fr/auteur/dan-diana',

    // Vehicles We Armor – Listing + Make Filters
    '/vehicles-we-armor': '/fr/vehicules-que-nous-blindons',
    '/vehicles-we-armor?make=audi': '/fr/vehicules-que-nous-blindons?make=audi',
    '/vehicles-we-armor?make=bentley': '/fr/vehicules-que-nous-blindons?make=bentley',
    '/vehicles-we-armor?make=bmw': '/fr/vehicules-que-nous-blindons?make=bmw',
    '/vehicles-we-armor?make=bulldog': '/fr/vehicules-que-nous-blindons?make=bulldog',
    '/vehicles-we-armor?make=cadillac': '/fr/vehicules-que-nous-blindons?make=cadillac',
    '/vehicles-we-armor?make=chevrolet': '/fr/vehicules-que-nous-blindons?make=chevrolet',
    '/vehicles-we-armor?make=cuda': '/fr/vehicules-que-nous-blindons?make=cuda',
    '/vehicles-we-armor?make=cyclone': '/fr/vehicules-que-nous-blindons?make=cyclone',
    '/vehicles-we-armor?make=ford': '/fr/vehicules-que-nous-blindons?make=ford',
    '/vehicles-we-armor?make=genesis': '/fr/vehicules-que-nous-blindons?make=genesis',
    '/vehicles-we-armor?make=gmc': '/fr/vehicules-que-nous-blindons?make=gmc',
    '/vehicles-we-armor?make=honda': '/fr/vehicules-que-nous-blindons?make=honda',
    '/vehicles-we-armor?make=hummer': '/fr/vehicules-que-nous-blindons?make=hummer',
    '/vehicles-we-armor?make=infiniti': '/fr/vehicules-que-nous-blindons?make=infiniti',
    '/vehicles-we-armor?make=ineos': '/fr/vehicules-que-nous-blindons?make=ineos',
    '/vehicles-we-armor?make=international': '/fr/vehicules-que-nous-blindons?make=international',
    '/vehicles-we-armor?make=jeep': '/fr/vehicules-que-nous-blindons?make=jeep',
    '/vehicles-we-armor?make=lamborghini': '/fr/vehicules-que-nous-blindons?make=lamborghini',
    '/vehicles-we-armor?make=land-rover': '/fr/vehicules-que-nous-blindons?make=land-rover',
    '/vehicles-we-armor?make=lexus': '/fr/vehicules-que-nous-blindons?make=lexus',
    '/vehicles-we-armor?make=lincoln': '/fr/vehicules-que-nous-blindons?make=lincoln',
    '/vehicles-we-armor?make=mastiff': '/fr/vehicules-que-nous-blindons?make=mastiff',
    '/vehicles-we-armor?make=maybach': '/fr/vehicules-que-nous-blindons?make=maybach',
    '/vehicles-we-armor?make=mercedes-benz': '/fr/vehicules-que-nous-blindons?make=mercedes-benz',
    '/vehicles-we-armor?make=nissan': '/fr/vehicules-que-nous-blindons?make=nissan',
    '/vehicles-we-armor?make=omicron': '/fr/vehicules-que-nous-blindons?make=omicron',
    '/vehicles-we-armor?make=pit-bull': '/fr/vehicules-que-nous-blindons?make=pit-bull',
    '/vehicles-we-armor?make=pointer': '/fr/vehicules-que-nous-blindons?make=pointer',
    '/vehicles-we-armor?make=range-rover': '/fr/vehicules-que-nous-blindons?make=range-rover',
    '/vehicles-we-armor?make=rolls-royce': '/fr/vehicules-que-nous-blindons?make=rolls-royce',
    '/vehicles-we-armor?make=tesla': '/fr/vehicules-que-nous-blindons?make=tesla',
    '/vehicles-we-armor?make=toyota': '/fr/vehicules-que-nous-blindons?make=toyota',
    '/vehicles-we-armor?make=typhoon': '/fr/vehicules-que-nous-blindons?make=typhoon',

    // Vehicles We Armor – Type Categories
    '/vehicles-we-armor/type/special-of-the-month': '/fr/vehicules-que-nous-blindons/type/offre-du-mois',
    '/vehicles-we-armor/type/armored-suvs': '/fr/vehicules-que-nous-blindons/type/vus-blindes',
    '/vehicles-we-armor/type/armored-sedans': '/fr/vehicules-que-nous-blindons/type/berlines-blindees',
    '/vehicles-we-armor/type/armored-pickup-trucks': '/fr/vehicules-que-nous-blindons/type/camionnettes-blindees',
    '/vehicles-we-armor/type/armored-law-enforcement': '/fr/vehicules-que-nous-blindons/type/forces-de-lordre-blindees',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit': '/fr/vehicules-que-nous-blindons/type/transport-de-fonds-blinde',
    '/vehicles-we-armor/type/armored-specialty-vehicles': '/fr/vehicules-que-nous-blindons/type/vehicules-specialises-blindes',
    '/vehicles-we-armor/type/armored-pre-owned': '/fr/vehicules-que-nous-blindons/type/blindes-doccasion',
    '/vehicles-we-armor/type/recently-sold-armored-vehicles': '/fr/vehicules-que-nous-blindons/type/vehicules-blindes-vendus-recemment',
    '/vehicles-we-armor/type/armored-rental': '/fr/vehicules-que-nous-blindons/type/location-blindee',
    '/vehicles-we-armor/type/armored-vans-and-buses': '/fr/vehicules-que-nous-blindons/type/fourgons-et-autobus-blindes',

    // Vehicles We Armor – Individual Vehicles
    '/vehicles-we-armor/armored-audi-a8': '/fr/vehicules-que-nous-blindons/audi-a8-blindee',
    '/vehicles-we-armor/armored-audi-q7': '/fr/vehicules-que-nous-blindons/audi-q7-blindee',
    '/vehicles-we-armor/armored-audi-q8': '/fr/vehicules-que-nous-blindons/audi-q8-blindee',
    '/vehicles-we-armor/armored-audi-s8': '/fr/vehicules-que-nous-blindons/audi-s8-blindee',
    '/vehicles-we-armor/armored-bentley-bentayga': '/fr/vehicules-que-nous-blindons/bentley-bentayga-blindee',
    '/vehicles-we-armor/armored-bentley-flying-spur': '/fr/vehicules-que-nous-blindons/bentley-flying-spur-blindee',
    '/vehicles-we-armor/armored-bmw-7-series': '/fr/vehicules-que-nous-blindons/bmw-serie-7-blindee',
    '/vehicles-we-armor/armored-bmw-i7': '/fr/vehicules-que-nous-blindons/bmw-i7-blindee',
    '/vehicles-we-armor/armored-bmw-x5': '/fr/vehicules-que-nous-blindons/bmw-x5-blindee',
    '/vehicles-we-armor/armored-bmw-x7': '/fr/vehicules-que-nous-blindons/bmw-x7-blindee',
    '/vehicles-we-armor/armored-bmw-xm': '/fr/vehicules-que-nous-blindons/bmw-xm-blindee',
    '/vehicles-we-armor/armored-bulldog-swat-truck': '/fr/vehicules-que-nous-blindons/camion-blinde-de-type-bulldog-pour-les-forces-dintervention',
    '/vehicles-we-armor/armored-cadillac-escalade': '/fr/vehicules-que-nous-blindons/cadillac-escalade-blindee',
    '/vehicles-we-armor/armored-cadillac-escalade-esv': '/fr/vehicules-que-nous-blindons/cadillac-escalade-esv-blindee',
    '/vehicles-we-armor/armored-cadillac-escalade-iq': '/fr/vehicules-que-nous-blindons/cadillac-escalade-blindee-iq',
    '/vehicles-we-armor/armored-cadillac-escalade-v': '/fr/vehicules-que-nous-blindons/cadillac-escalade-v-blindee',
    '/vehicles-we-armor/armored-chevrolet-silverado-1500': '/fr/vehicules-que-nous-blindons/chevrolet-silverado-1500-blinde',
    '/vehicles-we-armor/armored-chevrolet-silverado-3500': '/fr/vehicules-que-nous-blindons/chevrolet-silverado-3500-blinde',
    '/vehicles-we-armor/armored-chevrolet-suburban': '/fr/vehicules-que-nous-blindons/chevrolet-suburban-blindee',
    '/vehicles-we-armor/armored-chevrolet-tahoe': '/fr/vehicules-que-nous-blindons/chevrolet-tahoe-blinde',
    '/vehicles-we-armor/armored-chevy-express-cit-van': '/fr/vehicules-que-nous-blindons/chevy-express-cit-van-blindee',
    '/vehicles-we-armor/armored-condor-tactical-suv': '/fr/vehicules-que-nous-blindons/suv-tactique-blinde-condor',
    '/vehicles-we-armor/armored-cuda-apc-swat': '/fr/vehicules-que-nous-blindons/vehicule-blinde-cuda-apc-swat',
    '/vehicles-we-armor/armored-cyclone': '/fr/vehicules-que-nous-blindons/cyclone-blinde',
    '/vehicles-we-armor/armored-ford-expedition': '/fr/vehicules-que-nous-blindons/expedition-du-ford-blinde',
    '/vehicles-we-armor/armored-ford-explorer': '/fr/vehicules-que-nous-blindons/ford-explorer-blinde',
    '/vehicles-we-armor/armored-ford-explorer-interceptor-ppv': '/fr/vehicules-que-nous-blindons/ford-explorer-interceptor-blinde-ppv',
    '/vehicles-we-armor/armored-ford-f-150': '/fr/vehicules-que-nous-blindons/ford-f-150-blinde',
    '/vehicles-we-armor/armored-ford-f-350': '/fr/vehicules-que-nous-blindons/ford-f-350-blinde',
    '/vehicles-we-armor/armored-ford-f-350-cit-truck': '/fr/vehicules-que-nous-blindons/camion-ford-f-350-blinde',
    '/vehicles-we-armor/armored-ford-transit-cit': '/fr/vehicules-que-nous-blindons/ford-transit-cit-blinde',
    '/vehicles-we-armor/armored-genesis-g90': '/fr/vehicules-que-nous-blindons/armored-genesis-g90',
    '/vehicles-we-armor/armored-genesis-gv-80': '/fr/vehicules-que-nous-blindons/armored-genesis-gv-80',
    '/vehicles-we-armor/armored-gmc-savana-cit-van': '/fr/vehicules-que-nous-blindons/gmc-savana-cit-van-blindee',
    '/vehicles-we-armor/armored-gmc-sierra-1500': '/fr/vehicules-que-nous-blindons/gmc-sierra-1500-blinde',
    '/vehicles-we-armor/armored-gmc-yukon': '/fr/vehicules-que-nous-blindons/gmc-yukon-blinde',
    '/vehicles-we-armor/armored-gmc-yukon-xl': '/fr/vehicules-que-nous-blindons/gmc-yukon-xl-blinde',
    '/vehicles-we-armor/armored-grand-wagoneer': '/fr/vehicules-que-nous-blindons/grand-wagoneer-blinde',
    '/vehicles-we-armor/armored-honda-odyssey': '/fr/vehicules-que-nous-blindons/honda-odyssey-blindee',
    '/vehicles-we-armor/armored-hummer-ev-suv': '/fr/vehicules-que-nous-blindons/hummer-blinde-electrique-suv',
    '/vehicles-we-armor/armored-ineos-grenadier': '/fr/vehicules-que-nous-blindons/arme-ineos-grenadier',
    '/vehicles-we-armor/armored-infiniti-qx-80': '/fr/vehicules-que-nous-blindons/armored-infiniti-qx-80',
    '/vehicles-we-armor/armored-international-mv-series-cit-truck': '/fr/vehicules-que-nous-blindons/serie-mv-darmored-international-camion-cit',
    '/vehicles-we-armor/armored-jeep-grand-cherokee': '/fr/vehicules-que-nous-blindons/jeep-blindee-grand-cherokee',
    '/vehicles-we-armor/armored-jeep-grand-cherokee-l': '/fr/vehicules-que-nous-blindons/jeep-blindee-grand-cherokee-l',
    '/vehicles-we-armor/armored-lamborghini-urus': '/fr/vehicules-que-nous-blindons/lamborghini-urus-blindee',
    '/vehicles-we-armor/armored-land-rover-defender-110': '/fr/vehicules-que-nous-blindons/land-rover-defender-110-blinde',
    '/vehicles-we-armor/armored-lexus-ls500': '/fr/vehicules-que-nous-blindons/lexus-ls-500-blindee',
    '/vehicles-we-armor/armored-lexus-lx': '/fr/vehicules-que-nous-blindons/lexus-lx-blindee',
    '/vehicles-we-armor/armored-lincoln-aviator': '/fr/vehicules-que-nous-blindons/lincoln-aviator-blindee',
    '/vehicles-we-armor/armored-lincoln-navigator': '/fr/vehicules-que-nous-blindons/lincoln-navigator-blindee',
    '/vehicles-we-armor/armored-mastiff-50-cal-truck': '/fr/vehicules-que-nous-blindons/camion-blinde-equipe-dun-mastiff-de-calibre-50',
    '/vehicles-we-armor/armored-mercedes-benz-g-class': '/fr/vehicules-que-nous-blindons/mercedes-benz-classe-g-blindee',
    '/vehicles-we-armor/armored-mercedes-benz-g580-ev': '/fr/vehicules-que-nous-blindons/mercedes-benz-g580-ev-blindee',
    '/vehicles-we-armor/armored-mercedes-benz-gle': '/fr/vehicules-que-nous-blindons/mercedes-benz-gle-blindee',
    '/vehicles-we-armor/armored-mercedes-benz-gls': '/fr/vehicules-que-nous-blindons/mercedes-benz-gls-blindee',
    '/vehicles-we-armor/armored-mercedes-benz-s580-s-class': '/fr/vehicules-que-nous-blindons/mercedes-benz-classe-s-s580-blindee',
    '/vehicles-we-armor/armored-mercedes-maybach-gls': '/fr/vehicules-que-nous-blindons/mercedes-maybach-gls-blindee',
    '/vehicles-we-armor/armored-mercedes-maybach-s-class': '/fr/vehicules-que-nous-blindons/mercedes-maybach-classe-s-blindee',
    '/vehicles-we-armor/armored-nissan-patrol': '/fr/vehicules-que-nous-blindons/nissan-patrol-blinde',
    '/vehicles-we-armor/armored-omicron-ambulance': '/fr/vehicules-que-nous-blindons/ambulance-blindee-omicron',
    '/vehicles-we-armor/armored-pit-bull-vx': '/fr/vehicules-que-nous-blindons/pitbull-blinde-vx',
    '/vehicles-we-armor/armored-pit-bull-vx-50-cal': '/fr/vehicules-que-nous-blindons/pitbull-blinde-vx-calibre-50',
    '/vehicles-we-armor/armored-pit-bull-vxt': '/fr/vehicules-que-nous-blindons/armored-pit-bull-vxt',
    '/vehicles-we-armor/armored-pit-bull-vxt-50-cal': '/fr/vehicules-que-nous-blindons/pitbull-blinde-vxt-calibre-50',
    '/vehicles-we-armor/armored-pointer-mobile-command': '/fr/vehicules-que-nous-blindons/vehicule-blinde-de-commandement-mobile',
    '/vehicles-we-armor/armored-pointer-swat-van-sprinter': '/fr/vehicules-que-nous-blindons/fourgon-blinde-de-la-brigade-dintervention-speciale-swat-sprinter',
    '/vehicles-we-armor/armored-pointer-swat-van-transit': '/fr/vehicules-que-nous-blindons/fourgon-blinde-de-transport-de-fonds',
    '/vehicles-we-armor/armored-range-rover': '/fr/vehicules-que-nous-blindons/range-rover-blinde',
    '/vehicles-we-armor/armored-range-rover-sport': '/fr/vehicules-que-nous-blindons/range-rover-sport-blinde',
    '/vehicles-we-armor/armored-riot-control-tactical-swat-apc-truck': '/fr/vehicules-que-nous-blindons/camion-blinde-de-controle-des-emeutes-tactique-swat-apc',
    '/vehicles-we-armor/armored-rivian-r1s': '/fr/vehicules-que-nous-blindons/rivian-r1s-blinde',
    '/vehicles-we-armor/armored-rivian-r1t': '/fr/vehicules-que-nous-blindons/rivian-r1t-blinde',
    '/vehicles-we-armor/armored-rolls-royce-cullinan': '/fr/vehicules-que-nous-blindons/rolls-royce-cullinan-blindee',
    '/vehicles-we-armor/armored-rolls-royce-ghost': '/fr/vehicules-que-nous-blindons/rolls-royce-ghost-blindee',
    '/vehicles-we-armor/armored-rolls-royce-phantom': '/fr/vehicules-que-nous-blindons/rolls-royce-phantom-blindee',
    '/vehicles-we-armor/armored-tesla-cybertruck': '/fr/vehicules-que-nous-blindons/tesla-cybertruck-blinde',
    '/vehicles-we-armor/armored-tesla-model-s': '/fr/vehicules-que-nous-blindons/tesla-model-s-blindee',
    '/vehicles-we-armor/armored-tesla-model-y': '/fr/vehicules-que-nous-blindons/tesla-model-y-blindee',
    '/vehicles-we-armor/armored-toyota-4-runner': '/fr/vehicules-que-nous-blindons/toyota-4runner-blindee',
    '/vehicles-we-armor/armored-toyota-ambulance': '/fr/vehicules-que-nous-blindons/ambulance-toyota-blindee',
    '/vehicles-we-armor/armored-toyota-camry': '/fr/vehicules-que-nous-blindons/toyota-camry-blindee',
    '/vehicles-we-armor/armored-toyota-coaster': '/fr/vehicules-que-nous-blindons/toyota-coaster-blindee',
    '/vehicles-we-armor/armored-toyota-fortuner': '/fr/vehicules-que-nous-blindons/toyota-fortuner-blinde',
    '/vehicles-we-armor/armored-toyota-hiace': '/fr/vehicules-que-nous-blindons/toyota-hiace-blinde',
    '/vehicles-we-armor/armored-toyota-hilux': '/fr/vehicules-que-nous-blindons/toyota-hilux-blinde',
    '/vehicles-we-armor/armored-toyota-land-cruiser-300': '/fr/vehicules-que-nous-blindons/toyota-land-cruiser-300-blinde',
    '/vehicles-we-armor/armored-toyota-land-cruiser-76': '/fr/vehicules-que-nous-blindons/toyota-land-cruiser-blinde-76',
    '/vehicles-we-armor/armored-toyota-land-cruiser-78': '/fr/vehicules-que-nous-blindons/toyota-land-cruiser-78-blinde',
    '/vehicles-we-armor/armored-toyota-land-cruiser-79': '/fr/vehicules-que-nous-blindons/toyota-land-cruiser-79-blinde',
    '/vehicles-we-armor/armored-toyota-land-cruiser-us': '/fr/vehicules-que-nous-blindons/toyota-land-cruiser-blinde-etats-unis',
    '/vehicles-we-armor/armored-toyota-prado': '/fr/vehicules-que-nous-blindons/toyota-prado-blinde',
    '/vehicles-we-armor/armored-toyota-sequoia': '/fr/vehicules-que-nous-blindons/toyota-sequoia-blindee',
    '/vehicles-we-armor/armored-toyota-tacoma': '/fr/vehicules-que-nous-blindons/toyota-tacoma-blinde',
    '/vehicles-we-armor/armored-toyota-tundra': '/fr/vehicules-que-nous-blindons/toyota-tundra-blindee',
    '/vehicles-we-armor/armored-typhoon': '/fr/vehicules-que-nous-blindons/tempete-blindee',
    '/vehicles-we-armor/armored-volkswagen-atlas': '/fr/vehicules-que-nous-blindons/volkswagen-atlas-blindee',

    // Available Now – Listing
    '/armored-vehicles-for-sale': '/fr/vehicules-blindes-a-vendre',

    // Available Now – Type Categories
    '/available-now/type/special-of-the-month': '/fr/disponible-maintenant/type/offre-du-mois',
    '/available-now/type/armored-suvs': '/fr/disponible-maintenant/type/vus-blindes',
    '/available-now/type/armored-sedans': '/fr/disponible-maintenant/type/berlines-blindees',
    '/available-now/type/armored-pickup-trucks': '/fr/disponible-maintenant/type/camionnettes-blindees',
    '/available-now/type/armored-law-enforcement': '/fr/disponible-maintenant/type/forces-de-lordre-blindees',
    '/available-now/type/armored-cash-in-transit-cit': '/fr/disponible-maintenant/type/transport-de-fonds-blinde',
    '/available-now/type/armored-specialty-vehicles': '/fr/disponible-maintenant/type/vehicules-specialises-blindes',
    '/available-now/type/armored-pre-owned': '/fr/disponible-maintenant/type/blindes-doccasion',
    '/available-now/type/recently-sold-armored-vehicles': '/fr/disponible-maintenant/type/vehicules-blindes-vendus-recemment',
    '/available-now/type/armored-rental': '/fr/disponible-maintenant/type/location-blindee',
    '/available-now/type/armored-vans-and-buses': '/fr/disponible-maintenant/type/fourgons-et-autobus-blindes',

    // Available Now – Individual Vehicles
    '/available-now/armored-cadillac-escalade-esv-4wd-3601': '/fr/disponible-maintenant/cadillac-escalade-esv-blindee-a-quatre-roues-motrices-3601',
    '/available-now/armored-chevrolet-suburban-high-country-2562': '/fr/disponible-maintenant/chevrolet-suburban-high-country-blindee-2562',
    '/available-now/armored-condor-6300': '/fr/disponible-maintenant/armored-condor-6300',
    '/available-now/armored-ford-f-350-lariat-0101': '/fr/disponible-maintenant/ford-f-350-lariat-blinde-0101',
    '/available-now/armored-ford-f-350-lariat-3964': '/fr/disponible-maintenant/ford-f-350-lariat-blinde-3964',
    '/available-now/armored-gmc-yukon-denali-xl-3329': '/fr/disponible-maintenant/gmc-yukon-denali-xl-blinde-3329',
    '/available-now/armored-mercedes-benz-g63-amg-6773': '/fr/disponible-maintenant/mercedes-benz-g63-amg-blindee-6773',
    '/available-now/armored-mercedes-benz-s580-5179': '/fr/disponible-maintenant/mercedes-benz-s580-blindee-5179',
    '/available-now/armored-mercedes-benz-s560-5805': '/fr/disponible-maintenant/mercedes-benz-s560-blindee-5805',
    '/available-now/armored-mercedes-benz-s580-8905bach': '/fr/disponible-maintenant/mercedes-benz-s580-blindee-8905bach',
    '/available-now/armored-mercedes-benz-s580-maybach-7643': '/fr/disponible-maintenant/armored-mercedes-benz-s580-maybach-7643',
    '/available-now/armored-pointer-van-1600': '/fr/disponible-maintenant/fourgon-blinde-de-transport-de-fonds-1600',
    '/available-now/armored-range-rover-autobiography-lwb-0058': '/fr/disponible-maintenant/range-rover-autobiography-lwb-blindee-0058',
    '/available-now/armored-swat-truck-pit-bull-vx-2558': '/fr/disponible-maintenant/camion-blinde-du-swat-pitbull-vx-2558',
    '/available-now/armored-swat-truck-pit-bull-vx-4370': '/fr/disponible-maintenant/camion-blinde-du-swat-pitbull-vx-4370',
    '/available-now/armored-toyota-land-cruiser-300-1723': '/fr/disponible-maintenant/toyota-land-cruiser-300-blinde-1723',
    '/available-now/armored-toyota-land-cruiser-300-5978': '/fr/disponible-maintenant/toyota-land-cruiser-300-blinde-5978',
    '/available-now/tactical-armored-apc-cuda-5017': '/fr/disponible-maintenant/vehicule-blinde-de-transport-de-troupes-tactique-cuda-5017',

    // Rental Vehicles
    '/rental-vehicles': '/fr/vehicules-de-location',
    '/rental-vehicles/armored-range-rover-autobiography-lwb-0058': '/fr/vehicules-de-location/range-rover-autobiography-lwb-blindee-0058',

    // Blog
    '/blog': '/fr/blog',
    '/blog/3-reasons-to-consider-purchasing-an-armored-vehicle': '/fr/blog/3-raisons-denvisager-lachat-dun-vehicule-blinde',
    '/blog/alpine-armoring-pit-bull': '/fr/blog/alpine-armoring-pitbull',
    '/blog/armored-vehicles-3-steps-to-help-you-find-the-right-one': '/fr/blog/vehicules-blindes-3-etapes-pour-vous-aider-a-trouver-celui-qui-vous-convient',
    '/blog/bridging-the-gap-between-tactical-requirements-and-luxury-expectations': '/fr/blog/combler-le-fosse-entre-les-exigences-tactiques-et-les-attentes-en-matiere-de-luxe',
    '/blog/bulletproof-mercedes-amg-g63': '/fr/blog/mercedes-amg-g63-blindee',
    '/blog/how-armored-vehicles-provide-peace-of-mind-for-families': '/fr/blog/comment-les-vehicules-blindes-apportent-une-tranquillite-desprit-aux-familles',
    '/blog/how-bulletproof-glass-works': '/fr/blog/comment-fonctionne-le-verre-pare-balles',
    '/blog/how-run-flat-tires-keep-you-moving-in-a-crisis': '/fr/blog/comment-les-pneus-run-flat-vous-permettent-de-continuer-a-rouler-en-cas-durgence',
    '/blog/top-10-bulletproof-cars-the-most-desired-armored-vehicles-in-the-world': '/fr/blog/top-10-des-voitures-blindees-les-vehicules-blindes-les-plus-convoites-au-monde',
    '/blog/top-security-measures': '/fr/blog/mesures-de-securite-de-haut-niveau',
    '/blog/understanding-armor-levels-in-vehicles-nij-cen-and-vpam-standards-explained': '/fr/blog/comprendre-les-niveaux-de-blindage-des-vehicules-explication-des-normes-nij-cen-et-vpam',
    '/blog/what-makes-an-armored-car-more-secure-than-other-cars': '/fr/blog/quest-ce-qui-rend-un-vehicule-blinde-plus-sur-que-les-autres-voitures',
    '/blog/what-you-should-know-about-armored-cars': '/fr/blog/ce-quil-faut-savoir-sur-les-vehicules-blindes',
    '/blog/why-the-ultra-wealthy-choose-custom-armored-vehicles': '/fr/blog/pourquoi-les-personnes-extremement-riches-optent-elles-pour-des-vehicules-blindes-sur-mesure',

    // News
    '/news': '/fr/actualites',
    '/news/alpine-armoring-featured-autoevolution': '/fr/actualites/alpine-armoring-en-vedette-autoevolution',
    '/news/alpine-armoring-featured-in-car-and-driver-magazine': '/fr/actualites/alpine-armoring-a-lhonneur-dans-le-magazine-car-and-driver',
    '/news/alpine-armoring-featured-in-motortrend': '/fr/actualites/alpine-armoring-a-lhonneur-dans-motor-trend',
    '/news/alpine-armoring-featured-on-the-drive-com': '/fr/actualites/alpine-armoring-en-vedette-sur-the-drive-com',
    '/news/alpine-armoring-mastiff-featured-on-hot-cars-com': '/fr/actualites/alpine-armoring-mastiff-en-vedette-sur-hotcarscom',
    '/news/alpine-ceo-featured-in-cbs-money-watch-article': '/fr/actualites/le-pdg-dalpine-mis-a-lhonneur-dans-un-article-de-cbs-moneywatch',
    '/news/alpine-donates-pit-bull-vx-to-tunisia': '/fr/actualites/alpine-fait-don-dun-pitbull-vx-a-la-tunisie',
    '/news/alpine-featured-on-hot-cars-com': '/fr/actualites/alpine-en-vedette-sur-hotcarscom',
    '/news/alpine-pit-bull-featured-in-car-and-driver': '/fr/actualites/un-pitbull-alpin-a-lhonneur-dans-car-and-driver',
    '/news/armored-rolls-royce-cullinan': '/fr/actualites/rolls-royce-cullinan-blindee',
    '/news/armored-tesla-model-s-withstands-live-fire-ballistic-testing': '/fr/actualites/une-tesla-model-s-blindee-resiste-a-des-essais-balistiques-en-conditions-reelles',
    '/news/iacp-press-release': '/fr/actualites/communique-de-presse-de-liacp',
    '/news/introducing-mastiff': '/fr/actualites/presentation-du-mastiff',
    '/news/motor-trend-highlights-alpine-armoring': '/fr/actualites/les-points-forts-de-motor-trend-alpine-armoring',
    '/news/next-gen-pitbull-vxt-press-release': '/fr/actualites/communique-de-presse-sur-le-pitbull-vxt-nouvelle-generation',
    '/news/pitbull-autoevolution-feature': '/fr/actualites/pitbull-autoevolution-article',
    '/news/richmond-police-department-unveils-pit-bull-vx': '/fr/actualites/le-service-de-police-de-richmond-devoile-le-pit-bull-vx',
    '/news/roswell-pds-newest-addition-alpine-armoring-pit-bull-vx': '/fr/actualites/roswell-pds-nouvelle-acquisition-alpine-armoring-pit-bull-vx',
    '/news/typhoon-pressrelease': '/fr/actualites/communique-de-presse-sur-le-typhon',

    // FAQs – Categories
    '/faqs': '/fr/faq',
    '/faqs/product-information': '/fr/faq/informations-sur-le-produit',
    '/faqs/safety-and-security': '/fr/faq/securite',
    '/faqs/purchasing-and-ordering': '/fr/faq/achats-et-commandes',
    '/faqs/customization': '/fr/faq/personnalisation',
    '/faqs/ballistic-protection': '/fr/faq/protection-balistique',
    '/faqs/maintenance-and-support': '/fr/faq/maintenance-et-assistance',

    // FAQs – Individual Articles
    '/faqs/are-the-suspension-and-brakes-upgraded-to-allow-for-the-extra-weight': '/fr/faq/la-suspension-et-les-freins-ont-ils-ete-renforces-pour-supporter-le-poids-supplementaire',
    '/faqs/can-civilians-buy-armored-vehicles-in-the-usa': '/fr/faq/les-civils-peuvent-ils-acheter-des-vehicules-blindes-aux-etats-unis',
    '/faqs/can-i-bulletproof-any-vehicle': '/fr/faq/puis-je-blinder-nimporte-quel-vehicule',
    '/faqs/can-i-just-add-bulletproof-glass-to-my-vehicle': '/fr/faq/puis-je-simplement-installer-du-verre-pare-balles-sur-mon-vehicule',
    '/faqs/can-i-send-you-my-vehicle-to-armor': '/fr/faq/puis-je-vous-envoyer-mon-vehicule-pour-le-faire-blinder',
    '/faqs/do-i-need-a-special-license-to-drive-an-armored-car-in-the-united-states': '/fr/faq/faut-il-un-permis-special-pour-conduire-un-fourgon-blinde-aux-etats-unis',
    '/faqs/do-i-need-an-export-license-to-ship-armored-vehicles-outside-of-the-united-states': '/fr/faq/ai-je-besoin-dune-licence-dexportation-pour-expedier-des-vehicules-blindes-en-dehors-des-etats-unis',
    '/faqs/how-do-i-insure-my-armored-car': '/fr/faq/comment-assurer-mon-vehicule-blinde',
    '/faqs/how-do-i-know-what-protection-level-i-need': '/fr/faq/comment-savoir-quel-niveau-de-protection-il-me-faut',
    '/faqs/how-do-i-pay-for-a-vehicle-and-does-alpine-offer-financing': '/fr/faq/comment-puis-je-financer-lachat-dun-vehicule-alpine-propose-t-elle-des-solutions-de-financement',
    '/faqs/how-does-a-warranty-work-on-the-vehicle-itself-and-the-armoring-parts': '/fr/faq/comment-fonctionne-la-garantie-sur-le-vehicule-lui-meme-et-sur-les-elements-de-blindage',
    '/faqs/how-local-police-can-apply-for-federal-or-homeland-security-grants': '/fr/faq/comment-les-services-de-police-locaux-peuvent-ils-solliciter-des-subventions-federales-ou-de-la-securite-interieure',
    '/faqs/how-long-does-it-take-to-have-a-vehicle-armored': '/fr/faq/combien-de-temps-faut-il-pour-faire-blinde-un-vehicule',
    '/faqs/how-much-armored-weight-is-usually-added-to-these-vehicles': '/fr/faq/quel-est-le-poids-de-blindage-generalement-ajoute-a-ces-vehicules',
    '/faqs/how-much-does-it-cost-to-get-an-armored-vehicle': '/fr/faq/combien-coute-lacquisition-dun-vehicule-blinde',
    '/faqs/how-thick-is-bulletproof-glass': '/fr/faq/quelle-est-lepaisseur-du-verre-pare-balles',
    '/faqs/is-there-a-training-course-that-i-can-take-to-learn-to-operate-an-armored-car': '/fr/faq/existe-t-il-une-formation-que-je-pourrais-suivre-pour-apprendre-a-conduire-un-vehicule-blinde',
    '/faqs/what-do-people-mean-by-armored-vehicles': '/fr/faq/que-veut-on-dire-exactement-par-vehicules-blindes',
    '/faqs/why-do-people-need-armored-cars': '/fr/faq/pourquoi-a-t-on-besoin-de-voitures-blindees',

    // Locations – Listing only (individual locations handled by regex)
    '/locations-we-serve': '/fr/regions-desservies',
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
  // Reason: negative lookbehind (?<!\w) on the standalone alternative prevents
  // matching source URLs as substrings inside already-translated URLs.
  // E.g. "/contact" won't match inside "/es/contacto" because "s" precedes it.
  const combinedRegex = new RegExp(
    `(\\[[^\\]]+\\]\\()(${urlPattern})(\\))|((?<!\\w)(?:${urlPattern}))`,
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

  // Regex passes: patterns that can't be covered by static URL_MAPPINGS
  const regexCfg = LOCALE_REGEX_CONFIG[locale];
  if (regexCfg) {
    // Translate /locations-we-serve/<slug> URLs (200+ locations handled automatically)
    fixedText = fixedText.replace(
      /\/locations-we-serve\/([^")\s]+)/g,
      `${regexCfg.locationsPrefix}/$1`
    );

    // Translate /vehicles-we-armor/type/<type>?<query> URLs (type+make filter combos)
    fixedText = fixedText.replace(
      /\/vehicles-we-armor\/type\/([\w-]+)(\?[^")\s]*)/g,
      (match, typeSlug, query) => {
        const mapped = VEHICLE_TYPE_MAP[locale]?.[typeSlug];
        if (mapped) return `${regexCfg.vehiclesTypePrefix}/${mapped}${query}`;
        return match;
      }
    );
  }

  return fixedText;
}

// Reason: DeepL translates URL-only fields (e.g. "/about-us" → "/sobre nosotros"),
// so we can't match EN URLs in the ES text after translation. When enContent is
// provided, walk both trees in parallel: if the EN field value is an exact key in
// URL_MAPPINGS, replace the ES value with the correct mapped URL regardless of what
// DeepL wrote. For richtext with embedded links, fall back to fixMarkdownLinks.
function processContent(content, locale, enContent = undefined) {
  if (!content) return content;

  if (typeof content === 'string') {
    const mappings = URL_MAPPINGS[locale];
    if (mappings && typeof enContent === 'string' && mappings[enContent]) {
      return mappings[enContent];
    }
    return fixMarkdownLinks(content, locale);
  }

  if (Array.isArray(content)) {
    // Zip with EN array if lengths match so dynamic zone components align by index
    if (Array.isArray(enContent) && enContent.length === content.length) {
      return content.map((item, i) => processContent(item, locale, enContent[i]));
    }
    return content.map(item => processContent(item, locale));
  }

  if (typeof content === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(content)) {
      if (SKIP_FIELDS.has(key) || key.endsWith('_id') || key.endsWith('Id') || key === '__component') {
        processed[key] = value;
      } else {
        processed[key] = processContent(value, locale, enContent?.[key]);
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
    const processTranslationLinks = async (contentType, event) => {
      const { result } = event;
      const entryKey = `${contentType}-${result.id}`;

      // Only process non-default locales (assuming 'en' is the default)
      if (!result.locale || result.locale === 'en') return;

      // Reason: When an English entry is saved, Strapi's i18n plugin syncs
      // non-localized fields to the Spanish entry, triggering afterUpdate.
      // That sync doesn't change any localized text fields, so there are
      // no URLs to rewrite. Detect this by checking event.params.data.
      const schema = strapi.contentTypes[contentType];
      const changedKeys = Object.keys(event.params?.data || {});
      const hasLocalizedTextChange = changedKeys.some(key => {
        const attr = schema.attributes[key];
        if (!attr) return false;
        const isLocalized = attr.pluginOptions?.i18n?.localized !== false;
        const isText = ['string', 'text', 'richtext'].includes(attr.type);
        return isLocalized && isText;
      });

      if (!hasLocalizedTextChange && changedKeys.length > 0) {
        return;
      }

      // Skip if already processing this entry
      if (processingEntries.has(entryKey)) return;

      try {
        processingEntries.add(entryKey);

        // Reason: getFullPopulateObject returns { populate: { ... } } wrapper —
        // unwrap it so entityService.findOne receives the correct params shape.
        const modelObject = getFullPopulateObject(contentType, 2);
        const populateConfig = modelObject?.populate || modelObject;
        const fullEntry = await strapi.entityService.findOne(contentType, result.id, {
          populate: {
            ...(populateConfig === true ? {} : populateConfig),
            // Ensure localizations includes locale so we can find the EN entry
            localizations: { fields: ['id', 'locale'] },
          },
        });

        // Fetch the EN entry so we can detect DeepL-mangled URL fields by comparing
        // the EN value against URL_MAPPINGS rather than searching the ES text.
        let enEntry = null;
        const enLocalization = fullEntry.localizations?.find(l => l.locale === 'en');
        if (enLocalization) {
          enEntry = await strapi.entityService.findOne(contentType, enLocalization.id, {
            populate: populateConfig === true ? {} : populateConfig,
          });
        }

        const processedData = processContent(fullEntry, result.locale, enEntry || undefined);

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

        afterCreate(event) {
          processTranslationLinks(contentType, event);
        },

        afterUpdate(event) {
          processTranslationLinks(contentType, event);
        }
      });
    });
  },
};
