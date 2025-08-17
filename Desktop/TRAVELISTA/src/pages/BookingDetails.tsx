
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Luggage, Car, CreditCard, CheckCircle, Navigation, Star } from 'lucide-react';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'hsl(214, 57%, 51%)' }}>No Booking Data</h2>
          <p className="mb-4" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Please go back and select a taxi to book.</p>
          <Button onClick={() => navigate('/')} style={{ backgroundColor: 'hsl(214, 57%, 51%)' }}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const { taxi, searchParams } = bookingData;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b" 
              style={{ 
                borderColor: 'hsl(214, 57%, 51%, 0.2)',
                boxShadow: `
                  0 10px 15px -3px hsla(214, 57%, 51%, 0.1),
                  0 4px 6px -2px hsla(214, 57%, 51%, 0.05)
                `
              }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4 p-2"
                style={{ color: 'hsl(214, 57%, 51%)' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>
                  Booking Confirmation
                </h1>
                <p style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Review your booking details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" style={{ color: 'hsl(214, 57%, 51%)' }} />
              <span className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>Confirmed</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trip Summary */}
        <Card className="p-8 mb-8 border-2 rounded-3xl" 
              style={{ 
                borderColor: 'hsl(214, 57%, 51%)',
                boxShadow: `
                  0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                  0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                  0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                  0 0 0 1px hsla(214, 57%, 51%, 0.05)
                `
              }}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4" 
                 style={{ 
                   backgroundColor: 'hsl(214, 57%, 51%)',
                   boxShadow: `
                     0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                     0 10px 10px -5px hsla(214, 57%, 51%, 0.2)
                   `
                 }}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>Trip Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3 flex items-center" style={{ color: 'hsl(214, 57%, 51%)' }}>
                <MapPin className="w-4 h-4 mr-2" />
                Pickup Location
              </h3>
              <p className="text-lg mb-1" style={{ color: 'hsl(214, 57%, 51%, 0.9)' }}>
                {searchParams.pickupLocation?.name || 'Pickup Location'}
              </p>
              <p style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>
                {searchParams.pickupLocation?.city}, {searchParams.pickupLocation?.country}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center" style={{ color: 'hsl(214, 57%, 51%)' }}>
                <Navigation className="w-4 h-4 mr-2" />
                Destination
              </h3>
              <p className="text-lg mb-1" style={{ color: 'hsl(214, 57%, 51%, 0.9)' }}>
                {searchParams.dropoffLocation?.name || 'Destination'}
              </p>
              <p style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>
                {searchParams.dropoffLocation?.city}, {searchParams.dropoffLocation?.country}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center" style={{ color: 'hsl(214, 57%, 51%)' }}>
                <Calendar className="w-4 h-4 mr-2" />
                Date & Time
              </h3>
              <p className="text-lg mb-1" style={{ color: 'hsl(214, 57%, 51%, 0.9)' }}>
                {searchParams.pickupDate && new Date(searchParams.pickupDate).toLocaleDateString()}
              </p>
              <p style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>
                {searchParams.pickupTime}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center" style={{ color: 'hsl(214, 57%, 51%)' }}>
                <Clock className="w-4 h-4 mr-2" />
                Duration & Distance
              </h3>
              <p className="text-lg mb-1" style={{ color: 'hsl(214, 57%, 51%, 0.9)' }}>
                {formatDuration(taxi.duration)}
              </p>
              <p style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>
                {taxi.drivingDistance?.toFixed(1)} km
              </p>
            </div>
          </div>
        </Card>

        {/* Vehicle Details */}
        <Card className="p-8 mb-8 border-2 rounded-3xl" 
              style={{ 
                borderColor: 'hsl(214, 57%, 51%)',
                boxShadow: `
                  0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                  0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                  0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                  0 0 0 1px hsla(214, 57%, 51%, 0.05)
                `
              }}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4" 
                 style={{ 
                   backgroundColor: 'hsl(214, 57%, 51%)',
                   boxShadow: `
                     0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                     0 10px 10px -5px hsla(214, 57%, 51%, 0.2)
                   `
                 }}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>Vehicle Information</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6" 
                   style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.05)' }}>
                <img
                  src={taxi.imageUrl}
                  alt={taxi.categoryLocalised}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300/ffffff/4A90E2?text=Premium+Vehicle';
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(214, 57%, 51%)' }}>
                  {taxi.categoryLocalised}
                </h3>
                <p style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>{taxi.descriptionLocalised}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white border-2 rounded-xl p-4" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%, 0.2)',
                       boxShadow: `
                         0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                         0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                       `
                     }}>
                  <Users className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(214, 57%, 51%)' }} />
                  <div className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>{taxi.passengerCapacity}</div>
                  <div className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Passengers</div>
                </div>
                <div className="text-center bg-white border-2 rounded-xl p-4" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%, 0.2)',
                       boxShadow: `
                         0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                         0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                       `
                     }}>
                  <Luggage className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(214, 57%, 51%)' }} />
                  <div className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>{taxi.bags}</div>
                  <div className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Luggage</div>
                </div>
                <div className="text-center bg-white border-2 rounded-xl p-4" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%, 0.2)',
                       boxShadow: `
                         0 4px 6px -1px hsla(214, 57%, 51%, 0.1),
                         0 2px 4px -1px hsla(214, 57%, 51%, 0.06)
                       `
                     }}>
                  <Star className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(214, 57%, 51%)' }} />
                  <div className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>{taxi.supplierName}</div>
                  <div className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Provider</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {taxi.meetGreet && (
                  <Badge className="border-2" style={{ borderColor: 'hsl(214, 57%, 51%)', color: 'hsl(214, 57%, 51%)', backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
                    Meet & Greet
                  </Badge>
                )}
                {!taxi.nonRefundable && (
                  <Badge className="border-2" style={{ borderColor: 'hsl(214, 57%, 51%)', color: 'hsl(214, 57%, 51%)', backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
                    Free Cancellation
                  </Badge>
                )}
                {taxi.geniusDiscount && (
                  <Badge className="border-2" style={{ borderColor: 'hsl(214, 57%, 51%)', color: 'hsl(214, 57%, 51%)', backgroundColor: 'hsl(214, 57%, 51%, 0.1)' }}>
                    Genius Discount
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Price Summary */}
        <Card className="p-8 mb-8 border-2 rounded-3xl" 
              style={{ 
                borderColor: 'hsl(214, 57%, 51%)',
                boxShadow: `
                  0 25px 50px -12px hsla(214, 57%, 51%, 0.25),
                  0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                  0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                  0 0 0 1px hsla(214, 57%, 51%, 0.05)
                `
              }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4" 
                   style={{ 
                     backgroundColor: 'hsl(214, 57%, 51%)',
                     boxShadow: `
                       0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                       0 10px 10px -5px hsla(214, 57%, 51%, 0.2)
                     `
                   }}>
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>Price Summary</h2>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>
                €{taxi.price.amount}
              </div>
              <p style={{ color: 'hsl(214, 57%, 51%, 0.6)' }}>Total Price</p>
            </div>
          </div>

          <div className="bg-white border-2 rounded-2xl p-6" 
               style={{ 
                 borderColor: 'hsl(214, 57%, 51%, 0.2)',
                 backgroundColor: 'hsl(214, 57%, 51%, 0.02)'
               }}>
            <div className="flex justify-between items-center mb-3">
              <span style={{ color: 'hsl(214, 57%, 51%, 0.8)' }}>Base fare</span>
              <span className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>€{taxi.price.amount}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span style={{ color: 'hsl(214, 57%, 51%, 0.8)' }}>Service fee</span>
              <span className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>Included</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span style={{ color: 'hsl(214, 57%, 51%, 0.8)' }}>Taxes</span>
              <span className="font-semibold" style={{ color: 'hsl(214, 57%, 51%)' }}>Included</span>
            </div>
            <hr className="my-4" style={{ borderColor: 'hsl(214, 57%, 51%, 0.2)' }} />
            <div className="flex justify-between items-center text-xl font-bold">
              <span style={{ color: 'hsl(214, 57%, 51%)' }}>Total</span>
              <span style={{ color: 'hsl(214, 57%, 51%)' }}>€{taxi.price.amount}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1 py-4 text-lg border-2 rounded-xl"
            style={{ 
              borderColor: 'hsl(214, 57%, 51%)', 
              color: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 10px 15px -3px hsla(214, 57%, 51%, 0.1),
                0 4px 6px -2px hsla(214, 57%, 51%, 0.05)
              `
            }}
          >
            Book Another Ride
          </Button>
          <Button
            className="flex-1 py-4 text-lg text-white font-bold rounded-xl border-0"
            style={{ 
              backgroundColor: 'hsl(214, 57%, 51%)',
              boxShadow: `
                0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                0 0 0 1px hsla(214, 57%, 51%, 0.1)
              `
            }}
          >
            Confirm & Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
