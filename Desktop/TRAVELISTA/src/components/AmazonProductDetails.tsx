import React from 'react';
import { useAmazonProduct } from '../hooks/useAmazonProduct';
import './AmazonProductDetails.css';

interface AmazonProductDetailsProps {
  asin: string;
  country?: string;
}

export const AmazonProductDetails: React.FC<AmazonProductDetailsProps> = ({ asin, country }) => {
  const { data, loading, error } = useAmazonProduct({ asin, country });

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No product data available</div>;
  }

  return (
    <div className="product-details">
      <h2>{data.title}</h2>
      {data.thumbnail && (
        <img src={data.thumbnail} alt={data.title} className="product-image" />
      )}
      <div className="product-info">
        <p>Price: {data.current_price}</p>
        <p>Rating: {data.rating}</p>
        <p>Reviews: {data.reviews_total}</p>
        {data.description && (
          <div className="description">
            <h3>Description</h3>
            <p>{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 