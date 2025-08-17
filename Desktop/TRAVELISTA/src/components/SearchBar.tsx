import React, { useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const popularDestinations = [
    { name: 'Paris', emoji: '🇫🇷', desc: 'City of Light' },
    { name: 'Tokyo', emoji: '🇯🇵', desc: 'Modern Tradition' },
    { name: 'New York', emoji: '🇺🇸', desc: 'The Big Apple' },
    { name: 'London', emoji: '🇬🇧', desc: 'Royal Heritage' },
    { name: 'Barcelona', emoji: '🇪🇸', desc: 'Art & Architecture' }
  ];

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`flex items-center bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 border-4 ${
          isFocused ? 'shadow-blue-200' : 'hover:shadow-3xl'
        } ${loading ? 'animate-pulse' : ''}`} style={{borderColor: isFocused ? 'hsl(214, 57%, 51%)' : 'transparent'}}>
          
          <div className="flex items-center px-8 py-6 text-gray-400">
            <MapPin className={`w-7 h-7 mr-4 transition-colors duration-300 ${
              isFocused ? '' : 'text-gray-400'
            }`} style={{color: isFocused ? 'hsl(214, 57%, 51%)' : undefined}} />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Where do you want to explore? (e.g., Paris, Tokyo, New York)"
            className="flex-1 py-6 text-xl text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none font-medium"
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="m-3 px-10 py-4 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 transform hover:scale-105"
            style={{background: `linear-gradient(135deg, hsl(214, 57%, 45%) 0%, hsl(214, 57%, 55%) 100%)`}}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-lg">Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                <span className="text-lg">Explore</span>
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Enhanced Popular Suggestions */}
      <div className="mt-14">
        <div className="text-center mb-6">
          <p className="text-[hsl(214,57%,51%)] text-lg font-semibold tracking-wide">Popular destinations</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {popularDestinations.map((destination) => (
            <button
              key={destination.name}
              onClick={() => {
                setQuery(destination.name);
                onSearch(destination.name);
              }}
              className="group flex items-center px-6 py-4 bg-white/90 shadow-md text-gray-700 rounded-2xl hover:bg-white transition-all duration-300 border border-[hsl(214,57%,51%)]/10 hover:border-[hsl(214,57%,51%)] hover:shadow-xl hover:scale-105"
            >
              <span className="text-2xl mr-3">{destination.emoji}</span>
              <div className="text-left">
                <div className="font-semibold text-lg text-[hsl(214,57%,51%)]">{destination.name}</div>
                <div className="text-sm text-[hsl(197,100%,36%)] group-hover:text-[hsl(214,57%,51%)] transition-colors">
                  {destination.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
