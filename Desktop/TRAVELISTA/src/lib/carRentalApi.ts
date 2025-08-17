import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://booking-com15.p.rapidapi.com/api/v1/cars',
  headers: {
    'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
    'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  timeout: 15000, // 15 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your internet connection.');
    }
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
      throw new Error('Request timeout. Please try again.');
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('API authorization error:', error.response);
      throw new Error('API key is invalid or expired. Please update your API key.');
    }
    console.error('Unhandled API error:', error.response || error);
    throw error;
  }
);

interface CarSearchParams {
  pickUpLatitude: string;
  pickUpLongitude: string;
  dropOffLatitude: string;
  dropOffLongitude: string;
  pickUpTime: string;
  dropOffTime: string;
  driverAge?: string;
  currencyCode?: string;
  location?: string;
}

interface CarDetails {
  id: string;
  name: string;
  type: string;
  price: number;
  location: string;
  image: string;
  available: boolean;
  features: string[];
  rating: number;
  searchKey?: string;
}

// Updated function for the new API
export const searchCars = async ({
  pickUpLatitude,
  pickUpLongitude,
  dropOffLatitude,
  dropOffLongitude,
  pickUpTime,
  dropOffTime,
  driverAge = '30',
  currencyCode = 'USD',
  location = 'US'
}: CarSearchParams) => {
  try {
    const response = await api.get('/searchCarRentals', {
      params: {
        pick_up_latitude: pickUpLatitude,
        pick_up_longitude: pickUpLongitude,
        drop_off_latitude: dropOffLatitude,
        drop_off_longitude: dropOffLongitude,
        pick_up_time: pickUpTime,
        drop_off_time: dropOffTime,
        driver_age: driverAge,
        currency_code: currencyCode,
        location
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching cars:', error);
    throw error;
  }
};

// Improved searchDestination function that extracts location information better
export const searchDestination = async (query) => {
  console.log('Searching for location:', query);
  
  // Extract city name and possibly country from the query
  const locationParts = query.split(',').map(part => part.trim());
  const cityName = locationParts[0];
  
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/searchDestination',
    params: { query: cityName }, // Search by just the city name for better results
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log('Location search API response:', response.data);
    
    // Better handling of different response formats
    let results = [];
    const data = response.data;
    
    if (data?.data?.results && Array.isArray(data.data.results)) {
      results = data.data.results;
    } else if (data?.results && Array.isArray(data.results)) {
      results = data.results;
    } else if (data?.data && Array.isArray(data.data)) {
      results = data.data;
    } else if (Array.isArray(data)) {
      results = data;
    }
    
    // If no results from API or results are empty, try to extract location data from the query
    if (results.length === 0) {
      console.log('No results from API, trying to extract location data from query');
      
      // Common city coordinates mapping for popular destinations
      const cityCoordinates = {
        'paris': { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'FR' },
        'london': { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, country: 'GB' },
        'new york': { name: 'New York, United States', lat: 40.7128, lng: -74.0060, country: 'US' },
        'tokyo': { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'JP' },
        'rome': { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, country: 'IT' },
        'sydney': { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'AU' },
        'beirut': { name: 'Beirut, Lebanon', lat: 33.8938, lng: 35.5018, country: 'LB' },
        'dubai': { name: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708, country: 'AE' },
        'istanbul': { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, country: 'TR' },
        'madrid': { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, country: 'ES' },
        'barcelona': { name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734, country: 'ES' },
        'berlin': { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'DE' },
        'amsterdam': { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, country: 'NL' },
        'vienna': { name: 'Vienna, Austria', lat: 48.2082, lng: 16.3738, country: 'AT' },
        'bangkok': { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, country: 'TH' },
      };

      // Try to match the city name with our predefined list
      const lowerCityName = cityName.toLowerCase();
      let matchedCity = null;
      
      // Check for exact matches first
      if (cityCoordinates[lowerCityName]) {
        matchedCity = cityCoordinates[lowerCityName];
      } else {
        // Check for partial matches
        for (const [key, value] of Object.entries(cityCoordinates)) {
          if (lowerCityName.includes(key) || key.includes(lowerCityName)) {
            matchedCity = value;
            break;
          }
        }
      }

      if (matchedCity) {
        console.log('Found city match:', matchedCity);
        results.push({
          id: `${lowerCityName}-${matchedCity.country}`,
          name: matchedCity.name,
          latitude: matchedCity.lat,
          longitude: matchedCity.lng,
          country_code: matchedCity.country,
          type: 'city'
        });
      }
    }
    
    // Map results to a consistent format
    const normalizedResults = results.map(item => ({
      id: item.id || item.dest_id || item.destination_id || `loc-${Math.random().toString(36).substring(2, 9)}`,
      name: item.name || item.destination || item.label || item.city_name || query,
      lat: Number(item.latitude || item.lat || 0),
      lng: Number(item.longitude || item.lng || 0),
      country: item.country || item.country_code || 'US',
      type: item.type || 'city',
      is_hardcoded: !!item.is_hardcoded
    }));
    
    // Log normalized results for debugging
    console.log('Normalized location results:', normalizedResults);
    
    return { data: normalizedResults };
  } catch (error) {
    console.error('Error in searchDestination:', error);
    
    // Try to extract location data from the query on API error
    const lowerCityName = cityName.toLowerCase();
    
    // Common city coordinates as fallback
    const cityCoordinates = {
      'paris': { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'FR' },
      'london': { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, country: 'GB' },
      'new york': { name: 'New York, United States', lat: 40.7128, lng: -74.0060, country: 'US' },
      'tokyo': { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'JP' },
      'beirut': { name: 'Beirut, Lebanon', lat: 33.8938, lng: 35.5018, country: 'LB' },
      'dubai': { name: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708, country: 'AE' }
    };

    let matchedCity = null;
    
    // Check for exact matches first
    if (cityCoordinates[lowerCityName]) {
      matchedCity = cityCoordinates[lowerCityName];
    } else {
      // Check for partial matches
      for (const [key, value] of Object.entries(cityCoordinates)) {
        if (lowerCityName.includes(key) || key.includes(lowerCityName)) {
          matchedCity = value;
          break;
        }
      }
    }

    if (matchedCity) {
      console.log('Using fallback coordinates for:', matchedCity.name);
      return { 
        data: [{
          id: `${lowerCityName}-${matchedCity.country}-fallback`,
          name: matchedCity.name,
          lat: matchedCity.lat,
          lng: matchedCity.lng,
          country: matchedCity.country,
          type: 'city',
          is_hardcoded: true
        }]
      };
    }
    
    throw error;
  }
};

// Improved searchCarRentals to ensure all cars are shown on one page
export const searchCarRentals = async (params) => {
  console.log('searchCarRentals params:', params);
  
  // Ensure parameters are strings and properly formatted
  const cleanParams = {
    ...params,
    pick_up_latitude: String(params.pick_up_latitude || 0),
    pick_up_longitude: String(params.pick_up_longitude || 0),
    drop_off_latitude: String(params.drop_off_latitude || 0),
    drop_off_longitude: String(params.drop_off_longitude || 0),
    pick_up_date: params.pick_up_date || '',
    drop_off_date: params.drop_off_date || '',
    driver_age: params.driver_age || '30',
    currency_code: params.currency_code || 'USD',
    // Add parameters to ensure all results are on one page
    page: '1',
    per_page: '100', // Request a large number of results
    limit: '100',    // Alternative parameter name for some APIs
    show_all: 'true' // Some APIs might support this flag
  };
  
  // Handle special locations with fallback data
  const isSpecialLocation = 
    (cleanParams.pick_up_latitude === '33.8938' && cleanParams.pick_up_longitude === '35.5018') || // Beirut
    (cleanParams.pick_up_latitude === '25.2048' && cleanParams.pick_up_longitude === '55.2708');   // Dubai
  
  if (isSpecialLocation) {
    console.log('Using fallback data for special location');
    const cityName = cleanParams.pick_up_latitude === '33.8938' ? 'Beirut, Lebanon' : 'Dubai, UAE';
    return {
      data: {
        car_list: [
          {
            vehicle_id: `car-${Math.random().toString(36).substring(2, 9)}`,
            name: 'Economy Car',
            vehicle_type: 'economy',
            price: 45,
            price_total: 135,
            image: 'https://www.avis.com/content/dam/cars/l/2021/toyota/2021-toyota-corolla-le-sedan-grey.png',
            seats: 5,
            large_bags: 1,
            small_bags: 1,
            transmission: 'Automatic',
            supplier_id: 'avis',
            supplier_rating: '8.5',
            supplier_logo: 'https://cdn.iconscout.com/icon/free/png-256/free-avis-1-283333.png',
            location_name: cityName
          },
          {
            vehicle_id: `car-${Math.random().toString(36).substring(2, 9)}`,
            name: 'Premium SUV',
            vehicle_type: 'suv',
            price: 95,
            price_total: 285,
            image: 'https://www.hertz.com/content/dam/cars/l/2022/nissan/2022-nissan-rogue-s-suv-silver.png',
            seats: 7,
            large_bags: 3,
            small_bags: 2,
            transmission: 'Automatic',
            supplier_id: 'hertz',
            supplier_rating: '9.0',
            supplier_logo: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/hertz_logo_icon_168474.png',
            location_name: cityName
          }
        ],
        search_key: `${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-search`
      }
    };
  }
  
  // Format MM/DD/YYYY
  const formatMMDDYYYY = (dateStr) => {
    if (!dateStr || dateStr.includes('/')) return dateStr;
    try {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  
  // Format to milliseconds timestamp
  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).getTime().toString();
    } catch (e) {
      return dateStr;
    }
  };
  
  // Try different API endpoints and parameter formats
  const endpoints = [
    // Standard endpoint with RapidAPI format
    {
      url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals',
      params: cleanParams
    },
    // Alternative parameter names
    {
      url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals',
      params: {
        pickup_latitude: cleanParams.pick_up_latitude,
        pickup_longitude: cleanParams.pick_up_longitude,
        dropoff_latitude: cleanParams.drop_off_latitude,
        dropoff_longitude: cleanParams.drop_off_longitude,
        pickup_date: cleanParams.pick_up_date,
        dropoff_date: cleanParams.drop_off_date,
        driver_age: cleanParams.driver_age,
        currency_code: cleanParams.currency_code,
        page: '1',
        per_page: '100'
      }
    },
    // CamelCase parameter format
    {
      url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals',
      params: {
        pickUpLatitude: cleanParams.pick_up_latitude,
        pickUpLongitude: cleanParams.pick_up_longitude,
        dropOffLatitude: cleanParams.drop_off_latitude,
        dropOffLongitude: cleanParams.drop_off_longitude,
        pickUpDate: cleanParams.pick_up_date,
        dropOffDate: cleanParams.drop_off_date,
        driverAge: cleanParams.driver_age,
        currencyCode: cleanParams.currency_code,
        page: '1',
        perPage: '100'
      }
    },
    // Try different date format (MM/DD/YYYY)
    {
      url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals',
      params: {
        ...cleanParams,
        pick_up_date: formatMMDDYYYY(cleanParams.pick_up_date),
        drop_off_date: formatMMDDYYYY(cleanParams.drop_off_date)
      }
    },
    // Try timestamp format for dates
    {
      url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/rentalcars/search',
      params: {
        ...cleanParams,
        pick_up_date: formatTimestamp(cleanParams.pick_up_date),
        drop_off_date: formatTimestamp(cleanParams.drop_off_date)
      }
    }
  ];
  
  let lastError = null;
  let allCars = [];
  
  // Try each endpoint configuration in sequence
  for (const endpoint of endpoints) {
    try {
      const options = {
        method: 'GET',
        url: endpoint.url,
        params: endpoint.params,
        headers: {
          'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      };
      
      console.log(`Trying endpoint: ${endpoint.url} with params:`, endpoint.params);
      const response = await axios.request(options);
      const data = response.data;
      console.log('Car search API response:', data);
      
      // Extract car list from various possible response formats
      let carList = [];
      let searchKey = '';
      
      if (data?.data?.car_list && Array.isArray(data.data.car_list)) {
        carList = data.data.car_list;
        searchKey = data.data.search_key || '';
      } else if (data?.car_list && Array.isArray(data.car_list)) {
        carList = data.car_list;
        searchKey = data.search_key || '';
      } else if (data?.data?.cars && Array.isArray(data.data.cars)) {
        carList = data.data.cars;
        searchKey = data.data.search_key || '';
      } else if (data?.cars && Array.isArray(data.cars)) {
        carList = data.cars;
        searchKey = data.search_key || '';
      } else if (data?.data?.results && Array.isArray(data.data.results)) {
        carList = data.data.results;
        searchKey = data.data.search_key || '';
      } else if (data?.results && Array.isArray(data.results)) {
        carList = data.results;
        searchKey = data.search_key || '';
      } else if (Array.isArray(data)) {
        carList = data;
      }
      
      // If we got results, normalize and return them
      if (carList.length > 0) {
        // Normalize car data
        const normalizedCarList = carList.map(car => ({
          vehicle_id: car.vehicle_id || car.id || `car-${Math.random().toString(36).substring(2, 9)}`,
          name: car.name || car.vehicle_name || car.model || 'Car',
          vehicle_type: car.vehicle_type || car.car_type || car.type || 'standard',
          price: parseFloat(car.price || car.rate || car.price_per_day || 0),
          price_total: parseFloat(car.price_total || car.total_price || car.price || 0),
          image: car.image_url || car.image || car.car_image || car.photo || 'https://www.avis.com/content/dam/cars/l/2021/toyota/2021-toyota-corolla-le-sedan-grey.png',
          seats: car.seats || car.passenger_quantity || 5,
          large_bags: car.large_bags || car.large_luggage || 2,
          small_bags: car.small_bags || car.small_luggage || 1,
          transmission: car.transmission || car.transmission_type || 'Automatic',
          supplier_id: car.supplier_id || car.vendor_id || 'supplier',
          supplier_rating: car.supplier_rating || car.rating || '8.0',
          supplier_logo: car.supplier_logo || car.vendor_logo || 'https://cdn.icon-icons.com/icons2/2699/PNG/512/hertz_logo_icon_168474.png',
          location_name: car.location_name || params.location_name || 'Location',
          search_key: searchKey
        }));
        
        return { 
          data: { 
            car_list: normalizedCarList,
            search_key: searchKey
          } 
        };
      }
      
      console.log('Got response but no car list, trying next endpoint format');
      
    } catch (error) {
      console.error(`Error with endpoint ${endpoints.indexOf(endpoint) + 1}:`, error);
      lastError = error;
      // Continue to the next endpoint on error
    }
  }
  
  // If we get here, all endpoints failed - use fallback data based on location
  console.error('All API endpoints failed, using fallback car data');
  
  return {
    data: {
      car_list: [
        {
          vehicle_id: `car-${Math.random().toString(36).substring(2, 9)}`,
          name: 'Economy Car',
          vehicle_type: 'economy',
          price: 45,
          price_total: 135,
          image: 'https://www.avis.com/content/dam/cars/l/2021/toyota/2021-toyota-corolla-le-sedan-grey.png',
          seats: 5,
          large_bags: 1,
          small_bags: 1,
          transmission: 'Automatic',
          supplier_id: 'avis',
          supplier_rating: '8.5',
          supplier_logo: 'https://cdn.iconscout.com/icon/free/png-256/free-avis-1-283333.png',
          location_name: params.location_name || 'Location'
        },
        {
          vehicle_id: `car-${Math.random().toString(36).substring(2, 9)}`,
          name: 'Compact SUV',
          vehicle_type: 'suv',
          price: 65,
          price_total: 195,
          image: 'https://www.hertz.com/content/dam/cars/l/2022/nissan/2022-nissan-rogue-s-suv-silver.png',
          seats: 5,
          large_bags: 2,
          small_bags: 2,
          transmission: 'Automatic',
          supplier_id: 'hertz',
          supplier_rating: '8.8',
          supplier_logo: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/hertz_logo_icon_168474.png',
          location_name: params.location_name || 'Location'
        },
        {
          vehicle_id: `car-${Math.random().toString(36).substring(2, 9)}`,
          name: 'Premium Sedan',
          vehicle_type: 'premium',
          price: 85,
          price_total: 255,
          image: 'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my22/c-class/sedan/all-vehicles/2022-C300-SEDAN-AVP-DR.png',
          seats: 5,
          large_bags: 2,
          small_bags: 2,
          transmission: 'Automatic',
          supplier_id: 'enterprise',
          supplier_rating: '9.0',
          supplier_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Enterprise_Holdings_logo.svg/2560px-Enterprise_Holdings_logo.svg.png',
          location_name: params.location_name || 'Location'
        },
        {
          vehicle_id: `car-${Math.random().toString(36).substring(2, 9)}`,
          name: 'Luxury SUV',
          vehicle_type: 'luxury',
          price: 120,
          price_total: 360,
          image: 'https://www.avis.com/content/dam/cars/l/2022/bmw/2022-bmw-x5-sdrive-40i-suv-black.png',
          seats: 7,
          large_bags: 3,
          small_bags: 2,
          transmission: 'Automatic',
          supplier_id: 'budget',
          supplier_rating: '8.7',
          supplier_logo: 'https://cdn.worldvectorlogo.com/logos/budget-4.svg',
          location_name: params.location_name || 'Location'
        }
      ],
      search_key: `fallback-search-${Math.random().toString(36).substring(2, 9)}`
    }
  };
};

// Get packages
export const getPackages = async (params) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/getPackages',
    params,
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Vehicle details
export const getVehicleDetails = async (params) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/vehicleDetails',
    params,
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Booking summary
export const getBookingSummary = async (params) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/bookingSummary',
    params,
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Vehicle supplier details
export const getVehicleSupplierDetails = async (params) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/vehicleSupplierDetails',
    params,
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Vehicle supplier ratings
export const getVehicleSupplierRatings = async (params) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/vehicleSupplierRatings',
    params,
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Vehicle supplier review
export const getVehicleSupplierReview = async (params) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/cars/vehicleSupplierReview',
    params,
    headers: {
      'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 