// Real API service for attractions using Booking.com API

export interface Attraction {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  duration: string;
  category: string;
  productId: string;
  productSlug: string;
  cityName: string;
  countryCode: string;
  hasFreeCancellation?: boolean;
  shortDescription?: string;
}

interface BookingApiProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  representativePrice: {
    chargeAmount: number;
    currency: string;
    publicAmount: number;
  };
  primaryPhoto: {
    small: string;
  };
  reviewsStats: {
    allReviewsCount: number;
    percentage: string;
  };
  combinedNumericStats: {
    average: number;
    total: number;
  };
  ufiDetails: {
    bCityName: string;
    ufi: number;
    url: {
      country: string;
    };
  };
  cancellationPolicy: {
    hasFreeCancellation: boolean;
  };
  flags?: Array<{
    flag: string;
    value: boolean;
  }>;
}

interface BookingSearchLocationResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    destinations: Array<{
      id: string;
      ufi: number;
      country: string;
      cityName: string;
      productCount: number;
      cc1: string;
    }>;
  };
}

interface BookingSearchAttractionsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    products: BookingApiProduct[];
  };
}

export interface TimeSlotOffer {
  id: string;
  label: string;
  items: TimeSlotOfferItem[];
  languageOptions: LanguageOption[];
  additionalInfo?: string;
  description?: string;
  benefits: Benefits;
  locationInstructions?: string;
  notIncluded?: string[];
  whatsIncluded?: string[];
  typicalDuration?: string;
  reservationRestrictions: ReservationRestrictions;
}

export interface TimeSlotOfferItem {
  id: string;
  offerItemId: string;
  type: string;
  label: string;
  price: {
    chargeAmount: number;
    currency: string;
    publicAmount: number;
  };
  cancellationPolicy: {
    hasFreeCancellation: boolean;
    isStillRefundable: boolean;
    percentage: number;
    period: string;
    comparedTo: string;
  };
  constraint: {
    label: string;
    maxGroupSize?: number;
    minGroupSize?: number;
  };
  languageOption: {
    language: string;
    type: string;
  };
  ticketsAvailable: number;
  maxPerReservation: number;
  minPerReservation: number;
  duration?: string;
  travelerCountRequired?: number;
  tieredPricing: boolean;
}

export interface LanguageOption {
  label: string;
  language: string;
  type: string;
}

export interface Benefits {
  freeAudioGuide?: boolean;
  freeDrink?: boolean;
  freeTransportation?: boolean;
  inStoreDiscount?: boolean;
  priorityLane?: boolean;
  skipTheLine?: boolean;
}

export interface ReservationRestrictions {
  adultRequiredForReservation: boolean;
  maxOfferItemsPerReservation: number;
  minOfferItemsPerReservation: number;
}

export interface TimeSlot {
  timeSlotId: string;
  start: string;
  fullDay: boolean;
  timeSlotOffers: TimeSlotOffer[];
}

export interface GetAvailabilityResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: TimeSlot[];
}

export interface AttractionAddress {
  id: string;
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  locationType: string;
  instructions?: string;
  googlePlaceId?: string;
  publicTransport?: string;
  zip?: string;
}

export interface AttractionAddresses {
  arrival?: AttractionAddress[];
  departure?: AttractionAddress[];
  entrance?: AttractionAddress[];
  meeting?: AttractionAddress[];
  pickup?: AttractionAddress[];
  guestPickup?: AttractionAddress[];
}

export interface AttractionPhoto {
  small: string;
  medium: string;
  isPrimary: boolean;
}

export interface AttractionLabel {
  text: string;
  type: string;
}

export interface AttractionFlag {
  flag: string;
  value: boolean;
  rank: number;
}

export interface TermsConditions {
  policyProvider: string;
  privacyPolicyUrl: string;
  termsUrl: string;
}

export interface AttractionOffer {
  id: string;
  availabilityType: string;
}

export interface AttractionDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  addresses: AttractionAddresses;
  photos: AttractionPhoto[];
  flags: AttractionFlag[];
  labels: AttractionLabel[];
  offers: AttractionOffer[];
  operatedBy: string;
  isBookable: boolean;
  additionalInfo: string;
  guideSupportedLanguages: string[];
  healthSafety: string[];
  notIncluded: string[];
  applicableTerms: TermsConditions[];
  cancellationPolicy: {
    hasFreeCancellation: boolean;
  };
  onSiteRequirements: {
    voucherPrintingRequired?: boolean;
  };
}

export interface GetAttractionDetailsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: AttractionDetails;
}

// Get Attraction Reviews
export interface AttractionReview {
  id: string;
  reviewer: string;
  rating: number;
  title: string;
  text: string;
  date: string;
}

export interface GetAttractionReviewsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    reviews: AttractionReview[];
  };
}

// Get Availability Calendar
export interface AvailabilityCalendarDay {
  date: string;
  available: boolean;
}

export interface GetAvailabilityCalendarResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    calendar: AvailabilityCalendarDay[];
  };
}

const API_KEY = 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113';
const API_HOST = 'booking-com15.p.rapidapi.com';

const convertToAttraction = (product: BookingApiProduct): Attraction => {
  const currencySymbol = product.representativePrice?.currency === 'INR' ? '₹' : 
                        product.representativePrice?.currency === 'USD' ? '$' : 
                        product.representativePrice?.currency === 'EUR' ? '€' : 
                        product.representativePrice?.currency === 'GBP' ? '£' : '';

  return {
    id: product.id ?? '',
    name: product.name ?? '',
    location: `${product.ufiDetails?.bCityName ?? ''}, ${product.ufiDetails?.url?.country?.toUpperCase() ?? ''}`,
    rating: product.combinedNumericStats?.average ?? 0,
    reviews: product.combinedNumericStats?.total ?? 0,
    price: `${currencySymbol}${Math.round(product.representativePrice?.chargeAmount ?? 0)}`,
    image: product.primaryPhoto?.small ?? '',
    duration: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 3) + 2} hours`,
    category: Array.isArray(product.flags) && product.flags.find(f => f.flag === 'bestseller')?.value ? 'Bestseller' : 'Experience',
    productId: product.id ?? '',
    productSlug: product.slug ?? '',
    cityName: product.ufiDetails?.bCityName ?? '',
    countryCode: product.ufiDetails?.url?.country ?? '',
    hasFreeCancellation: product.cancellationPolicy?.hasFreeCancellation ?? false,
    shortDescription: product.shortDescription ?? ''
  };
};

export const searchAttractions = async (location: string): Promise<Attraction[]> => {
  console.log(`Searching for attractions in: ${location}`);
  
  try {
    // First, get the destination ID using searchLocation
    const locationResponse = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation?query=${encodeURIComponent(location)}&languagecode=en-us`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );

    if (!locationResponse.ok) {
      throw new Error(`Location search failed with status ${locationResponse.status}`);
    }

    const locationData: BookingSearchLocationResponse = await locationResponse.json();
    
    if (!locationData.status || !locationData.data?.destinations?.length) {
      throw new Error('No destinations found for this location');
    }

    // Get the first destination's UFI
    const destination = locationData.data.destinations[0];
    const destinationId = btoa(JSON.stringify({ ufi: destination.ufi }));

    console.log(`Found destination: ${destination.cityName}, using ID: ${destinationId}`);

    // Now search for attractions using the destination ID
    const attractionsResponse = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions?id=${encodeURIComponent(destinationId)}&sortBy=trending&page=1&currency_code=USD&languagecode=en-us`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );

    if (!attractionsResponse.ok) {
      throw new Error(`Attractions search failed with status ${attractionsResponse.status}`);
    }

    const attractionsData: BookingSearchAttractionsResponse = await attractionsResponse.json();
    
    if (!attractionsData.status || !attractionsData.data?.products) {
      throw new Error('No attractions found for this destination');
    }

    const attractions = attractionsData.data.products
      .slice(0, 12) // Limit to 12 results
      .map(convertToAttraction);

    console.log(`Found ${attractions.length} attractions for ${location}`);
    return attractions;
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback to mock data if API fails
    const mockAttractions = generateFallbackAttractions(location);
    console.log(`Using fallback data: ${mockAttractions.length} attractions`);
    return mockAttractions;
  }
};

export const getAvailability = async (slug: string, currencyCode: string = 'USD', languageCode: string = 'en-us'): Promise<TimeSlot[]> => {
  console.log(`Getting availability for attraction: ${slug}`);
  
  try {
    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/attraction/getAvailability?slug=${slug}&currency_code=${currencyCode}&languagecode=${languageCode}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch availability with status ${response.status}`);
    }

    const data: GetAvailabilityResponse = await response.json();
    
    if (!data.status || !data.data) {
      throw new Error('No availability data found');
    }

    console.log(`Found ${data.data.length} time slots for ${slug}`);
    return data.data;
    
  } catch (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
};

export const getAttractionDetails = async (slug: string, currencyCode: string = 'USD'): Promise<AttractionDetails | null> => {
  console.log(`Getting details for attraction: ${slug}`);
  
  try {
    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/attraction/getAttractionDetails?slug=${slug}&currency_code=${currencyCode}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch attraction details with status ${response.status}`);
    }

    const data: GetAttractionDetailsResponse = await response.json();
    
    if (!data.status || !data.data) {
      throw new Error('No attraction details found');
    }

    console.log(`Found details for ${data.data.name}`);
    return data.data;
    
  } catch (error) {
    console.error('Error fetching attraction details:', error);
    return null;
  }
};

const generateFallbackAttractions = (location: string): Attraction[] => {
  return [
    {
      id: '1',
      name: `Popular Attraction in ${location}`,
      location: location,
      rating: 4.5,
      reviews: 1234,
      price: "$25",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
      duration: "2-3 hours",
      category: "Sightseeing",
      productId: 'fallback-1',
      productSlug: 'fallback-attraction-1',
      cityName: location,
      countryCode: 'us',
      hasFreeCancellation: true
    },
    {
      id: '2',
      name: `Cultural Experience in ${location}`,
      location: location,
      rating: 4.6,
      reviews: 987,
      price: "$35",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
      duration: "3-4 hours",
      category: "Cultural",
      productId: 'fallback-2',
      productSlug: 'fallback-attraction-2',
      cityName: location,
      countryCode: 'us',
      hasFreeCancellation: true
    }
  ];
};

export const getPopularDestinations = async (): Promise<string[]> => {
  return ['Paris', 'Tokyo', 'London', 'New York', 'Barcelona', 'Rome', 'Amsterdam', 'Dubai'];
};

export const getAttractionReviews = async (
  idOrSlug: string,
  isId: boolean = false
): Promise<AttractionReview[]> => {
  try {
    const url = isId
      ? `https://booking-com15.p.rapidapi.com/api/v1/attraction/getAttractionReviews?id=${idOrSlug}&page=1`
      : `https://booking-com15.p.rapidapi.com/api/v1/attraction/getAttractionReviews?slug=${idOrSlug}&languagecode=en-us`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    });

    if (!response.ok) {
      console.log(`Reviews API returned status ${response.status}`);
      return [];
    }

    const data: GetAttractionReviewsResponse = await response.json();
    
    // Check if we have a valid response
    if (!data.status) {
      console.log('Reviews API returned unsuccessful status');
      return [];
    }

    // Handle different response formats
    if (Array.isArray(data.data?.reviews)) {
      return data.data.reviews;
    } else if (Array.isArray(data.data)) {
      return data.data;
    } else if (data.data && typeof data.data === 'object') {
      // Try to find reviews in the response
      const reviewsData = Object.values(data.data).find(val => Array.isArray(val));
      if (reviewsData) {
        return reviewsData as AttractionReview[];
      }
    }

    console.log('No reviews found in response:', data);
    return [];
  } catch (error) {
    console.error('Error fetching attraction reviews:', error);
    return []; // Return empty array instead of throwing
  }
};

export const getAvailabilityCalendar = async (productSlug: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/attraction/getAvailabilityCalendar?id=${productSlug}&languagecode=en`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Check if we have a valid response
    if (!result.status) {
      console.log('Calendar API returned unsuccessful status');
      return [];
    }

    // Handle different response formats
    if (Array.isArray(result.data)) {
      // Direct array format
      return result.data.map((item: any) => ({
        date: item.date,
        available: item.available
      }));
    } else if (result.data && Array.isArray(result.data.calendar)) {
      // Nested calendar format
      return result.data.calendar.map((item: any) => ({
        date: item.date,
        available: item.available
      }));
    } else if (result.data && typeof result.data === 'object') {
      // Try to find calendar data in the response
      const calendarData = Object.values(result.data).find(val => Array.isArray(val));
      if (calendarData) {
        return (calendarData as any[]).map((item: any) => ({
          date: item.date,
          available: item.available
        }));
      }
    }

    console.log('No calendar data found in response:', result);
    return [];
  } catch (error) {
    console.error('Error fetching availability calendar:', error);
    return []; // Return empty array instead of throwing
  }
};
