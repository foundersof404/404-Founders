
import React from 'react';
import { AlertTriangle, RefreshCw, Search } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        {/* Error Message */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {message}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-sm"
          >
            <Search className="w-4 h-4 mr-2" />
            New Search
          </button>
        </div>
        
        {/* Helpful suggestions */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Try searching for popular destinations like:</p>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {['Paris', 'London', 'Tokyo', 'New York', 'Rome'].map((city) => (
              <span key={city} className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 text-xs">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
