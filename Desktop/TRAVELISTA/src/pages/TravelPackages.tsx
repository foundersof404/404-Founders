import React, { useState, useEffect } from 'react';
import TravelistaLayout from '@/components/TravelistaLayout';
import { Button } from '@/components/ui/button';
import { MapPin, Plane, Calendar, Users, Star, Coffee, Wifi, Utensils, Bed, Waves, Dumbbell, Heart, Gift, Shield, Check, Phone, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface PackageCard {
  id: number;
  destination: string;
  image: string;
  price: number;  // This will now be the base price per person
  duration: string;
  description: string;
  departureCity: string;
  rating: number;
  amenities: {
    breakfast: boolean;
    wifi: boolean;
    pool: boolean;
    gym: boolean;
    spa: boolean;
    airportTransfer: boolean;
    guidedTour: boolean;
    allInclusive: boolean;
    freeCancellation: boolean;
  };
  highlights: string[];
  itinerary: {
    day: number;
    description: string;
  }[];
}

const travelPackages: PackageCard[] = [
  {
    id: 1,
    destination: "Paris, France",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
    price: 2499,  // Updated from 1299
    duration: "7 days",
    description: "Experience the romance of Paris with this all-inclusive package",
    departureCity: "New York",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Eiffel Tower guided tour",
      "Louvre Museum skip-the-line access",
      "Seine River dinner cruise",
      "Versailles Palace visit",
      "French cooking class"
    ],
    itinerary: [
      { day: 1, description: "Arrival and welcome dinner at a traditional French restaurant" },
      { day: 2, description: "Morning Eiffel Tower visit, afternoon at the Louvre" },
      { day: 3, description: "Full-day trip to Versailles Palace" },
      { day: 4, description: "Montmartre walking tour and Sacré-Cœur visit" },
      { day: 5, description: "Seine River cruise and Notre-Dame Cathedral" },
      { day: 6, description: "French cooking class and free time for shopping" },
      { day: 7, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 2,
    destination: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    price: 3299,  // Updated from 1899
    duration: "10 days",
    description: "Discover the blend of tradition and modernity in Tokyo",
    departureCity: "Los Angeles",
    rating: 4.9,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: false,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Mt. Fuji day trip",
      "Tsukiji Outer Market food tour",
      "Traditional tea ceremony",
      "Tokyo Skytree visit",
      "Sumo wrestling match"
    ],
    itinerary: [
      { day: 1, description: "Arrival and orientation in Tokyo" },
      { day: 2, description: "Tsukiji Outer Market and Tokyo Skytree" },
      { day: 3, description: "Traditional tea ceremony and Asakusa Temple" },
      { day: 4, description: "Full-day trip to Mt. Fuji" },
      { day: 5, description: "Sumo wrestling match and local dinner" },
      { day: 6, description: "Shibuya and Harajuku exploration" },
      { day: 7, description: "Day trip to Hakone" },
      { day: 8, description: "Free day for shopping and personal exploration" },
      { day: 9, description: "Final day in Tokyo with farewell dinner" },
      { day: 10, description: "Departure" }
    ]
  },
  {
    id: 3,
    destination: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    price: 1899,  // Updated from 1599
    duration: "5 days",
    description: "Luxury and adventure in the heart of Dubai",
    departureCity: "London",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Burj Khalifa visit",
      "Desert safari with camel ride",
      "Dubai Marina yacht cruise",
      "Souk shopping experience",
      "Dubai Museum visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Burj Khalifa and Dubai Mall" },
      { day: 3, description: "Desert safari and camel ride" },
      { day: 4, description: "Dubai Marina yacht cruise" },
      { day: 5, description: "Souk shopping and Dubai Museum" }
    ]
  },
  {
    id: 4,
    destination: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    price: 1199,
    duration: "8 days",
    description: "Paradise beaches and cultural experiences in Bali",
    departureCity: "Sydney",
    rating: 4.6,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Tegallalang Rice Terraces visit",
      "Ubud Monkey Forest visit",
      "Kintamani volcano visit",
      "Tanah Lot sunset visit",
      "Bali Safari and Marine Park visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Tegallalang Rice Terraces visit" },
      { day: 3, description: "Ubud Monkey Forest visit" },
      { day: 4, description: "Kintamani volcano visit" },
      { day: 5, description: "Tanah Lot sunset visit" },
      { day: 6, description: "Bali Safari and Marine Park visit" },
      { day: 7, description: "Free day for personal exploration" },
      { day: 8, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 5,
    destination: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
    price: 1399,
    duration: "6 days",
    description: "Historic Rome exploration with guided tours",
    departureCity: "Chicago",
    rating: 4.5,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Colosseum guided tour",
      "Roman Forum visit",
      "Trevi Fountain visit",
      "Piazza Navona visit",
      "Spanish Steps visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Colosseum guided tour" },
      { day: 3, description: "Roman Forum visit" },
      { day: 4, description: "Trevi Fountain visit" },
      { day: 5, description: "Piazza Navona visit" },
      { day: 6, description: "Spanish Steps visit" }
    ]
  },
  {
    id: 6,
    destination: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
    price: 2199,
    duration: "7 days",
    description: "Luxury overwater villa experience in paradise",
    departureCity: "Dubai",
    rating: 4.9,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Overwater villa experience",
      "Snorkeling and diving",
      "Sunset cruise",
      "Private dinner on the beach",
      "Spa treatments"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at the overwater villa" },
      { day: 2, description: "Snorkeling and diving" },
      { day: 3, description: "Sunset cruise" },
      { day: 4, description: "Private dinner on the beach" },
      { day: 5, description: "Spa treatments" },
      { day: 6, description: "Free day for personal exploration" },
      { day: 7, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 7,
    destination: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
    price: 1299,
    duration: "5 days",
    description: "Art, architecture, and Mediterranean charm",
    departureCity: "Paris",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Sagrada Familia visit",
      "La Rambla walk",
      "Barcelona Beach visit",
      "Gothic Quarter visit",
      "Boqueria Market visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Sagrada Familia visit" },
      { day: 3, description: "La Rambla walk" },
      { day: 4, description: "Barcelona Beach visit" },
      { day: 5, description: "Gothic Quarter visit and Boqueria Market" }
    ]
  },
  {
    id: 8,
    destination: "Cape Town, South Africa",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    price: 1699,
    duration: "9 days",
    description: "Safari adventures and coastal beauty",
    departureCity: "Amsterdam",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Table Mountain visit",
      "Cape Peninsula visit",
      "Kirstenbosch National Botanical Garden visit",
      "Robben Island visit",
      "Cape Point visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Table Mountain visit" },
      { day: 3, description: "Cape Peninsula visit" },
      { day: 4, description: "Kirstenbosch National Botanical Garden visit" },
      { day: 5, description: "Robben Island visit" },
      { day: 6, description: "Cape Point visit" },
      { day: 7, description: "Free day for personal exploration" },
      { day: 8, description: "Farewell breakfast and departure" },
      { day: 9, description: "Departure" }
    ]
  },
  {
    id: 9,
    destination: "Bangkok, Thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
    price: 999,
    duration: "6 days",
    description: "Cultural immersion and street food paradise",
    departureCity: "Seoul",
    rating: 4.6,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Grand Palace visit",
      "Wat Pho visit",
      "Chatuchak Weekend Market visit",
      "Khao San Road visit",
      "Thai cooking class"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Grand Palace visit" },
      { day: 3, description: "Wat Pho visit" },
      { day: 4, description: "Chatuchak Weekend Market visit" },
      { day: 5, description: "Khao San Road visit" },
      { day: 6, description: "Thai cooking class" }
    ]
  },
  {
    id: 10,
    destination: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    price: 1599,
    duration: "6 days",
    description: "Stunning sunsets and Mediterranean luxury",
    departureCity: "Rome",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Oia sunset visit",
      "Red Beach visit",
      "Santorini Wine Museum visit",
      "Thira town visit",
      "Santorini Caldera visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Oia sunset visit" },
      { day: 3, description: "Red Beach visit" },
      { day: 4, description: "Santorini Wine Museum visit" },
      { day: 5, description: "Thira town visit" },
      { day: 6, description: "Santorini Caldera visit" }
    ]
  },
  {
    id: 11,
    destination: "Sydney, Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    price: 1799,
    duration: "8 days",
    description: "Experience the vibrant city life and stunning beaches of Sydney",
    departureCity: "Singapore",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Sydney Opera House tour",
      "Bondi Beach visit",
      "Blue Mountains day trip",
      "Harbor Bridge climb",
      "Taronga Zoo visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Sydney Opera House tour and harbor cruise" },
      { day: 3, description: "Bondi Beach and coastal walk" },
      { day: 4, description: "Blue Mountains day trip" },
      { day: 5, description: "Harbor Bridge climb" },
      { day: 6, description: "Taronga Zoo visit" },
      { day: 7, description: "Free day for shopping and exploration" },
      { day: 8, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 12,
    destination: "New York City, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    price: 1599,
    duration: "6 days",
    description: "Discover the city that never sleeps with this exciting package",
    departureCity: "London",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: false,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Empire State Building visit",
      "Broadway show tickets",
      "Central Park tour",
      "Statue of Liberty visit",
      "Times Square experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Empire State Building and Times Square" },
      { day: 3, description: "Statue of Liberty and Ellis Island" },
      { day: 4, description: "Central Park and Museum of Natural History" },
      { day: 5, description: "Broadway show and dinner" },
      { day: 6, description: "Shopping and departure" }
    ]
  },
  {
    id: 13,
    destination: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a",
    price: 1399,
    duration: "7 days",
    description: "Explore ancient Egyptian wonders and modern Cairo",
    departureCity: "Dubai",
    rating: 4.6,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Pyramids of Giza visit",
      "Egyptian Museum tour",
      "Nile River cruise",
      "Khan el-Khalili bazaar",
      "Camel ride in the desert"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Pyramids of Giza and Sphinx" },
      { day: 3, description: "Egyptian Museum and Tahrir Square" },
      { day: 4, description: "Nile River cruise with dinner" },
      { day: 5, description: "Khan el-Khalili bazaar and local markets" },
      { day: 6, description: "Desert safari and camel ride" },
      { day: 7, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 14,
    destination: "Rio de Janeiro, Brazil",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
    price: 1699,
    duration: "8 days",
    description: "Experience the vibrant culture and stunning beaches of Rio",
    departureCity: "Miami",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Christ the Redeemer visit",
      "Copacabana Beach day",
      "Sugarloaf Mountain cable car",
      "Samba show experience",
      "Favela tour"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a beachfront hotel" },
      { day: 2, description: "Christ the Redeemer and Tijuca Forest" },
      { day: 3, description: "Copacabana and Ipanema beaches" },
      { day: 4, description: "Sugarloaf Mountain and sunset" },
      { day: 5, description: "Samba show and local dinner" },
      { day: 6, description: "Favela tour and local experience" },
      { day: 7, description: "Free day for beach activities" },
      { day: 8, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 15,
    destination: "Vienna, Austria",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af",
    price: 1499,
    duration: "6 days",
    description: "Immerse yourself in classical music and imperial history",
    departureCity: "Paris",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Schönbrunn Palace visit",
      "Vienna State Opera",
      "St. Stephen's Cathedral",
      "Vienna Philharmonic concert",
      "Coffee house culture"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Schönbrunn Palace and gardens" },
      { day: 3, description: "Vienna State Opera and St. Stephen's Cathedral" },
      { day: 4, description: "Vienna Philharmonic concert" },
      { day: 5, description: "Coffee house tour and local markets" },
      { day: 6, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 16,
    destination: "Marrakech, Morocco",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f11",
    price: 1299,
    duration: "7 days",
    description: "Discover the magic of Marrakech's medina and desert",
    departureCity: "London",
    rating: 4.6,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: false,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Jardin Majorelle visit",
      "Sahara Desert excursion",
      "Traditional hammam experience",
      "Souk shopping tour",
      "Atlas Mountains day trip"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a riad" },
      { day: 2, description: "Jardin Majorelle and Yves Saint Laurent Museum" },
      { day: 3, description: "Souk shopping and local markets" },
      { day: 4, description: "Traditional hammam experience" },
      { day: 5, description: "Atlas Mountains day trip" },
      { day: 6, description: "Sahara Desert excursion" },
      { day: 7, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 17,
    destination: "Seoul, South Korea",
    image: "https://images.unsplash.com/photo-1538485399081-7c8ed730643d",
    price: 1599,
    duration: "7 days",
    description: "Experience the perfect blend of tradition and technology",
    departureCity: "Tokyo",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Gyeongbokgung Palace visit",
      "K-pop experience",
      "DMZ tour",
      "Traditional market tour",
      "Korean cooking class"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Gyeongbokgung Palace and traditional village" },
      { day: 3, description: "K-pop experience and shopping" },
      { day: 4, description: "DMZ tour" },
      { day: 5, description: "Traditional market tour and street food" },
      { day: 6, description: "Korean cooking class" },
      { day: 7, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 18,
    destination: "Amsterdam, Netherlands",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
    price: 1399,
    duration: "5 days",
    description: "Explore the charming canals and rich culture of Amsterdam",
    departureCity: "London",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: false,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Canal cruise",
      "Van Gogh Museum",
      "Anne Frank House",
      "Bike tour",
      "Flower market visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a canal-side hotel" },
      { day: 2, description: "Canal cruise and Anne Frank House" },
      { day: 3, description: "Van Gogh Museum and Rijksmuseum" },
      { day: 4, description: "Bike tour and flower market" },
      { day: 5, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 19,
    destination: "Hawaii, USA",
    image: "https://images.unsplash.com/photo-1507876466758-bc54f384809c",
    price: 1999,
    duration: "8 days",
    description: "Experience paradise in the Pacific with this island package",
    departureCity: "Los Angeles",
    rating: 4.9,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Volcano National Park",
      "Luau show",
      "Snorkeling with sea turtles",
      "Waterfall hike",
      "Sunset cruise"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a beach resort" },
      { day: 2, description: "Volcano National Park tour" },
      { day: 3, description: "Snorkeling and beach activities" },
      { day: 4, description: "Waterfall hike and local culture" },
      { day: 5, description: "Sunset cruise and dinner" },
      { day: 6, description: "Luau show and traditional dinner" },
      { day: 7, description: "Free day for beach activities" },
      { day: 8, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 20,
    destination: "Istanbul, Turkey",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa",
    price: 1299,
    duration: "6 days",
    description: "Discover the magic of East meets West in Istanbul",
    departureCity: "Dubai",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Hagia Sophia visit",
      "Blue Mosque tour",
      "Grand Bazaar shopping",
      "Bosphorus cruise",
      "Turkish bath experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and check-in at a luxury hotel" },
      { day: 2, description: "Hagia Sophia and Blue Mosque" },
      { day: 3, description: "Grand Bazaar and spice market" },
      { day: 4, description: "Bosphorus cruise and dinner" },
      { day: 5, description: "Turkish bath and local experience" },
      { day: 6, description: "Farewell breakfast and departure" }
    ]
  },
  {
    id: 21,
    destination: "Beirut, Lebanon",
    image: "https://images.unsplash.com/photo-1577869769409-6c2b9dfa6e3f",
    price: 1199,
    duration: "6 days",
    description: "Experience the vibrant culture and rich history of Lebanon's capital",
    departureCity: "Dubai",
    rating: 4.6,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Jeita Grotto tour",
      "Byblos ancient port visit",
      "Traditional Lebanese cooking class",
      "Beirut Souks shopping",
      "Baalbek temples exploration"
    ],
    itinerary: [
      { day: 1, description: "Arrival and welcome dinner in downtown Beirut" },
      { day: 2, description: "Jeita Grotto and Harissa visit" },
      { day: 3, description: "Byblos ancient port and old souks" },
      { day: 4, description: "Baalbek temples and Ksara winery" },
      { day: 5, description: "Cooking class and city tour" },
      { day: 6, description: "Final shopping and departure" }
    ]
  },
  {
    id: 22,
    destination: "Baghdad, Iraq",
    image: "https://images.unsplash.com/photo-1570168755129-c64a24d9d636",
    price: 1299,
    duration: "5 days",
    description: "Discover the ancient heritage of Mesopotamia",
    departureCity: "Istanbul",
    rating: 4.5,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: false,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "National Museum of Iraq",
      "Al-Mutanabbi Street tour",
      "Baghdad Zoo visit",
      "Al-Shaheed Monument",
      "Traditional bazaar experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and traditional Iraqi dinner" },
      { day: 2, description: "National Museum and cultural sites" },
      { day: 3, description: "Al-Mutanabbi Street and book market" },
      { day: 4, description: "Modern Baghdad tour" },
      { day: 5, description: "Shopping and departure" }
    ]
  },
  {
    id: 23,
    destination: "Riyadh, Saudi Arabia",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6",
    price: 1899,
    duration: "7 days",
    description: "Experience the modern marvel of Saudi Arabia's capital",
    departureCity: "London",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Kingdom Centre Tower",
      "National Museum",
      "Masmak Fortress",
      "Edge of the World",
      "Desert safari experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and luxury hotel check-in" },
      { day: 2, description: "City landmarks tour" },
      { day: 3, description: "Desert safari and camping" },
      { day: 4, description: "Historical sites visit" },
      { day: 5, description: "Modern architecture tour" },
      { day: 6, description: "Shopping at luxury malls" },
      { day: 7, description: "Departure" }
    ]
  },
  {
    id: 24,
    destination: "Antalya, Turkey",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
    price: 1299,
    duration: "6 days",
    description: "Turkish Riviera's perfect blend of beach and history",
    departureCity: "Paris",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Kaleici old town",
      "Duden Waterfalls",
      "Aspendos ancient theater",
      "Lara Beach",
      "Turkish hammam experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and beach resort check-in" },
      { day: 2, description: "Old town exploration" },
      { day: 3, description: "Ancient ruins tour" },
      { day: 4, description: "Beach and water activities" },
      { day: 5, description: "Spa and shopping day" },
      { day: 6, description: "Departure" }
    ]
  },
  {
    id: 25,
    destination: "Madrid, Spain",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325",
    price: 1499,
    duration: "7 days",
    description: "Experience the royal charm of Spain's capital",
    departureCity: "London",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: false,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Royal Palace tour",
      "Prado Museum visit",
      "Retiro Park exploration",
      "Flamenco show",
      "Tapas food tour"
    ],
    itinerary: [
      { day: 1, description: "Arrival and welcome dinner" },
      { day: 2, description: "Royal Palace and city center" },
      { day: 3, description: "Art museums tour" },
      { day: 4, description: "Day trip to Toledo" },
      { day: 5, description: "Parks and gardens" },
      { day: 6, description: "Flamenco and tapas" },
      { day: 7, description: "Departure" }
    ]
  },
  {
    id: 26,
    destination: "Muscat, Oman",
    image: "https://images.unsplash.com/photo-1621242958268-76b6a03ce0c0",
    price: 1599,
    duration: "6 days",
    description: "Discover the hidden jewel of the Arabian Peninsula",
    departureCity: "Dubai",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Sultan Qaboos Grand Mosque",
      "Mutrah Souq exploration",
      "Wadis adventure",
      "Desert camping",
      "Traditional Omani dinner"
    ],
    itinerary: [
      { day: 1, description: "Arrival and city orientation" },
      { day: 2, description: "Mosque and heritage sites" },
      { day: 3, description: "Souq and harbor tour" },
      { day: 4, description: "Wadi adventure" },
      { day: 5, description: "Desert experience" },
      { day: 6, description: "Departure" }
    ]
  },
  {
    id: 27,
    destination: "Petra, Jordan",
    image: "https://images.unsplash.com/photo-1579606037885-46c0ee2d128e",
    price: 1799,
    duration: "5 days",
    description: "Walk through the ancient rose-red city",
    departureCity: "Cairo",
    rating: 4.9,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: false,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Treasury at Petra",
      "Wadi Rum desert tour",
      "Dead Sea float",
      "Little Petra visit",
      "Bedouin experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and Petra introduction" },
      { day: 2, description: "Full day at Petra" },
      { day: 3, description: "Wadi Rum adventure" },
      { day: 4, description: "Dead Sea relaxation" },
      { day: 5, description: "Departure" }
    ]
  },
  {
    id: 28,
    destination: "Seville, Spain",
    image: "https://images.unsplash.com/photo-1559682109-0300472460f0",
    price: 1399,
    duration: "5 days",
    description: "Experience the heart of Andalusia",
    departureCity: "Madrid",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Real Alcázar visit",
      "Flamenco show",
      "Cathedral tour",
      "Plaza de España",
      "Tapas crawl"
    ],
    itinerary: [
      { day: 1, description: "Arrival and evening tapas" },
      { day: 2, description: "Royal Alcázar and Cathedral" },
      { day: 3, description: "Flamenco and culture" },
      { day: 4, description: "City exploration" },
      { day: 5, description: "Departure" }
    ]
  },
  {
    id: 29,
    destination: "Kuwait City, Kuwait",
    image: "https://images.unsplash.com/photo-1578895101408-1bc89683ba76",
    price: 1499,
    duration: "4 days",
    description: "Modern luxury meets Arabian tradition",
    departureCity: "Dubai",
    rating: 4.6,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Kuwait Towers",
      "Grand Mosque visit",
      "Souk Al-Mubarakiya",
      "Mirror House tour",
      "Desert camp experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and city tour" },
      { day: 2, description: "Cultural sites and shopping" },
      { day: 3, description: "Desert adventure" },
      { day: 4, description: "Departure" }
    ]
  },
  {
    id: 30,
    destination: "Valencia, Spain",
    image: "https://images.unsplash.com/photo-1599302592205-d7d683c83ecd",
    price: 1299,
    duration: "6 days",
    description: "City of arts, sciences, and paella",
    departureCity: "Barcelona",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: false,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "City of Arts and Sciences",
      "Historic center tour",
      "Paella cooking class",
      "Beach day",
      "Central Market visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and welcome dinner" },
      { day: 2, description: "Modern architecture tour" },
      { day: 3, description: "Historic center exploration" },
      { day: 4, description: "Cooking and culture" },
      { day: 5, description: "Beach and relaxation" },
      { day: 6, description: "Departure" }
    ]
  },
  {
    id: 31,
    destination: "Doha, Qatar",
    image: "https://images.unsplash.com/photo-1562823083-3f86817eb4a9",
    price: 1899,
    duration: "5 days",
    description: "Ultra-modern luxury in the heart of Qatar",
    departureCity: "London",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Museum of Islamic Art",
      "Souq Waqif exploration",
      "The Pearl-Qatar tour",
      "Desert safari",
      "Katara Cultural Village"
    ],
    itinerary: [
      { day: 1, description: "Arrival and luxury hotel check-in" },
      { day: 2, description: "City tour and museum visits" },
      { day: 3, description: "Shopping and cultural exploration" },
      { day: 4, description: "Desert adventure" },
      { day: 5, description: "Final shopping and departure" }
    ]
  },
  {
    id: 32,
    destination: "Amman, Jordan",
    image: "https://images.unsplash.com/photo-1534571177127-3a448117b880",
    price: 1299,
    duration: "6 days",
    description: "Ancient history meets modern culture",
    departureCity: "Istanbul",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Citadel hill exploration",
      "Roman Theater visit",
      "Rainbow Street tour",
      "Day trip to Jerash",
      "Local food experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and city orientation" },
      { day: 2, description: "Ancient ruins tour" },
      { day: 3, description: "Modern Amman exploration" },
      { day: 4, description: "Jerash day trip" },
      { day: 5, description: "Local culture and food" },
      { day: 6, description: "Departure" }
    ]
  },
  {
    id: 33,
    destination: "Granada, Spain",
    image: "https://images.unsplash.com/photo-1591794836251-47dcf6e5c864",
    price: 1399,
    duration: "5 days",
    description: "Moorish splendor in southern Spain",
    departureCity: "Madrid",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: false,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Alhambra Palace tour",
      "Albaicín quarter walk",
      "Flamenco cave show",
      "Sierra Nevada visit",
      "Tapas experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and welcome dinner" },
      { day: 2, description: "Full day at Alhambra" },
      { day: 3, description: "Historic quarters exploration" },
      { day: 4, description: "Mountain and nature" },
      { day: 5, description: "Final tapas and departure" }
    ]
  },
  {
    id: 34,
    destination: "Manama, Bahrain",
    image: "https://images.unsplash.com/photo-1578895101408-1bc89683ba76",
    price: 1499,
    duration: "4 days",
    description: "Pearl of the Arabian Gulf",
    departureCity: "Dubai",
    rating: 4.6,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Bahrain Fort",
      "Bab Al Bahrain Souk",
      "Formula 1 Circuit",
      "Pearl diving experience",
      "Al Fateh Grand Mosque"
    ],
    itinerary: [
      { day: 1, description: "Arrival and city tour" },
      { day: 2, description: "Historical sites and shopping" },
      { day: 3, description: "Modern attractions" },
      { day: 4, description: "Departure" }
    ]
  },
  {
    id: 35,
    destination: "Malaga, Spain",
    image: "https://images.unsplash.com/photo-1562668304-3a58ba6964cf",
    price: 1299,
    duration: "6 days",
    description: "Sun, culture, and Picasso's birthplace",
    departureCity: "London",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Picasso Museum",
      "Alcazaba fortress",
      "Roman Theater",
      "Beach day",
      "Wine tasting tour"
    ],
    itinerary: [
      { day: 1, description: "Arrival and beach welcome" },
      { day: 2, description: "Art and museums" },
      { day: 3, description: "Historical sites" },
      { day: 4, description: "Costa del Sol beaches" },
      { day: 5, description: "Wine country tour" },
      { day: 6, description: "Departure" }
    ]
  },
  {
    id: 36,
    destination: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    price: 2699,  // Updated from 1899
    duration: "7 days",
    description: "Experience romance in Paris with a Lebanese touch",
    departureCity: "Beirut",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Eiffel Tower VIP access",
      "Lebanese-French fusion dinner",
      "Louvre Museum tour",
      "Seine River cruise",
      "Versailles Palace visit"
    ],
    itinerary: [
      { day: 1, description: "Arrival and Lebanese-French welcome dinner" },
      { day: 2, description: "Eiffel Tower and city tour" },
      { day: 3, description: "Louvre and art galleries" },
      { day: 4, description: "Versailles day trip" },
      { day: 5, description: "Shopping and leisure" },
      { day: 6, description: "Seine dinner cruise" },
      { day: 7, description: "Departure" }
    ]
  },
  {
    id: 37,
    destination: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
    price: 3999,  // Updated from 2499
    duration: "6 days",
    description: "Luxury escape from Dubai to paradise",
    departureCity: "Dubai",
    rating: 4.9,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Overwater villa stay",
      "Private beach dinner",
      "Sunset dolphin cruise",
      "Snorkeling adventure",
      "Spa treatments"
    ],
    itinerary: [
      { day: 1, description: "Arrival and villa check-in" },
      { day: 2, description: "Water activities and relaxation" },
      { day: 3, description: "Island hopping tour" },
      { day: 4, description: "Spa and wellness day" },
      { day: 5, description: "Beach activities and farewell dinner" },
      { day: 6, description: "Departure" }
    ]
  },
  {
    id: 38,
    destination: "Istanbul, Turkey",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b",
    price: 1499,  // Updated from 1299
    duration: "5 days",
    description: "Historical journey from Lebanon",
    departureCity: "Beirut",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Hagia Sophia tour",
      "Blue Mosque visit",
      "Bosphorus cruise",
      "Grand Bazaar shopping",
      "Turkish bath experience"
    ],
    itinerary: [
      { day: 1, description: "Arrival and Turkish welcome" },
      { day: 2, description: "Historical sites tour" },
      { day: 3, description: "Bosphorus and Asian side" },
      { day: 4, description: "Shopping and spa" },
      { day: 5, description: "Departure" }
    ]
  },
  {
    id: 39,
    destination: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    price: 2799,  // Updated from 1999
    duration: "8 days",
    description: "Tropical paradise escape from Dubai",
    departureCity: "Dubai",
    rating: 4.8,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: true,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: true,
      freeCancellation: true
    },
    highlights: [
      "Ubud rice terraces",
      "Temple visits",
      "Monkey forest",
      "Sunset at Tanah Lot",
      "Balinese cooking class"
    ],
    itinerary: [
      { day: 1, description: "Arrival and resort check-in" },
      { day: 2, description: "Ubud cultural tour" },
      { day: 3, description: "Temple and spiritual sites" },
      { day: 4, description: "Beach club day" },
      { day: 5, description: "Cooking and crafts" },
      { day: 6, description: "Adventure activities" },
      { day: 7, description: "Spa and relaxation" },
      { day: 8, description: "Departure" }
    ]
  },
  {
    id: 40,
    destination: "Athens, Greece",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235",
    price: 1999,  // Updated from 1599
    duration: "6 days",
    description: "Ancient wonders tour from Lebanon",
    departureCity: "Beirut",
    rating: 4.7,
    amenities: {
      breakfast: true,
      wifi: true,
      pool: true,
      gym: true,
      spa: false,
      airportTransfer: true,
      guidedTour: true,
      allInclusive: false,
      freeCancellation: true
    },
    highlights: [
      "Acropolis tour",
      "Plaka district walk",
      "Greek cooking class",
      "Cape Sounion trip",
      "Island day cruise"
    ],
    itinerary: [
      { day: 1, description: "Arrival and Greek welcome dinner" },
      { day: 2, description: "Acropolis and ancient sites" },
      { day: 3, description: "Local culture and cooking" },
      { day: 4, description: "Cape Sounion excursion" },
      { day: 5, description: "Island hopping" },
      { day: 6, description: "Departure" }
    ]
  }
];

const TravelPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageCard | null>(null);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePackages, setVisiblePackages] = useState(6);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const loadMore = () => {
    setVisiblePackages(prev => prev + 6);
  };

  // Calculate total price based on number of passengers
  const calculateTotalPrice = (basePrice: number, numPassengers: number) => {
    // Apply slight discount for multiple passengers
    const discountFactors = {
      1: 1,      // No discount for single passenger
      2: 0.95,   // 5% discount per person for 2 passengers
      3: 0.93,   // 7% discount per person for 3 passengers
      4: 0.90,   // 10% discount per person for 4 passengers
      5: 0.88,   // 12% discount per person for 5 passengers
      6: 0.85    // 15% discount per person for 6 passengers
    };
    
    const discountFactor = discountFactors[numPassengers as keyof typeof discountFactors] || 0.85;
    return Math.round(basePrice * numPassengers * discountFactor);
  };

  const filteredPackages = travelPackages.filter(pkg => {
    const matchesFrom = !fromLocation || pkg.departureCity.toLowerCase().includes(fromLocation.toLowerCase());
    const matchesTo = !toLocation || pkg.destination.toLowerCase().includes(toLocation.toLowerCase());
    const totalPrice = calculateTotalPrice(pkg.price, parseInt(passengers));
    const matchesPrice = totalPrice >= priceRange[0] && totalPrice <= priceRange[1];
    const matchesDuration = durationFilter === "all" || pkg.duration.includes(durationFilter);
    const matchesRating = ratingFilter === 0 || pkg.rating >= ratingFilter;
    const matchesAmenities = selectedAmenities.length === 0 || 
                            selectedAmenities.every(amenity => pkg.amenities[amenity as keyof typeof pkg.amenities]);

    return matchesFrom && matchesTo && matchesPrice && matchesDuration && matchesRating && matchesAmenities;
  });

  useEffect(() => {
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const renderAmenityIcon = (amenity: string, included: boolean) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      breakfast: <Coffee className="w-5 h-5" />,
      wifi: <Wifi className="w-5 h-5" />,
      pool: <Waves className="w-5 h-5" />,
      gym: <Dumbbell className="w-5 h-5" />,
      spa: <Heart className="w-5 h-5" />,
      airportTransfer: <Plane className="w-5 h-5" />,
      guidedTour: <MapPin className="w-5 h-5" />,
      allInclusive: <Utensils className="w-5 h-5" />,
      freeCancellation: <Shield className="w-5 h-5" />
    };

    return (
      <div className={`flex items-center gap-2 ${included ? 'text-green-600' : 'text-gray-400'}`}>
        {iconMap[amenity]}
        <span className="text-sm">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <TravelistaLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section with enhanced parallax effect */}
        <motion.div
          className="relative mb-16 text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 pointer-events-none" />
          <div className="relative container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-6 text-[hsl(214,57%,51%)] bg-clip-text text-transparent bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,65%)]">
                Travel Packages
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
                Discover our curated selection of premium travel packages
              </p>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From exotic destinations to luxury getaways, explore a world of possibilities and create unforgettable memories.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-12">
          {/* Enhanced Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Departure City"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Destination"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sticky Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/4"
            >
              <div className="sticky top-24 p-6 rounded-xl backdrop-blur-xl bg-white/80 shadow-lg border border-white/20">
                <h2 className="text-xl font-semibold mb-6">Filter Packages</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={3000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        <SelectItem value="5">5 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="10">10 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                    <div className="flex items-center gap-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setRatingFilter(rating)}
                          className={`p-2 rounded ${ratingFilter === rating ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                        >
                          {rating === 0 ? 'All' : rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Amenities</label>
                    <div className="space-y-2">
                      {Object.keys(travelPackages[0].amenities).map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <Checkbox
                            id={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAmenities([...selectedAmenities, amenity]);
                              } else {
                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                              }
                            }}
                          />
                          <label htmlFor={amenity} className="ml-2 text-sm">
                            {amenity.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-50 rounded-lg p-8"
                  >
                    <h3 className="text-xl font-semibold mb-2">No packages found</h3>
                    <p className="text-gray-600">Try adjusting your filters to find more options</p>
                  </motion.div>
                </div>
              ) : (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {filteredPackages.slice(0, visiblePackages).map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          variants={cardVariants}
                          className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={pkg.image}
                              alt={pkg.destination}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            {pkg.price < 1500 && (
                              <div className="absolute top-3 left-3">
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse shadow-lg">
                                  HOT DEAL
                                </div>
                              </div>
                            )}
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-semibold">{pkg.rating}</span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{pkg.destination}</h3>
                            <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">{pkg.description}</p>
                            
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <MapPin size={18} />
                              <span className="font-medium text-sm">From: {pkg.departureCity}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <Calendar size={18} />
                              <span className="font-medium text-sm">{pkg.duration}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600 mb-3">
                              <Plane size={18} />
                              <span className="font-medium text-sm">Round-trip flight included</span>
                            </div>
                            
                            <div className="flex justify-between items-end">
                              <div>
                                {pkg.price < 1500 && (
                                  <div className="text-xs text-gray-400 line-through mb-0.5">
                                    ${Math.round(pkg.price * 1.2)} per person
                                  </div>
                                )}
                                <div className="text-lg font-bold text-gray-600 mb-1">
                                  ${pkg.price} per person
                                </div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  Total: ${calculateTotalPrice(pkg.price, parseInt(passengers))}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {parseInt(passengers) > 1 ? `Group discount applied` : ''}
                                </div>
                              </div>
                              <Button
                                onClick={() => setSelectedPackage(pkg)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-4 py-1.5 rounded-lg text-sm"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  
                  {visiblePackages < filteredPackages.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 text-center"
                    >
                      <Button
                        onClick={loadMore}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl"
                      >
                        Load More Packages
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Secure Booking</h3>
                <p className="text-sm text-gray-600">128-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Phone className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Award className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Best Price Guarantee</h3>
                <p className="text-sm text-gray-600">Found cheaper? We'll match it</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Package Details Modal */}
      <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPackage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedPackage.destination}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="relative">
                    <img
                      src={selectedPackage.image}
                      alt={selectedPackage.destination}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {selectedPackage.price < 1500 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        SAVE {Math.round((1 - selectedPackage.price / (selectedPackage.price * 1.2)) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Package Highlights</h3>
                    <ul className="space-y-2">
                      {selectedPackage.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedPackage.amenities).map(([key, value]) => (
                        <div key={key}>
                          {renderAmenityIcon(key, value)}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Itinerary</h3>
                    <div className="space-y-4">
                      {selectedPackage.itinerary.map((day) => (
                        <div key={day.day} className="flex gap-4">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {day.day}
                            </div>
                            {day.day < selectedPackage.itinerary.length && (
                              <div className="absolute top-8 left-4 w-0.5 h-full -ml-px bg-blue-200"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="text-gray-700">{day.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">${selectedPackage.price}</div>
                        {selectedPackage.price < 1500 && (
                          <div className="text-sm text-gray-500 line-through">
                            ${Math.round(selectedPackage.price * 1.2)}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-600">Secure booking</span>
                      </div>
                    </div>
                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300">
                      Book Now
                    </Button>
                    <div className="mt-4 text-center text-sm text-gray-500">
                      Free cancellation available
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TravelistaLayout>
  );
};

export default TravelPackages; 