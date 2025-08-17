import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getFlightDetails, getSeatMap } from "@/services/flightApi";
import { getWeatherByCity } from "@/services/weatherApi";
import { PlaneTakeoff, PlaneLanding, Clock, Luggage, BadgeCheck, BadgeX, ArrowLeft, Download, Calendar, MapPin, Ticket, Tag, Shield, Info, Route, ChevronDown, ChevronUp, Code } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
// import jsPDF from "jspdf"; // Uncomment if jsPDF is installed

// Function to get airline logo from carrier code
const getAirlineLogo = (code: string): string => {
  if (!code) return '';
  // Using the free aviation API for logos
  return `https://content.airhex.com/content/logos/airlines_${code}_200_200_s.png`;
};

// Function to convert Fahrenheit to Celsius
const fahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round((fahrenheit - 32) * 5 / 9);
};

// Utility function to format price with nanos and currency
const getPriceString = (p: any) => {
  if (!p) return '-';
  const units = p.units || 0;
  const nanos = p.nanos || 0;
  const nanosDecimal = nanos / 1000000000;
  const totalAmount = units + nanosDecimal;
  return `${p.currencyCode} ${totalAmount.toFixed(2)}`;
};

const FlightDetails = () => {
  const { id } = useParams();
  console.log("FlightDetails page, id from URL:", id);
  const location = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState<any>(null);
  const [seatMap, setSeatMap] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const [showRawDetails, setShowRawDetails] = useState(false);

  // Get flight and searchParams from state if available
  const flight = location.state?.flight;
  const searchParams = location.state?.searchParams;
  const selectedSeat = location.state?.selectedSeat || null;
  const passenger = location.state?.passenger || { name: null, email: null, phone: null };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getFlightDetails(id as string, searchParams?.currency_code || "AED");
        console.log("API response for getFlightDetails:", res);
        // If API returns full details, use them. Otherwise, fallback to flight from state.
        if (res?.data && res.data.status !== false && Object.keys(res.data).length > 1) {
          setDetails(res.data);
        } else if (flight) {
          setDetails(flight); // fallback to navigation state
        } else {
          setError("Flight not found.");
        }
        // Fetch weather for destination city
        const city = flight?.arrivalAirport || res?.data?.arrivalAirport || res?.data?.arrivalCity || res?.data?.arrival || null;
        if (city) {
          const weatherData = await getWeatherByCity(city);
          setWeather(weatherData);
        }
      } catch (e) {
        setError("Failed to load flight details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Auto-trigger print dialog when the page loads
  useEffect(() => {
    if (!loading && !error && details) {
      // Small delay to ensure the content is fully rendered
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, details]);

  // Utility to safely render baggage info
  function renderBaggage(baggage: any): string {
    if (!baggage) return "-";
    if (typeof baggage === "string") return baggage;
    if (typeof baggage === "object") {
      // Show number of pieces and weight if available
      let parts = [];
      if (baggage.maxPiece) {
        parts.push(`${baggage.maxPiece} piece${baggage.maxPiece > 1 ? 's' : ''}`);
      }
      if (baggage.maxWeightPerPiece && baggage.massUnit) {
        parts.push(`${baggage.maxWeightPerPiece}${baggage.massUnit} per piece`);
      }
      if (baggage.description) {
        parts.push(baggage.description);
      }
      if (parts.length > 0) return parts.join(' | ');
      return JSON.stringify(baggage);
    }
    return "-";
  }

  // Utility to safely render fare rules
  function renderFareRules(fareRules: any): string {
    if (!fareRules) return "-";
    if (typeof fareRules === "string") return fareRules;
    if (typeof fareRules === "object") {
      // Try to extract a human-readable summary
      if (Array.isArray(fareRules)) {
        // If it's an array, join types or fallback
        return fareRules.map(renderFareRules).join("\n");
      }
      if (fareRules.availablePolicies) {
        const policies = fareRules.availablePolicies.map((p: any) => p.type).join(", ");
        return `Policies: ${policies}`;
      }
      if (fareRules.segmentIdentifiers) {
        return `Segment Info: ${JSON.stringify(fareRules.segmentIdentifiers)}`;
      }
      // Fallback: pretty-print JSON
      return JSON.stringify(fareRules, null, 2);
    }
    return "-";
  }

  // Download as PDF (placeholder)
  const handleDownloadPDF = () => {
    // If jsPDF is installed, implement PDF download here
    // const doc = new jsPDF();
    // doc.text("Flight Details", 10, 10);
    // doc.save("flight-details.pdf");
    window.print(); // For now, use browser print as a placeholder
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white animate-fade-in">
        <div className="text-lg font-medium text-black animate-pulse">Loading flight details...</div>
      </div>
    );
  }
  if (error || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white animate-fade-in">
        <div className="text-base font-medium text-red-600">{error || "Flight not found."} (ID: {id})</div>
        <button onClick={() => navigate(-1)} className="ml-6 px-6 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  // Get airline code for logo fallback
  const airlineCode = details?.segments?.[0]?.legs?.[0]?.flightInfo?.carrierInfo?.marketingCarrier || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-2 animate-fade-in">
      <div
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-12 relative animate-fade-in-up border-4 border-blue-200 backdrop-blur-xl transition-all duration-700 hover:shadow-3xl"
        ref={printRef}
        style={{ fontFamily: "Inter, Arial, sans-serif" }}
      >
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-lg text-base font-semibold hover:bg-gray-200 transition-all print:hidden"
          >
            <ArrowLeft className="inline mr-2" size={18} />
            Back
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg shadow-lg text-lg font-semibold hover:bg-blue-800 transition-all print:hidden"
          >
            <Download className="inline mr-2" size={18} />
            Download Ticket
          </button>
        </div>
        {/* PDF Ticket Layout (Now Main Page) */}
        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">FLIGHT TICKET</h1>
        <div className="flex items-center gap-8 mb-8">
          {details?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.logo && (
            <img src={details.segments[0].legs[0].carriersData[0].logo} alt="Airline Logo" className="w-28 h-28 rounded-xl border-2 border-blue-200 shadow" />
          )}
          <div>
            <div className="font-bold text-3xl mb-2">{details?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.name || '-'}</div>
            <div className="text-xl mb-1">Flight: {details?.segments?.[0]?.legs?.[0]?.flightInfo?.flightNumber || '-'}</div>
            <div className="text-xl mb-1">Plane: {details?.segments?.[0]?.legs?.[0]?.flightInfo?.planeType || '-'}</div>
            <div className="text-xl">Cabin: {details?.segments?.[0]?.legs?.[0]?.cabinClass || '-'}</div>
          </div>
        </div>
        <hr className="my-4 border-blue-200" />
        {details?.segments?.map((seg, idx) => (
          <div key={idx} className="mb-8">
            <div className="font-bold text-xl mb-2">
              {seg.departureAirport?.cityName} ({seg.departureAirport?.code}) → {seg.arrivalAirport?.cityName} ({seg.arrivalAirport?.code})
            </div>
            <div className="text-lg mb-1">
              {seg.departureAirport?.name}, {seg.departureAirport?.countryName} <br />
              <span className="font-semibold">Departure:</span> {new Date(seg.departureTime).toLocaleString()}
            </div>
            <div className="text-lg mb-1">
              {seg.arrivalAirport?.name}, {seg.arrivalAirport?.countryName} <br />
              <span className="font-semibold">Arrival:</span> {new Date(seg.arrivalTime).toLocaleString()}
            </div>
            <div className="text-lg mb-1">
              <span className="font-semibold">Duration:</span> {seg.totalTime ? `${Math.floor(seg.totalTime / 3600)}h ${Math.floor((seg.totalTime % 3600) / 60)}m` : '-'}
            </div>
            {seg.legs?.[0]?.arrivalTerminal && (
              <div className="text-base mb-1">Arrival Terminal: {seg.legs[0].arrivalTerminal}</div>
            )}
            {seg.legs?.[0]?.departureTerminal && (
              <div className="text-base mb-1">Departure Terminal: {seg.legs[0].departureTerminal}</div>
            )}
          </div>
        ))}
        <hr className="my-4 border-blue-200" />
        <div className="mb-4 font-bold text-xl">Baggage Allowance</div>
        <div className="text-lg mb-1">
          <span className="font-semibold">Checked:</span> {details?.segments?.[0]?.travellerCheckedLuggage?.[0]?.luggageAllowance?.maxPiece || '-'} x {details?.segments?.[0]?.travellerCheckedLuggage?.[0]?.luggageAllowance?.maxWeightPerPiece || '-'}{details?.segments?.[0]?.travellerCheckedLuggage?.[0]?.luggageAllowance?.massUnit || ''}
        </div>
        <div className="text-base mb-1">
          <span className="font-semibold">Cabin:</span> {details?.segments?.[0]?.travellerCabinLuggage?.[0]?.luggageAllowance?.maxPiece || '-'} x {details?.segments?.[0]?.travellerCabinLuggage?.[0]?.luggageAllowance?.maxWeightPerPiece || '-'}{details?.segments?.[0]?.travellerCabinLuggage?.[0]?.luggageAllowance?.massUnit || ''}
          {details?.segments?.[0]?.travellerCabinLuggage?.[0]?.luggageAllowance?.sizeRestrictions && (
            <> ({details.segments[0].travellerCabinLuggage[0].luggageAllowance.sizeRestrictions.maxLength} x {details.segments[0].travellerCabinLuggage[0].luggageAllowance.sizeRestrictions.maxWidth} x {details.segments[0].travellerCabinLuggage[0].luggageAllowance.sizeRestrictions.maxHeight} {details.segments[0].travellerCabinLuggage[0].luggageAllowance.sizeRestrictions.sizeUnit})</>
          )}
        </div>
        <hr className="my-4 border-blue-200" />
        <div className="mb-4 font-bold text-lg">Price Breakdown</div>
        <div className="text-base mb-1"><span className="font-semibold">Total:</span> {getPriceString(details?.priceBreakdown?.total)}</div>
        <div className="text-base mb-1"><span className="font-semibold">Base Fare:</span> {getPriceString(details?.priceBreakdown?.baseFare)}</div>
        <div className="text-base mb-1"><span className="font-semibold">Tax:</span> {getPriceString(details?.priceBreakdown?.tax)}</div>
        <div className="text-base mb-1"><span className="font-semibold">Fee:</span> {getPriceString(details?.priceBreakdown?.fee)}</div>
        <div className="text-base mb-1"><span className="font-semibold">Discount:</span> {getPriceString(details?.priceBreakdown?.discount)}</div>
        {details?.priceBreakdown?.carrierTaxBreakdown?.length > 0 && (
          <div className="text-base mb-1">
            <span className="font-semibold">Carrier Tax Breakdown:</span>
            {details.priceBreakdown.carrierTaxBreakdown.map((tax, i) => (
              <div key={i}>
                {tax.carrier?.name}: {getPriceString(tax.avgPerAdult)}
              </div>
            ))}
          </div>
        )}
        <hr className="my-4 border-blue-200" />
        <div className="mb-4 font-bold text-lg">Traveller(s)</div>
        {details?.travellerPrices?.map((tp, i) => (
          <div key={i} className="text-base mb-1">
            Traveller {i + 1}: {getPriceString(tp.travellerPriceBreakdown?.total)}
          </div>
        ))}
        <hr className="my-4 border-blue-200" />
        <div className="mb-4 font-bold text-lg">Seat & Passenger Details</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="font-semibold text-base mb-1">Selected Seat</div>
            {selectedSeat ? (
              <div className="text-lg text-blue-700 font-bold">
                {selectedSeat.seatId || 'Not selected'}
                {selectedSeat.price && (
                  <span className="ml-2 text-base text-green-700 font-semibold">{selectedSeat.price}</span>
                )}
                {selectedSeat.seat && selectedSeat.seat.seatType && (
                  <span className="ml-2 text-base text-gray-600">({selectedSeat.seat.seatType})</span>
                )}
              </div>
            ) : (
              <div className="text-lg text-gray-500">Not selected</div>
            )}
          </div>
          <div>
            <div className="font-semibold text-base mb-1">Passenger Details</div>
            <div className="text-base text-gray-700">Name: <span className="font-semibold">{passenger.name ?? 'Not provided'}</span></div>
            <div className="text-base text-gray-700">Email: <span className="font-semibold">{passenger.email ?? 'Not provided'}</span></div>
            <div className="text-base text-gray-700">Phone: <span className="font-semibold">{passenger.phone ?? 'Not provided'}</span></div>
          </div>
        </div>
        <hr className="my-4 border-blue-200" />
        <div className="text-base text-center mt-6 font-semibold">Thank you for booking with us!</div>
      </div>
      {/* Enhanced Weather Card */}
      {weather && weather.main && (
        <div className="max-w-md mx-auto mt-10 mb-4 bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {weather.weather?.[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                  className="w-20 h-20"
                />
              )}
              <div>
                <div className="text-2xl font-bold text-blue-800">{weather.name}, {weather.sys?.country}</div>
                <div className="text-lg text-gray-600 capitalize">{weather.weather?.[0]?.description}</div>
                <div className="text-sm text-gray-500">
                  {new Date(weather.dt * 1000).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            <div className="text-5xl font-extrabold text-blue-700">
              {fahrenheitToCelsius(weather.main.temp)}°C
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600">Feels Like</div>
              <div className="text-xl font-semibold text-blue-800">{fahrenheitToCelsius(weather.main.feels_like)}°C</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600">Humidity</div>
              <div className="text-xl font-semibold text-blue-800">{weather.main.humidity}%</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600">Wind Speed</div>
              <div className="text-xl font-semibold text-blue-800">{weather.wind?.speed} m/s</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600">Pressure</div>
              <div className="text-xl font-semibold text-blue-800">{weather.main.pressure} hPa</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600">Min Temperature</div>
              <div className="text-xl font-semibold text-blue-800">{fahrenheitToCelsius(weather.main.temp_min)}°C</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600">Max Temperature</div>
              <div className="text-xl font-semibold text-blue-800">{fahrenheitToCelsius(weather.main.temp_max)}°C</div>
            </div>
          </div>
          
          {weather.visibility && (
            <div className="mt-4 bg-blue-50 p-3 rounded-xl">
              <div className="text-sm text-gray-600">Visibility</div>
              <div className="text-xl font-semibold text-blue-800">{(weather.visibility / 1000).toFixed(1)} km</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightDetails; 