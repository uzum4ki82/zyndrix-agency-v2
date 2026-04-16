export async function searchGlobalLeads(query: string, location: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ Google Maps API Key missing. Returning simulation data.");
    return null;
  }

  try {
    // Usando Text Search (New) de Google Maps
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.websiteUri,places.location,places.rating,places.userRatingCount,places.primaryType,places.nationalPhoneNumber,places.photos'
      },
      body: JSON.stringify({
        textQuery: `${query} in ${location}`
      })
    });

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error("Error fetching from Google Maps:", error);
    return null;
  }
}
