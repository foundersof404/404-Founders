import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';
import TravelistaLayout from '@/components/TravelistaLayout';
import FadeInOnScroll from '@/components/FadeInOnScroll';
import {
  searchDestination,
  searchCarRentals,
  getVehicleDetails,
  getVehicleSupplierDetails,
  getVehicleSupplierRatings,
  getVehicleSupplierReview
} from '../lib/carRentalApi';
import { MOCKED_CARS } from '../lib/mockedCars';

const carTypes = [
  { label: 'Medium car', icon: '🚗', value: 'medium' },
  { label: 'Small car', icon: '🚙', value: 'small' },
  { label: 'Large car', icon: '🚐', value: 'large' },
  { label: 'SUVs', icon: '🚙', value: 'suv' },
  { label: 'People carrier', icon: '🚐', value: 'people_carrier' },
  { label: 'Premium car', icon: '🏎️', value: 'premium' },
];

const Car = () => {
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [sortBy, setSortBy] = useState('Recommended');
  const [selectedType, setSelectedType] = useState('');
  const [filter, setFilter] = useState({});
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [showDetails, setShowDetails] = useState<any | null>(null);
  const [supplierDetails, setSupplierDetails] = useState<any | null>(null);
  const [supplierRatings, setSupplierRatings] = useState<any | null>(null);
  const [supplierReviews, setSupplierReviews] = useState<any | null>(null);

  // Set default dates on component mount
  useEffect(() => {
    // Set pickup date to 4 hours from now
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + (4 * 60 * 60 * 1000));
    const tomorrow = new Date(fourHoursFromNow);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Format time as HH:mm
    const formatTime = (date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };
    
    setPickupDate(formatDate(fourHoursFromNow));
    setPickupTime(formatTime(fourHoursFromNow));
    setDropoffDate(formatDate(tomorrow));
    setDropoffTime(formatTime(fourHoursFromNow));
  }, []);

  // Format date for the API (YYYY-MM-DD)
  const formatDateForApi = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return parts.join('-');
  };

  // Validate pickup date and time
  const validatePickupDateTime = (date: string, time: string) => {
    const pickupDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + (4 * 60 * 60 * 1000));
    
    if (pickupDateTime < fourHoursFromNow) {
      toast({
        title: 'Invalid Pickup Time',
        description: 'Pickup must be at least 4 hours from now.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  // Robust autocomplete location using /searchDestination for any non-empty input
  const handleLocationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);
    if (!query) {
      setLocationResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await searchDestination(query);
      console.log('Location search results:', response.data);
      setLocationResults(response.data || []);
    } catch (err) {
      console.error('Error searching locations:', err);
      setLocationResults([]);
      setError(`Failed to search locations: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Select location from autocomplete
  const handleLocationSelect = (loc: any) => {
    console.log('Selected location:', loc);
    setSelectedLocation(loc);
    setLocationQuery(loc.name);
    setLocationResults([]);
  };

  // Search cars only after location is selected
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      toast({
        title: 'Missing Information',
        description: 'Please select a location from the dropdown suggestions.',
        variant: 'destructive',
      });
      setError('You must select a location from the dropdown suggestions. Typing in a location without selecting is not enough.');
      return;
    }
    if (!pickupDate || !dropoffDate) {
      toast({
        title: 'Missing Information',
        description: 'Please select pick-up and drop-off dates.',
        variant: 'destructive',
      });
      setError('Please select pick-up and drop-off dates.');
      return;
    }
    if (!validatePickupDateTime(pickupDate, pickupTime)) {
      return;
    }
    setLoading(true);
    setError('');
    setCars([]);
    setShowSummary(false);
    const lat = selectedLocation.lat || selectedLocation.latitude || 0;
    const lng = selectedLocation.lng || selectedLocation.longitude || 0;
    const country = selectedLocation.country || selectedLocation.country_code || 'US';
    const params = {
      pick_up_latitude: lat.toString(),
      pick_up_longitude: lng.toString(),
      drop_off_latitude: lat.toString(),
      drop_off_longitude: lng.toString(),
      pick_up_date: formatDateForApi(pickupDate),
      drop_off_date: formatDateForApi(dropoffDate),
      pick_up_time: pickupTime,
      drop_off_time: dropoffTime,
      driver_age: '30',
      currency_code: 'USD',
      location: country,
    };
    try {
      // Check for mocked locations
      const locName = (selectedLocation.name || '').toLowerCase();
      let city = '';
      if (locName.includes('beirut')) city = 'beirut';
      else if (locName.includes('paris')) city = 'paris';
      else if (locName.includes('london')) city = 'london';
      if (city && MOCKED_CARS[city]) {
        setTimeout(() => {
          setCars(MOCKED_CARS[city]);
          setCurrentCarIndex(0);
          setShowSummary(true);
          setLoading(false);
        }, 500);
        return;
      }
      const data = await searchCarRentals(params);
      const carList = data.data.car_list || [];
      const searchKey = data.data.search_key || '';
      const carListWithSearchKey = carList.map(car => ({ ...car, search_key: car.search_key || searchKey }));
      setCars(carListWithSearchKey);
      setCurrentCarIndex(0);
      setShowSummary(true);
      if (carList.length === 0) {
        setError(`No cars found for your search criteria in ${selectedLocation.name}. The API might be having issues or there might be no availability for your dates.`);
      }
    } catch (err: any) {
      console.error('Car search error:', err);
      let errorMessage = `Error searching for cars: ${err.message || 'Unknown error'}`;
      if (err.response) {
        const status = err.response.status;
        errorMessage += `\nAPI Status: ${status}`;
        if (status === 404) {
          errorMessage += '\nThe Booking.com API could not find results for this location.';
        } else if (status === 429) {
          errorMessage += '\nThe API request limit has been reached. Please try again later.';
        } else if (status === 401 || status === 403) {
          errorMessage += '\nAPI authentication error. Please check the API key.';
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filtering by car type
  const filteredCars = selectedType
    ? cars.filter((car) => (car.vehicle_type || '').toLowerCase().includes(selectedType))
    : cars;
  const carToShow = filteredCars[currentCarIndex] || null;

  // Show car details, supplier info, and reviews
  const handleShowDetails = async (car: any) => {
    setShowDetails(null);
    setSupplierDetails(null);
    setSupplierRatings(null);
    setSupplierReviews(null);
    try {
      const details = await getVehicleDetails({
        vehicle_id: car.vehicle_id,
        search_key: car.search_key,
        units: 'metric',
        currency_code: 'USD',
        languagecode: 'en-us',
      });
      setShowDetails(details?.data);
      const supplier = await getVehicleSupplierDetails({
        supplier_id: car.supplier_id,
        languagecode: 'en-us',
      });
      setSupplierDetails(supplier?.data);
      const ratings = await getVehicleSupplierRatings({
        supplier_id: car.supplier_id,
        languagecode: 'en-us',
      });
      setSupplierRatings(ratings?.data);
      const reviews = await getVehicleSupplierReview({
        supplier_id: car.supplier_id,
        languagecode: 'en-us',
      });
      setSupplierReviews(reviews?.data);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch car details.', variant: 'destructive' });
    }
  };

  // Handle view deal
  const handleViewDeal = (car: any) => {
    navigate(`/car/${car.vehicle_id}?search_key=${encodeURIComponent(car.search_key)}`);
  };

  return (
    <TravelistaLayout>
      <div className="min-h-screen bg-white font-inter">
        <FadeInOnScroll>
          <div className="flex flex-col items-center justify-center pt-16 pb-10 px-4">
            <div className="text-center mb-10">
              <div className="text-xs font-semibold tracking-widest text-[hsl(214,57%,51%)]/60 mb-2 uppercase">RENT A CAR</div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[hsl(214,57%,51%)] mb-4">Find Your Perfect Ride</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Search for car rentals across multiple locations. Try major cities like London, Paris, or New York for best results.
                <br/><span className="text-xs">(Note: This service uses the Booking.com API which may have coverage limitations in some regions)</span>
              </p>
            </div>
            <form onSubmit={handleSearch} className="w-full max-w-5xl mx-auto flex items-center gap-2 bg-white border-2 border-yellow-400 rounded-xl p-4 mt-8 mb-6 shadow">
              <div className="flex-1 flex items-center gap-2 relative">
                <span className="text-xl text-gray-400">🔍</span>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={handleLocationInput}
                  placeholder="Pick-up location"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                />
                {locationResults.length > 0 && (
                  <div className="absolute z-10 w-full left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    {locationResults.map((loc) => (
                      <button
                        key={loc.id || loc.name}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-2">📍</span>
                          <div>
                            <div>{loc.name}</div>
                            <div className="text-xs text-gray-500">{loc.lat}, {loc.lng} - {loc.country || 'Unknown'}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedLocation && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Selected
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Pick-up date</label>
                <input 
                  type="date" 
                  value={pickupDate} 
                  onChange={e => {
                    const newDate = e.target.value;
                    if (validatePickupDateTime(newDate, pickupTime)) {
                      setPickupDate(newDate);
                    }
                  }} 
                  className="rounded-lg border border-gray-200 px-2 py-1" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Time</label>
                <input 
                  type="time" 
                  value={pickupTime} 
                  onChange={e => {
                    const newTime = e.target.value;
                    if (validatePickupDateTime(pickupDate, newTime)) {
                      setPickupTime(newTime);
                    }
                  }} 
                  className="rounded-lg border border-gray-200 px-2 py-1" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Drop-off date</label>
                <input type="date" value={dropoffDate} onChange={e => setDropoffDate(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Time</label>
                <input type="time" value={dropoffTime} onChange={e => setDropoffTime(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold ml-2">Search</button>
            </form>
            <div className="flex items-center gap-4 max-w-5xl mx-auto mb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={differentDropoff} onChange={e => setDifferentDropoff(e.target.checked)} />
                Drop car off at different location
              </label>
            </div>
            
            {/* Loading indicator */}
            {loading && (
              <div className="max-w-5xl mx-auto text-center py-8">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                <div className="text-gray-600">Searching for cars...</div>
              </div>
            )}
            
            {/* Error display */}
            {error && !loading && (
              <div className="max-w-5xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-6">
                <div className="font-semibold flex items-center gap-2 mb-2">
                  <span>⚠️</span> Error
                </div>
                <p className="whitespace-pre-line">{error}</p>
                {error.includes('No cars found') && (
                  <div className="mt-4 text-sm text-gray-600 p-3 bg-gray-100 rounded">
                    <p className="font-semibold mb-1">Possible reasons:</p>
                    <ul className="list-disc list-inside">
                      <li>API limitations or rate limiting</li>
                      <li>No cars available for the selected dates</li>
                      <li>Booking.com may not have coverage for this location</li>
                      <li>The API key may need to be updated</li>
                    </ul>
                    <p className="mt-2">Try another location or different dates. Major cities like London, Paris, or New York may have better availability.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Developer Debug Information - only in development */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="max-w-5xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6 text-xs font-mono">
                <details>
                  <summary className="font-bold cursor-pointer">Debug Information</summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="font-semibold">Location Query:</div>
                      <pre className="bg-gray-100 p-2 rounded">{locationQuery || 'Not set'}</pre>
                    </div>
                    <div>
                      <div className="font-semibold">Selected Location:</div>
                      <pre className="bg-gray-100 p-2 rounded">{selectedLocation ? JSON.stringify(selectedLocation, null, 2) : 'Not selected'}</pre>
                    </div>
                    <div>
                      <div className="font-semibold">Search Parameters:</div>
                      <pre className="bg-gray-100 p-2 rounded">
                        Pick-up: {pickupDate} {pickupTime}{'\n'}
                        Drop-off: {dropoffDate} {dropoffTime}{'\n'}
                        Different Drop-off: {differentDropoff ? 'Yes' : 'No'}
                      </pre>
                    </div>
                    <div>
                      <div className="font-semibold">Location Results:</div>
                      <pre className="bg-gray-100 p-2 rounded max-h-40 overflow-auto">
                        {locationResults.length > 0 ? JSON.stringify(locationResults, null, 2) : 'No results'}
                      </pre>
                    </div>
                  </div>
                </details>
              </div>
            )}
            
            {/* Summary Box */}
            {showSummary && selectedLocation && (
              <div className="max-w-5xl mx-auto bg-white border-2 border-yellow-400 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="font-bold text-lg">{selectedLocation.name}</div>
                    <div className="text-xs text-gray-500">{pickupDate} {pickupTime}</div>
                  </div>
                  <span className="text-2xl">→</span>
                  <div>
                    <div className="font-bold text-lg">{selectedLocation.name}</div>
                    <div className="text-xs text-gray-500">{dropoffDate} {dropoffTime}</div>
                  </div>
                </div>
                
                {/* Special location notice */}
                {(selectedLocation.country?.toLowerCase() === 'lb' || 
                  selectedLocation.name?.toLowerCase().includes('beirut') || 
                  (selectedLocation.lat === 33.8938 && selectedLocation.lng === 35.5018)) && (
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm mt-2 md:mt-0 md:mx-4">
                    Limited API coverage area
                  </div>
                )}
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold mt-3 md:mt-0" onClick={() => setShowSummary(false)}>Edit</button>
              </div>
            )}
            {/* Map and Filter Sidebar */}
            {showSummary && (
              <div className="max-w-7xl mx-auto flex gap-6">
                <div className="w-1/4 min-w-[220px]">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">Show on map</div>
                    <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg">Show on map</button>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="font-bold mb-2">Filter</div>
                    <div className="text-sm font-semibold mb-1">Location</div>
                    <div className="flex flex-col gap-1 mb-2">
                      <label><input type="checkbox" /> Airport (in terminal)</label>
                      <label><input type="checkbox" /> Airport (meet & greet)</label>
                      <label><input type="checkbox" /> All other locations</label>
                    </div>
                    <div className="text-sm font-semibold mb-1">Price per day</div>
                    <div className="flex flex-col gap-1 mb-2">
                      <label><input type="checkbox" /> US$0 - US$50</label>
                      <label><input type="checkbox" /> US$50 - US$100</label>
                      <label><input type="checkbox" /> US$100 - US$150</label>
                    </div>
                    <button className="text-blue-600 text-xs mt-2">Clear all filters</button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-xl">{filteredCars.length} cars available</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Sort by:</span>
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded border px-2 py-1">
                        <option>Recommended</option>
                        <option>Price (low to high)</option>
                        <option>Price (high to low)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    {carTypes.map(type => (
                      <button
                        key={type.value}
                        className={`flex flex-col items-center px-3 py-2 rounded-lg border ${selectedType === type.value ? 'bg-blue-100 border-blue-400' : 'border-gray-200'} text-xs`}
                        onClick={() => setSelectedType(type.value)}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {/* No Results State */}
                  {filteredCars.length === 0 && !loading && (
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold mb-2">No cars available</h3>
                      <p className="text-gray-600 mb-4">We couldn't find any cars matching your search criteria.</p>
                      <p className="text-gray-600 mb-4">Try adjusting your dates or location.</p>
                    </div>
                  )}
                  {/* All Cars List */}
                  <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                    <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                      <strong>Note:</strong> Driver must be 30 years or older to rent a car.
                    </div>
                    {filteredCars.map((car, idx) => (
                      <div key={car.vehicle_id || idx} className="bg-white rounded-xl shadow p-6 flex gap-6 items-center mb-2">
                        <div className="w-48 h-32 flex items-center justify-center bg-gray-100 rounded">
                          {car.image_url || car.image ? (
                            <img src={car.image_url || car.image} alt={car.name} className="w-48 h-32 object-contain rounded" />
                          ) : (
                            <span className="text-4xl">🚗</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded">Top Pick</span>
                            <span className="font-bold text-lg">{car.name || 'Car'} <span className="text-gray-500 font-normal text-base">or similar {car.vehicle_type}</span></span>
                          </div>
                          <div className="flex gap-4 text-sm mb-2">
                            <span>🚗 {car.seats || 5} seats</span>
                            <span>🧳 {car.large_bags || 1} Large bag</span>
                            <span>🧳 {car.small_bags || 1} Small bag</span>
                            <span>⚙️ {car.transmission || 'Manual'}</span>
                            <span>∞ Unlimited mileage</span>
                          </div>
                          <div className="text-blue-700 underline text-sm mb-2">{car.location_name || (selectedLocation && selectedLocation.name)}</div>
                          <div className="flex items-center gap-2 mb-2">
                            {car.supplier_logo && <img src={car.supplier_logo} alt="Supplier" className="w-8 h-8 rounded" />}
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{car.supplier_rating || '7.9'}</span>
                            <span className="text-xs text-gray-500">1000+ reviews</span>
                          </div>
                          <div className="flex gap-4 mt-2">
                            <button className="text-blue-700 text-xs">Important info</button>
                            <button className="text-blue-700 text-xs">Email quote</button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end min-w-[160px]">
                          <div className="text-xs text-gray-500 mb-1">Price for {Math.max(1, (new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000*60*60*24))} days:</div>
                          <div className="text-2xl font-bold mb-1">US${car.price_total || car.price}</div>
                          <div className="text-green-600 text-xs mb-2">Free cancellation</div>
                          <button
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                            onClick={() => {
                              if (!car.search_key) {
                                console.warn('Missing search_key for car', car);
                                return;
                              }
                              navigate(`/car/${car.vehicle_id}?search_key=${encodeURIComponent(car.search_key)}`);
                            }}
                            disabled={!car.search_key}
                            title={!car.search_key ? 'This car is missing a search key and cannot be viewed in detail.' : ''}
                          >
                            View deal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Car Details Modal */}
            {showDetails && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowDetails(null)}>&times;</button>
                  <h2 className="text-2xl font-bold mb-2">{showDetails.name}</h2>
                  <img src={showDetails.image_url || showDetails.image || ''} alt={showDetails.name} className="w-full h-48 object-cover mb-4" />
                  <div className="mb-2">Type: {showDetails.vehicle_type}</div>
                  <div className="mb-2">Price: ${showDetails.price_total || showDetails.price}</div>
                  <div className="mb-2">Features: {showDetails.features?.join(', ')}</div>
                  {supplierDetails && (
                    <div className="mb-2">Supplier: {supplierDetails.name}</div>
                  )}
                  {supplierRatings && (
                    <div className="mb-2">Supplier Rating: {supplierRatings.rating}</div>
                  )}
                  {supplierReviews && supplierReviews.reviews && (
                    <div className="mb-2">
                      <div className="font-semibold">Supplier Reviews:</div>
                      <ul className="list-disc ml-6">
                        {supplierReviews.reviews.slice(0, 3).map((review: any, idx: number) => (
                          <li key={idx}>{review.comment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </FadeInOnScroll>
      </div>
    </TravelistaLayout>
  );
};

export default Car; 