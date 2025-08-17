import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import AttractionGrid from '../components/AttractionGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { searchAttractions } from '../services/attractionApi';
import { MapPin, Star, Calendar, Users, Sparkles, Globe, Shield } from 'lucide-react';
import {
  getAttractionDetails,
  getAvailabilityCalendar,
  getAvailability,
  getAttractionReviews,
} from '../services/attractionApi';
import AttractionCard from '../components/AttractionCard';
import TravelistaLayout from '@/components/TravelistaLayout';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [details, setDetails] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const handleSearch = async (query: string) => {
    console.log('Searching for attractions in:', query);
    setSearchQuery(query);
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setUsedFallback(false);
    
    try {
      const results = await searchAttractions(query);
      if (results.length === 0) {
        setError('No attractions found for this location. Please try a different destination.');
        setAttractions([]);
      } else {
      setAttractions(results);
        setUsedFallback(results.some(a => a.id && a.id.startsWith('fallback-')));
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to find attractions. Please try a different destination or check your internet connection.');
      setAttractions([]);
      setUsedFallback(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (attraction) => {
    setSelectedAttraction(attraction);
    setDetails(null);
    setCalendar([]);
    setAvailability([]);
    setReviews([]);
    setDetailsLoading(true);
    setDetailsError(null);
    setCalendarLoading(true);
    setReviewsLoading(true);
    setAvailabilityLoading(true);

    try {
      // Fetch details, availability, and reviews in parallel
      const [d, a, r] = await Promise.all([
        getAttractionDetails(attraction.productSlug),
        getAvailability(attraction.productSlug),
        getAttractionReviews(attraction.productId, true),
      ]);

      if (!d) {
        throw new Error('Failed to load attraction details');
      }

      setDetails(d);
      setAvailability(a || []);
      setReviews(r || []);
      setAvailabilityLoading(false);
      setReviewsLoading(false);

      // Try to fetch calendar separately - if it fails, we'll just show the time slots
      try {
        const c = await getAvailabilityCalendar(attraction.productSlug);
        setCalendar(c || []);
      } catch (calendarErr) {
        console.log('Calendar data not available, showing time slots only');
        setCalendar([]);
      } finally {
        setCalendarLoading(false);
      }
    } catch (err) {
      console.error('Error loading attraction details:', err);
      setDetailsError('Failed to load attraction details. Please try again later.');
      setAvailabilityLoading(false);
      setReviewsLoading(false);
      setCalendarLoading(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedAttraction(null);
    setDetails(null);
    setCalendar([]);
    setAvailability([]);
    setReviews([]);
    setDetailsError(null);
  };

  // Stripe Checkout handler
  const handleBookNow = async (offer, details) => {
    // Ensure we have a real price from the API
    if (!offer.realPrice) {
      alert('Sorry, this attraction is currently unavailable for booking. Please try again later.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `${details?.name || 'Attraction'} - ${offer.availabilityType}`,
          price: offer.realPrice,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start payment session.');
      }
    } catch (err) {
      alert('Payment error: ' + err.message);
    }
  };

  return (
    <TravelistaLayout>
      <div className="min-h-screen bg-white">
        {/* Modern Hero Section */}
        <div className="relative min-h-[40vh] flex items-center justify-center bg-white">
          {/* Hero Content */}
          <div className="relative w-full text-center px-6 py-16 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(197,100%,36%)]">
              Discover the World with <span className="text-[hsl(214,57%,51%)]">Travelista</span>
            </h1>
            <p className="text-lg md:text-2xl text-light blue-700 font-medium mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
              Explore the world's most incredible destinations and create unforgettable memories with our curated collection of attractions.
            </p>
            {/* Animated Search Bar */}
            <div className="w-full max-w-2xl mx-auto mb-2 animate-fade-in-up delay-200">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
            <div className="my-8"></div>
            <a
              href="#explore"
              className="inline-block px-12 py-4 font-bold text-xl rounded-2xl shadow-lg transition-all duration-300 animate-bounce"
              style={{
                letterSpacing: '0.03em',
                background: 'linear-gradient(90deg, hsl(214, 57%, 51%) 0%, hsl(197, 100%, 36%) 100%)',
                color: 'white',
                border: 'none',
              }}>
              Start Exploring
            </a>
          </div>
        </div>

        {/* Enhanced Features Section */}
        {!hasSearched && (
          <div className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-[hsl(214,57%,51%)]">Why Choose Our Platform?</h2>
                <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Experience the best attractions with our curated selection, professional service, and seamless booking
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  {
                    icon: MapPin,
                    title: "Curated Locations",
                    description: "Handpicked attractions in the world's most beautiful destinations, verified by travel experts",
                    gradient: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: Star,
                    title: "Premium Quality",
                    description: "Only the highest-rated attractions with verified reviews from real travelers worldwide",
                    gradient: "from-blue-600 to-blue-700"
                  },
                  {
                    icon: Shield,
                    title: "Secure Booking",
                    description: "Quick and secure booking with instant confirmation, flexible cancellation, and 24/7 support",
                    gradient: "from-blue-700 to-blue-800"
                  }
                ].map((feature, index) => (
                  <div 
                    key={feature.title}
                    className="text-center group transition-all duration-500 p-6 rounded-3xl bg-white shadow-lg border border-[hsl(214,57%,51%)]/10 hover:border-[hsl(214,57%,51%)] hover:shadow-xl"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`} style={{background: `linear-gradient(135deg, hsl(214, 57%, 45%) 0%, hsl(214, 57%, 55%) 100%)`}}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-[hsl(214,57%,51%)] group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Results Section */}
        {hasSearched && (
          <div className="py-12 bg-white min-h-screen">
            <div className="container mx-auto px-6">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="text-center">
                <ErrorMessage message={error} onRetry={() => handleSearch(searchQuery)} />
                  <div className="mt-4 text-gray-600">
                    <p>Suggestions:</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Try a different city or location</li>
                      <li>Check your spelling</li>
                      <li>Try a more specific location</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-[hsl(214,57%,51%)]">
                      Attractions in <span className="text-[hsl(214,57%,51%)]">{searchQuery}</span>
                    </h2>
                    <p className="text-base text-gray-600">
                      {attractions.length} amazing experiences waiting for you
                    </p>
                    <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-[hsl(214,57%,51%)]"></div>
                    {usedFallback && (
                      <div className="text-yellow-600 text-center mt-6 bg-yellow-50 p-4 rounded-lg">
                        <p className="font-semibold">Sample Data Shown</p>
                        <p className="text-sm mt-1">No real attractions found for this destination. Showing sample attractions instead.</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {attractions.map((a) => (
                      <div key={a.id} onClick={() => handleCardClick(a)} className="cursor-pointer">
                        <div className="bg-white rounded-3xl shadow-lg border border-[hsl(214,57%,51%)]/10 hover:border-[hsl(214,57%,51%)] hover:shadow-xl transition-all duration-300">
                          <AttractionCard attraction={a} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {selectedAttraction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh] border border-[hsl(214,57%,51%)]/10" onClick={e => e.stopPropagation()}>
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
              {detailsLoading ? (
                <LoadingSpinner />
              ) : detailsError ? (
                <ErrorMessage message={detailsError} onRetry={() => handleCardClick(selectedAttraction)} />
              ) : (
                <>
                  {/* Name and Description */}
                  <h2 className="text-2xl font-bold mb-2" style={{color: 'hsl(214, 57%, 51%)'}}>{details?.name}</h2>
                  <p className="mb-2 text-gray-700">{details?.description}</p>
                  <div className="mb-4">
                    <span className="font-semibold">Operated by:</span> {details?.operatedBy}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Free Cancellation:</span> {details?.cancellationPolicy?.hasFreeCancellation ? 'Yes' : 'No'}
                  </div>
                  {/* Photos */}
                  {details?.photos?.length > 0 && (
                    <div className="mb-4">
                      <span className="font-semibold">Photos:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {details.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo.small}
                            alt={`Attraction photo ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Addresses */}
                  {details?.addresses && (
                    <div className="mb-4">
                      <span className="font-semibold">Addresses:</span>
                      <ul className="list-disc ml-6">
                        {Object.entries(details.addresses).map(([type, arr]) =>
                          Array.isArray(arr) && arr.length > 0 ? (
                            <li key={type}>
                              <span className="capitalize">{type}:</span>
                              <ul>
                                {arr.map((addr, i) => (
                                  <li key={addr.id || i}>
                                    {addr.address}, {addr.city}, {addr.country}
                                    {addr.instructions && <div className="text-xs text-gray-500">Instructions: {addr.instructions}</div>}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ) : null
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Flags/Labels */}
                  {(Array.isArray(details?.flags) && details.flags.length > 0) || (Array.isArray(details?.labels) && details.labels.length > 0) ? (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(Array.isArray(details?.flags) ? details.flags : []).map((flag, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{flag.flag}</span>
                      ))}
                      {(Array.isArray(details?.labels) ? details.labels : []).map((label, i) => (
                        <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{label.text}</span>
                      ))}
                    </div>
                  ) : null}
                  {/* Health & Safety */}
                  {Array.isArray(details?.healthSafety) && details.healthSafety.length > 0 && (
                    <div className="mb-4">
                      <span className="font-semibold">Health & Safety:</span>
                      <ul className="list-disc ml-6">
                        {details.healthSafety.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    </div>
                  )}
                  {/* Not Included */}
                  {Array.isArray(details?.notIncluded) && details.notIncluded.length > 0 && (
                    <div className="mb-4">
                      <span className="font-semibold">Not Included:</span>
                      <ul className="list-disc ml-6">
                        {details.notIncluded.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </div>
                  )}
                  {/* Additional Info */}
                  {details?.additionalInfo && (
                    <div className="mb-4">
                      <span className="font-semibold">Additional Info:</span>
                      <div>{details.additionalInfo}</div>
                    </div>
                  )}
                  {/* Offers */}
                  {Array.isArray(details?.offers) && details.offers.length > 0 && (
                    <div className="mb-4">
                      <span className="font-semibold">Available Offers:</span>
                      <ul className="space-y-2 mt-2">
                        {details.offers
                          .map((offer, i) => {
                            // Find all slots for this offer
                            const slots = Array.isArray(availability)
                              ? availability.filter(slot =>
                                  Array.isArray(slot.timeSlotOffers) &&
                                  slot.timeSlotOffers.some(o => o.id === offer.id)
                                )
                              : [];

                            // For each slot, get the price(s)
                            const slotInfos = slots.flatMap(slot =>
                              slot.timeSlotOffers
                                .filter(o => o.id === offer.id)
                                .flatMap(tso =>
                                  (tso.items || []).map(item => ({
                                    time: slot.start,
                                    price: item.price?.chargeAmount,
                                    item,
                                    slot,
                                    offer: tso,
                                  }))
                                )
                            );

                            // Find the first valid price for this offer
                            const firstValid = slotInfos.find(info => typeof info.price === 'number' && info.price > 0);
                            if (!firstValid) return null;

                            // Only show slots/items with a valid price
                            const realSlotInfos = slotInfos.filter(info => typeof info.price === 'number' && info.price > 0);

                            // Deduplicate by time + label + price
                            const uniqueSlotInfos = [];
                            const seen = new Set();
                            for (const info of realSlotInfos) {
                              const key = `${info.time}|${info.item.label}|${info.price}`;
                              if (!seen.has(key)) {
                                seen.add(key);
                                uniqueSlotInfos.push(info);
                              }
                            }

                            return (
                              <li key={i} className="p-3 border rounded-lg bg-blue-50">
                                <div className="font-bold text-blue-800">
                                  {offer.availabilityType === 'date_time' ? 'Available Time Slot' : offer.availabilityType}
                                </div>
                                <ul className="mt-2 space-y-2">
                                  {uniqueSlotInfos.map((info, idx) => (
                                    <li key={idx} className="flex items-center justify-between">
                                      <span>
                                        {new Date(info.time).toLocaleString(undefined, {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })} — {info.item.label || 'Ticket'} — ${Number(info.price).toFixed(2)}
                                      </span>
                                      <button
                                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        onClick={() => handleBookNow({ ...offer, realPrice: Number(info.price), slot: info.slot, item: info.item }, details)}
                                      >
                                        Book Now
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            );
                          })
                          .filter(Boolean)}
                      </ul>
                    </div>
                  )}
                  {/* Availability Calendar */}
                  {calendarLoading ? (
                    <div className="mb-4">
                      <span className="font-semibold">Availability Calendar:</span>
                      <div className="mt-2">
                        <LoadingSpinner />
                      </div>
                    </div>
                  ) : Array.isArray(calendar) && calendar.length > 0 ? (
                    <div className="mb-4">
                      <span className="font-semibold">Availability Calendar:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {calendar.map((day, idx) => (
                          <span
                            key={day.date}
                            className={`px-2 py-1 rounded text-xs font-medium border ${
                              day.available
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}
                            title={day.available ? 'Available' : 'Not Available'}
                          >
                            {new Date(day.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {calendar.filter(day => day.available).length} available days from{' '}
                        {calendar[0] && new Date(calendar[0].date).toLocaleDateString()} to{' '}
                        {calendar[calendar.length - 1] && new Date(calendar[calendar.length - 1].date).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 text-gray-500 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" fill="#e0e7ff"/>
                        <path d="M8 2v4M16 2v4M3 10h18" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>This attraction does not require a date to book or has no calendar data.</span>
                    </div>
                  )}
                  {/* Time Slots Section */}
                  {availabilityLoading ? (
                    <div className="mb-4">
                      <span className="font-semibold">Upcoming Time Slots:</span>
                      <div className="mt-2">
                        <LoadingSpinner />
                      </div>
                    </div>
                  ) : availability.length > 0 ? (
                    <div className="mb-4">
                      <span className="font-semibold">Upcoming Time Slots:</span>
                      <ul className="list-disc ml-6">
                        {availability.map((slot) => (
                          <li key={slot.timeSlotId} className="py-1">
                            {new Date(slot.start).toLocaleString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} 
                            <span className="text-sm text-gray-500 ml-2">
                              ({slot.fullDay ? 'Full Day' : 'Timed'})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="mb-4 text-gray-500 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>No time slots available at the moment. Please check back later or contact the attraction directly.</span>
                    </div>
                  )}
                  {/* Reviews Section */}
                  {reviewsLoading ? (
                    <div className="mb-4">
                      <span className="font-semibold">Reviews:</span>
                      <div className="mt-2">
                        <LoadingSpinner />
                      </div>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-gray-500 mt-2">No reviews yet for this attraction.</div>
                  ) : (
                    <div className="mb-4">
                      <span className="font-semibold">Reviews:</span>
                      <ul className="divide-y divide-gray-200 mt-2">
                        {reviews.map((review) => (
                          <li key={review.id} className="py-4 flex gap-3 items-start">
                            {/* Avatar */}
                            <div>
                              {review.user?.avatar ? (
                                <img src={review.user.avatar} alt={review.user.name || 'User'} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" fill="#e5e7eb"/><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 1116 0H4z" fill="#9ca3af"/></svg>
                                </div>
                              )}
                            </div>
                            {/* Review Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                                {/* Country flag emoji if cc1 is present */}
                                {review.user?.cc1 && (
                                  <span title={review.user.cc1}>
                                    {String.fromCodePoint(
                                      ...review.user.cc1
                                        .toUpperCase()
                                        .split('')
                                        .map(c => 127397 + c.charCodeAt())
                                    )}
                                  </span>
                                )}
                                {/* Travel partner type */}
                                {Array.isArray(review.travelPartnerTypes) && review.travelPartnerTypes.length > 0 && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({review.travelPartnerTypes.join(', ')})
                                  </span>
                                )}
                                {/* Provider name */}
                                {review.providerName && (
                                  <span className="text-xs text-blue-500 ml-2">via {review.providerName}</span>
                                )}
                              </div>
                              {/* Rating as stars */}
                              <div className="flex items-center mb-1">
                                <span className="text-yellow-500 mr-2">
                                  {'★'.repeat(Math.round(review.numericRating || 0))}
                                  {'☆'.repeat(5 - Math.round(review.numericRating || 0))}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {review.numericRating}/5
                                </span>
                                {/* Date */}
                                {review.epochMs && (
                                  <span className="text-xs text-gray-400 ml-2">
                                    {new Date(review.epochMs).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {/* Content */}
                              <div className="text-gray-700">
                                {review.content || <span className="italic text-gray-400">No review text</span>}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </TravelistaLayout>
  );
};

export default Index;
