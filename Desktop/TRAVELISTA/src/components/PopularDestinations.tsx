import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import axios from 'axios';

// Define the type for destination data
interface Destination {
  id: number;
  country: string;
  name: string;
  image: string;
  description: string;
  rating: number;
}

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const apiUrl = 'http://localhost:5000/api/popular-destinations';
      console.log('Fetching destinations from:', apiUrl);
      const response = await axios.get(apiUrl);
      console.log('API response success:', response.data);
      setDestinations(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching popular destinations:', err);
      if (axios.isAxiosError(err)) {
        console.error('API response error:', err.response?.data);
        console.error('API error status:', err.response?.status);
        setError(`API Error (${err.response?.status}): ${err.message}`);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Function to render star ratings
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={11} className="fill-white text-white" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" size={11} className="fill-white text-white" />);
    }
    
    return (
      <div className="flex items-center gap-0.5">
        {stars}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore these iconic landmarks that have captivated travelers for generations
          </p>
        </motion.div>
        
        {/* Add keyframes for continuous zoom animation */}
        <style>
          {`
            @keyframes zoomInOut {
              0% { transform: scale(1); }
              50% { transform: scale(1.25); }
              100% { transform: scale(1); }
            }
            
            .image-zoom {
              animation: zoomInOut 4s infinite cubic-bezier(0.4, 0, 0.6, 1);
            }
            
            .card-container:hover .image-zoom {
              animation-play-state: paused;
            }
            
            .card-container:hover {
              box-shadow: 15px 8px 30px rgba(59, 130, 246, 0.7);
              transform: translateY(-10px);
              transition: all 0.3s ease;
            }
            
            .card-container:hover .text-container {
              background-color: rgba(255, 255, 255, 1);
              border-color: #ffffff;
            }
          `}
        </style>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading destinations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-[30px] overflow-hidden shadow-xl h-[400px] max-w-[calc(100%-15px)] mx-auto card-container transition-all duration-300"
              >
                <div className="w-full h-full overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                    className="w-full h-full object-cover image-zoom"
                    style={{ 
                      animationDelay: `${index * 0.5}s`,
                    }}
                  />
                </div>
                
                {/* Text Content Area */}
                <div className="absolute bottom-6 left-6 right-6">
                  {/* Semi-transparent cream/beige background */}
                  <div className="bg-[#fbf7e8]/90 backdrop-blur-sm p-4 rounded-[20px] relative border border-[#f5efd7] text-container transition-all duration-300">
                    {/* Rating Badge - Positioned on the border of the text area */}
                    <div className="absolute -top-3 right-3 bg-blue-600 py-0.5 px-1.5 rounded-full">
                      {renderRating(destination.rating)}
                    </div>
                    
                    <div className="text-teal-600 text-xs font-medium mb-0.5">{destination.country}</div>
                    <h3 className="text-[#374151] text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-gray-600 text-xs font-normal">{destination.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularDestinations; 