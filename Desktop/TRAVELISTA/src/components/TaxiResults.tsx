import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Luggage, Clock, MapPin, Star, Zap, Shield, Crown, Leaf, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';

interface TaxiResult {
  resultId: string;
  category: string;
  categoryLocalised: string;
  description: string;
  descriptionLocalised: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  passengerCapacity: number;
  bags: number;
  duration: number;
  drivingDistance: number;
  imageUrl: string;
  supplierName: string;
  vehicleType: string;
  meetGreet: boolean;
  geniusDiscount: boolean;
  nonRefundable: boolean;
}

interface TaxiResultsProps {
  results: any;
  isLoading: boolean;
  searchParams: any;
  error?: any;
}

const TaxiResults = ({ results, isLoading, searchParams, error }: TaxiResultsProps) => {
  const navigate = useNavigate();
  
  console.log('📊 TaxiResults Component State:');
  console.log('- Results:', results);
  console.log('- Is Loading:', isLoading);
  console.log('- Error:', error);
  console.log('- Search Params:', searchParams);

  const handleBookNow = (taxi: TaxiResult) => {
    console.log('🎫 Booking taxi:', taxi);
    navigate('/booking-details', {
      state: {
        taxi,
        searchParams
      }
    });
  };

  // Show error state
  if (error) {
    return (
      <Card className="p-12 bg-white border-2 rounded-3xl" 
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                0 0 0 1px hsla(214, 57%, 51%, 0.05)
              `
            }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
            <AlertTriangle className="w-10 h-10" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(214, 57%, 51%)' }}>Search Error</h3>
          <p className="text-lg mb-4" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>
            {error.message || 'Unable to search for taxis at the moment'}
          </p>
          <div className="text-sm font-mono p-4 rounded-lg mb-4" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.05)', color: 'hsl(214, 57%, 51%, 0.8)' }}>
            Error Details: {error.toString()}
          </div>
          <p className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>
            Please try again with different search criteria or check your internet connection.
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-12 bg-white border-2 rounded-3xl" 
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                0 0 0 1px hsla(214, 57%, 51%, 0.05)
              `
            }}>
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 mx-auto" style={{ borderColor: 'hsl(214, 57%, 51%, 0.3)', borderTopColor: 'hsl(214, 57%, 51%)' }}></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}></div>
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(214, 57%, 51%)' }}>Discovering Premium Rides</h3>
          <p className="text-lg" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Our AI is finding the perfect vehicles for your journey...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'hsl(214, 57%, 51%)' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'hsl(214, 57%, 51%)', animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'hsl(214, 57%, 51%)', animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!results || !results.data) {
    console.log('❌ No results or no data property in results');
    return (
      <Card className="p-12 bg-white border-2 rounded-3xl" 
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                0 0 0 1px hsla(214, 57%, 51%, 0.05)
              `
            }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
            <MapPin className="w-10 h-10" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(214, 57%, 51%)' }}>No results found</h3>
          <p className="text-lg" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Please try searching again with different criteria.</p>
        </div>
      </Card>
    );
  }

  const journeys = results.data.journeys;
  const taxiResults = results.data.results;

  console.log('🧳 Journeys found:', journeys?.length || 0);
  console.log('🚗 Taxi results found:', taxiResults?.length || 0);

  if (!journeys || !Array.isArray(journeys) || journeys.length === 0) {
    console.log('❌ No journeys available');
    return (
      <Card className="p-12 bg-white border-2 rounded-3xl" 
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                0 0 0 1px hsla(214, 57%, 51%, 0.05)
              `
            }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
            <MapPin className="w-10 h-10" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(214, 57%, 51%)' }}>No journeys available</h3>
          <p className="text-lg" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Try adjusting your search criteria or choose different locations.</p>
        </div>
      </Card>
    );
  }

  const journey = journeys[0];
  console.log('🎯 Using journey:', journey);

  if (!taxiResults || !Array.isArray(taxiResults) || taxiResults.length === 0) {
    console.log('❌ No taxi results available');
    return (
      <Card className="p-12 bg-white border-2 rounded-3xl" 
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                0 0 0 1px hsla(214, 57%, 51%, 0.05)
              `
            }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
            <MapPin className="w-10 h-10" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(214, 57%, 51%)' }}>No taxis found</h3>
          <p className="text-lg" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Try adjusting your search criteria or choose different locations.</p>
        </div>
      </Card>
    );
  }

  console.log('✅ Displaying', taxiResults.length, 'taxi results');

  const getCategoryColor = (category: string) => {
    return 'bg-white border-2' + ` border-[hsl(214,57%,51%)] text-[hsl(214,57%,51%)]`;
  };

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('luxury')) return <Crown className="w-4 h-4" />;
    if (lowerCategory.includes('electric')) return <Leaf className="w-4 h-4" />;
    if (lowerCategory.includes('executive')) return <Shield className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Journey Info with Professional Shadow */}
      <Card className="p-8 bg-white border-2 rounded-3xl transform hover:scale-[1.02] transition-all duration-500" 
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                0 0 0 1px hsla(214, 57%, 51%, 0.05),
                inset 0 1px 0 0 hsla(214, 57%, 51%, 0.1)
              `
            }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4" 
                   style={{ 
                     backgroundColor: 'hsl(214, 57%, 51%)',
                     boxShadow: `
                       0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                       0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                       0 0 0 1px hsla(214, 57%, 51%, 0.1)
                     `
                   }}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ color: 'hsl(214, 57%, 51%)' }}>
                  {journey.pickupLocation?.establishment || journey.pickupLocation?.city || 'Pickup Location'}
                </h3>
                <div className="flex items-center" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>
                  <ArrowRight className="w-4 h-4 mx-2" />
                  <span>{journey.dropOffLocation?.establishment || journey.dropOffLocation?.city || 'Dropoff Location'}</span>
                </div>
              </div>
            </div>
            <p className="text-lg" style={{ color: 'hsl(214, 57%, 51%, 0.8)' }}>
              {journey.requestedPickupDateTime && new Date(journey.requestedPickupDateTime).toLocaleDateString()} at{' '}
              {journey.requestedPickupDateTime && new Date(journey.requestedPickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-white border-2 rounded-2xl p-4 text-center" 
                 style={{ 
                   borderColor: 'hsl(214, 57%, 51%, 0.3)',
                   boxShadow: `
                     0 10px 15px -3px hsla(214, 57%, 51%, 0.1),
                     0 4px 6px -2px hsla(214, 57%, 51%, 0.05)
                   `
                 }}>
              <div className="flex items-center text-lg font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>
                <Clock className="w-5 h-5 mr-2" />
                {taxiResults[0]?.drivingDistance ? `${taxiResults[0].drivingDistance.toFixed(1)} km` : 'Distance: N/A'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-2" style={{ color: 'hsl(214, 57%, 51%)' }}>Available Vehicles</h3>
        <p className="text-lg" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Choose from our premium selection of vehicles</p>
        <div className="mt-2 text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>
          Found {taxiResults.length} option{taxiResults.length !== 1 ? 's' : ''} for your journey
        </div>
      </div>

      {/* Enhanced Results Grid with Professional Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {taxiResults.map((taxi: TaxiResult, index: number) => {
          console.log(`🚗 Rendering taxi ${index + 1}:`, taxi);
          return (
            <Card 
              key={taxi.resultId} 
              className="group overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white border-2 rounded-3xl animate-fade-in"
              style={{ 
                borderColor: 'hsl(214, 57%, 51%)', 
                animationDelay: `${index * 100}ms`,
                boxShadow: `
                  0 25px 50px -12px hsla(214, 57%, 51%, 0.15),
                  0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                  0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                  0 0 0 1px hsla(214, 57%, 51%, 0.05)
                `
              }}
            >
              {/* Vehicle Image with Enhanced Overlay */}
              <div className="relative h-56 overflow-hidden" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.05)' }}>
                <img
                  src={taxi.imageUrl}
                  alt={taxi.categoryLocalised}
                  className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300/ffffff/4A90E2?text=Premium+Vehicle';
                  }}
                />
                
                {/* Enhanced Badges with Shadows */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {taxi.geniusDiscount && (
                    <Badge className="bg-white border-2" 
                           style={{ 
                             borderColor: 'hsl(214, 57%, 51%)', 
                             color: 'hsl(214, 57%, 51%)',
                             boxShadow: `
                               0 10px 15px -3px hsla(214, 57%, 51%, 0.1),
                               0 4px 6px -2px hsla(214, 57%, 51%, 0.05)
                             `
                           }}>
                      <Star className="w-3 h-3 mr-1" />
                      Genius Discount
                    </Badge>
                  )}
                  {taxi.category.toLowerCase().includes('electric') && (
                    <Badge className="bg-white border-2" 
                           style={{ 
                             borderColor: 'hsl(214, 57%, 51%)', 
                             color: 'hsl(214, 57%, 51%)',
                             boxShadow: `
                               0 10px 15px -3px hsla(214, 57%, 51%, 0.1),
                               0 4px 6px -2px hsla(214, 57%, 51%, 0.05)
                             `
                           }}>
                      <Leaf className="w-3 h-3 mr-1" />
                      Electric
                    </Badge>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full border backdrop-blur-lg ${getCategoryColor(taxi.category)}`}
                       style={{
                         boxShadow: `
                           0 10px 15px -3px hsla(214, 57%, 51%, 0.1),
                           0 4px 6px -2px hsla(214, 57%, 51%, 0.05)
                         `
                       }}>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(taxi.category)}
                      <span className="text-sm font-medium">{taxi.supplierName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold group-hover:opacity-80 transition-opacity duration-300" style={{ color: 'hsl(214, 57%, 51%)' }}>
                    {taxi.categoryLocalised}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" style={{ color: 'hsl(214, 57%, 51%)' }} />
                    <span className="text-sm font-medium" style={{ color: 'hsl(214, 57%, 51%)' }}>Premium</span>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed" style={{ color: 'hsl(214, 57%, 51%, 0.8)' }}>{taxi.descriptionLocalised}</p>

                {/* Enhanced Features with Shadows */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center bg-white border-2 rounded-xl p-3 transition-all duration-300" 
                       style={{ 
                         borderColor: 'hsl(214, 57%, 51%, 0.2)',
                         boxShadow: `
                           0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                           0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                         `
                       }}>
                    <Users className="w-5 h-5 mx-auto mb-1" style={{ color: 'hsl(214, 57%, 51%)' }} />
                    <div className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>{taxi.passengerCapacity}</div>
                    <div className="text-xs" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Passengers</div>
                  </div>
                  <div className="text-center bg-white border-2 rounded-xl p-3 transition-all duration-300" 
                       style={{ 
                         borderColor: 'hsl(214, 57%, 51%, 0.2)',
                         boxShadow: `
                           0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                           0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                         `
                       }}>
                    <Luggage className="w-5 h-5 mx-auto mb-1" style={{ color: 'hsl(214, 57%, 51%)' }} />
                    <div className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>{taxi.bags}</div>
                    <div className="text-xs" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Luggage</div>
                  </div>
                  <div className="text-center bg-white border-2 rounded-xl p-3 transition-all duration-300" 
                       style={{ 
                         borderColor: 'hsl(214, 57%, 51%, 0.2)',
                         boxShadow: `
                           0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                           0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                         `
                       }}>
                    <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: 'hsl(214, 57%, 51%)' }} />
                    <div className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>{formatDuration(taxi.duration)}</div>
                    <div className="text-xs" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Duration</div>
                  </div>
                </div>

                {/* Enhanced Features badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {taxi.meetGreet && (
                    <Badge variant="outline" className="border-2" style={{ borderColor: 'hsl(214, 57%, 51%, 0.5)', color: 'hsl(214, 57%, 51%)', backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
                      Meet & Greet
                    </Badge>
                  )}
                  {!taxi.nonRefundable && (
                    <Badge variant="outline" className="border-2" style={{ borderColor: 'hsl(214, 57%, 51%, 0.5)', color: 'hsl(214, 57%, 51%)', backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
                      Free Cancellation
                    </Badge>
                  )}
                </div>

                {/* Enhanced Price and Book Button with Shadow */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>
                      €{taxi.price.amount}
                    </div>
                    <div className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Total price</div>
                  </div>
                  <Button
                    onClick={() => handleBookNow(taxi)}
                    className="group relative text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-0 overflow-hidden" 
                    style={{ 
                      backgroundColor: 'hsl(214, 57%, 51%)',
                      boxShadow: `
                        0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                        0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                        0 0 0 1px hsla(214, 57%, 51%, 0.1),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
                      `
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'hsl(214, 57%, 45%)' }}></div>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TaxiResults;
