export async function searchGlobalLeads(query: string, location: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ Google Maps API Key missing. Returning simulation data.");
    return null;
  }

  console.log(`[Google Maps Search] Query: "${query}" | Location: "${location}" | API Key: ${apiKey.substring(0, 5)}...`);

  try {
    // Usando Text Search (New) de Google Maps
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Eliminado fieldMask para ver si es el problema, o mejor, aseguramos uno robusto
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.websiteUri,places.location,places.rating,places.userRatingCount,places.primaryType,places.nationalPhoneNumber,places.photos'
      },
      body: JSON.stringify({
        textQuery: `${query} in ${location}`
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error(`[Google Maps Error] Status ${response.status}:`, JSON.stringify(errorData, null, 2));
        return null;
    }

    const data = await response.json();
    console.log(`[Google Maps Success] Found ${data.places?.length || 0} places.`);
    return data.places || [];
  } catch (error) {
    console.error("[Google Maps Exception]:", error);
    return null;
  }
}
