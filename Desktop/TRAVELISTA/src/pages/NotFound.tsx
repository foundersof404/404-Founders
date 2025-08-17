
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TravelistaLayout from '@/components/TravelistaLayout';
import { MapPin, Globe, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <TravelistaLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-3">Destination Not Found</h2>
          <p className="text-muted-foreground mb-8">
            It seems like you've wandered off the map. The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </Button>
        </div>
      </div>
    </TravelistaLayout>
  );
};

export default NotFound;
