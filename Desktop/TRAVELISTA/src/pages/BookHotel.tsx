import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import TravelistaLayout from '@/components/TravelistaLayout';
import { searchHotels, getHotelLocations } from '@/services/api';
import { 
  Calendar as CalendarIcon, 
  Search, 
  MapPin, 
  Users, 
  Bed, 
  DollarSign,
  Star,
  Loader2,
  Check
} from 'lucide-react';

interface HotelLocation {
  dest_id: string;
  name: string;
  city_name: string;
  country: string;
}

interface Hotel {
  hotel_id: string;
  name: string;
  main_photo_url: string;
  review_score: number;
  review_score_word: string;
  review_nr: number;
  price_breakdown: {
    gross_price: {
      value: number;
      currency: string;
    };
  };
  address: string;
  distance: string;
  distance_string: string;
  hotel_include_breakfast: boolean;
  is_free_cancellable: boolean;
  property_class: number;
  hotel_facilities: string[];
}

const BookHotel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [destination, setDestination] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationLocations, setDestinationLocations] = useState<HotelLocation[]>([]);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<HotelLocation | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);

  // Search for hotel locations when query changes
  useEffect(() => {
    const searchLocations = async () => {
      if (destinationQuery.length < 2) {
        setDestinationLocations([]);
        return;
      }
      
      try {
        const response = await getHotelLocations(destinationQuery);
        if (response.data) {
          setDestinationLocations(response.data);
        }
      } catch (error) {
        console.error('Error searching hotel locations:', error);
      }
    };

    const timer = setTimeout(() => {
      searchLocations();
    }, 300);

    return () => clearTimeout(timer);
  }, [destinationQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDestination || !checkInDate || !checkOutDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const params = {
        location: selectedDestination.dest_id,
        checkin_date: format(checkInDate, 'yyyy-MM-dd'),
        checkout_date: format(checkOutDate, 'yyyy-MM-dd'),
        adults_number: guests,
        room_number: rooms,
        filter_by_currency: 'USD',
        order_by: 'popularity',
        languagecode: 'en-us',
        page_number: 1,
      };
      
      const response = await searchHotels(params);
      setSearchResults(response.result || []);
      
      if (response.result && response.result.length > 0) {
        toast({
          title: "Hotels found",
          description: `Found ${response.result.length} hotels matching your criteria`,
        });
      } else {
        toast({
          title: "No hotels found",
          description: "Try adjusting your search criteria",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching hotels:', error);
      toast({
        title: "Error searching hotels",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <TravelistaLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Book Your Hotel</h1>
            <p className="text-gray-600">Find and book hotels worldwide</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <Input
                    id="destination"
                    placeholder="Where are you going?"
                    value={destinationQuery}
                    onChange={(e) => {
                      setDestinationQuery(e.target.value);
                      setShowDestinationDropdown(true);
                    }}
                    onFocus={() => setShowDestinationDropdown(true)}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  {showDestinationDropdown && destinationLocations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {destinationLocations.map((location) => (
                        <div
                          key={location.dest_id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedDestination(location);
                            setDestinationQuery(`${location.name}, ${location.city_name}`);
                            setShowDestinationDropdown(false);
                          }}
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.city_name}, {location.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check-in">Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="check-out">Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        initialFocus
                        disabled={(date) => 
                          date < new Date() || 
                          (checkInDate ? date <= checkInDate : false)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="10"
                      value={guests}
                      onChange={(e) => setGuests(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                      className="text-center border-x-0 rounded-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => setGuests(Math.min(10, guests + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Rooms</Label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="rooms"
                      type="number"
                      min="1"
                      max="5"
                      value={rooms}
                      onChange={(e) => setRooms(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                      className="text-center border-x-0 rounded-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => setRooms(Math.min(5, rooms + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="price-range">Price Range (per night)</Label>
                  <span className="text-sm text-gray-500">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </span>
                </div>
                <Slider
                  id="price-range"
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-2"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 primary-btn" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching hotels...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search Hotels</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Available Hotels</h2>
              
              {searchResults.map((hotel) => (
                <div key={hotel.hotel_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto">
                      <img 
                        src={hotel.main_photo_url} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{hotel.address}</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <span className="mr-2">{hotel.distance_string} from center</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            {renderStars(hotel.property_class)}
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {hotel.review_score_word}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({hotel.review_nr} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {hotel.hotel_facilities.slice(0, 5).map((facility, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            {facility}
                          </span>
                        ))}
                        {hotel.hotel_facilities.length > 5 && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            +{hotel.hotel_facilities.length - 5} more
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                          {hotel.hotel_include_breakfast && (
                            <span className="flex items-center text-green-600 text-sm mr-4">
                              <Check className="w-4 h-4 mr-1" />
                              Breakfast included
                            </span>
                          )}
                          {hotel.is_free_cancellable && (
                            <span className="flex items-center text-green-600 text-sm">
                              <Check className="w-4 h-4 mr-1" />
                              Free cancellation
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="text-sm text-gray-500">Price per night</div>
                            <div className="text-xl font-bold text-blue-600">
                              {formatPrice(hotel.price_breakdown.gross_price.value)}
                            </div>
                          </div>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && !isLoading && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Hotels</h2>
              <p className="text-gray-600 mb-6">Explore our popular hotels or search for accommodations above</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Grand Plaza Hotel" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white">Grand Plaza Hotel</h3>
                    <div className="flex items-center text-white/80">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="ml-1">5.0 (120 reviews)</span>
                    </div>
                    <p className="text-white/80 mt-1">From $199/night</p>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Seaside Resort" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white">Seaside Resort</h3>
                    <div className="flex items-center text-white/80">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="ml-1">4.8 (95 reviews)</span>
                    </div>
                    <p className="text-white/80 mt-1">From $249/night</p>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Mountain View Lodge" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white">Mountain View Lodge</h3>
                    <div className="flex items-center text-white/80">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="ml-1">4.9 (75 reviews)</span>
                    </div>
                    <p className="text-white/80 mt-1">From $179/night</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TravelistaLayout>
  );
};

export default BookHotel; 