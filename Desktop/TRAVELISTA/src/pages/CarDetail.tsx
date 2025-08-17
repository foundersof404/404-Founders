import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import TravelistaLayout from '@/components/TravelistaLayout';
import { getVehicleDetails, getVehicleSupplierDetails, getVehicleSupplierRatings, getVehicleSupplierReview } from '../lib/carRentalApi';
import { searchTaxiLocation, searchTaxi } from '../lib/taxiApi';
import { FaCarSide, FaTaxi, FaSuitcase, FaUserFriends, FaCogs, FaCheckCircle } from 'react-icons/fa';
import { MOCKED_CARS } from '../lib/mockedCars';

const CarDetail = () => {
  const { vehicle_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [ratings, setRatings] = useState<any>(null);
  const [reviews, setReviews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract search_key from query params
  const searchParams = new URLSearchParams(location.search);
  const search_key = searchParams.get('search_key') || '';

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      // If search_key is a mock, use local data
      if (search_key.startsWith('mock_')) {
        let city = '';
        if (search_key.startsWith('mock_beirut')) city = 'beirut';
        else if (search_key.startsWith('mock_paris')) city = 'paris';
        else if (search_key.startsWith('mock_london')) city = 'london';
        if (city && MOCKED_CARS[city]) {
          const found = MOCKED_CARS[city].find(car => car.vehicle_id === vehicle_id && car.search_key === search_key);
          setCar(found || null);
          setLoading(false);
          return;
        }
      }
      try {
        const details = await getVehicleDetails({ vehicle_id, search_key, units: 'metric', currency_code: 'USD', languagecode: 'en-us' });
        setCar(details?.data);
        if (details?.data?.supplier_id) {
          const supplierData = await getVehicleSupplierDetails({ supplier_id: details.data.supplier_id, languagecode: 'en-us' });
          setSupplier(supplierData?.data);
          const ratingsData = await getVehicleSupplierRatings({ supplier_id: details.data.supplier_id, languagecode: 'en-us' });
          setRatings(ratingsData?.data);
          const reviewsData = await getVehicleSupplierReview({ supplier_id: details.data.supplier_id, languagecode: 'en-us' });
          setReviews(reviewsData?.data);
        }
      } catch (err: any) {
        setError('Failed to fetch car details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (vehicle_id && search_key) fetchDetails();
  }, [vehicle_id, search_key]);

  if (loading) {
    return (
      <TravelistaLayout>
        <div className="min-h-screen flex items-center justify-center text-xl">Loading car details...</div>
      </TravelistaLayout>
    );
  }
  if (error) {
    return (
      <TravelistaLayout>
        <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error}</div>
      </TravelistaLayout>
    );
  }
  if (!car) {
    return (
      <TravelistaLayout>
        <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">Car not found.</div>
      </TravelistaLayout>
    );
  }

  return (
    <TravelistaLayout>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <button className="mb-8 text-blue-600 underline hover:text-blue-800 transition" onClick={() => navigate(-1)}>&larr; Back to results</button>
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 border border-gray-200">
          <div className="flex-shrink-0 w-full md:w-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-inner p-6">
            {car.image_url || car.image ? (
              <img src={car.image_url || car.image} alt={car.name} className="w-full h-64 object-contain rounded-xl drop-shadow-xl" />
            ) : (
              <span className="text-7xl text-blue-200"><FaCarSide /></span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-4 justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow">Top Pick</span>
                <span className="font-extrabold text-3xl text-gray-900 tracking-tight">{car.name || 'Car'}</span>
                <span className="text-gray-400 font-normal text-lg">or similar {car.vehicle_type}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-base mb-3 text-gray-700">
                <span className="flex items-center gap-1"><FaUserFriends className="text-blue-400" /> {car.seats || 5} seats</span>
                <span className="flex items-center gap-1"><FaSuitcase className="text-blue-400" /> {car.large_bags || 1} Large bag</span>
                <span className="flex items-center gap-1"><FaSuitcase className="text-blue-200" /> {car.small_bags || 1} Small bag</span>
                <span className="flex items-center gap-1"><FaCogs className="text-blue-400" /> {car.transmission || 'Manual'}</span>
                <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500" /> Unlimited mileage</span>
              </div>
              <div className="text-blue-700 underline text-base mb-2 font-medium">{car.location_name}</div>
              {supplier && (
                <div className="flex items-center gap-3 mb-2">
                  {supplier.logo && <img src={supplier.logo} alt="Supplier" className="w-12 h-12 rounded-full shadow" />}
                  <span className="font-bold text-lg">{supplier.name}</span>
                  {ratings && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold shadow">{ratings.rating}</span>}
                  <span className="text-xs text-gray-500">{ratings?.review_count || '1000+'} reviews</span>
                </div>
              )}
              <div className="flex flex-col gap-1 mb-2">
                <span className="font-semibold">Features:</span>
                <span className="text-gray-700">{car.features?.join(', ') || 'Standard features'}</span>
              </div>
              <div className="flex flex-col gap-1 mb-2">
                <span className="font-semibold">Cancellation Policy:</span>
                <span className="text-green-700">Free cancellation</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <span className="font-semibold text-lg text-gray-700">Price:</span>
              <span className="text-4xl font-extrabold text-blue-700 drop-shadow">US${car.price_total || car.price}</span>
              <button className="mt-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200">Book Now</button>
            </div>
          </div>
        </div>
        {reviews && reviews.reviews && reviews.reviews.length > 0 && (
          <div className="mt-10 bg-white/80 rounded-2xl shadow p-6 border border-gray-100">
            <div className="font-bold text-xl mb-3 text-gray-800">Supplier Reviews</div>
            <ul className="list-disc ml-6 space-y-2">
              {reviews.reviews.slice(0, 5).map((review: any, idx: number) => (
                <li key={idx} className="text-gray-700 italic">{review.comment}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </TravelistaLayout>
  );
};

export default CarDetail; 