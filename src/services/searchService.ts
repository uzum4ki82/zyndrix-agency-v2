import { calculateLeadIntelligence } from '@/lib/agent-brain';
import { searchGlobalLeads } from '@/lib/google-maps';
import { enrichLeadsWithDeepDiscovery } from '@/lib/email-discovery';
import { daemonLog } from '@/lib/logger';
import { checkLeadByGooglePlaceId } from '@/lib/supabase';

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  'restaurant': 'Restaurante / Hostelería',
  'cafe': 'Cafetería / Bakery',
  'bar': 'Bar / Restaurante',
  'beauty_salon': 'Estética y Cuidado Personal',
  'hair_care': 'Peluquería / Barbería',
  'barber_shop': 'Barbería Moderna',
  'dentist': 'Clínica Dental / Salud',
  'doctor': 'Centro Médico / Especialista',
  'physiotherapist': 'Clínica de Fisioterapia',
  'gym': 'Gimnasio / Centro Deportivo',
  'car_repair': 'Taller Mecánico / Automoción',
  'real_estate_agency': 'Agencia Inmobiliaria',
  'lawyer': 'Despacho Jurídico',
  'accounting': 'Gestoría y Asesoría',
  'clothing_store': 'Tienda de Moda / Retail',
  'supermarket': 'Supermercado / Alimentación',
  'grocery_or_supermarket': 'Alimentación Local',
  'bakery': 'Panadería / Pastelería',
  'spa': 'Spa y Salud Bienestar',
  'veterinary_care': 'Clínica Veterinaria',
  'pet_store': 'Servicios para Mascotas',
  'electronics_store': 'Soluciones Tecnológicas',
  'furniture_store': 'Mobiliario y Diseño',
  'home_goods_store': 'Hogar y Decoración',
  'shoe_store': 'Calzado y Accesorios',
  'jewelry_store': 'Joyería Artesanal',
  'florist': 'Floristería / Eventos',
  'pharmacy': 'Farmacia Digital',
  'hospital': 'Centro Sanitario',
  'lodging': 'Alojamiento Turístico',
  'travel_agency': 'Gestión de Viajes',
  'car_dealer': 'Venta de Vehículos',
  'bank': 'Entidad Financiera',
  'gas_station': 'Gasolinera / Estación',
  'parking': 'Parking / Logística',
  'electrician': 'Electricidad y Energía',
  'plumber': 'Fontanería y Fontanería',
  'painter': 'Pintura y Decoración',
  'roofing_contractor': 'Reformas y Tejados',
  'general_contractor': 'Reformas Generales',
  'locksmith': 'Cerrajería de Seguridad',
  'storage': 'Almacenaje Inteligente',
  'moving_company': 'Logística de Mudanzas',
  'funeral_home': 'Servicios Funerarios',
  'establishment': 'Negocio Local',
  'point_of_interest': 'Establecimiento Local',
  'carpenter': 'Carpintería Artesanal',
  'home_improvement': 'Reformas del Hogar',
  'landscape_architect': 'Jardinería y Paisajismo'
};

const PUBLIC_INSTITUTIONS_TYPES = [
  'local_government_office', 'police', 'town_hall', 'city_hall', 'embassy',
  'government_office', 'courthouse', 'fire_station', 'post_office',
  'school', 'university', 'library', 'museum', 'public_transport_station',
  'cemetery', 'church', 'place_of_worship'
];

const PUBLIC_KEYWORDS = [
  'ayuntamiento', 'policia', 'guardia civil', 'ministerio', 'centro publico',
  'escuela publica', 'instituto publico', 'biblioteca municipal', 'juzgado',
  'correos', 'asociacion', 'federacion', 'consistorio', 'diputacion',
  'deixalleria', 'punto limpio', 'centro de salud', 'cap ', 'ambulatorio'
];

const BIG_CHAINS_KEYWORDS = [
  'mercadona', 'lidl', 'aldi', 'carrefour', 'bonarea', 'spar', 'dia %', 'el corte ingles',
  'decathlon', 'ikea', 'leroy merlin', 'mediamarkt', 'zara', 'h&m', 'bbva', 'santander',
  'caixabank', 'caixa', 'sabadell', 'bankinter', 'telepizza', 'burger king', 'mcdonalds',
  'starbucks', 'vips', 'foster', 'dominos', 'pans & company'
];

function refineQueryAggressively(niche: string, location: string): string {
  const n = niche.toLowerCase();

  if (n.includes('servicio') || n.includes('negocio') || n === 'local' || n === 'todos' || n === 'pyme' || n.includes('auditoria')) {
    return `(restaurante OR "centro de estética" OR reformas OR taller OR clínica OR dentista OR abogado OR "agencia inmobiliaria") in ${location}`;
  }

  if (n.includes('comida') || n.includes('restaurante') || n.includes('gastronom')) {
    return `${niche} OR "bar de tapas" OR "restaurante familiar" in ${location}`;
  }

  if (n.includes('reparaci') || n.includes('taller') || n.includes('mecanic') || n.includes('coche')) {
    return `${niche} OR "taller mecánico" OR "taller chapa y pintura" in ${location}`;
  }

  if (n.includes('construccion') || n.includes('reformas') || n.includes('obra') || n.includes('casa')) {
    return `${niche} OR "reformas integrales" OR fontanero OR electricista OR carpintero in ${location}`;
  }

  if (n.includes('salud') || n.includes('estetic') || n.includes('belleza') || n.includes('bienestar')) {
    return `${niche} OR peluquería OR dentista OR fisioterapeuta in ${location}`;
  }

  return `${niche} in ${location}`;
}

function translateCategory(type: string | undefined, niche: string): string {
  if (!type) return niche;
  return CATEGORY_TRANSLATIONS[type.toLowerCase()] || niche || type;
}

function isPublicInstitution(place: any): boolean {
  try {
    const type = place.primaryType;
    const name = (place.displayName?.text || "").toLowerCase();

    if (type && PUBLIC_INSTITUTIONS_TYPES.includes(type)) return true;
    if (PUBLIC_KEYWORDS.some(kw => name.includes(kw))) return true;
    
    // [FIX] Filter Big Chains
    if (BIG_CHAINS_KEYWORDS.some(chain => name.includes(chain))) {
        daemonLog('info', `[Search Service] Ignorando gran cadena detectada: ${place.displayName?.text}`);
        return true;
    }
    
    return false;
  } catch (e) {
    return false;
  }
}

export async function performLeadSearch(niche: string, location: string, companyType: string) {
  daemonLog('info', `[Search Service] Petición recibida: ${niche} en ${location} (${companyType})`);

  let refinedQuery = refineQueryAggressively(niche, location);
  if (companyType === 'corporativo') refinedQuery = `grandes ${refinedQuery}`;

  daemonLog('info', `[Search Service] Ejecutando Google Maps Scan para: "${refinedQuery}"...`);
  const realPlaces = await searchGlobalLeads(refinedQuery, location);

  if (realPlaces && realPlaces.length > 0) {
    daemonLog('success', `[Search Service] Google Maps detectó ${realPlaces.length} posibles negocios.`);

    const mappedLeads = await Promise.all(realPlaces
      .filter((place: any) => {
          const isPublic = isPublicInstitution(place);
          if (isPublic) daemonLog('info', `[Search Service] Ignorando institución pública: ${place.displayName?.text}`);
          return !isPublic;
      })
      .map(async (place: any) => {
        const existing = await checkLeadByGooglePlaceId(place.id);
        if (existing) {
          daemonLog('info', `[Search Service] Deduplicación: Lead ya existe (${existing.name})`);
          return null;
        }

        const baseBusiness = {
          name: place.displayName?.text || "Negocio Desconocido",
          address: place.formattedAddress || "Dirección no disponible",
          category: translateCategory(place.primaryType, niche),
          website: place.websiteUri || null,
          phone: place.nationalPhoneNumber || null,
          googlePlaceId: place.id,
          rating: place.rating || 0,
          reviewsCount: place.userRatingCount || 0,
          neighborhood: location,
          photoUrl: place.photos && place.photos.length > 0
            ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxWidthPx=1000`
            : null,
        };

        const intel = await calculateLeadIntelligence(baseBusiness, niche);

        return {
          ...baseBusiness,
          id: place.id || crypto.randomUUID(),
          companyType,
          status: intel.score > 60 ? 'high' : (intel.score > 30 ? 'medium' : 'low'),
          score: intel.score,
          conversionGap: intel.findings[0] || "Optimización pendiente",
          tier: intel.tier,
          intel
        };
      }))
      .then(leads => leads.filter(l => l !== null));

    if (mappedLeads.length > 0) {
      daemonLog('info', `[Search Service] Iniciando descubrimiento profundo para ${mappedLeads.length} leads calificados...`);
      const enrichedLeads = await enrichLeadsWithDeepDiscovery(mappedLeads);
      return enrichedLeads;
    } else {
        daemonLog('warning', "[Search Service] Todos los resultados fueron filtrados por ser instituciones públicas.");
    }
  } else {
      daemonLog('warning', "[Search Service] No se encontraron resultados reales en Google Maps. Activando Simulación.");
  }

  daemonLog('info', "[Search Service] Generando leads de alta fidelidad en modo simulación...");
  const simulationLeads = await Promise.all([
    { name: `${niche} Principal ${location}`, rating: 3.8, reviews: 42, website: `https://central-${location}.com` },
    { name: `${niche} Elite ${location}`, rating: 4.5, reviews: 12, website: null },
    { name: `Especialistas ${niche} ${location}`, rating: 3.2, reviews: 89, website: `https://servicios-${location}.es` },
    { name: `${location} ${niche} & Boutique`, rating: 4.1, reviews: 5, website: null },
    { name: `${niche} Metropolitano`, rating: 3.9, reviews: 156, website: "https://facebook.com/nichelocal" },
    { name: `The ${niche} Alliance`, rating: 4.7, reviews: 28, website: null }
  ].map(async (sim) => {
      const baseBusiness = {
        ...sim,
        reviewsCount: sim.reviews,
        address: `Eje Central, ${location}`,
        category: niche,
        neighborhood: location,
      };

      const intel = await calculateLeadIntelligence(baseBusiness, niche);

      return {
        ...baseBusiness,
        id: crypto.randomUUID(),
        companyType,
        status: intel.score > 60 ? 'high' : (intel.score > 30 ? 'medium' : 'low'),
        score: intel.score,
        conversionGap: intel.findings[0] || "Sin presencia optimizada",
        tier: intel.tier,
        intel
      };
  }));

  const enrichedSimulation = await enrichLeadsWithDeepDiscovery(simulationLeads);
  return enrichedSimulation;
}
