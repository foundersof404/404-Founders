import TaxiBooking from '../components/TaxiBooking';
import { Car, Zap, Shield, Clock, Star, ArrowRight } from 'lucide-react';
import TravelistaLayout from '@/components/TravelistaLayout';

const Taxi = () => {
  return (
    <TravelistaLayout>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Top Spacing */}
        <div className="h-[20px]"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ backgroundColor: 'hsl(214, 57%, 51%)' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" style={{ backgroundColor: 'hsl(214, 57%, 51%)' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000" style={{ backgroundColor: 'hsl(214, 57%, 51%)' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
              <div className="animate-fade-in">
                <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: 'hsl(214, 57%, 51%)' }}>
                  Book Your Perfect
                  <span
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 drop-shadow-lg font-extrabold mt-2"
                    style={{ fontSize: '1.2em', letterSpacing: '0.03em' }}
                  >
                    Taxi Ride
                  </span>
                </h2>
                <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'hsl(214, 57%, 51%, 0.8)' }}>
                  Experience premium transportation with cutting-edge technology. From standard rides to luxury vehicles, 
                  discover the perfect taxi for your journey with our AI-powered booking system.
                </p>
              </div>
              
              {/* Floating Stats with Professional Shadows */}
              <div className="flex justify-center space-x-8 mt-12">
                <div className="bg-white rounded-2xl p-4 transform hover:scale-110 hover:rotate-3 transition-all duration-300 border-2" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%)',
                       boxShadow: `
                         0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                         0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                         0 0 0 1px hsla(214, 57%, 51%, 0.05)
                       `
                     }}>
                  <div className="text-2xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>10M+</div>
                  <div className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Happy Rides</div>
                </div>
                <div className="bg-white rounded-2xl p-4 transform hover:scale-110 hover:-rotate-3 transition-all duration-300 border-2" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%)',
                       boxShadow: `
                         0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                         0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                         0 0 0 1px hsla(214, 57%, 51%, 0.05)
                       `
                     }}>
                  <div className="text-2xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>4.9★</div>
                  <div className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Rating</div>
                </div>
                <div className="bg-white rounded-2xl p-4 transform hover:scale-110 hover:rotate-3 transition-all duration-300 border-2" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%)',
                       boxShadow: `
                         0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                         0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                         0 0 0 1px hsla(214, 57%, 51%, 0.05)
                       `
                     }}>
                  <div className="text-2xl font-bold" style={{ color: 'hsl(214, 57%, 51%)' }}>24/7</div>
                  <div className="text-sm" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Available</div>
                </div>
              </div>
            </div>
            
            <div className="transform hover:scale-[1.02] transition-all duration-500">
              <TaxiBooking />
            </div>
          </div>
        </div>

        {/* Enhanced Features Section with Professional Shadows */}
        <div className="relative py-20 mt-16" style={{ backgroundColor: 'hsl(214, 57%, 51%, 0.05)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-4" style={{ color: 'hsl(214, 57%, 51%)' }}>Why Choose Travelista?</h3>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Experience the future of transportation with our advanced features</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group">
                <div className="bg-white rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border-2" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%, 0.2)',
                       boxShadow: `
                         0 25px 50px -12px hsla(214, 57%, 51%, 0.15),
                         0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                         0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                         0 0 0 1px hsla(214, 57%, 51%, 0.05)
                       `
                     }}>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-all duration-300" 
                       style={{ 
                         backgroundColor: 'hsl(214, 57%, 51%)',
                         boxShadow: `
                           0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                           0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                           0 0 0 1px hsla(214, 57%, 51%, 0.1)
                         `
                       }}>
                    <Car className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3" style={{ color: 'hsl(214, 57%, 51%)' }}>Premium Fleet</h4>
                  <p className="leading-relaxed" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Choose from our extensive collection of luxury, executive, standard, and eco-friendly vehicles tailored to your preferences.</p>
                  <div className="mt-4 font-medium" style={{ color: 'hsl(214, 57%, 51%)' }}>
                    Learn More <ArrowRight className="w-4 h-4 inline ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border-2" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%, 0.2)',
                       boxShadow: `
                         0 25px 50px -12px hsla(214, 57%, 51%, 0.15),
                         0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                         0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                         0 0 0 1px hsla(214, 57%, 51%, 0.05)
                       `
                     }}>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-all duration-300" 
                       style={{ 
                         backgroundColor: 'hsl(214, 57%, 51%)',
                         boxShadow: `
                           0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                           0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                           0 0 0 1px hsla(214, 57%, 51%, 0.1)
                         `
                       }}>
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3" style={{ color: 'hsl(214, 57%, 51%)' }}>Instant Booking</h4>
                  <p className="leading-relaxed" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Lightning-fast booking process with real-time availability, instant confirmation, and seamless payment integration.</p>
                  <div className="mt-4 font-medium" style={{ color: 'hsl(214, 57%, 51%)' }}>
                    Learn More <ArrowRight className="w-4 h-4 inline ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border-2" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%, 0.2)',
                       boxShadow: `
                         0 25px 50px -12px hsla(214, 57%, 51%, 0.15),
                         0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                         0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                         0 0 0 1px hsla(214, 57%, 51%, 0.05)
                       `
                     }}>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-all duration-300" 
                       style={{ 
                         backgroundColor: 'hsl(214, 57%, 51%)',
                         boxShadow: `
                           0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                           0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                           0 0 0 1px hsla(214, 57%, 51%, 0.1)
                         `
                       }}>
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3" style={{ color: 'hsl(214, 57%, 51%)' }}>Safe & Secure</h4>
                  <p className="leading-relaxed" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Professional drivers, GPS tracking, insurance coverage, and 24/7 customer support for your complete peace of mind.</p>
                  <div className="mt-4 font-medium" style={{ color: 'hsl(214, 57%, 51%)' }}>
                    Learn More <ArrowRight className="w-4 h-4 inline ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border-2" 
                     style={{ 
                       borderColor: 'hsl(214, 57%, 51%, 0.2)',
                       boxShadow: `
                         0 25px 50px -12px hsla(214, 57%, 51%, 0.15),
                         0 20px 25px -5px hsla(214, 57%, 51%, 0.1),
                         0 10px 10px -5px hsla(214, 57%, 51%, 0.04),
                         0 0 0 1px hsla(214, 57%, 51%, 0.05)
                       `
                     }}>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-all duration-300" 
                       style={{ 
                         backgroundColor: 'hsl(214, 57%, 51%)',
                         boxShadow: `
                           0 20px 25px -5px hsla(214, 57%, 51%, 0.4),
                           0 10px 10px -5px hsla(214, 57%, 51%, 0.2),
                           0 0 0 1px hsla(214, 57%, 51%, 0.1)
                         `
                       }}>
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3" style={{ color: 'hsl(214, 57%, 51%)' }}>Always On Time</h4>
                  <p className="leading-relaxed" style={{ color: 'hsl(214, 57%, 51%, 0.7)' }}>Advanced route optimization, real-time traffic updates, and punctual service to ensure you reach your destination on time.</p>
                  <div className="mt-4 font-medium" style={{ color: 'hsl(214, 57%, 51%)' }}>
                    Learn More <ArrowRight className="w-4 h-4 inline ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TravelistaLayout>
  );
};

export default Taxi; 