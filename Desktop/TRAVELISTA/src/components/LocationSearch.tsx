
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

interface Location {
  googlePlaceId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  types: string;
  iata?: string;
}

interface LocationSearchProps {
  placeholder: string;
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
}

const LocationSearch = ({ placeholder, onLocationSelect, selectedLocation }: LocationSearchProps) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) return [];

    console.log('🔍 Searching locations for:', searchQuery);

    const url = `https://booking-com15.p.rapidapi.com/api/v1/taxi/searchLocation?query=${encodeURIComponent(searchQuery)}`;
    
    console.log('🌍 Location API URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113',
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
        }
      });

      console.log('🌍 Location API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Location API Error:', errorText);
        throw new Error(`Failed to search locations: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Location API Response:', data);
      console.log('📍 Number of locations found:', data.data?.length || 0);
      
      return data.data || [];
    } catch (error) {
      console.error('💥 Location Search Error:', error);
      throw error;
    }
  };

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locationSearch', debouncedQuery],
    queryFn: () => searchLocations(debouncedQuery),
    enabled: !!debouncedQuery && debouncedQuery.length >= 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('📝 Location input changed:', value);
    setQuery(value);
    setShowDropdown(true);
  };

  const handleLocationClick = (location: Location) => {
    console.log('📍 Location selected:', location);
    setQuery(location.name);
    setShowDropdown(false);
    onLocationSelect(location);
  };

  const displayValue = selectedLocation ? selectedLocation.name : query;

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          className="pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:shadow-lg"
          style={{ 
            borderColor: 'hsl(214, 57%, 51%, 0.3)',
            boxShadow: `
              0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
              0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
            `
          }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }} />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }} />
        )}
      </div>

      {showDropdown && locations.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 bg-white border-2 rounded-lg max-h-64 overflow-y-auto"
              style={{ 
                borderColor: 'hsl(214, 57%, 51%, 0.2)',
                boxShadow: `
                  0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                  0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                  0 0 0 1px hsla(214, 57%, 51%, 0.05)
                `
              }}>
          {locations.map((location: Location, index: number) => (
            <div
              key={location.googlePlaceId || index}
              onClick={() => handleLocationClick(location)}
              className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50"
              style={{ 
                borderColor: 'hsl(214, 57%, 51%, 0.1)'
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                       style={{ 
                         backgroundColor: 'hsl(214, 57%, 51%, 0.1)',
                         boxShadow: `
                           0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                           0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                         `
                       }}>
                    <MapPin className="w-4 h-4" style={{ color: 'hsl(214, 57%, 51%)' }} />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate" style={{ color: 'hsl(214, 57%, 51%)' }}>
                    {location.name}
                  </div>
                  <div className="text-sm flex items-center" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>
                    <span className="truncate">
                      {location.city}, {location.country}
                    </span>
                    {location.iata && (
                      <span className="ml-2 px-2 py-1 rounded text-xs font-mono" 
                            style={{ 
                              backgroundColor: 'hsl(214, 57%, 51%, 0.1)',
                              color: 'hsl(214, 57%, 51%)'
                            }}>
                        {location.iata}
                      </span>
                    )}
                  </div>
                  {location.description && (
                    <div className="text-xs truncate mt-1" style={{ color: 'hsl(214, 57%, 51%, 0.5)' }}>
                      {location.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {showDropdown && query && !isLoading && locations.length === 0 && debouncedQuery.length >= 2 && (
        <Card className="absolute z-50 w-full mt-1 bg-white border-2 rounded-lg"
              style={{ 
                borderColor: 'hsl(214, 57%, 51%, 0.2)',
                boxShadow: `
                  0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                  0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                  0 0 0 1px hsla(214, 57%, 51%, 0.05)
                `
              }}>
          <div className="px-4 py-3 text-center" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>
            No locations found for "{query}"
          </div>
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;
