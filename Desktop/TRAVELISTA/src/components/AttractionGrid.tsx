
import React from 'react';
import AttractionCard from './AttractionCard';

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
}

interface AttractionGridProps {
  attractions: Attraction[];
}

const AttractionGrid: React.FC<AttractionGridProps> = ({ attractions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {attractions.map((attraction, index) => (
        <div
          key={attraction.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <AttractionCard attraction={attraction} />
        </div>
      ))}
    </div>
  );
};

export default AttractionGrid;
