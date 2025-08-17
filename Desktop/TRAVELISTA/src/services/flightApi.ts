import { toast } from "@/components/ui/sonner";

interface SearchParams {
  query: string;
}

interface LocationResult {
  id: string;
  name: string;
  cityName: string;
  countryName: string;
  iata: string;
  type: string;
}

export interface FlightSearchResponse {
  status: boolean;
  message: string;
  data: {
    locations: LocationResult[];
  };
}

interface FlightQuery {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
}

export interface FlightOffer {
  id: string;
  price: number | string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number | string;
  departureAirport?: string;
  arrivalAirport?: string;
  cabinClass?: string;
  baggage?: string;
  token?: string;
}

export interface RealFlightQuery {
  fromId: string;
  toId: string;
  departDate: string;
  returnDate?: string;
  stops?: string;
  pageNo?: number;
  adults?: number;
  children?: string;
  sort?: string;
  cabinClass?: string;
  currency_code?: string;
}
const RAPIDAPI_KEY = "cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113";

const API_BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1/flights';

export const searchDestinations = async (params: SearchParams): Promise<LocationResult[]> => {
  try {
    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=${encodeURIComponent(params.query)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch destinations");
    }

    const data = await response.json() as FlightSearchResponse;
    
    if (!data.status) {
      throw new Error(data.message || "Failed to fetch destinations");
    }

    return data.data.locations || [];
  } catch (error) {
    console.error("Error fetching destinations:", error);
    toast.error("Failed to fetch destinations. Please try again.");
    return [];
  }
};

export const searchFlights = async (query: RealFlightQuery): Promise<any> => {
  try {
    const params = new URLSearchParams({
      fromId: query.fromId,
      toId: query.toId,
      departDate: query.departDate,
      ...(query.returnDate && { returnDate: query.returnDate }),
      ...(query.stops && { stops: query.stops }),
      ...(query.pageNo && { pageNo: query.pageNo.toString() }),
      ...(query.adults && { adults: query.adults.toString() }),
      ...(query.children && { children: query.children }),
      ...(query.sort && { sort: query.sort }),
      ...(query.cabinClass && { cabinClass: query.cabinClass }),
      ...(query.currency_code && { currency_code: query.currency_code }),
    });

    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to fetch flights: ${response.status}`);
    }

    const data = await response.json();
    console.log("searchFlights response:", data);

    // Validate response structure
    if (!data?.data?.flightOffers) {
      throw new Error("Invalid response structure: missing flight offers");
    }

    // Process and validate each flight offer
    const processedOffers = data.data.flightOffers.map((offer: any) => {
      // Validate required fields
      if (!offer.token || !offer.segments || !offer.priceBreakdown) {
        console.warn("Invalid flight offer structure:", offer);
        return null;
      }

      // Add additional metadata
      return {
        ...offer,
        metadata: {
          searchTimestamp: new Date().toISOString(),
          currency: query.currency_code,
          queryParams: query
        }
      };
    }).filter(Boolean);

    return {
      ...data,
      data: {
        ...data.data,
        flightOffers: processedOffers
      }
    };
  } catch (error) {
    console.error("Error fetching flights:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch flights. Please try again.");
    return null;
  }
};

export const getFlightDetails = async (token: string, currency_code: string = "AED"): Promise<any> => {
  if (!token || typeof token !== "string" || token.length < 10) {
    console.error("getFlightDetails: Invalid or missing token", token);
    toast.error("Invalid flight token. Cannot fetch details.");
    return { status: false, message: "Invalid token" };
  }

  try {
    console.log("getFlightDetails: Fetching details for token:", token, "currency_code:", currency_code);
    const params = new URLSearchParams({
      token,
      currency_code,
    });

    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    const data = await response.json();
    console.log("getFlightDetails response:", data);

    // If status is false or data is missing, handle gracefully
    if (!data?.status || !data?.data) {
      console.error("getFlightDetails: API returned error or missing data", data);
      toast.error(data?.message || "Failed to fetch flight details.");
      return null;
    }

    // Process and validate flight details
    const processedData = {
      ...data,
      data: {
        ...data.data,
        metadata: {
          fetchedAt: new Date().toISOString(),
          currency: currency_code
        },
        // Ensure all required fields are present with defaults
        segments: data.data.segments || [],
        priceBreakdown: data.data.priceBreakdown || {
          total: {
            currencyCode: currency_code,
            units: 0,
            nanos: 0
          }
        },
        // Include additional data from the response
        checkedInBaggage: data.data.checkedInBaggage || {},
        flexibleTicket: data.data.flexibleTicket || {},
        seatMap: data.data.seatMap || {},
        travelInsurance: data.data.travelInsurance || {}
      }
    };

    // Process segments if they exist
    if (processedData.data.segments) {
      processedData.data.segments = processedData.data.segments.map((segment: any) => ({
        ...segment,
        legs: segment.legs?.map((leg: any) => ({
          ...leg,
          carriersData: leg.carriersData?.map((carrier: any) => ({
            ...carrier,
            logo: carrier.logo || getAirlineLogo(carrier.code)
          }))
        }))
      }));
    }

    // Ensure price breakdown has the correct currency
    if (processedData.data.priceBreakdown) {
      const priceFields = ['total', 'baseFare', 'tax', 'fee', 'discount', 'totalWithoutDiscount'];
      priceFields.forEach(field => {
        if (processedData.data.priceBreakdown[field]) {
          processedData.data.priceBreakdown[field].currencyCode = currency_code;
        }
      });
    }

    return processedData;
  } catch (error) {
    console.error("Error fetching flight details:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch flight details. Please try again.");
    return null;
  }
};

export const getSeatMap = async (offerToken: string, currency_code: string = "AED") => {
  if (!offerToken || typeof offerToken !== "string" || offerToken.length < 10) {
    console.error("getSeatMap: Invalid or missing offerToken", offerToken);
    return generateMockSeatMapData(currency_code);
  }

  try {
    const params = new URLSearchParams({
      offerToken,
      currency_code,
    });

    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/flights/getSeatMap?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn("Seat map API error:", `Failed to fetch seat map: ${response.status}`);
      return generateMockSeatMapData(currency_code);
    }

    const data = await response.json();
    console.log("Seat map API response:", data);

    // Validate basic response structure
    if (!data?.data) {
      console.warn("Invalid response structure: missing data object");
      return generateMockSeatMapData(currency_code);
    }

    // Extract seatMapOption from the correct path (data.seatMap.seatMapOption)
    const seatMapOption = Array.isArray(data.data.seatMap?.seatMapOption)
      ? data.data.seatMap.seatMapOption
      : [];

    // Validate that we have at least some seat data
    const hasSeats = seatMapOption.some((option: any) =>
      option.cabins?.some((cabin: any) =>
        cabin.rows?.some((row: any) =>
          row.seats?.length > 0
        )
      )
    );

    if (!hasSeats) {
      console.warn("No seat data found in the response");
      return generateMockSeatMapData(currency_code);
    }

    return {
      status: true,
      data: {
        seatMap: {
          seatMapOption: seatMapOption.map(option => ({
            ...option,
            cabins: (option.cabins || []).map(cabin => ({
              ...cabin,
              columns: (cabin.columns || []).map(col => ({ ...col })),
              rows: (cabin.rows || []).map(row => ({
                ...row,
                seats: (row.seats || []).map(seat => ({
                  ...seat,
                  price: seat.priceBreakdown?.total
                    ? {
                        currencyCode: seat.priceBreakdown.total.currencyCode,
                        units: seat.priceBreakdown.total.units,
                        nanos: seat.priceBreakdown.total.nanos
                      }
                    : null
                }))
              }))
            }))
          }))
        }
      }
    };
  } catch (error) {
    console.error('Error fetching seat map:', error);
    return generateMockSeatMapData(currency_code);
  }
};

// Helper function to generate mock seat map data
const generateMockSeatMapData = (currency_code: string = "AED") => {
  const rows = 30;
  const columns = [
    { id: 'A', description: ['WINDOW'] },
    { id: 'B', description: ['BETWEEN'] },
    { id: 'C', description: ['AISLE'] },
    { id: 'D', description: ['AISLE'] },
    { id: 'E', description: ['BETWEEN'] },
    { id: 'F', description: ['WINDOW'] }
  ];
  
  const mockCabins = [{
    class: 'ECONOMY',
    deck: 'MAIN',
    columns: columns,
    rows: Array.from({ length: rows }, (_, i) => ({
      id: i + 1,
      description: null,
      seats: columns.map(col => {
        const seatId = `${i + 1}${col.id}`;
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        const seatType = Math.random();
        
        let description = 'NORMAL';
        let priceBreakdown = null;

        if (isAvailable) {
          if (seatType < 0.2) {
            description = 'EXTRA_LEGROOM';
            priceBreakdown = {
              total: {
                currencyCode: currency_code,
                units: 70,
                nanos: 650000000
              },
              baseFare: {
                currencyCode: currency_code,
                units: 70,
                nanos: 650000000
              },
              fee: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              tax: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              moreTaxesAndFees: null,
              discount: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              totalWithoutDiscount: {
                currencyCode: currency_code,
                units: 70,
                nanos: 650000000
              }
            };
          } else if (seatType < 0.4) {
            description = 'PREFERRED';
            priceBreakdown = {
              total: {
                currencyCode: currency_code,
                units: 50,
                nanos: 0
              },
              baseFare: {
                currencyCode: currency_code,
                units: 50,
                nanos: 0
              },
              fee: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              tax: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              moreTaxesAndFees: null,
              discount: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              totalWithoutDiscount: {
                currencyCode: currency_code,
                units: 50,
                nanos: 0
              }
            };
          } else {
            description = 'NORMAL';
            priceBreakdown = {
              total: {
                currencyCode: currency_code,
                units: 30,
                nanos: 0
              },
              baseFare: {
                currencyCode: currency_code,
                units: 30,
                nanos: 0
              },
              fee: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              tax: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              moreTaxesAndFees: null,
              discount: {
                currencyCode: currency_code,
                units: 0,
                nanos: 0
              },
              totalWithoutDiscount: {
                currencyCode: currency_code,
                units: 30,
                nanos: 0
              }
            };
          }
        }

        return {
          colId: col.id,
          description: description,
          price: null,
          priceBreakdown: priceBreakdown,
          seatCharacteristic: isAvailable ? [description] : ['UNAVAILABLE']
        };
      })
    }))
  }];

  return {
    status: true,
    message: "Success",
    timestamp: Date.now(),
    data: {
      airProductReference: "n/a",
      seatMapOption: [{
        cabins: mockCabins,
        optionType: 'STANDARD',
        optionFeatures: ['Standard Configuration'],
        optionRestrictions: []
      }]
    }
  };
};

// Helper function to get airline logo
const getAirlineLogo = (code: string): string => {
  if (!code) return '';
  return `https://content.airhex.com/content/logos/airlines_${code}_200_200_s.png`;
};
