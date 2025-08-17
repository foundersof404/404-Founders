import axios from 'axios';

// Create a default axios instance for general API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Keys - Replace with your actual API keys
const AMADEUS_API_KEY = 'YOUR_AMADEUS_API_KEY';
const AMADEUS_API_SECRET = 'YOUR_AMADEUS_API_SECRET';
const HOTELS_API_KEY = 'YOUR_HOTELS_API_KEY';

// Base URLs
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v2';
const HOTELS_BASE_URL = 'https://booking-com.p.rapidapi.com/v1';

// Create axios instances
const amadeusApi = axios.create({
  baseURL: AMADEUS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const hotelsApi = axios.create({
  baseURL: HOTELS_BASE_URL,
  headers: {
    'X-RapidAPI-Key': HOTELS_API_KEY,
    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
  },
});

// Amadeus token management
let amadeusToken = null;
let tokenExpiry = null;

const getAmadeusToken = async () => {
  // Check if we have a valid token
  if (amadeusToken && tokenExpiry && new Date() < tokenExpiry) {
    return amadeusToken;
  }

  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    amadeusToken = response.data.access_token;
    // Set token expiry to 25 minutes from now (token lasts 30 minutes)
    tokenExpiry = new Date(new Date().getTime() + 25 * 60000);
    
    return amadeusToken;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw error;
  }
};

// Flight API functions
export const searchFlights = async (params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: string;
}) => {
  try {
    const token = await getAmadeusToken();
    
    const response = await amadeusApi.get('/shopping/flight-offers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults,
        children: params.children || 0,
        infants: params.infants || 0,
        travelClass: params.travelClass || 'ECONOMY',
        max: 20,
        currencyCode: 'USD',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const getAirportAutocomplete = async (keyword: string) => {
  try {
    const token = await getAmadeusToken();
    
    const response = await amadeusApi.get('/reference-data/locations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        subType: 'CITY,AIRPORT',
        keyword,
        page: {
          limit: 10,
        },
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting airport autocomplete:', error);
    throw error;
  }
};

// Hotel API functions
export const searchHotels = async (params: {
  location: string;
  checkin_date: string;
  checkout_date: string;
  adults_number: number;
  room_number?: number;
  filter_by_currency?: string;
  order_by?: string;
  languagecode?: string;
  page_number?: number;
}) => {
  try {
    const response = await hotelsApi.get('/hotels/search', {
      params: {
        dest_id: params.location,
        checkin_date: params.checkin_date,
        checkout_date: params.checkout_date,
        adults_number: params.adults_number,
        room_number: params.room_number || 1,
        filter_by_currency: params.filter_by_currency || 'USD',
        order_by: params.order_by || 'popularity',
        languagecode: params.languagecode || 'en-us',
        page_number: params.page_number || 1,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
};

export const getHotelDetails = async (hotelId: string) => {
  try {
    const response = await hotelsApi.get('/hotels/detail', {
      params: {
        hotel_id: hotelId,
        languagecode: 'en-us',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting hotel details:', error);
    throw error;
  }
};

export const getHotelLocations = async (query: string) => {
  try {
    const response = await hotelsApi.get('/hotels/locations', {
      params: {
        name: query,
        locale: 'en-us',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting hotel locations:', error);
    throw error;
  }
};

// Car rental API functions (placeholder - implement with a real car rental API)
export const searchCars = async (params: {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string;
  carType?: string;
  transmission?: string;
  seats?: number;
}) => {
  // This is a placeholder. Replace with actual car rental API integration
  console.log('Car rental search params:', params);
  
  // Mock response
  return {
    cars: [
      {
        id: '1',
        name: 'Tesla Model 3',
        type: 'Electric',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 120,
        features: ['Bluetooth', 'GPS', 'Air Conditioning'],
        seats: 5,
        transmission: 'Automatic',
        available: true,
      },
      {
        id: '2',
        name: 'Jeep Wrangler',
        type: 'SUV',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 150,
        features: ['4x4', 'Bluetooth', 'GPS', 'Air Conditioning'],
        seats: 5,
        transmission: 'Automatic',
        available: true,
      },
      {
        id: '3',
        name: 'Mercedes-Benz C-Class',
        type: 'Luxury',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 180,
        features: ['Bluetooth', 'GPS', 'Air Conditioning', 'Leather Seats'],
        seats: 5,
        transmission: 'Automatic',
        available: true,
      },
    ],
  };
};

export default api; 