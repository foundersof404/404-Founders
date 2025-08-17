import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import TravelistaLayout from '@/components/TravelistaLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { searchCarRentals } from '@/lib/carRentalApi';
import { 
  CalendarIcon, 
  Search, 
  Car, 
  Users, 
  MapPin, 
  Clock,
  Loader2,
  Check,
  Fuel,
  Settings,
  Snowflake,
  Star
} from 'lucide-react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
}

interface CarOffer {
  id: string;
  provider: {
    name: string;
    rating: number;
    reviewCount: number;
  };
  vehicle: {
    name: string;
    type: string;
    category: string;
    seats: number;
    transmission: string;
    airConditioned: boolean;
    fuelType: string;
    imageUrl: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  location: {
    pickup: {
      address: string;
      latitude: number;
      longitude: number;
    };
    dropoff: {
      address: string;
      latitude: number;
      longitude: number;
    };
  };
  policies: {
    cancellation: string;
    requirements: string[];
  };
}

const mockCars = [
  {
    id: 1,
    name: 'Tesla Model 3',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80',
    price: 89,
    type: 'Electric',
    color: 'White',
    location: 'San Francisco',
  },
  {
    id: 2,
    name: 'Jeep Wrangler',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    price: 129,
    type: 'SUV',
    color: 'Black',
    location: 'Los Angeles',
  },
  {
    id: 3,
    name: 'Mercedes-Benz C-Class',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    price: 149,
    type: 'Luxury',
    color: 'Silver',
    location: 'New York',
  },
  {
    id: 4,
    name: 'Toyota Corolla',
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80',
    price: 59,
    type: 'Sedan',
    color: 'Blue',
    location: 'Chicago',
  },
  {
    id: 5,
    name: 'Ford Mustang',
    image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=600&q=80',
    price: 139,
    type: 'Sports',
    color: 'Red',
    location: 'Miami',
  },
  {
    id: 6,
    name: 'Honda Civic',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
    price: 65,
    type: 'Sedan',
    color: 'White',
    location: 'San Francisco',
  },
  {
    id: 7,
    name: 'BMW X5',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    price: 159,
    type: 'SUV',
    color: 'Black',
    location: 'Los Angeles',
  },
  {
    id: 8,
    name: 'Audi A4',
    image: 'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=600&q=80',
    price: 119,
    type: 'Luxury',
    color: 'Gray',
    location: 'New York',
  },
  {
    id: 9,
    name: 'Chevrolet Camaro',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    price: 129,
    type: 'Sports',
    color: 'Yellow',
    location: 'Miami',
  },
  {
    id: 10,
    name: 'Nissan Altima',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    price: 69,
    type: 'Sedan',
    color: 'Silver',
    location: 'Chicago',
  },
  {
    id: 11,
    name: 'Volkswagen Golf',
    image: 'https://images.unsplash.com/photo-1503736317-1c6b2b9b8b8b?auto=format&fit=crop&w=600&q=80',
    price: 75,
    type: 'Hatchback',
    color: 'Blue',
    location: 'San Francisco',
  },
  {
    id: 12,
    name: 'Hyundai Elantra',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    price: 62,
    type: 'Sedan',
    color: 'White',
    location: 'Los Angeles',
  },
  {
    id: 13,
    name: 'Kia Sportage',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    price: 99,
    type: 'SUV',
    color: 'Gray',
    location: 'New York',
  },
  {
    id: 14,
    name: 'Mazda CX-5',
    image: 'https://images.unsplash.com/photo-1503736322-6b8a2b8b8b8b?auto=format&fit=crop&w=600&q=80',
    price: 105,
    type: 'SUV',
    color: 'Red',
    location: 'Miami',
  },
  {
    id: 15,
    name: 'Subaru Outback',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    price: 110,
    type: 'Wagon',
    color: 'Green',
    location: 'Chicago',
  },
  {
    id: 16,
    name: 'Toyota Prius',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b43?auto=format&fit=crop&w=600&q=80',
    price: 80,
    type: 'Hybrid',
    color: 'Silver',
    location: 'San Francisco',
  },
  {
    id: 17,
    name: 'Ford Explorer',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    price: 120,
    type: 'SUV',
    color: 'Black',
    location: 'Los Angeles',
  },
  {
    id: 18,
    name: 'Chevrolet Tahoe',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    price: 140,
    type: 'SUV',
    color: 'White',
    location: 'New York',
  },
  {
    id: 19,
    name: 'Honda Accord',
    image: 'https://images.unsplash.com/photo-1503736317-1c6b2b9b8b8b?auto=format&fit=crop&w=600&q=80',
    price: 77,
    type: 'Sedan',
    color: 'Blue',
    location: 'Miami',
  },
  {
    id: 20,
    name: 'BMW 3 Series',
    image: 'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=600&q=80',
    price: 135,
    type: 'Luxury',
    color: 'Black',
    location: 'Chicago',
  },
];

const unique = (arr: string[]): string[] => Array.from(new Set(arr));

const mapContainerStyle = {
  width: '100%',
  height: '250px',
};
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco as default

const RentCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupLatLng, setPickupLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [dropoffLatLng, setDropoffLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState<Date>();
  const [returnTime, setReturnTime] = useState('10:00');
  const [carType, setCarType] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [seats, setSeats] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 160]);
  const [color, setColor] = useState('all');
  const [type, setType] = useState('all');
  const [location, setLocation] = useState('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLatLng || !dropoffLatLng || !pickupDate || !returnDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const params = {
        pick_up_latitude: pickupLatLng.lat.toString(),
        pick_up_longitude: pickupLatLng.lng.toString(),
        drop_off_latitude: dropoffLatLng.lat.toString(),
        drop_off_longitude: dropoffLatLng.lng.toString(),
        pick_up_date: format(pickupDate, 'yyyy-MM-dd'),
        drop_off_date: format(returnDate, 'yyyy-MM-dd'),
        pick_up_time: pickupTime,
        drop_off_time: returnTime,
        driver_age: '30',
        currency_code: 'USD',
        location: pickupLocation
      };
      
      const response = await searchCarRentals(params);
      
      if (response?.data?.car_list) {
        setCars(response.data.car_list);
        toast({
          title: "Cars found",
          description: `Found ${response.data.car_list.length} cars matching your criteria`,
        });
      } else {
        setCars([]);
        toast({
          title: "No cars found",
          description: "Try adjusting your search criteria",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching cars:', error);
      setError('Failed to search for cars. Please try again.');
      toast({
        title: "Error searching cars",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtering logic
  const filteredCars = cars.filter(car => {
    const inPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    const inType = type === 'all' || car.vehicle_type === type;
    const inLocation = location === 'all' || car.location_name === location;
    return inPrice && inType && inLocation;
  });

  return (
    <TravelistaLayout>
      <div className="min-h-screen bg-white text-black flex flex-col items-center py-10 px-2">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold mb-10 tracking-tight text-center">Car Rental & Booking</h2>
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10">
          {/* Left Side: Title, Big Text, Filters, Cars */}
          <div className="flex-1 flex flex-col justify-start">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Find Your Perfect Ride</h1>
              <div className="text-5xl md:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-black to-gray-600 text-transparent bg-clip-text">
                Drive Your Dream Car Today
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center border-b border-black pb-4">
              <div>
                <label className="font-semibold mr-2">Price:</label>
                <input
                  type="range"
                  min={50}
                  max={160}
                  value={priceRange[0]}
                  onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                  className="mx-1 appearance-none w-24 h-2 bg-black rounded outline-none"
                  style={{ accentColor: 'black' }}
                />
                <input
                  type="range"
                  min={50}
                  max={160}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  className="mx-1 appearance-none w-24 h-2 bg-black rounded outline-none"
                  style={{ accentColor: 'black' }}
                />
                <span className="ml-2">${priceRange[0]} - ${priceRange[1]}</span>
              </div>
              <div>
                <label className="font-semibold mr-2">Type:</label>
                <select value={type} onChange={e => setType(e.target.value)} className="border border-black rounded px-2 py-1 bg-white text-black font-semibold shadow-sm focus:border-gray-800 hover:border-gray-800 transition-colors">
                  <option value="all">All</option>
                  <option value="economy">Economy</option>
                  <option value="compact">Compact</option>
                  <option value="midsize">Midsize</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="font-semibold mr-2">Location:</label>
                <select value={location} onChange={e => setLocation(e.target.value)} className="border border-black rounded px-2 py-1 bg-white text-black font-semibold shadow-sm focus:border-gray-800 hover:border-gray-800 transition-colors">
                  <option value="all">All</option>
                  {Array.from(new Set(cars.map(car => car.location_name))).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Car Listings */}
            <div className="max-h-[70vh] overflow-y-auto flex flex-col gap-6 mt-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>Searching for cars...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-10">
                  {error}
                </div>
              ) : filteredCars.length > 0 ? (
                filteredCars.map(car => (
                  <div
                    key={car.vehicle_id}
                    className="border border-black rounded-2xl bg-white shadow-lg p-4 flex flex-col md:flex-row items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-800 hover:bg-gray-50 group"
                  >
                    <img src={car.image} alt={car.name} className="w-48 h-32 object-cover rounded-xl mb-3 md:mb-0 md:mr-6 group-hover:scale-105 transition-transform duration-300" />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300">{car.name}</div>
                      <div className="mb-1 text-sm">Type: <span className="font-medium">{car.vehicle_type}</span></div>
                      <div className="mb-1 text-sm">Seats: <span className="font-medium">{car.seats}</span></div>
                      <div className="mb-1 text-sm">Location: <span className="font-medium">{car.location_name}</span></div>
                      <div className="mb-2 text-xl font-bold">${car.price}/day</div>
                      <button
                        className="mt-2 bg-black text-white rounded py-2 font-semibold transition-all duration-300 hover:bg-gray-200 hover:text-black hover:scale-105 w-40"
                        onClick={() => { setSelectedCar(car); setShowModal(true); }}
                      >
                        See Info
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10">
                  No cars found for selected filters.
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Rental Form */}
          <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg border border-black">
            <h3 className="text-2xl font-bold mb-6">Search Cars</h3>
            <form onSubmit={handleSearch}>
              {/* Pickup Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Pickup Location</label>
                <div className="flex items-center border border-black rounded px-2 py-1">
                  <MapPin className="w-5 h-5 mr-2" />
                  <input
                    type="text"
                    placeholder="Enter pickup location..."
                    className="flex-1 bg-transparent outline-none"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                  />
                </div>
                {pickupLatLng && (
                  <div className="mt-2 h-48 rounded-lg overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={pickupLatLng}
                      zoom={12}
                      onClick={e => {
                        const lat = e.latLng?.lat();
                        const lng = e.latLng?.lng();
                        if (lat && lng) {
                          setPickupLatLng({ lat, lng });
                        }
                      }}
                    >
                      <Marker position={pickupLatLng} />
                    </GoogleMap>
                  </div>
                )}
              </div>

              {/* Dropoff Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Dropoff Location</label>
                <div className="flex items-center border border-black rounded px-2 py-1">
                  <MapPin className="w-5 h-5 mr-2" />
                  <input
                    type="text"
                    placeholder="Enter dropoff location..."
                    className="flex-1 bg-transparent outline-none"
                    value={dropoffLocation}
                    onChange={e => setDropoffLocation(e.target.value)}
                  />
                </div>
                {dropoffLatLng && (
                  <div className="mt-2 h-48 rounded-lg overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={dropoffLatLng}
                      zoom={12}
                      onClick={e => {
                        const lat = e.latLng?.lat();
                        const lng = e.latLng?.lng();
                        if (lat && lng) {
                          setDropoffLatLng({ lat, lng });
                        }
                      }}
                    >
                      <Marker position={dropoffLatLng} />
                    </GoogleMap>
                  </div>
                )}
              </div>

              {/* Pickup Date and Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Pickup Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-black rounded px-2 py-1">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      className="rounded-md"
                    />
                  </div>
                  <div className="border border-black rounded px-2 py-1">
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={e => setPickupTime(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Return Date and Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Return Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-black rounded px-2 py-1">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      className="rounded-md"
                    />
                  </div>
                  <div className="border border-black rounded px-2 py-1">
                    <input
                      type="time"
                      value={returnTime}
                      onChange={e => setReturnTime(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Driver Age Requirement */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-2">
                  <div className="text-yellow-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Driver Age Requirement</h4>
                    <p className="text-sm text-gray-600">Driver must be 30 years or older to rent a car.</p>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className={`w-full bg-black text-white rounded-full py-3 font-bold text-lg hover:bg-gray-900 transition ${!isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isAuthenticated || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Searching...
                  </>
                ) : (
                  'SEARCH CARS'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Car Info Modal */}
        {showModal && selectedCar && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-2 p-0 overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col md:flex-row gap-0">
                {/* Car Image and Name */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 min-w-[320px]">
                  <img src={selectedCar.image} alt={selectedCar.name} className="w-72 h-40 object-contain mb-4" />
                  <div className="text-2xl font-bold mb-1">{selectedCar.vehicle_type}</div>
                  <div className="text-gray-700 mb-2">{selectedCar.name}</div>
                </div>
                {/* Info Section */}
                <div className="flex-1 p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Price Includes */}
                    <div className="flex-1 mb-6 md:mb-0">
                      <div className="font-bold mb-2">PRICE INCLUDES</div>
                      <ul className="space-y-2 text-base">
                        <li className="flex items-center text-black"><span className="text-green-600 text-lg mr-2">✔</span> Unlimited Mileage</li>
                        <li className="flex items-center text-black"><span className="text-green-600 text-lg mr-2">✔</span> Collision Damage Waiver</li>
                        <li className="flex items-center text-black"><span className="text-green-600 text-lg mr-2">✔</span> Theft Protection</li>
                        <li className="flex items-center text-black"><span className="text-green-600 text-lg mr-2">✔</span> Local Taxes</li>
                      </ul>
                    </div>
                    {/* Price Options */}
                    <div className="flex-1 flex gap-8">
                      <div className="flex flex-col items-center border-r border-gray-300 pr-8">
                        <div className="font-semibold text-gray-700 mb-1">PAY ON COLLECTION</div>
                        <div className="text-2xl font-extrabold mb-2">${selectedCar.price_total}</div>
                        <button
                          className={`border-2 border-black text-black rounded-full px-8 py-2 font-bold mb-1 bg-white hover:scale-105 hover:bg-black hover:text-white transition-all duration-200 ${!isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`}
                          disabled={!isAuthenticated}
                          title={!isAuthenticated ? 'You must be signed in to choose a plan' : ''}
                        >
                          CHOOSE
                        </button>
                        <div className="text-xs text-gray-600 flex items-center gap-1">Free cancellation* <span className="text-black">?</span></div>
                      </div>
                      <div className="flex flex-col items-center pl-8">
                        <div className="font-semibold text-gray-700 mb-1">PAY NOW</div>
                        <div className="text-2xl font-extrabold mb-2">${selectedCar.price}</div>
                        <button
                          className={`bg-black text-white rounded-full px-8 py-2 font-bold mb-1 hover:scale-105 hover:bg-white hover:text-black border-2 border-black transition-all duration-200 ${!isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`}
                          disabled={!isAuthenticated}
                          title={!isAuthenticated ? 'You must be signed in to choose a plan' : ''}
                        >
                          CHOOSE
                        </button>
                        <div className="text-xs text-gray-600">SAVE ${selectedCar.price_total - selectedCar.price}</div>
                      </div>
                    </div>
                  </div>
                  {/* Features Bar */}
                  <div className="mt-8 bg-gray-100 border-t border-gray-200 flex flex-wrap items-center gap-6 px-6 py-4 rounded-b-2xl">
                    <span className="font-bold text-gray-800 flex items-center gap-2"><span className="text-xl">#</span>{selectedCar.vehicle_type}</span>
                    <span className="flex items-center gap-1 text-gray-700"><span className="text-xl">👥</span> {selectedCar.seats} seats</span>
                    <span className="flex items-center gap-1 text-gray-700"><span className="text-xl">⚙️</span> {selectedCar.transmission}</span>
                    <span className="flex items-center gap-1 text-gray-700"><span className="text-xl">⛽</span> Petrol/Diesel</span>
                    <span className="flex items-center gap-1 text-gray-700"><span className="text-xl">❄️</span> Air Con</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TravelistaLayout>
  );
};

export default RentCar; 