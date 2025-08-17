
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Clock, Search, Sparkles, Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LocationSearch from './LocationSearch';
import TaxiResults from './TaxiResults';
import { toast } from '@/hooks/use-toast';

interface Location {
  googlePlaceId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  types: string;
  iata?: string;
}

interface SearchParams {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  pickupDate: string;
  pickupTime: string;
}

const TaxiBooking = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    pickupLocation: null,
    dropoffLocation: null,
    pickupDate: '',
    pickupTime: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchTaxis = async (params: SearchParams) => {
    console.log('🚕 Starting taxi search with params:', params);
    
    if (!params.pickupLocation || !params.dropoffLocation || !params.pickupDate || !params.pickupTime) {
      throw new Error('Please fill in all required fields');
    }

    const url = `https://booking-com15.p.rapidapi.com/api/v1/taxi/searchTaxi?pick_up_place_id=${params.pickupLocation.googlePlaceId}&drop_off_place_id=${params.dropoffLocation.googlePlaceId}&pick_up_date=${params.pickupDate}&pick_up_time=${params.pickupTime}&currency_code=EUR`;
    
    console.log('🔗 API URL:', url);
    console.log('📍 Pickup Place ID:', params.pickupLocation.googlePlaceId);
    console.log('📍 Dropoff Place ID:', params.dropoffLocation.googlePlaceId);
    console.log('📅 Date & Time:', params.pickupDate, params.pickupTime);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
        }
      });

      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Success Response:', data);
      console.log('🚗 Number of results found:', data?.data?.results?.length || 0);
      
      return data;
    } catch (error) {
      console.error('💥 Fetch Error:', error);
      throw error;
    }
  };

  const { data: taxiResults, isLoading: isLoadingResults, error } = useQuery({
    queryKey: ['taxiSearch', searchParams],
    queryFn: () => searchTaxis(searchParams),
    enabled: isSearching && !!searchParams.pickupLocation && !!searchParams.dropoffLocation,
    retry: 1,
    retryDelay: 1000,
  });

  // Log any query errors
  React.useEffect(() => {
    if (error) {
      console.error('🚨 Query Error:', error);
      toast({
        title: "Search Error",
        description: error.message || "Failed to search for taxis. Please try again.",
        variant: "destructive"
      });
    }
  }, [error]);

  const handleSearch = () => {
    if (!searchParams.pickupLocation || !searchParams.dropoffLocation || !searchParams.pickupDate || !searchParams.pickupTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to search for taxis.",
        variant: "destructive"
      });
      return;
    }

    console.log('🔍 Initiating search with params:', searchParams);
    setIsSearching(true);
    setShowResults(true);
    
    toast({
      title: "Searching...",
      description: "Finding the best taxi options for you!",
    });
  };

  const handleLocationSelect = (location: Location, type: 'pickup' | 'dropoff') => {
    console.log(`✅ Selected ${type} location:`, location);
    setSearchParams(prev => ({
      ...prev,
      [type === 'pickup' ? 'pickupLocation' : 'dropoffLocation']: location
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Enhanced Search Form with Professional Shadows */}
      <Card className="p-10 bg-white backdrop-blur-xl border-2 rounded-3xl transform hover:scale-[1.02] transition-all duration-500" 
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                0 0 0 1px hsla(214, 57%, 51%, 0.05),
                inset 0 1px 0 0 hsla(214, 57%, 51%, 0.1)
              ` 
            }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-300" 
                 style={{ 
                   backgroundColor: 'hsl(214, 57%, 51%)',
                   boxShadow: `
                     0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                     0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                     0 0 0 1px hsla(214, 57%, 51%, 0.1)
                   `
                 }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'hsl(214, 57%, 51%)' }}>Find Your Perfect Ride</h3>
          <p style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Enter your details to discover amazing taxi options</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Pickup Location */}
          <div className="lg:col-span-2 group">
            <Label className="text-sm font-semibold mb-3 flex items-center group-hover:opacity-80 transition-opacity duration-300" style={{ color: 'hsl(214, 57%, 51%)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-all duration-300" 
                   style={{ 
                     backgroundColor: 'hsl(214, 57%, 51%)',
                     boxShadow: `
                       0 10px 15px -3px hsla(214, 57%, 51%, 0.3),
                       0 4px 6px -2px hsla(214, 57%, 51%, 0.1)
                     `
                   }}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              Pickup Location
            </Label>
            <div className="transform hover:scale-105 transition-all duration-300">
              <LocationSearch
                placeholder="Where shall we pick you up?"
                onLocationSelect={(location) => handleLocationSelect(location, 'pickup')}
                selectedLocation={searchParams.pickupLocation}
              />
            </div>
          </div>

          {/* Dropoff Location */}
          <div className="lg:col-span-2 group">
            <Label className="text-sm font-semibold mb-3 flex items-center group-hover:opacity-80 transition-opacity duration-300" style={{ color: 'hsl(214, 57%, 51%)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-all duration-300" 
                   style={{ 
                     backgroundColor: 'hsl(214, 57%, 51%)',
                     boxShadow: `
                       0 10px 15px -3px hsla(214, 57%, 51%, 0.3),
                       0 4px 6px -2px hsla(214, 57%, 51%, 0.1)
                     `
                   }}>
                <Navigation className="w-4 h-4 text-white" />
              </div>
              Destination
            </Label>
            <div className="transform hover:scale-105 transition-all duration-300">
              <LocationSearch
                placeholder="Where are you heading?"
                onLocationSelect={(location) => handleLocationSelect(location, 'dropoff')}
                selectedLocation={searchParams.dropoffLocation}
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-6">
            <div className="group">
              <Label className="text-sm font-semibold mb-3 flex items-center group-hover:opacity-80 transition-opacity duration-300" style={{ color: 'hsl(214, 57%, 51%)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-all duration-300" 
                     style={{ 
                       backgroundColor: 'hsl(214, 57%, 51%)',
                       boxShadow: `
                         0 10px 15px -3px hsla(214, 57%, 51%, 0.3),
                         0 4px 6px -2px hsla(214, 57%, 51%, 0.1)
                       `
                     }}>
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                Date
              </Label>
              <Input
                type="date"
                value={searchParams.pickupDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, pickupDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white border-2 rounded-xl transform hover:scale-105 transition-all duration-300 focus:shadow-lg"
                style={{ 
                  borderColor: 'hsl(214, 57%, 51%, 0.3)',
                  color: 'hsl(214, 57%, 51%)',
                  boxShadow: `
                    0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                    0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                  `
                }}
              />
            </div>
            <div className="group">
              <Label className="text-sm font-semibold mb-3 flex items-center group-hover:opacity-80 transition-opacity duration-300" style={{ color: 'hsl(214, 57%, 51%)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-all duration-300" 
                     style={{ 
                       backgroundColor: 'hsl(214, 57%, 51%)',
                       boxShadow: `
                         0 10px 15px -3px hsla(214, 57%, 51%, 0.3),
                         0 4px 6px -2px hsla(214, 57%, 51%, 0.1)
                       `
                     }}>
                  <Clock className="w-4 h-4 text-white" />
                </div>
                Time
              </Label>
              <Input
                type="time"
                value={searchParams.pickupTime}
                onChange={(e) => setSearchParams(prev => ({ ...prev, pickupTime: e.target.value }))}
                className="w-full bg-white border-2 rounded-xl transform hover:scale-105 transition-all duration-300 focus:shadow-lg"
                style={{ 
                  borderColor: 'hsl(214, 57%, 51%, 0.3)',
                  color: 'hsl(214, 57%, 51%)',
                  boxShadow: `
                    0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                    0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                  `
                }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Search Button with Professional Shadow */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleSearch}
            disabled={isLoadingResults}
            className="group relative px-16 py-4 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 border-0 text-lg overflow-hidden"
            style={{ 
              backgroundColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.5),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.3),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.1),
                0 0 0 1px hsla(214, 57%, 51%, 0.1),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 0 hsla(214, 57%, 51%, 0.2)
              `
            }}
          >
            {/* Button Content */}
            <div className="relative z-10 flex items-center">
              {isLoadingResults ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  <span>Discovering Amazing Rides...</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Search Premium Taxis</span>
                  <Sparkles className="w-5 h-5 ml-3 group-hover:animate-pulse" />
                </>
              )}
            </div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-1000"></div>
          </Button>
        </div>
      </Card>

      {/* Results */}
      {showResults && (
        <div className="mt-12 animate-fade-in">
          <TaxiResults 
            results={taxiResults} 
            isLoading={isLoadingResults}
            searchParams={searchParams}
            error={error}
          />
        </div>
      )}
    </div>
  );
};

export default TaxiBooking;
