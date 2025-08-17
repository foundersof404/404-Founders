import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ProductGrid from '../components/ProductGrid';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import RecentlyViewed from '../components/RecentlyViewed';
import { toast } from '../hooks/use-toast';
import TravelistaLayout from '@/components/TravelistaLayout';
import FadeInOnScroll from '@/components/FadeInOnScroll';
import { searchProducts, getProductsByCategory, categoryIds } from '../lib/amazonApi';


// Define product type
interface Product {
  product_title: string;
  product_photo: string;
  product_url: string;
  product_price?: string;
  product_discount?: string;
  rating?: number;
  review_count?: number;
  category?: string;
}

// Suggested categories
const suggestedCategories = [
  { name: 'Electronics', icon: '💻', query: 'electronics' },
  { name: 'Books', icon: '📚', query: 'books' },
  { name: 'Fashion', icon: '👕', query: 'fashion' },
  { name: 'Home & Kitchen', icon: '🏠', query: 'home kitchen' },
  { name: 'Sports', icon: '⚽', query: 'sports' },
  { name: 'Beauty', icon: '💄', query: 'beauty' },
];

// Amazon-like categories
const amazonCategories = [
  { name: 'All', icon: '🛒', query: '', categoryId: '' },
  { name: 'Electronics', icon: '💻', query: 'electronics', categoryId: categoryIds.electronics },
  { name: 'Books', icon: '📚', query: 'books', categoryId: categoryIds.books },
  { name: 'Fashion', icon: '👗', query: 'fashion', categoryId: categoryIds.fashion },
  { name: 'Home', icon: '🏠', query: 'home', categoryId: categoryIds.home },
  { name: 'Beauty', icon: '💄', query: 'beauty', categoryId: categoryIds.beauty },
  { name: 'Toys', icon: '🧸', query: 'toys', categoryId: categoryIds.toys },
  { name: 'Sports', icon: '⚽', query: 'sports', categoryId: categoryIds.sports },
  { name: 'Grocery', icon: '🛒', query: 'grocery', categoryId: categoryIds.grocery },
  { name: 'Automotive', icon: '🚗', query: 'automotive', categoryId: categoryIds.automotive },
  { name: 'Garden', icon: '🌱', query: 'garden', categoryId: categoryIds.garden },
  { name: 'Health', icon: '💊', query: 'health', categoryId: categoryIds.health },
  { name: 'Music', icon: '🎵', query: 'music', categoryId: categoryIds.music },
  { name: 'See All', icon: '➕', query: '', categoryId: '' },
];

// Travel product suggestions (real products)
const travelProductSuggestions = [
  {
    name: 'Samsonite Winfield 2 Hardside Luggage',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    price: 129.99,
    link: 'https://www.amazon.com/dp/B00EALLQ0Y',
  },
  {
    name: 'Trtl Travel Pillow',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    price: 29.99,
    link: 'https://www.amazon.com/dp/B00LB7REFK',
  },
  {
    name: 'Anker PowerCore 10000 Portable Charger',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    price: 25.99,
    link: 'https://www.amazon.com/dp/B0194WDVHI',
  },
  {
    name: 'Venture Pal 40L Lightweight Packable Backpack',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    price: 21.99,
    link: 'https://www.amazon.com/dp/B01MY4RJ2M',
  },
  {
    name: 'GoPro HERO11 Waterproof Action Camera',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80',
    price: 399.99,
    link: 'https://www.amazon.com/dp/B0B6RZ4G9V',
  },
  {
    name: 'Travel Bottles Set for Toiletries',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    price: 9.99,
    link: 'https://www.amazon.com/dp/B07QKQJL17',
  },
  {
    name: 'Travel at the Airport',
    image: 'https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80',
    price: 0.00,
    link: 'https://www.amazon.com/s?k=airport+travel+gear',
  },
  {
    name: 'Travel Map & Guide',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    price: 14.99,
    link: 'https://www.amazon.com/s?k=travel+map+guide',
  },
];

const Index = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [travelSuggestions, setTravelSuggestions] = useState<Product[]>([]);
  const [loadingTravel, setLoadingTravel] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Simulate initial load complete
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch travel suggestions on mount
  useEffect(() => {
    const fetchTravelSuggestions = async () => {
      setLoadingTravel(true);
      try {
        const data = await searchProducts({
          query: 'travel',
          page: '1',
          country: 'US'
        });

        if (data?.data?.products) {
          setTravelSuggestions(data.data.products);
        } else {
          // Fallback to static suggestions if API fails
          setTravelSuggestions(travelProductSuggestions.map(item => ({
            product_title: item.name,
            product_photo: item.image,
            product_url: item.link,
            product_price: item.price.toString()
          })));
        }
      } catch (err) {
        console.error('Error fetching travel suggestions:', err);
        // Fallback to static suggestions if API fails
        setTravelSuggestions(travelProductSuggestions.map(item => ({
          product_title: item.name,
          product_photo: item.image,
          product_url: item.link,
          product_price: item.price.toString()
        })));
      } finally {
        setLoadingTravel(false);
      }
    };
    fetchTravelSuggestions();
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (query.trim()) {
      // For demo: use recent searches as suggestions
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      setSuggestions(history.filter((item: string) => item.toLowerCase().includes(query.toLowerCase())));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  const getErrorMessage = (error: any) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your search query.';
        case 401:
          return 'Authentication failed. Please check your API key.';
        case 403:
          return 'Access denied. Check your API key or permissions.';
        case 404:
          return 'No products found for this search.';
        case 429:
          return 'Rate limit exceeded. Please try again in a few minutes.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Server error (${error.response.status}). Please try again later.`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      return error.message || 'Failed to fetch product data.';
    }
  };

  const handleSearch = async (searchQuery: string, pageNumber = 1) => {
    if (!searchQuery.trim()) return;

    setError('');
    setQuery(searchQuery);
    
    if (pageNumber === 1) {
      setResults([]);
    }
    
    setLoading(true);
    setPage(pageNumber);

    try {
      // Find the category if it exists
      const category = amazonCategories.find(cat => cat.query === searchQuery.toLowerCase());
      
      let data;
      if (category?.categoryId) {
        // Use category endpoint if it's a category search
        data = await getProductsByCategory({
          categoryId: category.categoryId,
          page: pageNumber.toString(),
          country: 'US'
        });
      } else {
        // Use regular search for other queries
        data = await searchProducts({
          query: searchQuery,
          page: pageNumber.toString(),
          country: 'US'
        });
      }

      if (!data) {
        throw new Error('No data received from the server');
      }

      const products = data?.data?.products;

      if (products && products.length > 0) {
        // If it's the first page, replace results - otherwise append
        setResults(pageNumber === 1 ? products : [...results, ...products]);
        saveSearchToHistory(searchQuery);
        
        // Show success toast
        toast({
          title: "Products found",
          description: `Found ${products.length} products for "${searchQuery}"`,
          duration: 3000,
        });
      } else {
        const errorMsg = 'No results found for your search.';
        setError(errorMsg);
        toast({
          title: "No results",
          description: errorMsg,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });

      // If we have previous results and this is a pagination request, don't clear them
      if (pageNumber === 1) {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSearchToHistory = (term: string) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const updated = [term, ...history.filter((item: string) => item !== term)].slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const loadMoreResults = () => {
    handleSearch(query, page + 1);
  };

  const handleBack = () => {
    setResults([]);
    setQuery('');
    setError('');
    setPage(1);
  };

  return (
    <TravelistaLayout>
      <div className="min-h-screen bg-white font-inter">
        <FadeInOnScroll>
          <div className="flex flex-col items-center justify-center pt-16 pb-10 px-4">
            {/* Hero Section */}
            <div className="text-center mb-10">
              <div className="text-xs font-semibold tracking-widest text-[hsl(214,57%,51%)]/60 mb-2 uppercase">DISCOVER PRODUCTS</div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[hsl(214,57%,51%)] mb-8">Product Explorer</h1>
              {/* Classy Search Bar below header */}
              <div className="relative w-full max-w-2xl mx-auto mt-8 mb-10">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (query.trim()) handleSearch(query);
                    setShowSuggestions(false);
                  }}
                  className="relative"
                  autoComplete="off"
                >
                  <input
                    type="text"
                    className="w-full rounded-2xl pl-6 pr-16 py-4 text-lg font-semibold bg-white border border-[hsl(214,57%,51%)]/10 shadow-lg focus:outline-none focus:ring-2 focus:ring-[hsl(214,57%,51%)]/30 placeholder-gray-400 transition"
                    placeholder="Search Amazon products..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => query && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-[hsl(214,57%,51%)] hover:bg-[hsl(214,57%,45%)] text-white rounded-full p-3 transition shadow-lg border-2 border-white"
                    aria-label="Search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10 border border-[hsl(214,57%,51%)]/10 overflow-hidden">
                      {suggestions.map((s, idx) => (
                        <button
                          key={s + idx}
                          type="button"
                          className="w-full text-left px-6 py-3 text-base text-[hsl(214,57%,51%)] hover:bg-[hsl(214,57%,51%)]/10 transition cursor-pointer"
                          onMouseDown={() => {
                            setQuery(s);
                            setShowSuggestions(false);
                            handleSearch(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>
            {/* Search for products title and subtitle (without icon) */}
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-2xl font-semibold mb-2 text-[hsl(214,57%,51%)]">Search for products</h2>
              <p className="text-[hsl(214,57%,51%)]/60 max-w-xl text-center mb-4">Enter a product name above to explore Amazon products with stunning visuals and detailed information.</p>
            </div>
            {/* Amazon-like Categories Bar */}
            <div className="w-full max-w-5xl mb-8">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[hsl(214,57%,51%)]/20 scrollbar-track-transparent pb-2">
                {amazonCategories.map((category, idx) => (
                  <button
                    key={category.name}
                    onClick={() => handleSearch(category.query)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border border-[hsl(214,57%,51%)]/10 bg-white text-[hsl(214,57%,51%)] font-medium whitespace-nowrap shadow-sm hover:bg-[hsl(214,57%,51%)] hover:text-white transition-colors ${category.name === 'See All' ? 'border-dashed border-[hsl(214,57%,51%)]/30' : ''}`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-base">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Travel Suggestions Section (from API) */}
            <div className="w-full max-w-5xl mb-12">
              <h3 className="text-lg font-bold mb-4 text-[hsl(214,57%,51%)]">Travel Suggestions</h3>
              {loadingTravel ? (
                <div>Loading travel products...</div>
              ) : (
                <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[hsl(214,57%,51%)]/20 scrollbar-track-transparent pb-2">
                  {travelSuggestions.map((item, idx) => (
                    <div
                      key={item.product_url || idx}
                      className="flex flex-col items-center bg-white border border-[hsl(214,57%,51%)]/10 rounded-lg shadow-sm min-w-[200px] max-w-[220px] p-4 text-center hover:shadow-md hover:border-[hsl(214,57%,51%)]/30 transition-all"
                    >
                      <img
                        src={item.product_photo}
                        alt={item.product_title}
                        className="object-contain w-full h-32 mb-2 rounded"
                        loading="lazy"
                      />
                      <span className="text-sm font-medium text-[hsl(214,57%,51%)] mb-2 line-clamp-2 min-h-[2.5em]">{item.product_title}</span>
                      <span className="font-bold text-base text-[hsl(214,57%,51%)] mb-2">{item.product_price}</span>
                      <a
                        href={item.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-[hsl(214,57%,51%)] text-white px-3 py-1 rounded hover:bg-[hsl(214,57%,45%)] transition-colors"
                      >
                        View on Amazon
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Popular Categories (grid, optional, can be removed if only bar is needed) */}
            {/*
            <div className="w-full max-w-4xl">
              <h3 className="text-lg font-medium mb-4 text-center text-black">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {suggestedCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleSearch(category.query)}
                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-white border border-black/10 hover:border-black transition-colors shadow-sm hover:shadow-md focus:outline-none text-black"
                  >
                    <span className="text-3xl mb-2">{category.icon}</span>
                    <span className="text-base font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            */}
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          {/* Results Section */}
      {error && !loading && results.length === 0 && (
            <div className="text-center py-10 text-[hsl(214,57%,51%)]">
          <p>{error}</p>
            </div>
      )}
      {loading && results.length === 0 ? (
        <LoadingPlaceholder count={8} />
      ) : results.length > 0 ? (
        <>
          <div className="max-w-4xl mx-auto px-4 py-6">
                <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-[hsl(214,57%,51%)] hover:text-[hsl(214,57%,45%)] transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Categories
                </button>
          </div>
          <ProductGrid products={results} onLoadMore={loadMoreResults} />
          <RecentlyViewed />
        </>
      ) : null}
      {loading && results.length > 0 && (
        <div className="py-10 text-center">
          <div className="inline-block h-8 w-8 animate-pulse-subtle rounded-full bg-primary/30"></div>
        </div>
      )}
        </FadeInOnScroll>
    </div>
    </TravelistaLayout>
  );
};

export default Index;
