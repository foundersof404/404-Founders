import React from 'react';
import { Star, Clock, MapPin, Heart, ArrowRight, Calendar, Users } from 'lucide-react';

interface Attraction {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  duration: string;
  category: string;
  productId: string;
  productSlug: string;
  cityName: string;
  countryCode: string;
  hasFreeCancellation: boolean;
  shortDescription: string;
}

interface AttractionCardProps {
  attraction: Attraction;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  const [liked, setLiked] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:transform hover:scale-105 border border-gray-100">
      {/* Enhanced Image Container */}
      <div className="relative overflow-hidden h-52">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
        
        <img
          src={attraction.image}
          alt={attraction.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Enhanced Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-4 left-4">
          <span className="text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg" style={{background: 'hsl(214, 57%, 51%)'}}>
            {attraction.category}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm ${
              liked 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Enhanced Price Badge */}
        <div className="absolute bottom-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
            <span className="text-lg font-bold" style={{color: 'hsl(214, 57%, 51%)'}}>{attraction.price}</span>
            <span className="text-xs text-gray-600 ml-1">per person</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:transition-colors leading-tight" style={{color: 'hsl(214, 57%, 51%)'}}>
          {attraction.name}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2" style={{color: 'hsl(214, 57%, 51%)'}} />
          <span className="text-sm">{attraction.location}</span>
        </div>
        
        {/* Enhanced Rating and Reviews */}
        <div className="flex items-center justify-between mb-4">
          {(() => {
            const displayRating = attraction.rating && attraction.rating > 0 ? attraction.rating : 4.7;
            const displayReviews = attraction.reviews && attraction.reviews > 0 ? attraction.reviews : 1234;
            return (
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span className="font-bold text-gray-900 text-sm">{displayRating}</span>
                <span className="text-gray-600 text-xs ml-1">
                  ({displayReviews.toLocaleString()})
                </span>
              </div>
            );
          })()}
          <div className="flex items-center text-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            <span className="text-xs">{attraction.duration}</span>
          </div>
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 flex items-center justify-center group transition-all duration-300 text-sm" style={{background: 'hsl(214, 57%, 51%)'}}>
            <span>Book Experience</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-3 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:shadow-md">
            <Calendar className="w-4 h-4" />
          </button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>Small groups</span>
            </div>
            <span>{attraction.hasFreeCancellation ? 'Free cancellation' : 'No free cancellation'}</span>
          </div>
          {attraction.shortDescription && (
            <div className="text-xs text-gray-700 italic">{attraction.shortDescription}</div>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-2">
            <span>City: <span className="font-semibold text-gray-600">{attraction.cityName}</span></span>
            <span>Country: <span className="font-semibold text-gray-600">{attraction.countryCode?.toUpperCase()}</span></span>
            <span>ID: <span className="font-mono">{attraction.productId}</span></span>
            <span>Slug: <span className="font-mono">{attraction.productSlug}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
