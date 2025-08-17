import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TravelistaLayout from '@/components/TravelistaLayout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Globe, 
  Utensils,
  LogIn,
  Search,
  Filter,
  X,
  ChevronDown,
  Star,
  ChefHat,
  Loader,
  Heart,
  Share2,
  User,
  Menu,
  Map,
  List,
  Sliders,
  DollarSign,
  Clock4,
  Wifi,
  ParkingCircle,
  Music
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface RestaurantType {
  id: string;
  name: string;
  location: string;
  address: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
  phone: string;
  website: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openHours: string;
  reviews: {
    author: string;
    rating: number;
    text: string;
  }[];
  popularDishes: string[];
  reservationNeeded?: boolean;
  amenities?: string[];
  dietaryOptions?: string[];
  distance?: number; // Add distance property
}

// Define cuisine options
const cuisines = [
  "All",
  "Lebanese",
  "Italian",
  "Japanese",
  "Chinese",
  "Indian",
  "Mexican",
  "French",
  "Thai",
  "Mediterranean",
  "American",
  "Korean",
  "Vietnamese",
  "Greek",
  "Turkish",
  "British",
  "Canadian",
  "Fast Food",
  "Desserts",
  "Chocolate",
  "Coffee",
  "Bakery"
];

// Define locations/countries
const locations = [
  "All",
  "Lebanon",
  "UK",
  "France",
  "USA",
  "Canada",
  "Italy",
  "Japan",
  "China",
  "India",
  "Mexico",
  "Greece",
  "Turkey"
];

// Price ranges
const priceRanges = [
  "All",
  "Under $15",
  "$15-$30",
  "$30-$60",
  "Over $60"
];

// Global restaurant chains (with location-specific details)
const globalChains = [
  // McDonald's across various locations
  {
    id: "mcdonalds",
    name: "McDonald's",
    location: "New York, USA",
    address: "123 Broadway, New York, USA",
    cuisine: "Fast Food",
    rating: 4.2,
    priceRange: "$5-$15",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "World's leading fast-food restaurant chain serving burgers, fries, and more.",
    phone: "+1 212-555-0123",
    website: "https://www.mcdonalds.com",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    openHours: "24/7",
    reviews: [
      { author: "John D.", rating: 4, text: "Quick service and consistent quality." },
      { author: "Sarah M.", rating: 3, text: "Good for a quick meal, but nothing special." }
    ],
    popularDishes: ["Big Mac", "McChicken", "French Fries", "McFlurry"],
    reservationNeeded: false,
    amenities: ["Takeout", "Delivery", "Drive-thru", "Free WiFi"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"]
  },
  {
    id: "mcdk-uk",
    name: "McDonald's",
    location: "London, UK",
    address: "Leicester Square, London, UK",
    cuisine: "Fast Food",
    rating: 3.8,
    priceRange: "Under $15",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Iconic fast food restaurant in the heart of London's entertainment district.",
    phone: "+44 20 7930 3940",
    website: "https://www.mcdonalds.com/gb/en-gb.html",
    coordinates: { lat: 51.5105, lng: -0.1305 },
    openHours: "24 Hours",
    reviews: [
      { author: "James P.", rating: 3, text: "Very busy but they handle the crowds well." },
      { author: "Emma W.", rating: 4, text: "Late night savior after theatre shows." }
    ],
    popularDishes: ["Big Mac", "Quarter Pounder", "Chicken Legend", "McFlurry"],
    reservationNeeded: false
  },
  {
    id: "mcdk-fr",
    name: "McDonald's",
    location: "Paris, France",
    address: "Champs-Élysées, Paris, France",
    cuisine: "Fast Food",
    rating: 3.7,
    priceRange: "Under $15",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Upscale McDonald's location on the famous Champs-Élysées boulevard.",
    phone: "+33 1 45 62 72 72",
    website: "https://www.mcdonalds.fr",
    coordinates: { lat: 48.8698, lng: 2.3075 },
    openHours: "7:00 AM - 1:00 AM",
    reviews: [
      { author: "Pierre D.", rating: 4, text: "One of the nicer McDonald's I've been to." },
      { author: "Sophie M.", rating: 3, text: "Tourist prices but decent food." }
    ],
    popularDishes: ["Royal Cheese", "McBaguette", "Chicken McNuggets", "Croque McDo"],
    reservationNeeded: false
  },

  // KFC across various locations
  {
    id: "kfc-leb",
    name: "KFC",
    location: "Beirut, Lebanon",
    address: "Verdun Street, Beirut, Lebanon",
    cuisine: "Fast Food",
    rating: 4.0,
    priceRange: "Under $15",
    image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "American fried chicken restaurant chain offering the Colonel's famous recipe in Lebanon.",
    phone: "+961 1 785 888",
    website: "https://www.kfc-lb.com",
    coordinates: { lat: 33.8933, lng: 35.4982 },
    openHours: "10:00 AM - 12:00 AM",
    reviews: [
      { author: "Mariam H.", rating: 4, text: "Chicken is always fresh and crispy." },
      { author: "Ali K.", rating: 4, text: "Great service and the spicy options are actually spicy!" }
    ],
    popularDishes: ["Original Recipe Chicken", "Zinger Burger", "Twister Wrap", "Hot Wings"],
    reservationNeeded: false
  },
  {
    id: "kfc-uk",
    name: "KFC",
    location: "London, UK",
    address: "Oxford Street, London, UK",
    cuisine: "Fast Food",
    rating: 3.9,
    priceRange: "Under $15",
    image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Popular fried chicken chain serving the Colonel's secret recipe on London's busiest shopping street.",
    phone: "+44 20 7629 3536",
    website: "https://www.kfc.co.uk",
    coordinates: { lat: 51.5152, lng: -0.1454 },
    openHours: "10:00 AM - 11:00 PM",
    reviews: [
      { author: "Thomas B.", rating: 4, text: "Reliable spot for fried chicken cravings." },
      { author: "Lucy M.", rating: 3, text: "Decent chicken but gets very busy at lunch." }
    ],
    popularDishes: ["Bargain Bucket", "Zinger Tower Burger", "Popcorn Chicken", "Gravy"],
    reservationNeeded: false
  },
  
  // Starbucks across various locations
  {
    id: "starbucks-leb",
    name: "Starbucks",
    location: "Beirut, Lebanon",
    address: "Beirut Souks, Downtown Beirut, Lebanon",
    cuisine: "Coffee",
    rating: 4.2,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1503481766315-7a586b20f66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Seattle-based coffeehouse chain offering specialty coffee, pastries and light bites in a trendy setting.",
    phone: "+961 1 999 876",
    website: "https://www.starbucks.com/store-locator/store/14883/",
    coordinates: { lat: 33.8969, lng: 35.5103 },
    openHours: "7:00 AM - 11:00 PM",
    reviews: [
      { author: "Nadia T.", rating: 5, text: "Great atmosphere for working or meetings." },
      { author: "Omar J.", rating: 4, text: "Coffee is consistent and service is friendly." }
    ],
    popularDishes: ["Caramel Macchiato", "Flat White", "Turkey & Swiss Sandwich", "Blueberry Muffin"],
    reservationNeeded: false
  },
  {
    id: "starbucks-uk",
    name: "Starbucks",
    location: "London, UK",
    address: "Covent Garden, London, UK",
    cuisine: "Coffee",
    rating: 4.0,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1503481766315-7a586b20f66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Iconic coffee chain in London's popular shopping and entertainment area.",
    phone: "+44 20 7240 7708",
    website: "https://www.starbucks.co.uk",
    coordinates: { lat: 51.5129, lng: -0.1243 },
    openHours: "6:30 AM - 9:00 PM",
    reviews: [
      { author: "William H.", rating: 4, text: "Good place to relax after shopping." },
      { author: "Olivia S.", rating: 4, text: "Consistent quality and comfortable seating." }
    ],
    popularDishes: ["Flat White", "Caramel Frappuccino", "Egg & Cheese Protein Box", "Almond Croissant"],
    reservationNeeded: false
  }
];

// Dessert places and specialty shops across various locations
const dessertPlaces = [
  // Dessert places in Lebanon
  {
    id: "amorino-leb",
    name: "Amorino",
    location: "Beirut, Lebanon",
    address: "ABC Mall, Achrafieh, Beirut, Lebanon",
    cuisine: "Desserts",
    rating: 4.6,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Italian gelato shop offering artistic flower-shaped gelato with natural ingredients and no artificial colors.",
    phone: "+961 1 444 123",
    website: "https://www.amorino.com/lb/",
    coordinates: { lat: 33.8845, lng: 35.5214 },
    openHours: "10:00 AM - 10:00 PM",
    reviews: [
      { author: "Rania K.", rating: 5, text: "The rose-shaped gelato is not only beautiful but delicious!" },
      { author: "Karim N.", rating: 4, text: "Great variety of flavors and beautiful presentation." }
    ],
    popularDishes: ["Flower Gelato", "Macarons", "Waffles", "Sorbet"],
    reservationNeeded: false
  },
  {
    id: "patchi-leb",
    name: "Patchi",
    location: "Beirut, Lebanon",
    address: "Bab Idriss, Downtown Beirut, Lebanon",
    cuisine: "Chocolate",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Luxury Lebanese chocolate brand offering premium handcrafted chocolates in elegant packaging.",
    phone: "+961 1 999 111",
    website: "https://www.patchi.com",
    coordinates: { lat: 33.8967, lng: 35.5077 },
    openHours: "9:00 AM - 9:00 PM",
    reviews: [
      { author: "Ziad M.", rating: 5, text: "The best chocolate gifts you can give in Lebanon." },
      { author: "Yasmine H.", rating: 5, text: "Exquisite taste and beautiful packaging. Perfect for special occasions." }
    ],
    popularDishes: ["Assorted Chocolate Box", "Wedding Favors", "Chocolate-Covered Nuts", "Gourmandises Collection"],
    reservationNeeded: false
  },
  
  // Dessert places in London
  {
    id: "fortnum-uk",
    name: "Fortnum & Mason",
    location: "London, UK",
    address: "181 Piccadilly, London, UK",
    cuisine: "Desserts",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Iconic British department store with an elegant tearoom offering traditional afternoon tea and pastries.",
    phone: "+44 20 7734 8040",
    website: "https://www.fortnumandmason.com",
    coordinates: { lat: 51.5081, lng: -0.1390 },
    openHours: "10:00 AM - 8:00 PM",
    reviews: [
      { author: "Elizabeth P.", rating: 5, text: "The quintessential British afternoon tea experience." },
      { author: "Richard G.", rating: 4, text: "Elegant surroundings and delicious pastries." }
    ],
    popularDishes: ["Afternoon Tea", "Battenberg Cake", "Éclair", "Scones with Clotted Cream"],
    reservationNeeded: true
  },
  {
    id: "hotelchoc-uk",
    name: "Hotel Chocolat",
    location: "London, UK",
    address: "Covent Garden, London, UK",
    cuisine: "Chocolate",
    rating: 4.6,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "British chocolatier offering premium chocolate products, from bars to gift boxes, emphasizing ethical sourcing.",
    phone: "+44 20 7395 1100",
    website: "https://www.hotelchocolat.com",
    coordinates: { lat: 51.5132, lng: -0.1240 },
    openHours: "10:00 AM - 8:00 PM",
    reviews: [
      { author: "George W.", rating: 5, text: "The hot chocolate is amazing and the staff are very knowledgeable." },
      { author: "Catherine M.", rating: 4, text: "High quality chocolates with interesting flavors." }
    ],
    popularDishes: ["Velvetiser Hot Chocolate", "Salted Caramel Puddles", "Champagne Truffles", "Rabbert Selector"],
    reservationNeeded: false
  },
  
  // Dessert places in Paris
  {
    id: "laduree-fr",
    name: "Ladurée",
    location: "Paris, France",
    address: "75 Avenue des Champs-Élysées, Paris, France",
    cuisine: "Pastry",
    rating: 4.5,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Famous French luxury bakery specializing in macarons with elegant tea rooms and pastries.",
    phone: "+33 1 40 75 08 75",
    website: "https://www.laduree.fr",
    coordinates: { lat: 48.8696, lng: 2.3083 },
    openHours: "8:30 AM - 9:30 PM",
    reviews: [
      { author: "Marie T.", rating: 5, text: "The original and still the best macarons in Paris." },
      { author: "Jean-Paul B.", rating: 4, text: "Beautiful setting and exquisite pastries, though pricey." }
    ],
    popularDishes: ["Macarons", "St. Honoré", "Pain au Chocolat", "Ispahan"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Wheelchair Accessible", "Takeout", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"]
  },
  {
    id: "angelina-fr",
    name: "Angelina",
    location: "Paris, France",
    address: "226 Rue de Rivoli, Paris, France",
    cuisine: "Chocolate",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1603503165259-c7385ebd32cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Historic Parisian tea house known for its thick hot chocolate and Mont Blanc pastry since 1903.",
    phone: "+33 1 42 60 82 00",
    website: "https://www.angelina-paris.fr",
    coordinates: { lat: 48.8651, lng: 2.3307 },
    openHours: "9:00 AM - 7:00 PM",
    reviews: [
      { author: "Françoise D.", rating: 5, text: "Their hot chocolate is legendary for good reason." },
      { author: "Thomas H.", rating: 5, text: "The Mont Blanc is perfect - not too sweet and wonderfully chestnutty." }
    ],
    popularDishes: ["Hot Chocolate 'l'Africain'", "Mont Blanc", "Millefeuille", "Paris-New York"],
    reservationNeeded: true
  }
];

// Additional filter options
const amenities = [
  "All",
  "Outdoor Seating",
  "Wheelchair Accessible",
  "Free WiFi",
  "Parking Available",
  "Live Music",
  "Smoking Area",
  "Takeout",
  "Delivery",
  "Reservations",
  "Private Dining",
  "Bar/Lounge",
  "Buffet",
  "Catering",
  "Family Style",
  "Happy Hour",
  "Late Night",
  "Vegan Options",
  "Vegetarian Friendly",
  "Gluten Free Options"
];

const dietaryOptions = [
  "All",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Dairy-Free",
  "Nut-Free",
  "Organic",
  "Raw Food"
];

// Additional restaurants data
const additionalRestaurants: RestaurantType[] = [
  {
    id: "seoul-gangnam",
    name: "Seoul Gangnam",
    location: "Seoul, South Korea",
    address: "Gangnam District, Seoul",
    cuisine: "Korean",
    rating: 4.8,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1535140728328-0bfb32dacd1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern Korean restaurant offering innovative takes on traditional dishes.",
    phone: "+82 2 1234 5678",
    website: "https://www.seoulgangnam.kr",
    coordinates: { lat: 37.5665, lng: 126.9780 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Ji-hoon K.", rating: 5, text: "Innovative Korean cuisine!" },
      { author: "Soo-jin L.", rating: 5, text: "Perfect fusion of traditional and modern." }
    ],
    popularDishes: ["Bibimbap", "Korean BBQ", "Kimchi Stew", "Tteokbokki"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Wine Pairing", "Cooking Classes"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "manila-bay",
    name: "Manila Bay",
    location: "Manila, Philippines",
    address: "Manila Bay, Manila",
    cuisine: "Filipino",
    rating: 4.8,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Luxury restaurant with bay views, serving modern Filipino cuisine.",
    phone: "+63 2 1234 5678",
    website: "https://www.manilabay.ph",
    coordinates: { lat: 14.5995, lng: 120.9842 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Maria S.", rating: 5, text: "Best sunset views in Manila!" },
      { author: "Juan D.", rating: 5, text: "Innovative Filipino cuisine." }
    ],
    popularDishes: ["Adobo", "Lechon", "Sinigang", "Halo-halo"],
    reservationNeeded: true,
    amenities: ["Bay View", "Private Dining", "Live Music", "Sunset Deck"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "jakarta-spice",
    name: "Jakarta Spice",
    location: "Jakarta, Indonesia",
    address: "Central Jakarta",
    cuisine: "Indonesian",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Luxury Indonesian restaurant offering traditional dishes with modern presentation.",
    phone: "+62 21 1234 5678",
    website: "https://www.jakartaspice.id",
    coordinates: { lat: -6.2088, lng: 106.8456 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Budi W.", rating: 5, text: "Authentic Indonesian flavors!" },
      { author: "Siti M.", rating: 5, text: "Beautiful presentation and service." }
    ],
    popularDishes: ["Rendang", "Nasi Goreng", "Satay", "Gado-gado"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Cooking Classes", "Spice Tasting"],
    dietaryOptions: ["Vegetarian", "Vegan", "Halal"]
  },
  {
    id: "kuala-lumpur-tower",
    name: "Kuala Lumpur Tower",
    location: "Kuala Lumpur, Malaysia",
    address: "KL Tower, Kuala Lumpur",
    cuisine: "Malaysian",
    rating: 4.8,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Revolving restaurant offering panoramic views and modern Malaysian cuisine.",
    phone: "+60 3 1234 5678",
    website: "https://www.kltower.my",
    coordinates: { lat: 3.1390, lng: 101.6869 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Ahmad K.", rating: 5, text: "Amazing city views!" },
      { author: "Mei L.", rating: 5, text: "Innovative Malaysian fusion." }
    ],
    popularDishes: ["Nasi Lemak", "Satay", "Laksa", "Roti Canai"],
    reservationNeeded: true,
    amenities: ["City View", "Revolving Restaurant", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Halal"]
  },
  {
    id: "hanoi-lotus",
    name: "Hanoi Lotus",
    location: "Hanoi, Vietnam",
    address: "Old Quarter, Hanoi",
    cuisine: "Vietnamese",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Luxury Vietnamese restaurant in a historic French colonial building.",
    phone: "+84 24 1234 5678",
    website: "https://www.hanoilotus.vn",
    coordinates: { lat: 21.0285, lng: 105.8542 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Minh T.", rating: 5, text: "Perfect fusion of French and Vietnamese!" },
      { author: "Lan N.", rating: 5, text: "Elegant atmosphere and service." }
    ],
    popularDishes: ["Pho", "Banh Mi", "Spring Rolls", "Ca Phe Trung"],
    reservationNeeded: true,
    amenities: ["Historic Setting", "Private Dining", "Wine Cellar", "Cooking Classes"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "taipei-101",
    name: "Taipei 101",
    location: "Taipei, Taiwan",
    address: "Taipei 101, Taipei",
    cuisine: "Taiwanese",
    rating: 4.8,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Luxury restaurant on the 85th floor of Taipei 101, offering modern Taiwanese cuisine.",
    phone: "+886 2 1234 5678",
    website: "https://www.taipei101.tw",
    coordinates: { lat: 25.0330, lng: 121.5654 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Wei C.", rating: 5, text: "Breathtaking views of Taipei!" },
      { author: "Mei L.", rating: 5, text: "Innovative Taiwanese cuisine." }
    ],
    popularDishes: ["Xiaolongbao", "Beef Noodle Soup", "Oyster Omelette", "Bubble Tea"],
    reservationNeeded: true,
    amenities: ["City View", "Private Dining", "Wine Pairing"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },

  // Lebanese restaurants
  {
    id: "em-sherif",
    name: "Em Sherif",
    location: "Beirut, Lebanon",
    address: "Achrafieh, Beirut, Lebanon",
    cuisine: "Lebanese",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Luxury Lebanese restaurant offering authentic traditional cuisine in an elegant setting. Known for its mezze and live cooking stations.",
    phone: "+961 1 200 800",
    website: "https://www.emsherif.com",
    coordinates: { lat: 33.8845, lng: 35.5214 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Nadine K.", rating: 5, text: "The best Lebanese dining experience in Beirut!" },
      { author: "Karim S.", rating: 5, text: "Authentic flavors and impeccable service." }
    ],
    popularDishes: ["Fattoush", "Hummus", "Mixed Grill", "Kunafa"],
    reservationNeeded: true,
    amenities: ["Live Music", "Private Dining", "Wine Cellar", "Outdoor Seating"],
    dietaryOptions: ["Vegetarian", "Vegan", "Halal"]
  },
  {
    id: "tawlet",
    name: "Tawlet",
    location: "Beirut, Lebanon",
    address: "Mar Mikhael, Beirut, Lebanon",
    cuisine: "Lebanese",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Farm-to-table Lebanese restaurant featuring daily changing menus prepared by different home cooks from various regions of Lebanon.",
    phone: "+961 1 448 129",
    website: "https://www.tawlet.com",
    coordinates: { lat: 33.8969, lng: 35.5103 },
    openHours: "12:00 PM - 4:00 PM, 7:00 PM - 11:00 PM",
    reviews: [
      { author: "Maya H.", rating: 5, text: "Unique concept showcasing authentic Lebanese home cooking." },
      { author: "Tony R.", rating: 4, text: "Great way to experience different regional Lebanese cuisines." }
    ],
    popularDishes: ["Daily Specials", "Mezze", "Traditional Stews", "Homemade Desserts"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Cooking Classes", "Local Products Shop"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "liza",
    name: "Liza",
    location: "Beirut, Lebanon",
    address: "Achrafieh, Beirut, Lebanon",
    cuisine: "Lebanese",
    rating: 4.8,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Sophisticated Lebanese restaurant set in a beautiful 19th-century mansion, offering refined traditional cuisine.",
    phone: "+961 1 200 800",
    website: "https://www.lizabeirut.com",
    coordinates: { lat: 33.8845, lng: 35.5214 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Sara M.", rating: 5, text: "Elegant atmosphere and exceptional Lebanese cuisine." },
      { author: "Fadi K.", rating: 5, text: "Perfect for special occasions." }
    ],
    popularDishes: ["Mouhamara", "Kibbeh Nayeh", "Grilled Sea Bass", "Mamoul"],
    reservationNeeded: true,
    amenities: ["Historic Setting", "Private Dining", "Garden", "Wine Cellar"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "mayrig",
    name: "Mayrig",
    location: "Beirut, Lebanon",
    address: "Gemmayze, Beirut, Lebanon",
    cuisine: "Armenian-Lebanese",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Authentic Armenian-Lebanese restaurant serving traditional dishes in a warm, family-friendly atmosphere.",
    phone: "+961 1 566 457",
    website: "https://www.mayrig.com",
    coordinates: { lat: 33.8969, lng: 35.5103 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Armen K.", rating: 5, text: "Best Armenian cuisine in Beirut!" },
      { author: "Lara T.", rating: 4, text: "Authentic flavors and cozy atmosphere." }
    ],
    popularDishes: ["Manti", "Lahmajoun", "Kebab", "Baklava"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Family Style", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "souk-el-tayeb",
    name: "Souk el Tayeb",
    location: "Beirut, Lebanon",
    address: "Downtown Beirut, Lebanon",
    cuisine: "Lebanese",
    rating: 4.8,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Farmers' market and restaurant promoting sustainable Lebanese agriculture and traditional cuisine.",
    phone: "+961 1 448 129",
    website: "https://www.soukeltayeb.com",
    coordinates: { lat: 33.8967, lng: 35.5077 },
    openHours: "9:00 AM - 6:00 PM",
    reviews: [
      { author: "Zeina A.", rating: 5, text: "Fresh, organic produce and authentic Lebanese street food." },
      { author: "Hassan M.", rating: 4, text: "Great place to experience local food culture." }
    ],
    popularDishes: ["Manoushe", "Foul", "Labneh", "Seasonal Fruits"],
    reservationNeeded: false,
    amenities: ["Outdoor Seating", "Local Products", "Cooking Workshops"],
    dietaryOptions: ["Vegetarian", "Vegan", "Organic"]
  },
  {
    id: "al-sultan-brahim",
    name: "Al Sultan Brahim",
    location: "Beirut, Lebanon",
    address: "Hamra, Beirut, Lebanon",
    cuisine: "Lebanese Seafood",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Iconic seafood restaurant serving fresh fish and traditional Lebanese seafood dishes since 1969.",
    phone: "+961 1 738 840",
    website: "https://www.alsultanbrahim.com",
    coordinates: { lat: 33.8969, lng: 35.5103 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Rami S.", rating: 5, text: "Best seafood in Beirut!" },
      { author: "Nour H.", rating: 4, text: "Fresh fish and authentic flavors." }
    ],
    popularDishes: ["Grilled Sea Bass", "Sayadieh", "Shrimp Arak", "Fish Mezze"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Private Dining", "Wine Selection"],
    dietaryOptions: ["Gluten-Free", "Halal"]
  },
  {
    id: "le-petit-gris",
    name: "Le Petit Gris",
    location: "Beirut, Lebanon",
    address: "Gemmayze, Beirut, Lebanon",
    cuisine: "Lebanese-French",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1535140728328-0bfb32dacd1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Charming bistro offering a fusion of Lebanese and French cuisine in a cozy setting.",
    phone: "+961 1 566 457",
    website: "https://www.lepetitgris.com",
    coordinates: { lat: 33.8969, lng: 35.5103 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Pierre D.", rating: 5, text: "Perfect blend of French and Lebanese flavors." },
      { author: "Layla M.", rating: 4, text: "Cozy atmosphere and creative dishes." }
    ],
    popularDishes: ["Escargot", "Kibbeh", "Coq au Vin", "Crème Brûlée"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Wine Bar", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"]
  },
  {
    id: "babel-bay",
    name: "Babel Bay",
    location: "Byblos, Lebanon",
    address: "Byblos Harbor, Byblos, Lebanon",
    cuisine: "Lebanese Seafood",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Luxury seafood restaurant with stunning views of the historic Byblos harbor, serving fresh seafood and traditional Lebanese dishes.",
    phone: "+961 9 940 777",
    website: "https://www.babelbay.com",
    coordinates: { lat: 34.1237, lng: 35.6516 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Marc A.", rating: 5, text: "Breathtaking views and exceptional seafood!" },
      { author: "Nadine K.", rating: 5, text: "Perfect for special occasions." }
    ],
    popularDishes: ["Grilled Lobster", "Sayadieh", "Seafood Mezze", "Fresh Oysters"],
    reservationNeeded: true,
    amenities: ["Harbor View", "Private Dining", "Wine Cellar", "Outdoor Seating"],
    dietaryOptions: ["Gluten-Free", "Halal"]
  },
  {
    id: "mounir",
    name: "Mounir",
    location: "Zahle, Lebanon",
    address: "Zahle, Bekaa Valley, Lebanon",
    cuisine: "Lebanese",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Traditional Lebanese restaurant in the heart of Zahle, known for its authentic mezze and grilled meats.",
    phone: "+961 8 820 000",
    website: "https://www.mounir.com",
    coordinates: { lat: 33.8497, lng: 35.9022 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Tony R.", rating: 5, text: "Best mezze in Zahle!" },
      { author: "Maya H.", rating: 4, text: "Authentic Lebanese flavors." }
    ],
    popularDishes: ["Mixed Grill", "Hummus", "Kibbeh", "Fattoush"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Family Style", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Halal"]
  },
  {
    id: "pepe's-fishing-club",
    name: "Pepe's Fishing Club",
    location: "Byblos, Lebanon",
    address: "Byblos Harbor, Byblos, Lebanon",
    cuisine: "Lebanese Seafood",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Historic seafood restaurant in Byblos harbor, serving fresh fish and traditional Lebanese seafood dishes since 1963.",
    phone: "+961 9 540 218",
    website: "https://www.pepesfishingclub.com",
    coordinates: { lat: 34.1237, lng: 35.6516 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Samir K.", rating: 5, text: "Iconic seafood restaurant with amazing views!" },
      { author: "Lara T.", rating: 4, text: "Fresh fish and authentic atmosphere." }
    ],
    popularDishes: ["Grilled Fish", "Seafood Pasta", "Fish Mezze", "Shrimp Arak"],
    reservationNeeded: true,
    amenities: ["Harbor View", "Outdoor Seating", "Private Dining"],
    dietaryOptions: ["Gluten-Free", "Halal"]
  },
  // Additional international restaurants
  {
    id: "tokyo-sushi",
    name: "Sukiyabashi Jiro",
    location: "Tokyo, Japan",
    address: "Ginza, Tokyo, Japan",
    cuisine: "Japanese",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Legendary sushi restaurant by Jiro Ono, offering an intimate omakase experience.",
    phone: "+81 3 3535 3600",
    website: "https://www.sukiyabashi-jiro.com",
    coordinates: { lat: 35.6895, lng: 139.7637 },
    openHours: "5:30 PM - 8:30 PM",
    reviews: [
      { author: "Hiroshi T.", rating: 5, text: "The ultimate sushi experience!" },
      { author: "Yuki S.", rating: 5, text: "Masterful craftsmanship in every piece." }
    ],
    popularDishes: ["Otoro", "Uni", "Tamago", "Akami"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Chef's Counter", "Wine Pairing"],
    dietaryOptions: ["Gluten-Free"]
  },
  {
    id: "paris-bistro",
    name: "Le Comptoir du Relais",
    location: "Paris, France",
    address: "Saint-Germain, Paris, France",
    cuisine: "French",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Classic Parisian bistro serving traditional French cuisine in a charming setting.",
    phone: "+33 1 44 27 07 97",
    website: "https://www.hotel-paris-relais-saint-germain.com",
    coordinates: { lat: 48.8534, lng: 2.3388 },
    openHours: "12:00 PM - 11:00 PM",
    reviews: [
      { author: "Marie L.", rating: 5, text: "Authentic French bistro experience!" },
      { author: "Pierre D.", rating: 4, text: "Classic dishes done perfectly." }
    ],
    popularDishes: ["Coq au Vin", "Steak Frites", "Crème Brûlée", "Escargot"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Wine Bar", "Historic Setting"],
    dietaryOptions: ["Vegetarian"]
  },
  {
    id: "london-indian",
    name: "Dishoom",
    location: "London, UK",
    address: "Covent Garden, London, UK",
    cuisine: "Indian",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern Indian restaurant inspired by the Irani cafés of Bombay, serving authentic dishes with a contemporary twist.",
    phone: "+44 20 7420 9320",
    website: "https://www.dishoom.com",
    coordinates: { lat: 51.5129, lng: -0.1243 },
    openHours: "8:00 AM - 11:00 PM",
    reviews: [
      { author: "Raj K.", rating: 5, text: "Best Indian breakfast in London!" },
      { author: "Sarah M.", rating: 4, text: "Great atmosphere and authentic flavors." }
    ],
    popularDishes: ["Bacon Naan Roll", "Black Daal", "Chicken Ruby", "House Chai"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Bar", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "new-york-steak",
    name: "Peter Luger Steak House",
    location: "New York, USA",
    address: "Brooklyn, New York, USA",
    cuisine: "American",
    rating: 4.8,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Iconic steakhouse serving the finest dry-aged beef since 1887.",
    phone: "+1 718 387 7400",
    website: "https://www.peterluger.com",
    coordinates: { lat: 40.7082, lng: -73.9571 },
    openHours: "11:45 AM - 9:45 PM",
    reviews: [
      { author: "John S.", rating: 5, text: "Best steak in New York!" },
      { author: "Michael R.", rating: 5, text: "Worth every penny for the perfect steak." }
    ],
    popularDishes: ["Porterhouse Steak", "Luger's Special Sauce", "German Fried Potatoes", "Creamed Spinach"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Wine Cellar", "Historic Setting"],
    dietaryOptions: ["Gluten-Free"]
  },
  {
    id: "rome-pasta",
    name: "Roscioli",
    location: "Rome, Italy",
    address: "Campo de' Fiori, Rome, Italy",
    cuisine: "Italian",
    rating: 4.9,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Historic deli and restaurant serving authentic Roman cuisine and artisanal products.",
    phone: "+39 06 687 5287",
    website: "https://www.salumeriaroscioli.com",
    coordinates: { lat: 41.8955, lng: 12.4714 },
    openHours: "12:30 PM - 4:00 PM, 7:00 PM - 11:00 PM",
    reviews: [
      { author: "Marco R.", rating: 5, text: "Best carbonara in Rome!" },
      { author: "Sofia M.", rating: 5, text: "Authentic Roman flavors and atmosphere." }
    ],
    popularDishes: ["Carbonara", "Cacio e Pepe", "Amatriciana", "Burrata"],
    reservationNeeded: true,
    amenities: ["Wine Shop", "Deli Counter", "Outdoor Seating"],
    dietaryOptions: ["Vegetarian"]
  },
  {
    id: "bangkok-thai",
    name: "Nusara",
    location: "Bangkok, Thailand",
    address: "Charoenkrung, Bangkok, Thailand",
    cuisine: "Thai",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern Thai restaurant offering innovative interpretations of traditional dishes.",
    phone: "+66 2 234 5678",
    website: "https://www.nusara.com",
    coordinates: { lat: 13.7279, lng: 100.5241 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Somchai P.", rating: 5, text: "Revolutionary Thai cuisine!" },
      { author: "Lisa W.", rating: 5, text: "Creative and delicious modern Thai food." }
    ],
    popularDishes: ["Tom Yum", "Pad Thai", "Green Curry", "Mango Sticky Rice"],
    reservationNeeded: true,
    amenities: ["Chef's Table", "Wine Pairing", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "dubai-arabic",
    name: "Al Hadheerah",
    location: "Dubai, UAE",
    address: "Bab Al Shams Desert Resort, Dubai, UAE",
    cuisine: "Arabic",
    rating: 4.8,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Desert dining experience offering traditional Arabic cuisine and entertainment.",
    phone: "+971 4 809 6100",
    website: "https://www.alhadheerah.com",
    coordinates: { lat: 24.9534, lng: 55.4701 },
    openHours: "6:30 PM - 11:00 PM",
    reviews: [
      { author: "Ahmed K.", rating: 5, text: "Magical desert dining experience!" },
      { author: "Fatima M.", rating: 5, text: "Authentic Arabic cuisine in a stunning setting." }
    ],
    popularDishes: ["Mixed Grill", "Hummus", "Shawarma", "Umm Ali"],
    reservationNeeded: true,
    amenities: ["Live Entertainment", "Desert Setting", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Halal"]
  },
  {
    id: "sydney-seafood",
    name: "Quay",
    location: "Sydney, Australia",
    address: "Circular Quay, Sydney, Australia",
    cuisine: "Australian",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Award-winning restaurant with stunning harbor views, serving modern Australian cuisine.",
    phone: "+61 2 9251 5600",
    website: "https://www.quay.com.au",
    coordinates: { lat: -33.8587, lng: 151.2140 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "James W.", rating: 5, text: "Best fine dining in Sydney!" },
      { author: "Emma T.", rating: 5, text: "Incredible views and innovative cuisine." }
    ],
    popularDishes: ["Snow Egg", "Confit of Petuna Ocean Trout", "Mud Crab Congee", "White Coral"],
    reservationNeeded: true,
    amenities: ["Harbor View", "Private Dining", "Wine Pairing"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "mumbai-indian",
    name: "Bombay Canteen",
    location: "Mumbai, India",
    address: "Lower Parel, Mumbai, India",
    cuisine: "Indian",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern Indian restaurant celebrating regional Indian cuisine with a contemporary twist.",
    phone: "+91 22 4966 6666",
    website: "https://www.thebombaycanteen.com",
    coordinates: { lat: 19.0170, lng: 72.8283 },
    openHours: "12:00 PM - 1:00 AM",
    reviews: [
      { author: "Rahul S.", rating: 5, text: "Innovative Indian cuisine!" },
      { author: "Priya M.", rating: 4, text: "Great cocktails and creative dishes." }
    ],
    popularDishes: ["Kejriwal Toast", "Pork Vindaloo", "Tandoori Chicken", "Gulab Jamun"],
    reservationNeeded: true,
    amenities: ["Bar", "Outdoor Seating", "Live Music"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "copenhagen-nordic",
    name: "Noma",
    location: "Copenhagen, Denmark",
    address: "Refshalevej, Copenhagen, Denmark",
    cuisine: "Nordic",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "World-renowned restaurant pioneering New Nordic cuisine with seasonal ingredients.",
    phone: "+45 32 96 32 97",
    website: "https://www.noma.dk",
    coordinates: { lat: 55.6828, lng: 12.6107 },
    openHours: "5:30 PM - 9:30 PM",
    reviews: [
      { author: "Lars J.", rating: 5, text: "Revolutionary dining experience!" },
      { author: "Anna K.", rating: 5, text: "Innovative and unforgettable." }
    ],
    popularDishes: ["Ants on Shrimp", "Vegetable Season", "Game and Forest Season", "Seafood Season"],
    reservationNeeded: true,
    amenities: ["Chef's Table", "Wine Pairing", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  // Additional 10 restaurants
  {
    id: "singapore-hawker",
    name: "Liao Fan Hawker Chan",
    location: "Singapore",
    address: "Chinatown Complex, Singapore",
    cuisine: "Chinese",
    rating: 4.8,
    priceRange: "Under $15",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "World's first Michelin-starred hawker stall serving famous soy sauce chicken rice and noodles.",
    phone: "+65 6222 1717",
    website: "https://www.liaofanhawkerchan.com",
    coordinates: { lat: 1.2847, lng: 103.8440 },
    openHours: "10:30 AM - 3:30 PM, 6:00 PM - 8:00 PM",
    reviews: [
      { author: "Wei L.", rating: 5, text: "Best soy sauce chicken in Singapore!" },
      { author: "Mei C.", rating: 4, text: "Michelin-starred food at hawker prices." }
    ],
    popularDishes: ["Soy Sauce Chicken Rice", "Char Siew Rice", "Roast Pork Noodles", "BBQ Pork"],
    reservationNeeded: false,
    amenities: ["Takeout", "Outdoor Seating"],
    dietaryOptions: ["Halal"]
  },
  {
    id: "berlin-german",
    name: "Zur Letzten Instanz",
    location: "Berlin, Germany",
    address: "Waisenstraße, Berlin, Germany",
    cuisine: "German",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Berlin's oldest restaurant, serving traditional German cuisine since 1621.",
    phone: "+49 30 242 5528",
    website: "https://www.zurletzteninstanz.de",
    coordinates: { lat: 52.5200, lng: 13.4050 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Hans M.", rating: 5, text: "Authentic German food in historic setting!" },
      { author: "Klara B.", rating: 4, text: "Great traditional dishes and atmosphere." }
    ],
    popularDishes: ["Eisbein", "Sauerbraten", "Wiener Schnitzel", "Apple Strudel"],
    reservationNeeded: true,
    amenities: ["Historic Setting", "Beer Garden", "Private Dining"],
    dietaryOptions: ["Vegetarian"]
  },
  {
    id: "lisbon-portuguese",
    name: "Belcanto",
    location: "Lisbon, Portugal",
    address: "Largo de São Carlos, Lisbon, Portugal",
    cuisine: "Portuguese",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Two Michelin-starred restaurant offering innovative Portuguese cuisine by Chef José Avillez.",
    phone: "+351 21 342 0607",
    website: "https://www.belcanto.pt",
    coordinates: { lat: 38.7071, lng: -9.1393 },
    openHours: "7:00 PM - 10:00 PM",
    reviews: [
      { author: "Antonio S.", rating: 5, text: "Revolutionary Portuguese cuisine!" },
      { author: "Maria L.", rating: 5, text: "Exceptional dining experience." }
    ],
    popularDishes: ["Bacalhau à Brás", "Arroz de Pato", "Pastéis de Nata", "Seafood Rice"],
    reservationNeeded: true,
    amenities: ["Wine Pairing", "Private Dining", "Historic Setting"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"]
  },
  {
    id: "seoul-korean",
    name: "Jungsik",
    location: "Seoul, South Korea",
    address: "Gangnam-gu, Seoul, South Korea",
    cuisine: "Korean",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Two Michelin-starred restaurant offering modern interpretations of traditional Korean cuisine.",
    phone: "+82 2 517 4654",
    website: "https://www.jungsik.kr",
    coordinates: { lat: 37.5665, lng: 126.9780 },
    openHours: "12:00 PM - 2:00 PM, 6:00 PM - 10:00 PM",
    reviews: [
      { author: "Ji-hoon K.", rating: 5, text: "Innovative Korean fine dining!" },
      { author: "Soo-jin L.", rating: 5, text: "Perfect fusion of tradition and modernity." }
    ],
    popularDishes: ["Bibimbap", "Galbi", "Japchae", "Dolsot Rice"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Wine Pairing", "Chef's Table"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "mexico-city-mexican",
    name: "Pujol",
    location: "Mexico City, Mexico",
    address: "Polanco, Mexico City, Mexico",
    cuisine: "Mexican",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "World-renowned restaurant by Chef Enrique Olvera, offering innovative Mexican cuisine.",
    phone: "+52 55 5545 4111",
    website: "https://www.pujol.com.mx",
    coordinates: { lat: 19.4326, lng: -99.1332 },
    openHours: "1:30 PM - 2:30 PM, 7:00 PM - 9:00 PM",
    reviews: [
      { author: "Carlos M.", rating: 5, text: "Revolutionary Mexican cuisine!" },
      { author: "Ana R.", rating: 5, text: "Unforgettable dining experience." }
    ],
    popularDishes: ["Mole Madre", "Taco Omakase", "Baby Corn", "Chocolate Tamal"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Wine Pairing", "Chef's Table"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "amsterdam-dutch",
    name: "Restaurant de Kas",
    location: "Amsterdam, Netherlands",
    address: "Park Frankendael, Amsterdam, Netherlands",
    cuisine: "Dutch",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Farm-to-table restaurant in a greenhouse, serving seasonal Dutch cuisine.",
    phone: "+31 20 462 4562",
    website: "https://www.restaurantdekas.nl",
    coordinates: { lat: 52.3676, lng: 4.9041 },
    openHours: "12:00 PM - 2:00 PM, 6:30 PM - 10:00 PM",
    reviews: [
      { author: "Jan V.", rating: 5, text: "Fresh and innovative Dutch cuisine!" },
      { author: "Lisa D.", rating: 4, text: "Beautiful setting and seasonal dishes." }
    ],
    popularDishes: ["Greenhouse Salad", "Dutch Fish", "Local Vegetables", "Seasonal Desserts"],
    reservationNeeded: true,
    amenities: ["Greenhouse Setting", "Garden", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "hong-kong-chinese",
    name: "Tim Ho Wan",
    location: "Hong Kong",
    address: "North Point, Hong Kong",
    cuisine: "Chinese",
    rating: 4.7,
    priceRange: "Under $15",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "World's cheapest Michelin-starred restaurant, famous for dim sum.",
    phone: "+852 2332 3078",
    website: "https://www.timhowan.com",
    coordinates: { lat: 22.3193, lng: 114.1694 },
    openHours: "10:00 AM - 9:30 PM",
    reviews: [
      { author: "Wong L.", rating: 5, text: "Best dim sum in Hong Kong!" },
      { author: "Ming C.", rating: 4, text: "Michelin-starred food at affordable prices." }
    ],
    popularDishes: ["BBQ Pork Buns", "Shrimp Dumplings", "Rice Rolls", "Egg Tarts"],
    reservationNeeded: false,
    amenities: ["Takeout", "Quick Service"],
    dietaryOptions: ["Vegetarian"]
  },
  {
    id: "stockholm-swedish",
    name: "Frantzén",
    location: "Stockholm, Sweden",
    address: "Gamla Stan, Stockholm, Sweden",
    cuisine: "Swedish",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Three Michelin-starred restaurant offering innovative Nordic cuisine.",
    phone: "+46 8 20 85 80",
    website: "https://www.restaurantfrantzen.com",
    coordinates: { lat: 59.3293, lng: 18.0686 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Erik S.", rating: 5, text: "Revolutionary Nordic cuisine!" },
      { author: "Anna L.", rating: 5, text: "Unforgettable dining experience." }
    ],
    popularDishes: ["Langoustine", "Nordic Caviar", "Wild Duck", "Cloudberry"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Wine Pairing", "Chef's Table"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "buenos-aires-argentine",
    name: "Don Julio",
    location: "Buenos Aires, Argentina",
    address: "Palermo, Buenos Aires, Argentina",
    cuisine: "Argentine",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "World-renowned parrilla (steakhouse) serving the finest Argentine beef.",
    phone: "+54 11 4832 6058",
    website: "https://www.parrilladonjulio.com",
    coordinates: { lat: -34.6037, lng: -58.3816 },
    openHours: "12:00 PM - 12:00 AM",
    reviews: [
      { author: "Carlos R.", rating: 5, text: "Best steak in Buenos Aires!" },
      { author: "Maria G.", rating: 5, text: "Authentic Argentine parrilla experience." }
    ],
    popularDishes: ["Bife de Chorizo", "Provoleta", "Chimichurri", "Malbec"],
    reservationNeeded: true,
    amenities: ["Wine Cellar", "Outdoor Seating", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"]
  },
  {
    id: "oslo-norwegian",
    name: "Maaemo",
    location: "Oslo, Norway",
    address: "Bjørvika, Oslo, Norway",
    cuisine: "Norwegian",
    rating: 4.9,
    priceRange: "Over $60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Three Michelin-starred restaurant offering innovative Norwegian cuisine.",
    phone: "+47 22 17 99 69",
    website: "https://www.maaemo.no",
    coordinates: { lat: 59.9139, lng: 10.7522 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "Lars N.", rating: 5, text: "Revolutionary Norwegian cuisine!" },
      { author: "Ingrid B.", rating: 5, text: "Exceptional dining experience." }
    ],
    popularDishes: ["Nordic Seafood", "Wild Game", "Foraged Herbs", "Cloudberry"],
    reservationNeeded: true,
    amenities: ["Private Dining", "Wine Pairing", "Chef's Table"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "delhi-vegetarian",
    name: "Sattvik",
    location: "Delhi, India",
    address: "Connaught Place, Delhi, India",
    cuisine: "Vegetarian Indian",
    rating: 4.8,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Pure vegetarian restaurant serving authentic Indian dishes with a focus on Ayurvedic principles.",
    phone: "+91 11 2345 6789",
    website: "https://www.sattvik.com",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    openHours: "11:00 AM - 11:00 PM",
    reviews: [
      { author: "Priya S.", rating: 5, text: "Best vegetarian thali in Delhi!" },
      { author: "Rahul M.", rating: 4, text: "Authentic flavors and healthy options." }
    ],
    popularDishes: ["Thali", "Paneer Butter Masala", "Dal Makhani", "Gulab Jamun"],
    reservationNeeded: true,
    amenities: ["Outdoor Seating", "Private Dining", "Ayurvedic Menu"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "berlin-vegan",
    name: "Kopps",
    location: "Berlin, Germany",
    address: "Mitte, Berlin, Germany",
    cuisine: "Vegan German",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Upscale vegan restaurant offering innovative plant-based versions of traditional German dishes.",
    phone: "+49 30 4320 9876",
    website: "https://www.kopps-berlin.de",
    coordinates: { lat: 52.5200, lng: 13.4050 },
    openHours: "12:00 PM - 10:00 PM",
    reviews: [
      { author: "Anna K.", rating: 5, text: "Revolutionary vegan cuisine!" },
      { author: "Thomas B.", rating: 4, text: "Creative plant-based dishes." }
    ],
    popularDishes: ["Vegan Schnitzel", "Seitan Roast", "Cashew Cheese", "Apple Strudel"],
    reservationNeeded: true,
    amenities: ["Wine Bar", "Private Dining", "Chef's Table"],
    dietaryOptions: ["Vegan", "Gluten-Free"]
  },
  {
    id: "tel-aviv-vegan",
    name: "Meshek Barzilay",
    location: "Tel Aviv, Israel",
    address: "Neve Tzedek, Tel Aviv, Israel",
    cuisine: "Vegan Mediterranean",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Organic vegan restaurant serving innovative Mediterranean cuisine with local ingredients.",
    phone: "+972 3 516 6329",
    website: "https://www.meshekbarzilay.co.il",
    coordinates: { lat: 32.0853, lng: 34.7818 },
    openHours: "8:00 AM - 11:00 PM",
    reviews: [
      { author: "David L.", rating: 5, text: "Best vegan food in Tel Aviv!" },
      { author: "Sarah M.", rating: 5, text: "Creative and delicious plant-based dishes." }
    ],
    popularDishes: ["Vegan Shakshuka", "Quinoa Bowl", "Raw Lasagna", "Cashew Cheesecake"],
    reservationNeeded: true,
    amenities: ["Organic Garden", "Wine Bar", "Cooking Classes"],
    dietaryOptions: ["Vegan", "Gluten-Free", "Raw Food"]
  },
  {
    id: "london-vegetarian",
    name: "Mildreds",
    location: "London, UK",
    address: "Soho, London, UK",
    cuisine: "Vegetarian International",
    rating: 4.6,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Popular vegetarian restaurant serving global cuisine with a focus on seasonal ingredients.",
    phone: "+44 20 7494 1634",
    website: "https://www.mildreds.co.uk",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    openHours: "11:00 AM - 11:00 PM",
    reviews: [
      { author: "Emma W.", rating: 5, text: "Amazing vegetarian options!" },
      { author: "James P.", rating: 4, text: "Great variety of dishes." }
    ],
    popularDishes: ["Halloumi Burger", "Sri Lankan Curry", "Polenta Chips", "Chocolate Brownie"],
    reservationNeeded: true,
    amenities: ["Bar", "Outdoor Seating", "Takeout"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "tokyo-vegetarian",
    name: "T's Tantan",
    location: "Tokyo, Japan",
    address: "Tokyo Station, Tokyo, Japan",
    cuisine: "Vegetarian Japanese",
    rating: 4.7,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Popular vegetarian ramen restaurant in Tokyo Station, known for its plant-based tantanmen.",
    phone: "+81 3 3218 8040",
    website: "https://www.tstantan.com",
    coordinates: { lat: 35.6812, lng: 139.7671 },
    openHours: "11:00 AM - 10:00 PM",
    reviews: [
      { author: "Yuki S.", rating: 5, text: "Best vegetarian ramen in Tokyo!" },
      { author: "Hiroshi T.", rating: 4, text: "Authentic flavors without meat." }
    ],
    popularDishes: ["Tantanmen", "Vegan Gyoza", "Vegetable Ramen", "Tofu Steak"],
    reservationNeeded: false,
    amenities: ["Quick Service", "Takeout"],
    dietaryOptions: ["Vegetarian", "Vegan"]
  },
  {
    id: "barcelona-vegetarian",
    name: "Teresa Carles",
    location: "Barcelona, Spain",
    address: "Raval, Barcelona, Spain",
    cuisine: "Vegetarian Mediterranean",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Upscale vegetarian restaurant offering creative Mediterranean cuisine with local ingredients.",
    phone: "+34 93 317 1848",
    website: "https://www.teresacarles.com",
    coordinates: { lat: 41.3851, lng: 2.1734 },
    openHours: "1:00 PM - 11:00 PM",
    reviews: [
      { author: "Maria G.", rating: 5, text: "Innovative vegetarian cuisine!" },
      { author: "Carlos R.", rating: 5, text: "Beautiful presentation and flavors." }
    ],
    popularDishes: ["Vegetable Paella", "Quinoa Salad", "Mushroom Risotto", "Vegan Cheesecake"],
    reservationNeeded: true,
    amenities: ["Wine Bar", "Private Dining", "Cooking Classes"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "melbourne-vegan",
    name: "Smith & Daughters",
    location: "Melbourne, Australia",
    address: "Fitzroy, Melbourne, Australia",
    cuisine: "Vegan Latin",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Vegan Latin restaurant serving creative plant-based versions of traditional dishes.",
    phone: "+61 3 9939 3293",
    website: "https://www.smithanddaughters.com",
    coordinates: { lat: -37.8136, lng: 144.9631 },
    openHours: "5:00 PM - 10:00 PM",
    reviews: [
      { author: "Emma T.", rating: 5, text: "Best vegan Latin food!" },
      { author: "James W.", rating: 4, text: "Creative and delicious dishes." }
    ],
    popularDishes: ["Vegan Empanadas", "Seitan Asado", "Plantain Chips", "Churros"],
    reservationNeeded: true,
    amenities: ["Bar", "Outdoor Seating", "Private Dining"],
    dietaryOptions: ["Vegan", "Gluten-Free"]
  },
  {
    id: "amsterdam-vegetarian",
    name: "De Bolhoed",
    location: "Amsterdam, Netherlands",
    address: "Jordaan, Amsterdam, Netherlands",
    cuisine: "Vegetarian International",
    rating: 4.6,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Cozy vegetarian restaurant serving organic international cuisine in a historic setting.",
    phone: "+31 20 626 1803",
    website: "https://www.bolhoed.nl",
    coordinates: { lat: 52.3676, lng: 4.9041 },
    openHours: "12:00 PM - 10:00 PM",
    reviews: [
      { author: "Jan V.", rating: 5, text: "Great vegetarian options!" },
      { author: "Lisa D.", rating: 4, text: "Cozy atmosphere and good food." }
    ],
    popularDishes: ["Vegetable Curry", "Quinoa Bowl", "Vegan Burger", "Apple Pie"],
    reservationNeeded: true,
    amenities: ["Organic Menu", "Historic Setting", "Outdoor Seating"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "paris-vegetarian",
    name: "Le Potager du Marais",
    location: "Paris, France",
    address: "Le Marais, Paris, France",
    cuisine: "Vegetarian French",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Traditional French vegetarian restaurant offering classic dishes with a plant-based twist.",
    phone: "+33 1 42 74 24 66",
    website: "https://www.lepotagerdumarais.fr",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    openHours: "12:00 PM - 10:00 PM",
    reviews: [
      { author: "Marie L.", rating: 5, text: "Authentic French vegetarian cuisine!" },
      { author: "Pierre D.", rating: 4, text: "Creative plant-based dishes." }
    ],
    popularDishes: ["Vegetable Terrine", "Mushroom Bourguignon", "Ratatouille", "Crème Brûlée"],
    reservationNeeded: true,
    amenities: ["Wine Bar", "Historic Setting", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "new-york-vegan",
    name: "Dirt Candy",
    location: "New York, USA",
    address: "Lower East Side, New York, USA",
    cuisine: "Vegan American",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Award-winning vegan restaurant known for its creative vegetable-focused cuisine.",
    phone: "+1 212 228 7732",
    website: "https://www.dirtcandynyc.com",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    openHours: "5:00 PM - 10:00 PM",
    reviews: [
      { author: "John S.", rating: 5, text: "Revolutionary vegan cuisine!" },
      { author: "Sarah M.", rating: 5, text: "Creative and delicious dishes." }
    ],
    popularDishes: ["Carrot Sliders", "Broccoli Dogs", "Mushroom Mousse", "Corn Ice Cream"],
    reservationNeeded: true,
    amenities: ["Wine Pairing", "Chef's Table", "Private Dining"],
    dietaryOptions: ["Vegan", "Gluten-Free"]
  },
  {
    id: "rome-vegetarian",
    name: "Il Margutta",
    location: "Rome, Italy",
    address: "Via Margutta, Rome, Italy",
    cuisine: "Vegetarian Italian",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Elegant vegetarian restaurant serving creative Italian cuisine in a historic setting.",
    phone: "+39 06 3265 0577",
    website: "https://www.ilmargutta.it",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    openHours: "12:30 PM - 10:30 PM",
    reviews: [
      { author: "Marco R.", rating: 5, text: "Best vegetarian Italian food!" },
      { author: "Sofia M.", rating: 4, text: "Elegant atmosphere and creative dishes." }
    ],
    popularDishes: ["Vegetable Lasagna", "Mushroom Risotto", "Artichoke Salad", "Tiramisu"],
    reservationNeeded: true,
    amenities: ["Wine Bar", "Historic Setting", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "bangkok-vegetarian",
    name: "May Veggie Home",
    location: "Bangkok, Thailand",
    address: "Sukhumvit, Bangkok, Thailand",
    cuisine: "Vegetarian Thai",
    rating: 4.6,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Popular vegetarian restaurant serving authentic Thai cuisine with plant-based ingredients.",
    phone: "+66 2 714 3174",
    website: "https://www.mayveggiehome.com",
    coordinates: { lat: 13.7563, lng: 100.5018 },
    openHours: "11:00 AM - 10:00 PM",
    reviews: [
      { author: "Somchai P.", rating: 5, text: "Authentic Thai vegetarian food!" },
      { author: "Lisa W.", rating: 4, text: "Great variety of dishes." }
    ],
    popularDishes: ["Pad Thai", "Green Curry", "Tom Yum", "Mango Sticky Rice"],
    reservationNeeded: false,
    amenities: ["Takeout", "Outdoor Seating"],
    dietaryOptions: ["Vegetarian", "Vegan"]
  },
  {
    id: "dubai-vegetarian",
    name: "Wild & The Moon",
    location: "Dubai, UAE",
    address: "City Walk, Dubai, UAE",
    cuisine: "Vegan International",
    rating: 4.7,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern vegan café serving organic, raw, and plant-based dishes with a focus on health.",
    phone: "+971 4 343 3392",
    website: "https://www.wildandthemoon.com",
    coordinates: { lat: 25.2048, lng: 55.2708 },
    openHours: "8:00 AM - 10:00 PM",
    reviews: [
      { author: "Ahmed K.", rating: 5, text: "Best vegan food in Dubai!" },
      { author: "Fatima M.", rating: 4, text: "Healthy and delicious options." }
    ],
    popularDishes: ["Acai Bowl", "Raw Lasagna", "Green Smoothie", "Vegan Cheesecake"],
    reservationNeeded: false,
    amenities: ["Takeout", "Outdoor Seating", "Juice Bar"],
    dietaryOptions: ["Vegan", "Raw Food", "Gluten-Free"]
  },
  {
    id: "sydney-vegetarian",
    name: "Yellow",
    location: "Sydney, Australia",
    address: "Potts Point, Sydney, Australia",
    cuisine: "Vegetarian Australian",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Award-winning vegetarian restaurant offering creative Australian cuisine with local ingredients.",
    phone: "+61 2 9332 2344",
    website: "https://www.yellowpotts.com.au",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    openHours: "6:00 PM - 10:00 PM",
    reviews: [
      { author: "James W.", rating: 5, text: "Innovative vegetarian cuisine!" },
      { author: "Emma T.", rating: 5, text: "Beautiful presentation and flavors." }
    ],
    popularDishes: ["Mushroom Risotto", "Vegetable Tart", "Local Cheese Plate", "Chocolate Mousse"],
    reservationNeeded: true,
    amenities: ["Wine Bar", "Private Dining", "Chef's Table"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "mumbai-vegetarian",
    name: "The Bombay Canteen",
    location: "Mumbai, India",
    address: "Lower Parel, Mumbai, India",
    cuisine: "Vegetarian Indian",
    rating: 4.7,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern vegetarian restaurant celebrating regional Indian cuisine with a contemporary twist.",
    phone: "+91 22 4966 6666",
    website: "https://www.thebombaycanteen.com",
    coordinates: { lat: 19.0170, lng: 72.8283 },
    openHours: "12:00 PM - 1:00 AM",
    reviews: [
      { author: "Rahul S.", rating: 5, text: "Best vegetarian food in Mumbai!" },
      { author: "Priya M.", rating: 4, text: "Creative and delicious dishes." }
    ],
    popularDishes: ["Kejriwal Toast", "Vegetable Curry", "Tandoori Platter", "Gulab Jamun"],
    reservationNeeded: true,
    amenities: ["Bar", "Outdoor Seating", "Live Music"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "copenhagen-vegetarian",
    name: "Bistro Lupa",
    location: "Copenhagen, Denmark",
    address: "Nørrebro, Copenhagen, Denmark",
    cuisine: "Vegetarian Nordic",
    rating: 4.8,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern vegetarian restaurant serving innovative Nordic cuisine with local ingredients.",
    phone: "+45 35 35 75 55",
    website: "https://www.bistrolupa.dk",
    coordinates: { lat: 55.6761, lng: 12.5683 },
    openHours: "5:30 PM - 10:00 PM",
    reviews: [
      { author: "Lars J.", rating: 5, text: "Creative vegetarian Nordic cuisine!" },
      { author: "Anna K.", rating: 5, text: "Beautiful presentation and flavors." }
    ],
    popularDishes: ["Root Vegetable Tart", "Wild Mushroom Risotto", "Local Cheese Plate", "Nordic Dessert"],
    reservationNeeded: true,
    amenities: ["Wine Bar", "Private Dining", "Chef's Table"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "hong-kong-vegetarian",
    name: "LockCha Tea House",
    location: "Hong Kong",
    address: "Admiralty, Hong Kong",
    cuisine: "Vegetarian Chinese",
    rating: 4.6,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Traditional vegetarian dim sum restaurant with a focus on tea culture.",
    phone: "+852 2801 7177",
    website: "https://www.lockcha.com",
    coordinates: { lat: 22.3193, lng: 114.1694 },
    openHours: "11:00 AM - 3:00 PM, 6:00 PM - 9:00 PM",
    reviews: [
      { author: "Wong L.", rating: 5, text: "Best vegetarian dim sum!" },
      { author: "Ming C.", rating: 4, text: "Authentic tea house experience." }
    ],
    popularDishes: ["Vegetable Dumplings", "Mushroom Buns", "Tea Eggs", "Lotus Root Cake"],
    reservationNeeded: true,
    amenities: ["Tea Ceremony", "Historic Setting", "Private Dining"],
    dietaryOptions: ["Vegetarian", "Vegan"]
  },
  {
    id: "singapore-vegetarian",
    name: "Joie",
    location: "Singapore",
    address: "Orchard, Singapore",
    cuisine: "Vegetarian International",
    rating: 4.7,
    priceRange: "$30-$60",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Upscale vegetarian restaurant offering creative international cuisine with a focus on presentation.",
    phone: "+65 6838 6966",
    website: "https://www.joierestaurant.com.sg",
    coordinates: { lat: 1.2847, lng: 103.8440 },
    openHours: "12:00 PM - 2:30 PM, 6:30 PM - 10:30 PM",
    reviews: [
      { author: "Wei L.", rating: 5, text: "Best vegetarian fine dining!" },
      { author: "Mei C.", rating: 5, text: "Creative and beautiful dishes." }
    ],
    popularDishes: ["Truffle Risotto", "Mushroom Wellington", "Vegetable Tart", "Chocolate Soufflé"],
    reservationNeeded: true,
    amenities: ["Wine Pairing", "Private Dining", "Chef's Table"],
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"]
  },
  {
    id: "seoul-vegetarian",
    name: "Plant",
    location: "Seoul, South Korea",
    address: "Itaewon, Seoul, South Korea",
    cuisine: "Vegan Korean",
    rating: 4.8,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Modern vegan restaurant serving creative Korean cuisine with plant-based ingredients.",
    phone: "+82 2 749 1981",
    website: "https://www.plantcafeseoul.com",
    coordinates: { lat: 37.5665, lng: 126.9780 },
    openHours: "11:00 AM - 10:00 PM",
    reviews: [
      { author: "Ji-hoon K.", rating: 5, text: "Best vegan Korean food!" },
      { author: "Soo-jin L.", rating: 4, text: "Creative and delicious dishes." }
    ],
    popularDishes: ["Bibimbap", "Kimchi Stew", "Tofu Steak", "Matcha Cake"],
    reservationNeeded: true,
    amenities: ["Takeout", "Outdoor Seating", "Cooking Classes"],
    dietaryOptions: ["Vegan", "Gluten-Free"]
  },
  {
    id: "taipei-vegetarian",
    name: "Ooh Cha Cha",
    location: "Taipei, Taiwan",
    address: "Gongguan, Taipei, Taiwan",
    cuisine: "Vegan International",
    rating: 4.7,
    priceRange: "$15-$30",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Cozy vegan café serving healthy international cuisine with a focus on local ingredients.",
    phone: "+886 2 2367 7133",
    website: "https://www.oohchacha.com",
    coordinates: { lat: 25.0330, lng: 121.5654 },
    openHours: "11:00 AM - 9:00 PM",
    reviews: [
      { author: "Wei C.", rating: 5, text: "Best vegan food in Taipei!" },
      { author: "Mei L.", rating: 4, text: "Healthy and delicious options." }
    ],
    popularDishes: ["Buddha Bowl", "Vegan Burger", "Smoothie Bowl", "Raw Cheesecake"],
    reservationNeeded: false,
    amenities: ["Takeout", "Outdoor Seating", "Juice Bar"],
    dietaryOptions: ["Vegan", "Raw Food", "Gluten-Free"]
  }
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 33.8938, lng: 35.5018 }; // Beirut as default center

const Restaurant = () => {
  const { isAuthenticated } = useAuth();
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedAmenity, setSelectedAmenity] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantType[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    notes: ''
  });
  const [locations, setLocations] = useState<string[]>([]);

  // Combine existing restaurants with new ones
  const allRestaurants = [...globalChains, ...dessertPlaces, ...additionalRestaurants];

  // Enhanced search functionality
  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = allRestaurants
        .filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(restaurant => restaurant.name)
        .slice(0, 5);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  // Extract unique locations from the data for search purposes
  useEffect(() => {
    const uniqueLocations = new Set<string>();
    allRestaurants.forEach(restaurant => {
      // Extract the city/country part
      const locationParts = restaurant.location.split(', ');
      if (locationParts.length >= 1) {
        uniqueLocations.add(locationParts[0]); // Add city
      }
      if (locationParts.length >= 2) {
        uniqueLocations.add(locationParts[1]); // Add country
      }
      // Add the full location too
      uniqueLocations.add(restaurant.location);
    });
    
    setLocations(['All', ...Array.from(uniqueLocations).sort()]);
  }, [allRestaurants]);
  
  // Handle location search from the search bar
  const handleLocationSearch = (query: string) => {
    setSearchQuery(query);
    
    // If the query exactly matches a known location, automatically filter by it
    const matchingLocation = locations.find(loc => 
      loc.toLowerCase() === query.toLowerCase()
    );
    
    if (matchingLocation && matchingLocation !== 'All') {
      setSelectedLocation(matchingLocation);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', bookingForm);
    alert('Your booking has been submitted successfully!');
  };

  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedLocation === 'All' || 
      restaurant.location.includes(selectedLocation) || 
      (restaurant.location.split(', ').length > 1 && restaurant.location.split(', ')[1] === selectedLocation);
    
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    const matchesPrice = selectedPrice === 'All' || restaurant.priceRange === selectedPrice;
    const matchesAmenity = selectedAmenity === 'All' || 
      (restaurant.amenities && restaurant.amenities.includes(selectedAmenity)) ||
      !restaurant.amenities;
    const matchesDietary = selectedDietary === 'All' || 
      (restaurant.dietaryOptions && restaurant.dietaryOptions.includes(selectedDietary)) ||
      !restaurant.dietaryOptions;
    
    return matchesSearch && matchesLocation && matchesCuisine && matchesPrice && matchesAmenity && matchesDietary;
  });

  // Google Maps API loading
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Get user's location
  useEffect(() => {
    if (viewMode === 'map') {
      setIsLoadingLocation(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            setUserLocation(defaultCenter);
            setIsLoadingLocation(false);
          }
        );
      } else {
        console.log("Geolocation is not supported");
        setUserLocation(defaultCenter);
        setIsLoadingLocation(false);
      }
    }
  }, [viewMode]);

  // Calculate nearby restaurants when user location changes
  useEffect(() => {
    if (userLocation) {
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      const nearby = allRestaurants
        .map(restaurant => ({
          ...restaurant,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            restaurant.coordinates.lat,
            restaurant.coordinates.lng
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10); // Get 10 nearest restaurants

      setNearbyRestaurants(nearby);
    }
  }, [userLocation]);

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
                Culinary Experiences
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
                Discover exquisite dining experiences from around the world
              </p>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From street food to fine dining, explore a world of flavors and create unforgettable culinary memories.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          
          {/* Enhanced Search Bar & Filters */}
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                  placeholder="Search by location, cuisine, or restaurant name..."
                value={searchQuery}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
                <AnimatePresence>
                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLocationSearch(suggestion)}
                        >
                          {suggestion}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
              <div className="flex gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
                  variant="outline" 
                  className="flex items-center gap-2 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
                  <Filter size={18} />
              Filters
                  <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
                <Button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                  variant="outline"
                  className="flex items-center gap-2 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {viewMode === 'grid' ? <Map size={18} /> : <List size={18} />}
                  {viewMode === 'grid' ? 'Map View' : 'List View'}
            </Button>
              </div>
          </div>

            {/* Enhanced Expanded Filters */}
            <AnimatePresence>
          {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                      <h3 className="font-medium text-gray-700 mb-3">Cuisine</h3>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {cuisines.map((cuisine) => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>
                    
                <div>
                      <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {priceRanges.map((price) => (
                          <option key={price} value={price}>{price}</option>
                    ))}
                  </select>
                </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Amenities</h3>
                      <select
                        value={selectedAmenity}
                        onChange={(e) => setSelectedAmenity(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        {amenities.map((amenity) => (
                          <option key={amenity} value={amenity}>{amenity}</option>
                        ))}
                      </select>
              </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Dietary Options</h3>
                      <select
                        value={selectedDietary}
                        onChange={(e) => setSelectedDietary(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        {dietaryOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
            </div>
        </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Count with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center group cursor-default">
              <span className="relative transition-all duration-300 group-hover:text-gray-600">
                Discover Restaurants
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
              </span>
              <motion.span 
                className="ml-3 text-sm font-medium bg-gray-100 text-gray-800 py-1 px-3 rounded-full"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredRestaurants.length} Results
              </motion.span>
            </h2>
          </motion.div>

          {/* Restaurant Grid/Map View */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-gray-200 hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
            >
                    <div className="relative h-48 overflow-hidden group">
                      <motion.img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <motion.div 
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-black/60"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 p-4 text-white"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="font-medium">{restaurant.location}</p>
                      </motion.div>
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <motion.span 
                          className="bg-white/90 text-amber-500 font-medium text-sm rounded-full px-2 py-1 flex items-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Star className="w-3.5 h-3.5 mr-1 fill-amber-500" />
                          {restaurant.rating.toFixed(1)}
                        </motion.span>
                        <motion.span 
                          className="bg-white/90 text-gray-800 text-sm rounded-full px-2 py-1"
                          whileHover={{ scale: 1.05 }}
                        >
                  {restaurant.priceRange}
                        </motion.span>
                </div>
              </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{restaurant.name}</h3>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {restaurant.cuisine}
                        </span>
                </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{restaurant.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {restaurant.popularDishes.slice(0, 3).map((dish, idx) => (
                          <motion.span 
                            key={idx} 
                            className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            {dish}
                          </motion.span>
                        ))}
                        {restaurant.popularDishes.length > 3 && (
                          <motion.span 
                            className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            +{restaurant.popularDishes.length - 3} more
                          </motion.span>
                        )}
                </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {restaurant.openHours.split(',')[0]}
                      </div>
                          {restaurant.reservationNeeded !== undefined && (
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className={restaurant.reservationNeeded ? 'text-amber-600 font-medium' : 'text-gray-600'}>
                                {restaurant.reservationNeeded ? 'Reservation needed' : 'No reservation needed'}
                              </span>
                      </div>
                  )}
                </div>
                <Button
                  variant="outline"
                          className="hover:bg-[hsl(214,57%,51%)] hover:text-white transition-colors"
                          onClick={() => setSelectedRestaurant(restaurant)}
                >
                          View Details
                </Button>
                      </div>
              </div>
            </motion.div>
          ))}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[600px] rounded-xl overflow-hidden shadow-lg relative"
              >
                {isLoadingLocation ? (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Getting your location...</p>
                    </div>
                  </div>
                ) : isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={userLocation || defaultCenter}
                    zoom={13}
                    options={{
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }]
                        },
                        {
                          featureType: "transit",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }]
                        }
                      ],
                      disableDefaultUI: false,
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true
                    }}
                  >
                    {/* User location marker */}
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                          scaledSize: new window.google.maps.Size(32, 32)
                        }}
                        title="Your Location"
                      />
                    )}

                    {/* All restaurant markers */}
                    {allRestaurants.map((restaurant) => (
                      <Marker
                        key={restaurant.id}
                        position={restaurant.coordinates}
                        onClick={() => setSelectedRestaurant(restaurant)}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                          scaledSize: new window.google.maps.Size(32, 32)
                        }}
                        title={restaurant.name}
                        label={restaurant.name}
                      />
                    ))}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Loading map...</p>
                    </div>
                  </div>
                )}

                {/* Nearby restaurants list overlay */}
                {userLocation && nearbyRestaurants.length > 0 && (
                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs max-h-[80%] overflow-y-auto">
                    <h3 className="font-semibold text-lg mb-2">Nearby Restaurants</h3>
                    <div className="space-y-2">
                      {nearbyRestaurants.map((restaurant) => (
                        <div
                          key={restaurant.id}
                          className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => setSelectedRestaurant(restaurant)}
                        >
                          <div className="font-medium">{restaurant.name}</div>
                          <div className="text-sm text-gray-600">
                            {restaurant.distance.toFixed(1)} km away
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Restaurant Detail Modal */}
        <AnimatePresence>
          {selectedRestaurant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedRestaurant(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="h-64 md:h-80 relative">
                    <img
                      src={selectedRestaurant.image}
                      alt={selectedRestaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-3xl font-bold mb-2">{selectedRestaurant.name}</h2>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Star className="w-5 h-5 mr-1 fill-amber-500" />
                          {selectedRestaurant.rating.toFixed(1)}
                        </span>
                        <span>{selectedRestaurant.cuisine}</span>
                        <span>{selectedRestaurant.priceRange}</span>
            </div>
                    </div>
                    <button
                      onClick={() => setSelectedRestaurant(null)}
                      className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
              </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                        <h3 className="text-xl font-semibold mb-4">About</h3>
                        <p className="text-gray-600 mb-6">{selectedRestaurant.description}</p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRestaurant.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-primary transition-colors"
                            >
                              {selectedRestaurant.address}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <span>{selectedRestaurant.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-500" />
                            <a href={selectedRestaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Visit Website
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span>{selectedRestaurant.openHours}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">Popular Dishes</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedRestaurant.popularDishes.map((dish, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-gray-800">{dish}</span>
                            </div>
                          ))}
                        </div>

                        {selectedRestaurant.amenities && (
                          <>
                            <h3 className="text-xl font-semibold mt-6 mb-4">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedRestaurant.amenities.map((amenity, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        {selectedRestaurant.dietaryOptions && (
                          <>
                            <h3 className="text-xl font-semibold mt-6 mb-4">Dietary Options</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedRestaurant.dietaryOptions.map((option, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                      <div className="space-y-4">
                        {selectedRestaurant.reviews.map((review, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-5 h-5 text-gray-500" />
                              <span className="font-medium">{review.author}</span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-amber-500" />
                                <span className="ml-1">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-600">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedRestaurant.reservationNeeded && (
                      <div className="mt-8 pt-6 border-t">
                        <h3 className="text-xl font-semibold mb-4">Make a Reservation</h3>
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                              placeholder="Name"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
                <input
                  type="email"
                              placeholder="Email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
                <input
                  type="tel"
                              placeholder="Phone"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                <input
                  type="number"
                              placeholder="Number of Guests"
                  value={bookingForm.guests}
                  onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                              min="1"
                  required
                />
              </div>
                <textarea
                            placeholder="Special Requests"
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  rows={3}
                />
              <Button type="submit" className="w-full">
                Book Now
              </Button>
            </form>
                      </div>
          )}
        </div>
      </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
    </TravelistaLayout>
  );
};

export default Restaurant; 