import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Luggage, Briefcase, User, Route, PlaneTakeoff, PlaneLanding, Clock, BadgeCheck, BadgeX, Grid, Loader2 } from "lucide-react";
import { FlightOffer } from "@/services/flightApi";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

interface FlightResultCardProps {
  flight: FlightOffer;
  onSelect: (flight: FlightOffer) => void;
  onBook: (flight: FlightOffer) => void;
  onViewSeatMap: (flight: FlightOffer) => Promise<void>;
  hasBooked: boolean;
  isBestPrice: boolean;
  delay?: number;
  onShowDetails: (flight: FlightOffer) => void;
}

const formatTime = (iso: string) => {
  if (!iso || typeof iso !== 'string') return '-';
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
};

// Find the price to display
const getDisplayPrice = (flight) => {
  if (flight.priceBreakdown && flight.priceBreakdown.total) {
    const { currencyCode, units, nanos } = flight.priceBreakdown.total;
    const nanosDecimal = nanos ? nanos / 1000000000 : 0;
    const totalAmount = units + nanosDecimal;
    return `${currencyCode} ${totalAmount.toFixed(2)}`;
  }
  return flight.price || '-';
};

const FlightResultCard = ({
  flight,
  onSelect,
  onBook,
  onViewSeatMap,
  hasBooked,
  isBestPrice,
  delay = 0,
  onShowDetails
}: FlightResultCardProps) => {
  const animationDelay = `${delay}ms`;
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window !== 'undefined') {
      const favs = JSON.parse(localStorage.getItem('favoriteFlights') || '[]');
      return favs.includes(flight.id);
    }
    return false;
  });
  const [isBooking, setIsBooking] = useState(false);

  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem('favoriteFlights') || '[]');
    if (isFavorite) {
      favs = favs.filter((id: string) => id !== flight.id);
    } else {
      favs.push(flight.id);
    }
    localStorage.setItem('favoriteFlights', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  const handleSelect = () => {
    if (!hasBooked) {
      toast.error("Please book the flight first before selecting it");
      return;
    }
    onSelect(flight);
  };

  const handleBookNow = async () => {
    setIsBooking(true);
    try {
      await onBook(flight);
    } catch (error) {
      console.error("Error booking flight:", error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Card 
      className={`flight-card group animate-slide-in card-hover-effect transition-shadow duration-300 hover:shadow-2xl bg-white rounded-2xl border p-0 ${isBestPrice ? 'ring-2 ring-[hsl(214,57%,51%)]' : ''}`}
      style={{ animationDelay, perspective: '1200px' }}
      onMouseMove={e => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * -8;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      }}
    >
      {isBestPrice && (
        <div className="absolute -top-4 -right-4 z-20 bg-[hsl(214,57%,51%)] text-white font-bold px-4 py-1 rounded-full shadow-lg text-xs border-2 border-[hsl(214,57%,51%)]">
          Best Price
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-center flex-wrap gap-6 p-6">
        {/* Airline and flight info */}
        <div className="flex items-center gap-4 w-full md:w-1/4">
          {flight.airlineLogo && <img src={flight.airlineLogo} alt={flight.airline} className="w-12 h-12 rounded-full border" />}
          <div>
            <div className="font-bold text-lg flex items-center gap-2">{flight.airline || '-'}
              <button onClick={toggleFavorite} className="ml-2 text-red-500 hover:scale-110 transition-transform" title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}>
                <Heart fill={isFavorite ? 'red' : 'none'} size={20} />
              </button>
            </div>
            <div className="text-xs text-gray-500">Flight: {flight.flightNumber || '-'}</div>
            <div className="flex gap-2 mt-1">
              <Badge className="bg-blue-100 text-blue-700 text-xs">{flight.cabinClass}</Badge>
              <Badge className={`text-xs ${Number(flight.stops) === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{Number(flight.stops) === 0 ? 'Direct' : `${flight.stops} Stop${Number(flight.stops) > 1 ? 's' : ''}`}</Badge>
            </div>
          </div>
        </div>
        {/* Times and route */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{formatTime(flight.departureTime)}</span>
            <span className="text-sm text-gray-500">{flight.departureAirport}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-400">——</span>
            <span className="text-xs text-gray-500">{flight.duration}</span>
            <span className={`badge ${Number(flight.stops) === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} mt-1`}>{Number(flight.stops) === 0 ? 'Direct' : `${flight.stops} Stop${Number(flight.stops) > 1 ? 's' : ''}`}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</span>
            <span className="text-sm text-gray-500">{flight.arrivalAirport}</span>
          </div>
        </div>
        {/* Price and baggage */}
        <div className="flex flex-col items-end gap-2 w-full md:w-1/4">
          <div className="font-bold text-black">{getDisplayPrice(flight)}</div>
          <div className="flex gap-2 flex-wrap">
            {flight.baggage && <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"><Luggage size={14} />{flight.baggage}</span>}
            <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"><User size={14} />{flight.cabinClass}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookNow}
              disabled={isBooking || hasBooked}
              className="flex items-center gap-1 btn-3d"
            >
              {isBooking ? <><Loader2 size={14} className="animate-spin mr-1" /> Booking...</> : hasBooked ? "Booked" : "Book Now"}
            </Button>
            <Button
              size="sm"
              onClick={handleSelect}
              disabled={!hasBooked}
              className="bg-[hsl(214,57%,51%)] text-white hover:bg-[hsl(214,57%,45%)] btn-3d"
            >
              Select
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowDetails(flight)}
              className="flex items-center gap-1 btn-3d"
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FlightResultCard;
