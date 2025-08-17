import { useState, useEffect, useRef } from "react";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightResults from "@/components/FlightResults";
import FlightApiFeatures from "@/components/FlightApiFeatures";
import { searchFlights, FlightOffer, getFlightDetails, getSeatMap } from "@/services/flightApi";
import "@/flight.css";
import { 
  ArrowDown, 
  Route, 
  PlaneTakeoff, 
  PlaneLanding, 
  Clock, 
  Luggage, 
  BadgeCheck, 
  BadgeX, 
  ArrowLeft, 
  Baby, 
  Accessibility,
  Calendar,
  Building,
  Timer,
  CreditCard,
  ShieldCheck,
  Users,
  Globe,
  Info,
  Tag,
  Briefcase,
  Award,
  Compass,
  MapPin,
  AlertTriangle,
  DollarSign,
  Utensils,
  User,
  Mail,
  Phone,
  Grid,
  Badge
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { Dialog } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Add these interfaces at the top of the file, after the imports
interface SeatPrice {
  currencyCode: string;
  units: number;
  nanos?: number;
}

interface SeatPriceBreakdown {
  total: SeatPrice;
  baseFare?: SeatPrice;
  tax?: SeatPrice;
  fee?: SeatPrice;
  discount?: SeatPrice;
  totalWithoutDiscount?: SeatPrice;
  moreTaxesAndFees?: any;
}

interface Seat {
  id?: string;
  colId: string;
  available?: boolean;
  description?: string;
  price?: any;
  priceBreakdown?: SeatPriceBreakdown;
  seatCharacteristic?: string[];
  seatType?: string;
  seatLocation?: string;
  seatFeatures?: string[];
  restrictions?: string[];
  seatClass?: string;
  seatGroup?: string;
  seatPosition?: {
    row: number;
    column: number;
    deck?: number;
  };
}

interface SeatColumn {
  id: string;
  type?: string;
  description?: string[];
  characteristics?: string[];
}

interface SeatRow {
  id: string | number;
  description?: any;
  seats: Seat[];
  rowType?: string;
  rowCharacteristics?: string[];
}

interface Cabin {
  class: string;
  deck?: string;
  columns: SeatColumn[];
  rows: SeatRow[];
  cabinType?: string;
  cabinFeatures?: string[];
  cabinRestrictions?: string[];
}

interface SeatMapOption {
  cabins: {
    class: string;
    deck: string;
    columns: {
      id: string;
      description: string[];
    }[];
    rows: {
      id: number;
      description: any;
      seats: {
        colId: string;
        description: string;
        price: any;
        priceBreakdown: any;
        seatCharacteristic: string[];
      }[];
    }[];
  }[];
  optionType: string;
}

interface SeatMapData {
  airProductReference: string;
  seatMapOption: SeatMapOption | SeatMapOption[];
}

interface SeatMapResponse {
  data: SeatMapData;
}

// Utility function to format time strings (e.g., '2024-06-01T14:30:00Z' -> '14:30')
function formatTime(dateString: string | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "-";
  }
}

// Utility to safely render baggage info
function renderBaggage(baggage: any): string {
  if (!baggage) return "-";
  if (typeof baggage === "string") return baggage;
  if (typeof baggage === "object") {
    if (baggage.description) return baggage.description;
    if (baggage.maxPiece && baggage.maxWeightPerPiece && baggage.massUnit)
      return `${baggage.maxPiece} x ${baggage.maxWeightPerPiece}${baggage.massUnit}`;
    return JSON.stringify(baggage);
  }
  return "-";
}

// Utility to safely render fare rules
function renderFareRules(fareRules: any): string {
  if (!fareRules) return "-";
  if (typeof fareRules === "string") return fareRules;
  if (typeof fareRules === "object") {
    if (fareRules.text) return fareRules.text;
    return JSON.stringify(fareRules);
  }
  return "-";
}

// Find the lowest price for the Best Price badge
const getLowestPrice = (flights: any[]) => {
  if (!flights || flights.length === 0) return null;
  let min = flights[0];
  flights.forEach(f => {
    if (typeof f.price === 'string') return;
    if (f.price < min.price) min = f;
  });
  return min?.id;
};

// Add these helper functions at the top of the file
const getSeatColor = (characteristics: string[]) => {
  if (characteristics.includes('EXTRA_LEG_ROOM')) return 'bg-blue-100 border-blue-500';
  if (characteristics.includes('PREFERRED')) return 'bg-green-100 border-green-500';
  return 'bg-gray-100 border-gray-500';
};

const getSeatTypeLabel = (characteristics: string[]) => {
  if (characteristics.includes('EXTRA_LEG_ROOM')) return 'Extra Legroom';
  if (characteristics.includes('PREFERRED')) return 'Preferred';
  return 'Standard';
};

const getPriceAdditional = (price: any) => {
  if (!price) return '';
  const amount = price.amount || 0;
  return amount > 0 ? `+${amount} ${price.currencyCode}` : '';
};

// Helper function to generate mock seat map data
function generateMockSeatMapData(currencyCode = "USD") {
  return {
    data: {
      airProductReference: "MOCK123",
      seatMap: {
        seatMapOption: [
          {
            cabins: [
              {
                class: "Economy",
                deck: "Main",
                columns: [
                  { id: "A", description: ["WINDOW"] },
                  { id: "B", description: ["MIDDLE"] },
                  { id: "C", description: ["AISLE"] },
                  { id: "D", description: ["AISLE"] },
                  { id: "E", description: ["MIDDLE"] },
                  { id: "F", description: ["WINDOW"] }
                ],
                rows: Array.from({ length: 10 }, (_, i) => ({
                  id: i + 1,
                  description: "",
                  seats: [
                    ...["A", "B", "C", "D", "E", "F"].map((col, idx) => ({
                      colId: col,
                      description: idx === 0 || idx === 5 ? "WINDOW" : idx === 2 || idx === 3 ? "AISLE" : "MIDDLE",
                      price: {
                        amount: idx === 0 || idx === 5 ? 70.65 : idx === 2 || idx === 3 ? 50 : 30,
                        currencyCode
                      },
                      priceBreakdown: {
                        total: {
                          units: idx === 0 || idx === 5 ? 70 : idx === 2 || idx === 3 ? 50 : 30,
                          nanos: idx === 0 || idx === 5 ? 650000000 : 0,
                          currencyCode
                        }
                      },
                      seatCharacteristic: [
                        idx === 0 || idx === 5 ? "EXTRA_LEG_ROOM" : idx === 2 || idx === 3 ? "PREFERRED" : "STANDARD"
                      ]
                    }))
                  ]
                }))
              }
            ],
            optionType: "MOCK"
          }
        ]
      }
    }
  };
}

// Change component name from Index to Flight
const Flight = () => {
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [seatMap, setSeatMap] = useState<any>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showBookingRequired, setShowBookingRequired] = useState(false);
  const [selectedSeatMap, setSelectedSeatMap] = useState<any>(null);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFlightDetails, setSelectedFlightDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsSeatMap, setDetailsSeatMap] = useState<any>(null);
  const [seatMapLoading, setSeatMapLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [currentBookingFlight, setCurrentBookingFlight] = useState<any>(null);
  const testimonials = [
    {
      name: "Sarah M.",
      location: "London, UK",
      quote: "BlackSwan made booking my trip effortless and affordable! Highly recommended.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "James L.",
      location: "New York, USA",
      quote: "The best flight deals and amazing customer support. I always use BlackSwan!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Aisha K.",
      location: "Dubai, UAE",
      quote: "Super smooth experience and the interface is beautiful. 10/10!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingFlightId, setBookingFlightId] = useState(null); // The flight being booked
  const [bookedFlightId, setBookedFlightId] = useState(null); // The flight that has been paid for
  
  // Background images array - set to only one image
  const backgroundImages = [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=3840&q=80"
  ];
  
  // Track scroll position for parallax and reveal effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      if (heroRef.current) {
        heroRef.current.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
      }
      if (featuresRef.current) {
        featuresRef.current.style.transform = `translate3d(${x / 2}px, ${y / 2}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D section reveal
  useEffect(() => {
    const revealSections = document.querySelectorAll('.section-3d-reveal');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });
    revealSections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleSearch = async (searchData: any) => {
    setSearchParams(searchData);
    setIsSearching(true);
    try {
      // Ensure dates are in YYYY-MM-DD format
      const departDateFormatted = searchData.departDate instanceof Date
        ? format(searchData.departDate, "yyyy-MM-dd")
        : searchData.departDate;
      const returnDateFormatted = searchData.returnDate instanceof Date
        ? format(searchData.returnDate, "yyyy-MM-dd")
        : searchData.returnDate;

      // Use the origin and destination from user input
      const fromId = searchData.origin;
      const toId = searchData.destination;
      
      // Store airport codes for filtering results
      searchData.originCode = searchData.originCode || "";
      searchData.destinationCode = searchData.destinationCode || "";
      
      // Validate required fields
      if (!fromId || !toId) {
        toast.error("Origin and destination are required");
        setIsSearching(false);
        return;
      }

      const adults = Number(searchData.passengers?.adults) > 0 ? searchData.passengers.adults : 1;
      const children = typeof searchData.childrenAges === 'string' ? searchData.childrenAges : '';
      const cabinClass = searchData.cabinClass ? searchData.cabinClass.toUpperCase() : "ECONOMY";
      const currency_code = searchData.currency_code || "USD";
      const stops = searchData.stops || "none";
      const sort = searchData.sort || "BEST";
      const pageNo = searchData.pageNo || 1;

      // Log all parameters
      console.log('searchFlights params:', {
        fromId, toId, departDate: departDateFormatted, returnDate: returnDateFormatted, stops, pageNo, adults, children, sort, cabinClass, currency_code
      });

      const results = await searchFlights({
        fromId,
        toId,
        departDate: departDateFormatted,
        returnDate: returnDateFormatted,
        stops,
        pageNo,
        adults,
        children,
        sort,
        cabinClass,
        currency_code,
      });
      console.log("searchFlights API response:", results);
      if (!results || results.status === false) {
        toast.error(results?.message || "Flight search failed. Please try again.");
        setFlights([]);
        setFlightDetails(null);
        setIsSearching(false);
        return;
      }
      const offers = results?.data?.flightOffers || [];
      const mappedFlights = offers.map((f: any, idx: number) => {
        // Get the first segment for basic flight info
        const firstSegment = f.segments && f.segments[0] ? f.segments[0] : {};
        const leg = firstSegment.legs && firstSegment.legs[0] ? firstSegment.legs[0] : {};
        const carrier = leg.carriersData && leg.carriersData[0] ? leg.carriersData[0] : {};

        // Process price information
        const priceObj = f.priceBreakdown?.total;
        const getPriceString = (p: any) => {
          if (!p) return '-';
          const units = p.units || 0;
          const nanos = p.nanos || 0;
          const nanosDecimal = nanos / 1000000000;
          const totalAmount = units + nanosDecimal;
          return `${p.currencyCode} ${totalAmount.toFixed(2)}`;
        };

        // Baggage info: combine checked and cabin
        const checked = f.travellerCheckedLuggage?.[0]?.luggageAllowance;
        const cabin = f.travellerCabinLuggage?.[0]?.luggageAllowance;
        const checkedStr = checked ? `🧳 ${checked.maxPiece} x ${checked.maxWeightPerPiece}${checked.massUnit} checked` : '';
        const cabinStr = cabin ? `🎒 ${cabin.maxPiece} x ${cabin.maxWeightPerPiece}${cabin.massUnit} cabin` : '';
        const baggage = [checkedStr, cabinStr].filter(Boolean).join(' | ');

        // Calculate total duration across all segments
        const totalDuration = f.segments?.reduce((total: number, segment: any) => {
          return total + (segment.totalTime || 0);
        }, 0) || 0;

        // Get the first and last segments for departure and arrival
        const lastSegment = f.segments && f.segments[f.segments.length - 1] ? f.segments[f.segments.length - 1] : {};

        // Calculate stops based only on the outbound direction (first segment's legs)
        let stops = 0;
        if (Array.isArray(f.segments) && f.segments.length > 0) {
          if (Array.isArray(f.segments[0].legs)) {
            stops = f.segments[0].legs.length - 1;
          } else {
            stops = 0;
          }
        }

        // --- Fix for departure/arrival code fallback ---
        let departureAirport = firstSegment.departureAirport?.code || '';
        let arrivalAirport = lastSegment.arrivalAirport?.code || '';
        // If codes are missing or the same, fallback to searchParams
        if (!departureAirport || !arrivalAirport || departureAirport === arrivalAirport) {
          departureAirport = searchData.originCode || searchData.origin || '-';
          arrivalAirport = searchData.destinationCode || searchData.destination || '-';
        }

        return {
          id: f.token || idx,
          airline: carrier.name || '-',
          airlineLogo: carrier.logo || '',
          flightNumber: leg.flightInfo?.flightNumber || '-',
          departureTime: firstSegment.departureTime || '-',
          arrivalTime: lastSegment.arrivalTime || '-',
          departureAirport,
          arrivalAirport,
          duration: totalDuration ? `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m` : '-',
          stops,
          cabinClass: leg.cabinClass || '-',
          // Include both price string and full priceBreakdown
          price: getPriceString(priceObj),
          priceBreakdown: f.priceBreakdown || null,
          currencyCode: priceObj?.currencyCode || searchData.currency_code || 'USD',
          baggage,
          token: f.token,
          segments: f.segments || [] // Store all segments for detailed view
        };
      });
      setFlights(mappedFlights);
      setFlightDetails(null);
    } catch (error) {
      console.error("Error searching flights:", error);
      toast.error("An error occurred while searching for flights.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handler for selecting a flight and navigating to details page
  const handleSelectFlight = (flight: any) => {
    if (bookedFlightId === flight.id) {
      // Navigate to the detailed ticket page (FlightDetails)
      navigate(`/flight-details/${flight.token}`, {
        state: {
          flight,
          searchParams,
          selectedSeat: selectedSeat || null,
          passenger: {
            name: null,
            email: null,
            phone: null
          }
        }
      });
    } else {
      toast.error("Please book and pay for this flight to access the ticket PDF.");
    }
  };

  // Update handleBookFlight to show seat map first
  const handleBookFlight = async (flight: any) => {
    try {
      // Show seat map first
      setCurrentBookingFlight(flight);
      setShowSeatMap(true);
      
      // Get flight details for the seat map
      toast.loading("Loading flight details...");
      const details = await getFlightDetails(flight.token);
      toast.dismiss();
      
      if (details?.data) {
        setSelectedFlightDetails(details.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to load flight details. Please try again.");
      console.error("Error loading flight details:", error);
    }
  };

  // Update confirmBooking to handle the booking flow
  const confirmBooking = (flight) => {
    if (!selectedSeat) {
      toast.error("Please select a seat before booking.");
      return;
    }
    setBookingFlightId(flight.id);
    setShowPaymentModal(true);
  };

  // Update handlePaymentSubmit to navigate to flight details
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Show loading state
      toast.loading("Processing payment...");
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set the booked flight ID
      setBookedFlightId(bookingFlightId);
      setShowPaymentModal(false);
      setShowSeatMap(false);
      
      // Find the booked flight
      const bookedFlight = flights.find(f => f.id === bookingFlightId);
      
      if (bookedFlight) {
        // Navigate to flight details page
        navigate(`/flight-details/${bookedFlight.token}`, {
          state: {
            flight: bookedFlight,
            searchParams,
            selectedSeat,
            passenger: {
              name: null,
              email: null,
              phone: null
            }
          }
        });
        
        toast.dismiss();
        toast.success("Payment successful! Your ticket has been generated.");
      } else {
        toast.dismiss();
        toast.error("Could not find flight details. Please try again.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    }
  };

  // Update the seat map data processing
  const handleViewSeatMap = async (flight: any) => {
    try {
      setSeatMapLoading(true);
      setShowSeatMap(true);
      setSelectedFlightDetails(null);
      setSelectedSeat(null);
      setCurrentBookingFlight(flight);
      
      const flightCurrency = flight.price?.split(' ')[0] || 'USD';
      
      // Fetch flight details as before
      try {
        toast.loading("Loading flight details...");
        const details = await getFlightDetails(flight.token);
        toast.dismiss();
        if (details?.data?.priceBreakdown?.total) {
          details.data.priceBreakdown.total.currencyCode = flightCurrency;
        }
        setSelectedFlightDetails(details?.data);
      } catch (e) {
        toast.dismiss();
        toast.error("Error fetching flight details");
        console.error("Error fetching flight details:", e);
      }
      
      // Fetch seat map data
      toast.loading("Loading seat map...");
      const seatMapData = await getSeatMap(flight.token, flightCurrency);
      toast.dismiss();
      console.log("Seat map data:", seatMapData);
      
      // Always set selectedSeatMap in the same structure
      if (seatMapData?.data && seatMapData.data.seatMap && seatMapData.data.seatMap.seatMapOption) {
        setSelectedSeatMap({
          ...seatMapData,
          data: {
            ...seatMapData.data,
            seatMap: {
              seatMapOption: Array.isArray(seatMapData.data.seatMap.seatMapOption)
                ? seatMapData.data.seatMap.seatMapOption
                : [seatMapData.data.seatMap.seatMapOption]
            }
          }
        });
      } else {
        // Use mock data if no seat map is available
        const mockData = generateMockSeatMapData(flightCurrency);
        setSelectedSeatMap(mockData);
        toast.info("Showing mock seat map (no real seat map data available).", { duration: 3000 });
      }
    } catch (error) {
      // On error, also show mock data
      const flightCurrency = flight.price?.split(' ')[0] || 'USD';
      const mockData = generateMockSeatMapData(flightCurrency);
      setSelectedSeatMap(mockData);
      toast.info("Showing mock seat map (error loading real data).", { duration: 3000 });
      setSeatMapLoading(false);
    } finally {
      setSeatMapLoading(false);
    }
  };

  const handleSeatSelection = (seat: any, rowId: string, colId: string, price: string, currencyCode: string) => {
    setSelectedSeat({
      seat,
      seatId: `${rowId}${colId}`,
      price,
      currencyCode
    });
    toast.success(`Selected seat ${rowId}${colId} - ${price}`);
  };

  const handleShowDetails = async (flight: any) => {
    setShowDetailsModal(true);
    setDetailsLoading(true);
    setSelectedFlightDetails(null);
    setDetailsSeatMap(null);
    
    // Extract the currency from the flight's price
    const flightCurrency = flight.currencyCode || (flight.price?.split(' ')[0]) || 'USD';
    
    try {
      const details = await getFlightDetails(flight.token, flightCurrency);
      
      // If we have price data, ensure it uses the same currency as the flight card
      if (details?.data?.priceBreakdown) {
        const priceData = details.data.priceBreakdown;
        
        // Normalize currency codes across price breakdown
        if (priceData.baseFare && priceData.baseFare.currencyCode !== flightCurrency) {
          priceData.baseFare.currencyCode = flightCurrency;
        }
        if (priceData.tax && priceData.tax.currencyCode !== flightCurrency) {
          priceData.tax.currencyCode = flightCurrency;
        }
        if (priceData.fee && priceData.fee.currencyCode !== flightCurrency) {
          priceData.fee.currencyCode = flightCurrency;
        }
        if (priceData.discount && priceData.discount.currencyCode !== flightCurrency) {
          priceData.discount.currencyCode = flightCurrency;
        }
        if (priceData.total && priceData.total.currencyCode !== flightCurrency) {
          priceData.total.currencyCode = flightCurrency;
        }
      }
      
      setSelectedFlightDetails(details?.data);
    } catch (e) {
      toast.error("Could not load flight details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Update the details seat map handler
  const handleShowDetailsSeatMap = async (offerToken: string) => {
    if (!offerToken) {
      toast.error("No valid token for this flight. Cannot load seat map.");
      return;
    }
    setSeatMapLoading(true);
    setDetailsSeatMap(null);
    
    // Use the same currency as in the flight detail
    const flightCurrency = selectedFlightDetails?.priceBreakdown?.total?.currencyCode || 
                          currentBookingFlight?.price?.split(' ')[0] || 'USD';
    
    try {
      console.log("Fetching seat map for offerToken:", offerToken, "currency_code:", flightCurrency);
      const seatMap = await getSeatMap(offerToken, flightCurrency);
      console.log("Seat map API response:", seatMap);
      
      if (seatMap?.data) {
        const processedData = {
          ...seatMap,
          data: {
            ...seatMap.data,
            seatMap: {
              seatMapOption: Array.isArray(seatMap.data.seatMapOption) 
                ? seatMap.data.seatMapOption 
                : [seatMap.data.seatMapOption]
            }
          }
        };
        setDetailsSeatMap(processedData.data);
      } else {
        toast.error("No seat map data returned for this flight.");
      }
    } catch (e) {
      toast.error("Could not load seat map.");
    } finally {
      setSeatMapLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Remove Particle Overlay and Dynamic Background */}
      <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        {!searchParams && (
          <div className="text-center mb-12 relative z-20">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6" style={{ color: 'hsl(197, 100%, 36%)' }}>
              Book Your Next Flight
            </h1>
            <p className="text-xl max-w-2xl mx-auto font-medium mb-8" style={{ color: 'hsl(197, 100%, 36%)' }}>
              Discover the best deals, top airlines, and seamless travel experiences worldwide.
            </p>
            <div className="mt-8 flex justify-center">
              <a href="#search" className="px-8 py-4 font-bold rounded-full shadow text-lg transition-all duration-300 text-white" style={{ backgroundColor: 'hsl(197, 100%, 36%)' }}>
                Start Your Journey
              </a>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(197, 100%, 36%)' }}>
                <ArrowDown className="text-white" size={24} />
              </div>
            </div>
          </div>
        )}
        
        {/* Glass Reflection Animation on Search Box */}
        {!searchParams && (
          <div className="mb-16 pt-20 w-full px-4 sm:px-6 lg:px-8" id="search">
            <div className="relative group glass-3d w-full">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-gradient-to-br from-white/60 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-700 rounded-3xl blur-lg animate-glass-reflection" />
              </div>
              <div className="backdrop-blur-2xl border-4 border-gradient-to-r from-[hsl(214,57%,51%)] via-[hsl(214,57%,51%)] to-[hsl(214,57%,51%)] rounded-3xl shadow-2xl p-10 w-full relative transition-all duration-700 hover:shadow-3xl hover:scale-[1.01] focus-within:shadow-[hsl(214,57%,51%)]/40 focus-within:border-[hsl(214,57%,51%)] animate-slide-up">
                <FlightSearchForm onSearch={handleSearch} />
              </div>
            </div>
          </div>
        )}
        
        {/* Section Divider with animated SVG wave */}
        {!searchParams && (
          <div className="w-full flex justify-center items-center my-12 animate-fade-in-up">
            <svg className="w-full max-w-2xl h-8 animate-fade-in" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#0f214D" fillOpacity="0.5" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
            </svg>
          </div>
        )}
        
        {/* Flight Results */}
        <div className="max-w-4xl mx-auto relative">
          {/* Back to Search floating button - Updated style */}
          {searchParams && (
            <button 
              onClick={() => { setSearchParams(null); setFlights([]); }}
              className="fixed top-4 left-4 z-40 bg-white/90 backdrop-blur-sm rounded-full shadow-sm px-3 py-1.5 flex items-center gap-1.5 text-sm text-gray-600 hover:bg-white hover:text-gray-900 transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {isSearching ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] py-24 animate-fade-in">
              <svg className="animate-spin h-12 w-12 text-blue-700 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <div className="text-lg font-semibold text-blue-700">Searching for the best flight offers...</div>
              <div className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest deals for you.</div>
            </div>
          ) : (
            <FlightResults 
              flights={flights} 
              isLoading={isSearching} 
              searchParams={searchParams}
              onSelectFlight={handleSelectFlight}
              onBookFlight={handleBookFlight}
              onViewSeatMap={handleViewSeatMap}
              bookedFlightId={bookedFlightId}
              bestPriceId={getLowestPrice(flights)}
              onShowDetails={handleShowDetails}
            />
          )}
        </div>
        
        {/* Booking Required Message */}
        {showBookingRequired && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4 animate-slide-up">
              <h3 className="text-xl font-bold mb-4 text-[hsl(214,57%,51%)]">Booking Required</h3>
              <p className="text-gray-600 mb-6">Please book the flight first to access the details and download the ticket as PDF.</p>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowBookingRequired(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowBookingRequired(false);
                    // Scroll to booking section
                    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-[hsl(214,57%,51%)] text-white rounded-lg hover:bg-[hsl(214,57%,45%)] transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Seat Map Modal */}
        {showSeatMap && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
              {seatMapLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="animate-spin h-12 w-12 text-blue-700 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <div className="text-lg font-semibold text-blue-700 mb-2">Loading seat map...</div>
                  <div className="text-sm text-gray-500 max-w-md text-center">
                    Please wait while we retrieve the seat map for your flight. This may take a few moments.
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-700 mx-1 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-700 mx-1 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-700 mx-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              ) : (
                <>
              <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-black">Select Your Seat</h3>
                <button 
                  onClick={() => setShowSeatMap(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <BadgeX size={24} />
                </button>
              </div>
                  
                  {/* Flight details summary */}
                  <div className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3">
                        {selectedFlightDetails?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.logo && (
                          <img 
                            src={selectedFlightDetails.segments[0].legs[0].carriersData[0].logo} 
                            alt={selectedFlightDetails.segments[0].legs[0].carriersData[0].name} 
                            className="w-10 h-10 rounded-full border"
                          />
                        )}
                        <div>
                          <div className="font-bold text-black">
                            {selectedFlightDetails?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.name || "-"}
              </div>
                          <div className="text-xs text-gray-600">
                            Flight: {selectedFlightDetails?.segments?.[0]?.legs?.[0]?.flightInfo?.flightNumber || "-"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center gap-3">
                        <div className="text-center">
                          <div className="font-semibold text-black">
                            {selectedFlightDetails?.segments?.[0]?.departureAirport?.code || "-"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatTime(selectedFlightDetails?.segments?.[0]?.departureTime || "")}
                          </div>
                        </div>
                        <div className="flex-1 border-t border-dashed border-gray-300 relative">
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-xs text-gray-500">
                            {selectedFlightDetails?.segments?.[0]?.totalTime ? 
                              `${Math.floor(selectedFlightDetails.segments[0].totalTime / 3600)}h ${Math.floor((selectedFlightDetails.segments[0].totalTime % 3600) / 60)}m` : 
                              '-'
                            }
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-black">
                            {selectedFlightDetails?.segments?.[0]?.arrivalAirport?.code || "-"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatTime(selectedFlightDetails?.segments?.[0]?.arrivalTime || "")}
                          </div>
                        </div>
                      </div>
                      

                    </div>
                  </div>
                  
                  {/* Pricing Legend with descriptions */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-black">Seat Categories & Pricing</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="w-8 h-8 rounded border-2 border-blue-700 bg-blue-200 flex items-center justify-center text-blue-800 font-bold">+</div>
                        <div>
                          <div className="font-medium text-sm text-black">Extra Legroom</div>
                          <div className="text-xs text-gray-600">More space for your comfort</div>
                          <div className="text-xs font-semibold text-blue-800 mt-1">+ $45</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <div className="w-8 h-8 rounded border-2 border-orange-700 bg-orange-200 flex items-center justify-center text-orange-800 font-bold">P</div>
                        <div>
                          <div className="font-medium text-sm text-black">Preferred</div>
                          <div className="text-xs text-gray-600">Prime location seats</div>
                          <div className="text-xs font-semibold text-orange-800 mt-1">+$15-30</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="w-8 h-8 rounded border-2 border-purple-700 bg-purple-200 flex items-center justify-center text-purple-800 font-bold">S</div>
                        <div>
                          <div className="font-medium text-sm text-black">Standard</div>
                          <div className="text-xs text-gray-600">Regular economy seats</div>
                          <div className="text-xs font-semibold text-purple-800 mt-1">+$0-10</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="w-8 h-8 rounded border-2 border-gray-400 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">×</div>
                        <div>
                          <div className="font-medium text-sm text-black">Unavailable</div>
                          <div className="text-xs text-gray-600">Already booked or blocked</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Amenities */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs text-black">
                      <Baby size={14} className="text-gray-500" /> Baby seat available
                    </span>
                    <span className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs text-black">
                      <Accessibility size={14} className="text-gray-500" /> Wheelchair accessible
                    </span>
                    <span className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs text-black">
                      <Luggage size={14} className="text-gray-500" /> Extra overhead space
                    </span>
                    <span className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs text-black">
                      <Grid size={14} className="text-gray-500" /> Emergency exit row
                    </span>
                  </div>
                  
                  {/* Seat Map Visualization */}
                  <div className="space-y-6">
                {selectedSeatMap?.data?.seatMap?.seatMapOption && Array.isArray(selectedSeatMap.data.seatMap.seatMapOption) && selectedSeatMap.data.seatMap.seatMapOption.length > 0 ? (
                  selectedSeatMap.data.seatMap.seatMapOption.map((option: SeatMapOption, optionIdx: number) => (
                    <div key={optionIdx} className="border rounded-lg p-4">
                      {/* Aircraft Information */}
                      {selectedSeatMap.data.seatMap.aircraftType && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-semibold text-black mb-2">Aircraft Information</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="text-xs text-black">
                                  <span className="font-medium">Type:</span> {selectedSeatMap.data.seatMap.aircraftType}
                                </div>
                                {selectedSeatMap.data.seatMap.aircraftModel && (
                                  <div className="text-xs text-black">
                                    <span className="font-medium">Model:</span> {selectedSeatMap.data.seatMap.aircraftModel}
                                  </div>
                                )}
                                {selectedSeatMap.data.seatMap.totalSeats && (
                                  <div className="text-xs text-black">
                                    <span className="font-medium">Total Seats:</span> {selectedSeatMap.data.seatMap.totalSeats}
                                  </div>
                                )}
                                {selectedSeatMap.data.seatMap.availableSeats && (
                                  <div className="text-xs text-black">
                                    <span className="font-medium">Available Seats:</span> {selectedSeatMap.data.seatMap.availableSeats}
                                  </div>
                                )}
                              </div>
                        </div>
                      )}
                      
                      {/* Cabin Information */}
                      {option.cabins?.map((cabin: Cabin, cabinIdx: number) => (
                        <div key={cabinIdx} className="mb-6">
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                                <h4 className="text-sm font-semibold text-black mb-2">
                                  {cabin.class || '-'} Class
                            {cabin.deck && ` | Deck: ${cabin.deck}`}
                          </h4>
                          
                          {/* Cabin Features */}
                          {cabin.cabinFeatures && cabin.cabinFeatures.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {cabin.cabinFeatures.map((feature, idx) => (
                                      <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                        {feature}
                                      </span>
                                    ))}
                            </div>
                          )}
                          
                          {/* Cabin Restrictions */}
                          {cabin.cabinRestrictions && cabin.cabinRestrictions.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {cabin.cabinRestrictions.map((restriction, idx) => (
                                      <span key={idx} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <AlertTriangle size={12} />
                                        {restriction}
                                      </span>
                                    ))}
                            </div>
                          )}
                              </div>
                              
                              <div className="flex justify-center mb-4">
                                <div className="p-6 bg-blue-50 rounded-lg inline-block">
                                  <div className="text-center text-xs font-semibold text-black mb-3 bg-white py-2 px-4 rounded-full shadow-sm">FRONT OF AIRCRAFT</div>
                                  <div className="overflow-x-auto mb-3 px-4">
                                    <table className="min-w-full border-separate border-spacing-y-4 border-spacing-x-2">
                              <thead>
                                <tr>
                                          <th className="px-2 py-1 text-xs text-center text-black font-bold bg-gray-100 rounded">Row</th>
                                  {cabin.columns?.map((col: SeatColumn) => (
                                            <th key={col.id} className="px-2 py-1 text-xs text-center text-black font-bold bg-gray-100 rounded">
                                      {col.id || '-'}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {cabin.rows?.map((row: SeatRow, rowIdx: number) => (
                                  <tr key={`row-${optionIdx}-${cabinIdx}-${rowIdx}-${row.id || ''}`}>
                                            <td className="px-2 py-1 font-bold text-xs text-center align-middle text-black bg-gray-100 rounded w-12">
                                      {row.id || '-'}
                                    </td>
                                    {cabin.columns?.map((col: SeatColumn, colIdx: number) => {
                                      const seat = Array.isArray(row.seats) ? row.seats.find((s: Seat) => s.colId === col.id) : null;
                                              
                                              if (!seat) return (
                                                <td key={`cell-${optionIdx}-${cabinIdx}-${rowIdx}-${colIdx}-empty`} className="px-1"></td>
                                              );
                                              
                                              // Get seat characteristics from either seatCharacteristic array or description string
                                              const seatCharacteristics = [];
                                              if (Array.isArray(seat.seatCharacteristic)) {
                                                seatCharacteristics.push(...seat.seatCharacteristic);
                                              }
                                              
                                              // Add description to characteristics if it exists
                                              if (typeof seat.description === 'string') {
                                                seatCharacteristics.push(seat.description);
                                              }
                                              
                                              // Add column description to characteristics
                                              if (Array.isArray(col.description)) {
                                                seatCharacteristics.push(...col.description);
                                              }
                                              
                                              const available = seat.available !== false;
                                              const characteristics = seatCharacteristics.map((c: string) => c.toUpperCase());
                                      const restrictions = Array.isArray(seat.restrictions) ? seat.restrictions : [];
                                      const features = Array.isArray(seat.seatFeatures) ? seat.seatFeatures : [];
                                      
                                              // Enhanced seat coloring based on characteristics
                                      let seatColor = '';
                                              let seatTypeLabel = '';
                                              let priceAdditional = '';
                                              
                                              if (!available || characteristics.includes('OCCUPIED') || characteristics.includes('UNAVAILABLE')) {
                                                seatColor = 'bg-gray-200 border-gray-400 text-gray-400';
                                                seatTypeLabel = 'Unavailable';
                                              } else if (characteristics.includes('EXTRA_LEGROOM') || characteristics.includes('LEGROOM')) {
                                                seatColor = 'bg-blue-200 border-blue-700 text-blue-900';
                                                seatTypeLabel = 'Extra Legroom';
                                                priceAdditional = '+ $45';
                                              } else if (characteristics.includes('PREFERRED')) {
                                                seatColor = 'bg-orange-200 border-orange-700 text-orange-900';
                                                seatTypeLabel = 'Preferred';
                                                priceAdditional = '+ $30';
                                              } else if (characteristics.includes('STANDARD') || characteristics.includes('NORMAL')) {
                                                seatColor = 'bg-purple-200 border-purple-700 text-purple-900';
                                                seatTypeLabel = 'Standard';
                                                priceAdditional = '+ $10';
                                              } else {
                                                // If no specific type, use green for available seats
                                                seatColor = 'bg-green-200 border-green-600 text-green-900';
                                                seatTypeLabel = 'Available';
                                                priceAdditional = '+ $0';
                                              }
                                              
                                              // Determine specific characteristics
                                              const isEmergencyExit = characteristics.includes('EMERGENCY_EXIT');
                                              const isWindow = characteristics.includes('WINDOW');
                                              const isAisle = characteristics.includes('AISLE');
                                              const isMiddle = characteristics.includes('BETWEEN') || characteristics.includes('MIDDLE');
                                      const showBaby = characteristics.includes('BABY');
                                      const showWheel = characteristics.includes('WHEELCHAIR');
                                              
                                              // Get actual price from API if available, else use our pricing tier
                                              let price = priceAdditional;
                                              let formattedCurrencyValue = "";
                                              let currencyCode = "USD";
                                              
                                              // Extract price from API response
                                              if (seat.priceBreakdown?.total) {
                                                currencyCode = seat.priceBreakdown.total.currencyCode || 'USD';
                                                const units = seat.priceBreakdown.total.units || 0;
                                                const nanos = seat.priceBreakdown.total.nanos || 0;
                                                
                                                // Convert nanos (billionths) to a decimal value
                                                const nanosDecimal = nanos / 1000000000;
                                                const totalAmount = units + nanosDecimal;
                                                
                                                if (totalAmount > 0) {
                                                  formattedCurrencyValue = `${currencyCode} ${totalAmount.toFixed(2)}`;
                                                  price = formattedCurrencyValue;
                                                } else {
                                                  // If amount is 0, still use our pricing tier based on seat type
                                                  formattedCurrencyValue = `${currencyCode} 0`;
                                                  if (priceAdditional !== '+ $0') {
                                                    // Extract the numerical value from priceAdditional (e.g., '+ $45' -> 45)
                                                    const additionalAmount = parseFloat(priceAdditional.replace(/[^0-9.]/g, ''));
                                                    price = `${currencyCode} ${additionalAmount}`;
                                                  } else {
                                                    price = formattedCurrencyValue;
                                                  }
                                                }
                                              } else {
                                                // If no price breakdown, convert our generic pricing to the flight's currency
                                                const baseCurrencyCode = currentBookingFlight?.price?.split(' ')[0] || 'USD';
                                                currencyCode = baseCurrencyCode;
                                                
                                                // Extract the numerical value from priceAdditional
                                                if (priceAdditional !== '+ $0') {
                                                  const additionalAmount = parseFloat(priceAdditional.replace(/[^0-9.]/g, ''));
                                                  price = `${currencyCode} ${additionalAmount}`;
                                                } else {
                                                  price = `${currencyCode} 0`;
                                                }
                                              }
                                              
                                              // Check if this is the selected seat
                                              const isSelected = selectedSeat && selectedSeat.seatId === `${String(row.id)}${col.id}`;
                                      
                                      // Enhanced tooltip content
                                      const tooltip = [
                                                `Seat: ${String(row.id)}${col.id}`,
                                                seatTypeLabel && `Type: ${seatTypeLabel}`,
                                                price && `Price: ${price}`,
                                                isWindow ? 'Window Seat' : isAisle ? 'Aisle Seat' : isMiddle ? 'Middle Seat' : '',
                                                isEmergencyExit ? 'Emergency Exit Row' : '',
                                                showBaby ? 'Suitable for infants' : '',
                                                showWheel ? 'Wheelchair accessible' : '',
                                        seat.seatLocation && `Location: ${seat.seatLocation}`,
                                        features.length > 0 && `Features: ${features.join(', ')}`,
                                        restrictions.length > 0 && `Restrictions: ${restrictions.join(', ')}`,
                                      ].filter(Boolean).join('\n');
                                      
                                      return (
                                                <td key={`cell-${optionIdx}-${cabinIdx}-${rowIdx}-${colIdx}-${seat.id || ''}`} className="px-1 py-1 text-center align-middle">
                                          <button
                                                    className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 text-xs font-bold transition-all duration-150 ${seatColor} ${isSelected ? 'ring-4 ring-green-500 scale-110' : ''} ${available ? 'hover:brightness-110 hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                                            disabled={!available}
                                            title={tooltip}
                                            onClick={() => {
                                              if (available) {
                                                        handleSeatSelection(seat, String(row.id), col.id, price, currencyCode);
                                                      }
                                                    }}
                                                  >
                                                    <span className="font-bold">{String(row.id)}{col.id}</span>
                                                    {price && <span className="text-[10px] font-semibold mt-1">{price}</span>}
                                                    {isEmergencyExit && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
                                                    {showBaby && <Baby size={8} className="absolute bottom-0 left-0 text-gray-500" />}
                                                    {showWheel && <Accessibility size={8} className="absolute bottom-0 right-0 text-gray-500" />}
                                          </button>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                                  </div>
                                  <div className="text-center text-xs font-semibold text-black bg-white py-2 px-4 rounded-full shadow-sm">BACK OF AIRCRAFT</div>
                                </div>
                          </div>
                        </div>
                      ))}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-500 mb-2">No seat map data available</div>
                        <p className="text-sm text-gray-500">The airline hasn't provided seat map information for this flight.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Seat Summary */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-semibold mb-3 text-black">Booking Summary</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Flight</div>
                          <div className="text-sm font-medium text-black">
                            {selectedFlightDetails?.segments?.[0]?.departureAirport?.code || "-"} → {selectedFlightDetails?.segments?.[0]?.arrivalAirport?.code || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Date</div>
                          <div className="text-sm font-medium text-black">
                            {selectedFlightDetails?.segments?.[0]?.departureTime ? new Date(selectedFlightDetails.segments[0].departureTime).toLocaleDateString() : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Passengers</div>
                          <div className="text-sm font-medium text-black">
                            {searchParams?.passengers?.adults || 1} Adult{(searchParams?.passengers?.adults || 1) > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      {/* Selected seat information */}
                      {selectedSeat && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex flex-wrap items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-500">Selected Seat</div>
                              <div className="text-sm font-medium text-black flex items-center gap-2">
                                {selectedSeat.seatId}
                                <Badge className="bg-green-100 text-green-700 px-2">
                                  {selectedSeat.price}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSeat(null)}
                              className="text-xs"
                            >
                              Change Seat
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Total price with seat */}
                      {currentBookingFlight && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-xs text-gray-500">Total Price</div>
                              <div className="text-base font-bold text-black flex items-center gap-2">
                                <span>{currentBookingFlight.price}</span>
                                {selectedSeat && selectedSeat.price && (
                                  <div className="flex items-center">
                                    <span className="text-gray-400 mx-1">+</span>
                                    <Badge className="bg-blue-100 text-blue-700">
                                      {selectedSeat.price}
                                    </Badge>
                                    <span className="text-gray-400 mx-1">=</span>
                                    <span className="text-green-600">
                                      {(() => {
                                        // Extract currency and amount from both values
                                        const flightCurrency = currentBookingFlight.price.split(' ')[0];
                                        const flightAmount = parseFloat(currentBookingFlight.price.split(' ')[1]) || 0;
                                        
                                        // Handle seat price
                                        let seatAmount = 0;
                                        if (selectedSeat.price) {
                                          // Check if it contains currency code or just a number
                                          if (selectedSeat.price.includes(' ')) {
                                            seatAmount = parseFloat(selectedSeat.price.split(' ')[1]) || 0;
                                          } else {
                                            seatAmount = parseFloat(selectedSeat.price.replace(/[^0-9.]/g, '')) || 0;
                                          }
                                        }
                                        
                                        // Calculate total and ensure proper formatting
                                        const total = flightAmount + seatAmount;
                                        return `${flightCurrency} ${total.toFixed(2)}`;
                                      })()}
                                    </span>
                        </div>
                      )}
                    </div>
                            </div>
                          </div>
                        </div>
                )}
              </div>
                    
                    <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowSeatMap(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button 
                        onClick={() => confirmBooking(currentBookingFlight)}
                        className="px-6 py-2 bg-[hsl(214,57%,51%)] text-white rounded-lg hover:bg-[hsl(214,57%,45%)] transition-colors font-medium"
                      >
                        Confirm Booking
                </button>
              </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Flight Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl p-5 max-w-4xl w-full shadow-lg overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold text-black">
                  Flight Details
                </h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-800 text-lg">×</button>
              </div>
              {detailsLoading && (
                <div className="flex items-center justify-center py-6">
                  <span className="loader mr-2"></span> <span className="text-sm text-black">Loading flight details...</span>
                </div>
              )}
              {!detailsLoading && selectedFlightDetails && (
                <div className="space-y-4">
                  {/* Reference ID removed as requested */}

                  {/* Flight Summary */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-xs font-semibold text-black flex items-center gap-2 mb-2">
                      <Info size={12} className="text-black" />
                      Flight Summary
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-start gap-2">
                        <Route size={12} className="text-black mt-1" />
                        <div>
                          <div className="text-[10px] font-medium text-black">Trip Type</div>
                          <div className="text-xs font-semibold text-black">{selectedFlightDetails.tripType || '-'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShieldCheck size={12} className="text-black mt-1" />
                        <div>
                          <div className="text-[10px] font-medium text-black">ATOL Protected</div>
                          <div className="text-xs font-semibold text-black">{typeof selectedFlightDetails.isAtolProtected !== 'undefined' ? (selectedFlightDetails.isAtolProtected ? "Yes" : "No") : '-'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Globe size={12} className="text-black mt-1" />
                        <div>
                          <div className="text-[10px] font-medium text-black">Point of Sale</div>
                          <div className="text-xs font-semibold text-black">{selectedFlightDetails.pointOfSale || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segments Section */}
                  {Array.isArray(selectedFlightDetails.segments) && selectedFlightDetails.segments.map((segment, segIdx) => (
                    <div key={segIdx} className="border border-gray-200 rounded-lg shadow-sm p-3 bg-white">
                      <h3 className="text-xs font-bold border-b border-gray-200 pb-2 mb-2 flex items-center gap-2 text-black">
                        <div className="bg-gray-100 p-1 rounded-full">
                          <PlaneTakeoff size={12} className="text-black" />
                        </div>
                        Segment {segIdx + 1}: {segment.departureAirport?.cityName || '-'} → {segment.arrivalAirport?.cityName || '-'}
                      </h3>
                      
                      {/* Segment Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="bg-gray-50 rounded-lg p-2 transition-all duration-300 hover:shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-black flex items-center gap-1 mb-1">
                              <PlaneTakeoff size={10} className="text-black" /> Departure
                            </span>
                            <div className="font-semibold text-xs text-black">{segment.departureAirport?.cityName || '-'} ({segment.departureAirport?.code || '-'})</div>
                            <div className="text-[10px] text-black">{segment.departureAirport?.name || '-'}</div>
                            <div className="text-[10px] text-black">{segment.departureAirport?.countryName || '-'}</div>
                            <div className="mt-1 text-[10px] bg-gray-100 text-black px-2 py-0.5 rounded inline-flex items-center gap-1 w-fit">
                              <Calendar size={8} className="text-black" />
                              {new Date(segment.departureTime).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 transition-all duration-300 hover:shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-black flex items-center gap-1 mb-1">
                              <PlaneLanding size={10} className="text-black" /> Arrival
                            </span>
                            <div className="font-semibold text-xs text-black">{segment.arrivalAirport?.cityName || '-'} ({segment.arrivalAirport?.code || '-'})</div>
                            <div className="text-[10px] text-black">{segment.arrivalAirport?.name || '-'}</div>
                            <div className="text-[10px] text-black">{segment.arrivalAirport?.countryName || '-'}</div>
                            <div className="mt-1 text-[10px] bg-gray-100 text-black px-2 py-0.5 rounded inline-flex items-center gap-1 w-fit">
                              <Calendar size={8} className="text-black" />
                              {new Date(segment.arrivalTime).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg mb-3">
                        <Timer size={10} className="text-black" />
                        <span className="font-medium text-[10px] text-black">Total Flight Time:</span> 
                        <span className="bg-gray-100 text-black px-2 py-0.5 rounded text-[10px]">
                          {segment.totalTime ? `${Math.floor(segment.totalTime / 3600)}h ${Math.floor((segment.totalTime % 3600) / 60)}m` : '-'}
                        </span>
                      </div>

                      {/* Luggage Information */}
                      <div className="mb-3">
                        <h4 className="text-[10px] font-semibold mb-1.5 flex items-center gap-2 text-black border-b border-gray-200 pb-1.5">
                          <Briefcase size={10} className="text-black" />
                          Luggage Allowance
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {/* Checked Luggage */}
                          {Array.isArray(segment.travellerCheckedLuggage) && segment.travellerCheckedLuggage.map((luggage, idx) => (
                            <div key={idx} className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-sm transition-shadow">
                              <div className="text-[10px] font-medium flex items-center gap-1.5 mb-1 text-black">
                                <Luggage size={10} className="text-black" />
                                Checked Luggage (Traveller {luggage.travellerReference})
                              </div>
                              <div className="text-[10px] pl-4">
                                {luggage.luggageAllowance.ruleType === 'WEIGHT_BASED' ? (
                                  <span className="bg-gray-50 text-black px-2 py-0.5 rounded text-[10px]">
                                    {luggage.luggageAllowance.maxPiece} piece(s) up to {luggage.luggageAllowance.maxTotalWeight}{luggage.luggageAllowance.massUnit}
                                  </span>
                                ) : (
                                  <span className="bg-gray-50 text-black px-2 py-0.5 rounded text-[10px]">
                                    {luggage.luggageAllowance.maxPiece} piece(s)
                                    {luggage.luggageAllowance.maxWeightPerPiece && ` up to ${luggage.luggageAllowance.maxWeightPerPiece}${luggage.luggageAllowance.massUnit} each`}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}

                          {/* Cabin Luggage */}
                          {Array.isArray(segment.travellerCabinLuggage) && segment.travellerCabinLuggage.map((luggage, idx) => (
                            <div key={idx} className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-sm transition-shadow">
                              <div className="text-[10px] font-medium flex items-center gap-1.5 mb-1 text-black">
                                <Briefcase size={10} className="text-black" />
                                Cabin Luggage (Traveller {luggage.travellerReference})
                              </div>
                              <div className="text-[10px] pl-4">
                                <span className="bg-gray-50 text-black px-2 py-0.5 rounded">
                                  {luggage.luggageAllowance.maxPiece} piece(s)
                                  {luggage.luggageAllowance.maxWeightPerPiece && ` up to ${luggage.luggageAllowance.maxWeightPerPiece}${luggage.luggageAllowance.massUnit} each`}
                                </span>
                                
                                {luggage.luggageAllowance.sizeRestrictions && (
                                  <div className="mt-1 text-black">
                                    Size: {luggage.luggageAllowance.sizeRestrictions.maxLength}×
                                    {luggage.luggageAllowance.sizeRestrictions.maxWidth}×
                                    {luggage.luggageAllowance.sizeRestrictions.maxHeight}
                                    {luggage.luggageAllowance.sizeRestrictions.sizeUnit}
                                  </div>
                                )}
                                {luggage.personalItem && (
                                  <div className="mt-1 flex items-center gap-1 text-black">
                                    <BadgeCheck size={8} className="text-black" />
                                    Personal item included
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Flight Legs */}
                      <div className="mb-3">
                        <h4 className="text-[10px] font-semibold mb-1.5 flex items-center gap-2 text-black border-b border-gray-200 pb-1.5">
                          <Route size={10} className="text-black" />
                          Flight Legs ({segment.legs?.length || 0})
                        </h4>
                        <div className="space-y-2">
                          {Array.isArray(segment.legs) && segment.legs.map((leg, legIdx) => (
                            <div key={legIdx} className="border border-gray-200 rounded-lg shadow-sm p-2 bg-white hover:shadow-sm transition-shadow">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                <div className="bg-gray-50 p-2 rounded-md">
                                  <div className="text-[10px] font-medium flex items-center gap-1.5 text-black mb-1">
                                    <PlaneTakeoff size={10} className="text-black" />
                                    From
                                  </div>
                                  <div className="text-xs font-semibold text-black">{leg.departureAirport?.cityName || '-'} ({leg.departureAirport?.code || '-'})</div>
                                  <div className="text-[10px] flex items-center gap-1 mt-1 text-black">
                                    <Calendar size={8} className="text-black" />
                                    {new Date(leg.departureTime).toLocaleString()}
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-md">
                                  <div className="text-[10px] font-medium flex items-center gap-1.5 text-black mb-1">
                                    <PlaneLanding size={10} className="text-black" />
                                    To
                                  </div>
                                  <div className="text-xs font-semibold text-black">{leg.arrivalAirport?.cityName || '-'} ({leg.arrivalAirport?.code || '-'})</div>
                                  <div className="text-[10px] flex items-center gap-1 mt-1 text-black">
                                    <Calendar size={8} className="text-black" />
                                    {new Date(leg.arrivalTime).toLocaleString()}
                                  </div>
                                  {leg.arrivalTerminal && (
                                    <div className="text-[10px] flex items-center gap-1 mt-1 text-black">
                                      <Building size={8} className="text-black" />
                                      Terminal: {leg.arrivalTerminal}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-1.5 bg-gray-50 p-1.5 rounded-md">
                                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px]">
                                  <img src={leg.carriersData?.[0]?.logo} alt={leg.carriersData?.[0]?.name} className="w-3 h-3" />
                                  <span className="font-medium text-black">{leg.carriersData?.[0]?.name || '-'} ({leg.flightInfo?.carrierInfo?.marketingCarrier || '-'})</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px]">
                                  <Tag size={8} className="text-black" />
                                  <span className="text-black">Flight: {leg.flightInfo?.flightNumber || '-'}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px]">
                                  <PlaneTakeoff size={8} className="text-black" />
                                  <span className="text-black">Aircraft: {leg.flightInfo?.planeType || '-'}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px]">
                                  <Award size={8} className="text-black" />
                                  <span className="text-black">Class: {leg.cabinClass || '-'}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px]">
                                  <Timer size={8} className="text-black" />
                                  <span className="text-black">Duration: {leg.totalTime ? `${Math.floor(leg.totalTime / 3600)}h ${Math.floor((leg.totalTime % 3600) / 60)}m` : '-'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Breakdown Section */}
                      {selectedFlightDetails.priceBreakdown && (
                        <div className="border border-gray-200 rounded-lg shadow-sm p-3 bg-white">
                          <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-3 flex items-center gap-2 text-black">
                            <div className="bg-gray-100 p-1.5 rounded-full">
                              <DollarSign size={12} className="text-black" />
                            </div>
                            Price Breakdown
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                            <div className="bg-gray-50 p-2 rounded-lg hover:shadow-sm transition-shadow">
                              <div className="text-xs font-medium text-black flex items-center gap-1">
                                <Tag size={10} className="text-black" />
                                Base Fare
                              </div>
                              <div className="font-semibold text-xs text-black">
                                {selectedFlightDetails.priceBreakdown.baseFare ? 
                                  `${selectedFlightDetails.priceBreakdown.baseFare.currencyCode} ${selectedFlightDetails.priceBreakdown.baseFare.units}` : 
                                  '-'}
                            </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg hover:shadow-sm transition-shadow">
                              <div className="text-xs font-medium text-black flex items-center gap-1">
                                <Tag size={10} className="text-black" />
                                Tax
                              </div>
                              <div className="font-semibold text-xs text-black">
                                {selectedFlightDetails.priceBreakdown.tax ?
                                  `${selectedFlightDetails.priceBreakdown.tax.currencyCode} ${selectedFlightDetails.priceBreakdown.tax.units}` :
                                  '-'}
                            </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg hover:shadow-sm transition-shadow">
                              <div className="text-xs font-medium text-black flex items-center gap-1">
                                <Tag size={10} className="text-black" />
                                Fee
                              </div>
                              <div className="font-semibold text-xs text-black">
                                {selectedFlightDetails.priceBreakdown.fee ?
                                  `${selectedFlightDetails.priceBreakdown.fee.currencyCode} ${selectedFlightDetails.priceBreakdown.fee.units}` :
                                  '-'}
                            </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg hover:shadow-sm transition-shadow">
                              <div className="text-xs font-medium text-black flex items-center gap-1">
                                <Tag size={10} className="text-black" />
                                Discount
                              </div>
                              <div className="font-semibold text-xs text-black">
                                {selectedFlightDetails.priceBreakdown.discount ?
                                  `${selectedFlightDetails.priceBreakdown.discount.currencyCode} ${selectedFlightDetails.priceBreakdown.discount.units}` :
                                  '-'}
                            </div>
                            </div>
                            <div className="col-span-2 bg-gray-50 p-2 rounded-lg shadow-sm border border-gray-200">
                              <div className="text-xs font-medium text-black flex items-center gap-1">
                                <DollarSign size={10} className="text-black" />
                                Total Price
                              </div>
                              <div className="text-sm font-bold text-black">
                                {selectedFlightDetails.priceBreakdown.total ?
                                  `${selectedFlightDetails.priceBreakdown.total.currencyCode} ${selectedFlightDetails.priceBreakdown.total.units}` :
                                  '-'}
                              </div>
                            </div>
                          </div>

                          {/* Carrier Tax Breakdown */}
                          {Array.isArray(selectedFlightDetails.priceBreakdown.carrierTaxBreakdown) && selectedFlightDetails.priceBreakdown.carrierTaxBreakdown.length > 0 && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                              <h4 className="text-xs font-semibold mb-2 flex items-center gap-2 text-black">
                                <Tag size={10} className="text-black" />
                                Carrier Tax Breakdown
                              </h4>
                              <div className="space-y-1.5">
                                {selectedFlightDetails.priceBreakdown.carrierTaxBreakdown.map((tax, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-100">
                                    <img src={tax.carrier?.logo} alt={tax.carrier?.name} className="w-6 h-6" />
                                    <div className="font-medium">{tax.carrier?.name}: </div>
                                    <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                      {tax.avgPerAdult ? 
                                        `${tax.avgPerAdult.currencyCode || selectedFlightDetails.priceBreakdown.total.currencyCode} ${tax.avgPerAdult.units}` : 
                                        '-'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Traveller Prices */}
                      {Array.isArray(selectedFlightDetails.travellerPrices) && selectedFlightDetails.travellerPrices.length > 0 && (
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-bold border-b pb-2 mb-3">Traveller Prices</h3>
                          <div className="space-y-4">
                            {selectedFlightDetails.travellerPrices.map((travellerPrice, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-gray-50 rounded">
                                <div>
                                  <div className="text-sm font-medium">Traveller {travellerPrice.travellerReference}</div>
                                  <div>{travellerPrice.travellerType}</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">Price</div>
                                  <div>{travellerPrice.travellerPriceBreakdown?.total?.currencyCode || '-'} {travellerPrice.travellerPriceBreakdown?.total?.units || '-'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Included Products */}
                      {selectedFlightDetails.includedProducts && (
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-bold border-b pb-2 mb-3">Included Products</h3>
                          <div className="text-sm mb-2">
                            All segments identical: {selectedFlightDetails.includedProducts.areAllSegmentsIdentical ? 'Yes' : 'No'}
                          </div>
                          {Array.isArray(selectedFlightDetails.includedProducts.segments) && selectedFlightDetails.includedProducts.segments.map((segment, segIdx) => (
                            <div key={segIdx} className="mb-3">
                              <div className="font-semibold">Segment {segIdx + 1}</div>
                              <ul className="list-disc pl-5">
                                {Array.isArray(segment) && segment.map((product, prodIdx) => (
                                  <li key={prodIdx}>
                                    {product.luggageType || '-'}: {product.maxPiece || '-'} piece(s)
                                    {product.maxWeightPerPiece && ` up to ${product.maxWeightPerPiece}${product.massUnit}`}
                                    {product.piecePerPax && ` (${product.piecePerPax} per passenger)`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Extra Products */}
                      {Array.isArray(selectedFlightDetails.extraProducts) && selectedFlightDetails.extraProducts.length > 0 && (
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-bold border-b pb-2 mb-3">Extra Products Available</h3>
                          <div className="space-y-3">
                            {selectedFlightDetails.extraProducts.map((product, idx) => (
                              <div key={idx} className="p-2 bg-gray-50 rounded">
                                <div className="font-medium">{product.type}</div>
                                <div className="text-sm">
                                  Price: {product.priceBreakdown?.total?.currencyCode || '-'} {product.priceBreakdown?.total?.units || '-'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Flexible Ticket */}
                      {selectedFlightDetails.offerExtras?.flexibleTicket && (
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-bold border-b pb-2 mb-3">Flexible Ticket</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium">Provider</div>
                              <div>{selectedFlightDetails.offerExtras.flexibleTicket.supplierInfo?.name || '-'}</div>
                              {selectedFlightDetails.offerExtras.flexibleTicket.supplierInfo?.termsUrl && (
                                <a href={selectedFlightDetails.offerExtras.flexibleTicket.supplierInfo.termsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline">
                                  Terms & Conditions
                                </a>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">Price</div>
                              <div>{selectedFlightDetails.offerExtras.flexibleTicket.priceBreakdown?.total?.currencyCode || '-'} {selectedFlightDetails.offerExtras.flexibleTicket.priceBreakdown?.total?.units || '-'}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Meal Preferences */}
                      {selectedFlightDetails.ancillaries?.mealPreference && Array.isArray(selectedFlightDetails.ancillaries.mealPreference.choices) && (
                        <div className="border border-gray-200 rounded-lg shadow-sm p-3 bg-white">
                          <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-2 flex items-center gap-2 text-black">
                            <div className="bg-gray-100 p-1.5 rounded-full">
                              <Utensils size={12} className="text-black" />
                            </div>
                            Meal Preferences
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {selectedFlightDetails.ancillaries.mealPreference.choices.map((choice, idx) => (
                              <div key={idx} className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                <div className="text-xs font-medium flex items-center gap-1.5 mb-1 text-black">
                                  <Utensils size={10} className="text-black" />
                                  {choice.mealType || '-'}
                                </div>
                                <div className="text-xs pl-4">
                                  {choice.priceBreakdown?.total?.units === 0 ? (
                                    <span className="bg-gray-100 text-black px-2 py-0.5 rounded text-xs">Free</span>
                                  ) : (
                                    <span className="bg-gray-100 text-black px-2 py-0.5 rounded text-xs">{choice.priceBreakdown?.total?.currencyCode || '-'} {choice.priceBreakdown?.total?.units || '-'}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Traveller Requirements */}
                      {Array.isArray(selectedFlightDetails.travellerDataRequirements) && selectedFlightDetails.travellerDataRequirements.length > 0 && (
                        <div className="border border-gray-200 rounded-lg shadow-sm p-3 bg-white">
                          <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-2 flex items-center gap-2 text-black">
                            <div className="bg-gray-100 p-1.5 rounded-full">
                              <User size={12} className="text-black" />
                            </div>
                            Traveller Data Requirements
                          </h3>
                          <ul className="space-y-1.5">
                            {selectedFlightDetails.travellerDataRequirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                <Info size={10} className="text-black" />
                                <span className="font-medium text-xs text-black">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Booker Requirements */}
                      {Array.isArray(selectedFlightDetails.bookerDataRequirement) && selectedFlightDetails.bookerDataRequirement.length > 0 && (
                        <div className="border border-amber-200 rounded-lg shadow-sm p-5 bg-white">
                          <h3 className="text-lg font-bold border-b border-amber-200 pb-3 mb-4 flex items-center gap-2 text-amber-800">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <Users size={18} className="text-amber-700" />
                            </div>
                            Booker Data Requirements
                          </h3>
                          <ul className="space-y-2">
                            {selectedFlightDetails.bookerDataRequirement.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
                                {req.toLowerCase().includes('email') ? (
                                  <Mail size={16} className="text-amber-700" />
                                ) : req.toLowerCase().includes('phone') ? (
                                  <Phone size={16} className="text-amber-700" />
                                ) : (
                                  <Info size={16} className="text-amber-700" />
                                )}
                                <span className="font-medium">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Removed the interactive seat map button */}


                          </div>
                          ))}
                        </div>
                      )}
            </div>
          </div>
        )}
        
        {/* Features Section with 3D/animated icons, 3D tilt, and glassmorphism */}
        {/* Removed as per new requirements */}
        
        {/* Testimonial Carousel Section */}
        {/* Removed as per new requirements */}
        
        {/* Animated Popular Destinations */}
        {!searchParams && (
          <div className="mt-24 overflow-hidden">
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: 'hsl(197, 100%, 36%)' }}>Popular Destinations</h3>
            <div className="whitespace-nowrap py-4">
              <div className="inline-block animate-marquee">
                {['New York', 'Tokyo', 'Paris', 'London', 'Dubai', 'Sydney', 'Rome', 'Bangkok', 'Los Angeles', 'Istanbul'].map((city, index) => (
                  <div key={index} className="inline-block mx-4 px-6 py-3 rounded-full shadow-md transition-colors duration-300 cursor-pointer hover:scale-110 animate-float-3d" style={{ color: 'hsl(197, 100%, 36%)', border: '2px solid hsl(197, 100%, 36%)', background: 'white' }}>
                    {city}
                  </div>
                ))}
              </div>
              <div className="inline-block animate-marquee" aria-hidden="true">
                {['New York', 'Tokyo', 'Paris', 'London', 'Dubai', 'Sydney', 'Rome', 'Bangkok', 'Los Angeles', 'Istanbul'].map((city, index) => (
                  <div key={index} className="inline-block mx-4 px-6 py-3 rounded-full shadow-md transition-colors duration-300 cursor-pointer hover:scale-110 animate-float-3d" style={{ color: 'hsl(197, 100%, 36%)', border: '2px solid hsl(197, 100%, 36%)', background: 'white' }}>
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-lg animate-slide-up">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Payment</h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input type="text" required maxLength={19} className="w-full border rounded px-3 py-2" placeholder="1234 5678 9012 3456" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name on Card</label>
                <input type="text" required className="w-full border rounded px-3 py-2" placeholder="John Doe" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Expiry</label>
                  <input type="text" required maxLength={5} className="w-full border rounded px-3 py-2" placeholder="MM/YY" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">CVC</label>
                  <input type="text" required maxLength={4} className="w-full border rounded px-3 py-2" placeholder="123" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium">Pay</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flight;