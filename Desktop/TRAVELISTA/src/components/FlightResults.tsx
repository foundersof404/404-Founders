import { useState, useEffect } from "react";
import FlightResultCard from "@/components/FlightResultCard";
import { FlightOffer } from "@/services/flightApi";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ArrowDown, ArrowUp } from "lucide-react";

interface FlightResultsProps {
  flights: FlightOffer[];
  isLoading: boolean;
  searchParams: any;
  onSelectFlight: (flight: FlightOffer) => void;
  onBookFlight: (flight: FlightOffer) => void;
  onViewSeatMap: (flight: FlightOffer) => Promise<void>;
  bookedFlightId: string | null;
  bestPriceId?: string | null;
  onShowDetails: (flight: FlightOffer) => void;
}

const FlightResults = ({
  flights,
  isLoading,
  searchParams,
  onSelectFlight,
  onBookFlight,
  onViewSeatMap,
  bookedFlightId,
  bestPriceId,
  onShowDetails
}: FlightResultsProps) => {
  const [selectedTab, setSelectedTab] = useState('recommendation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>([]);

  // Filter flights based on search parameters
  useEffect(() => {
    if (!searchParams || !flights.length) {
      setFilteredFlights([]);
      return;
    }

    // Filter flights to only include those matching the user's from/to inputs and stops preference
    const filtered = flights.filter(flight => {
      // Use airport codes for more accurate matching
      const fromMatch = flight.departureAirport && 
        (searchParams.originCode || searchParams.origin) && 
        (flight.departureAirport === searchParams.originCode || 
         flight.departureAirport === searchParams.origin);
      
      const toMatch = flight.arrivalAirport && 
        (searchParams.destinationCode || searchParams.destination) && 
        (flight.arrivalAirport === searchParams.destinationCode || 
         flight.arrivalAirport === searchParams.destination);
      
      // Filter by stops
      let stopsMatch = true;
      if (searchParams.stops && searchParams.stops !== 'none') {
        const requestedStops = parseInt(searchParams.stops);
        const actualStops = Number(flight.stops);
        stopsMatch = actualStops === requestedStops;
      }
      
      // Only include flights that match all criteria
      return fromMatch && toMatch && stopsMatch;
    });

    setFilteredFlights(filtered.length > 0 ? filtered : flights);
  }, [flights, searchParams]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getSortedFlights = () => {
    if (!sortBy) return filteredFlights;
    
    return [...filteredFlights].sort((a: any, b: any) => {
      if (sortBy === 'price') {
        const priceA = a.price.replace(/[^0-9.]/g, '');
        const priceB = b.price.replace(/[^0-9.]/g, '');
        return sortDirection === 'asc' 
          ? parseFloat(priceA) - parseFloat(priceB)
          : parseFloat(priceB) - parseFloat(priceA);
      } else if (sortBy === 'duration') {
        const durationA = a.duration.replace(/[^0-9]/g, '');
        const durationB = b.duration.replace(/[^0-9]/g, '');
        return sortDirection === 'asc'
          ? parseInt(durationA) - parseInt(durationB)
          : parseInt(durationB) - parseInt(durationA);
      }
      return 0;
    });
  };

  const sortedFlights = getSortedFlights();
  
  if (!searchParams) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="p-10 bg-white rounded-xl shadow-md animate-fade-in">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Searching for the best flights...</p>
      </div>
    );
  }

  if (filteredFlights.length === 0 && !isLoading) {
    return (
      <div className="p-10 bg-white rounded-xl shadow-md animate-fade-in">
        <h3 className="text-xl font-bold text-center mb-4">No Flights Found</h3>
        <p className="text-center text-gray-600">
          We couldn't find any flights matching your criteria. Please try different dates or destinations.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 animate-fade-in-up mb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-sm font-medium text-gray-600">
          {sortedFlights.length} {sortedFlights.length === 1 ? 'flight' : 'flights'} found
        </div>
        
        {/* Filter and Sort */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-600">Sort by:</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSort('price')}
              className={`text-xs flex items-center gap-1 ${sortBy === 'price' ? 'bg-blue-50 text-blue-700' : ''}`}
            >
              Price
              {sortBy === 'price' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSort('duration')}
              className={`text-xs flex items-center gap-1 ${sortBy === 'duration' ? 'bg-blue-50 text-blue-700' : ''}`}
            >
              Duration
              {sortBy === 'duration' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedFlights.map((flight, index) => (
        <FlightResultCard
          key={flight.id}
          flight={flight}
          onSelect={() => onSelectFlight(flight)}
          onBook={() => onBookFlight(flight)}
          onViewSeatMap={() => onViewSeatMap(flight)}
          hasBooked={bookedFlightId === flight.id}
          isBestPrice={bestPriceId === flight.id}
          delay={index * 100}
          onShowDetails={() => onShowDetails(flight)}
        />
      ))}
      </div>
    </div>
  );
};

export default FlightResults;
