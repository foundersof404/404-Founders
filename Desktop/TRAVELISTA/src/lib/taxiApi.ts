export const searchTaxiLocation = async (query) => {
  const url = `https://booking-com15.p.rapidapi.com/api/v1/taxi/searchLocation?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch taxi locations');
  return res.json();
};

export const searchTaxi = async (pickUpPlaceId, dropOffPlaceId, currencyCode = 'EUR') => {
  const url = `https://booking-com15.p.rapidapi.com/api/v1/taxi/searchTaxi?pick_up_place_id=${encodeURIComponent(pickUpPlaceId)}&drop_off_place_id=${encodeURIComponent(dropOffPlaceId)}&currency_code=${currencyCode}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch taxi results');
  return res.json();
}; 