
import React from 'react';
import { Loader2, Compass } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin" style={{borderColor: 'hsl(214, 57%, 85%)'}}>
          <div className="w-full h-full border-4 border-transparent border-t-blue-600 rounded-full" style={{borderTopColor: 'hsl(214, 57%, 51%)'}}></div>
        </div>
        
        {/* Inner compass icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass className="w-8 h-8 animate-pulse" style={{color: 'hsl(214, 57%, 51%)'}} />
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold mb-2" style={{color: 'hsl(214, 57%, 51%)'}}>
          Discovering Amazing Attractions
        </h3>
        <p className="text-gray-600 text-sm max-w-md">
          We're searching through thousands of incredible experiences to find the perfect ones for you
        </p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: 'hsl(214, 57%, 51%)'}}></div>
          <div className="w-2 h-2 rounded-full animate-bounce animation-delay-200" style={{backgroundColor: 'hsl(214, 57%, 51%)'}}></div>
          <div className="w-2 h-2 rounded-full animate-bounce animation-delay-400" style={{backgroundColor: 'hsl(214, 57%, 51%)'}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
