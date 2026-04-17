import { NextResponse } from 'next/server';
import { calculateLeadIntelligence } from '@/lib/agent-brain';
import { searchGlobalLeads } from '@/lib/google-maps';
import { enrichLeadsWithDeepDiscovery } from '@/lib/email-discovery';

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
  'school', 'university', 'library', 'museum', 'public_transport_station'
];

const PUBLIC_KEYWORDS = [
  'ayuntamiento', 'policia', 'guardia civil', 'ministerio', 'centro publico', 
  'escuela publica', 'instituto publico', 'biblioteca municipal', 'juzgado', 
  'correos', 'asociacion', 'federacion', 'consistorio', 'diputacion'
];

function refineQueryAggressively(niche: string, location: string): string {
  const n = niche.toLowerCase();
  
  // Si el nicho es genérico, expandir con términos locales potentes que suelen ser TIER 1 o TIER 2
  if (n.includes('servicio') || n.includes('negocio') || n === 'local' || n === 'todos' || n === 'pyme') {
    return 'carpintería o fontanería o reformas o taller mecánico o centro de estética o peluquería';
  }
  
  // Refuerzo de intención local y búsqueda de "puntos ciegos" digitales
  if (n.includes('comida') || n.includes('restaurante') || n.includes('gastronom')) {
    return `${niche} o bar de tapas o restaurante familiar en ${location}`;
  }

  if (n.includes('reparaci') || n.includes('taller') || n.includes('mecanic')) {
    return `${niche} mecánica o chapa y pintura o neumáticos`;
  }

  if (n.includes('construccion') || n.includes('reformas') || n.includes('obra')) {
    return `reformas integrales o fontanero o electricista o carpintero en ${location}`;
  }
  
  if (n.includes('salud') || n.includes('estetic') || n.includes('belleza')) {
    return `peluquería o centro de estética o dentista o fisioterapeuta en ${location}`;
  }

  // Si estamos en Sant Antoni de Vilamajor, añadir urbanizaciones para mayor cobertura
  if (location.toLowerCase().includes('sant antoni de vilamajor')) {
    return `${niche} en Sant Antoni de Vilamajor o Les Pungoles o Sant Julià d'Alfou`;
  }

  return niche;
}

function translateCategory(type: string | undefined, niche: string): string {
  if (!type) return niche;
  return CATEGORY_TRANSLATIONS[type.toLowerCase()] || niche || type;
}

function isPublicInstitution(place: any): boolean {
  try {
    const type = place.primaryType;
    const name = (place.displayName?.text || "").toLowerCase();
    
    // 1. Check by Google Places Type
    if (type && PUBLIC_INSTITUTIONS_TYPES.includes(type)) return true;

    // 2. Check by Name Keywords
    if (PUBLIC_KEYWORDS.some(kw => name.includes(kw))) return true;

    return false;
  } catch (e) {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { niche, location, companyType } = await request.json();
    console.log(`[Search API Started] Niche: ${niche} | Location: ${location} | Type: ${companyType}`);

    let refinedQuery = refineQueryAggressively(niche, location);
    if (companyType === 'corporativo') refinedQuery = `grandes ${refinedQuery}`;

    const realPlaces = await searchGlobalLeads(refinedQuery, location);
    
    if (realPlaces && realPlaces.length > 0) {
      console.log(`[Search API] Found ${realPlaces.length} real places before filtering.`);
      
      const mappedLeads = await Promise.all(realPlaces
        .filter((place: any) => {
            const isPublic = isPublicInstitution(place);
            if (isPublic) console.log(`[Search API] Filtering out public institution: ${place.displayName?.text}`);
            return !isPublic;
        })
        .map(async (place: any) => {
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
          
          const intel = await calculateLeadIntelligence(baseBusiness);

          return {
            ...baseBusiness,
            id: crypto.randomUUID(),
            companyType,
            status: intel.score > 60 ? 'high' : (intel.score > 30 ? 'medium' : 'low'),
            score: intel.score,
            conversionGap: intel.findings[0] || "Optimización pendiente",
            tier: intel.tier,
            intel
          };
        }));

      if (mappedLeads.length > 0) {
        console.log(`[Search API] Processing ${mappedLeads.length} leads for deep discovery...`);
        // Enriquecemos con Emails y Datos Profundos antes de devolver
        const enrichedLeads = await enrichLeadsWithDeepDiscovery(mappedLeads);
        return NextResponse.json(enrichedLeads);
      } else {
          console.warn("[Search API] No leads left after filtering public institutions.");
      }
    } else {
        console.warn("[Search API] No real places found from Google Maps.");
    }

    // 2. MODO SIMULACIÓN (Demos)
    console.log("[Search API] Switching to High-Resolution Simulation Mode.");
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
        
        const intel = await calculateLeadIntelligence(baseBusiness);

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

    await new Promise(r => setTimeout(r, 800));
    const enrichedSimulation = await enrichLeadsWithDeepDiscovery(simulationLeads);
    return NextResponse.json(enrichedSimulation);

  } catch (error) {
    console.error("[Search API Global Error]:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
