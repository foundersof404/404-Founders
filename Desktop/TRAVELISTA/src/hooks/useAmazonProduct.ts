import { useState, useEffect } from 'react';
import { getProductDetails } from '../lib/amazonApi';

interface UseAmazonProductProps {
  asin: string;
  country?: string;
}

export const useAmazonProduct = ({ asin, country = 'US' }: UseAmazonProductProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetails({ asin, country });
        setData(productData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch product details'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [asin, country]);

  return { data, loading, error };
}; 