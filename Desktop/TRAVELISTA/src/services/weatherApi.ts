export const getWeatherByCity = async (city: string, lang: string = 'EN') => {
  const apiKey = '7716ee235emshc2af0ab389b6ff4p12cd8djsnaa7bee7c8720';
  const apiHost = 'open-weather13.p.rapidapi.com';
  const url = `https://open-weather13.p.rapidapi.com/city?city=${encodeURIComponent(city)}&lang=${lang}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to fetch weather');
    }
    return await response.json();
  } catch (error) {
    console.error('Weather API error:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch weather data',
      city: city
    };
  }
}; 