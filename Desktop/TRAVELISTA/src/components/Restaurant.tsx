import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
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
  ChefHat
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const cuisines = [
  "All",
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
  "Spanish",
  "Middle Eastern",
  "Brazilian",
  "Peruvian",
  "Turkish",
  "German",
  "British"
];

const priceRanges = [
  "All",
  "$",
  "$$",
  "$$$",
  "$$$$"
];

const restaurants = [
  {
    id: 1,
    name: "The Gourmet Haven",
    location: "New York, USA",
    cuisine: "International",
    rating: 4.8,
    priceRange: "$$$",
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Gourmet+Haven",
    menu: {
      appetizers: [
        { name: "Truffle Fries", price: "$12", description: "Hand-cut fries with truffle oil and parmesan" },
        { name: "Bruschetta", price: "$10", description: "Toasted bread with fresh tomatoes and basil" },
        { name: "Calamari", price: "$14", description: "Crispy fried squid with marinara sauce" }
      ],
      mainCourses: [
        { name: "Truffle Pasta", price: "$24", description: "Homemade pasta with truffle cream sauce" },
        { name: "Grilled Salmon", price: "$28", description: "Fresh Atlantic salmon with lemon butter sauce" },
        { name: "Beef Wellington", price: "$42", description: "Tender beef fillet wrapped in puff pastry" }
      ],
      desserts: [
        { name: "Chocolate Soufflé", price: "$12", description: "Warm chocolate soufflé with vanilla ice cream" },
        { name: "Crème Brûlée", price: "$10", description: "Classic vanilla custard with caramelized sugar" }
      ],
      drinks: [
        { name: "House Wine", price: "$8/glass", description: "Selection of red and white wines" },
        { name: "Craft Cocktails", price: "$12", description: "Signature cocktails made with premium spirits" }
      ]
    }
  },
  {
    id: 2,
    name: "Sushi Master",
    location: "Tokyo, Japan",
    cuisine: "Japanese",
    rating: 4.9,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Sushi+Master",
    menu: [
      { name: "Omakase Set", price: "$85" },
      { name: "Dragon Roll", price: "$18" },
      { name: "Sashimi Platter", price: "$45" },
      { name: "Miso Soup", price: "$6" }
    ]
  },
  {
    id: 3,
    name: "La Trattoria",
    location: "Rome, Italy",
    cuisine: "Italian",
    rating: 4.7,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=La+Trattoria",
    menu: [
      { name: "Margherita Pizza", price: "$15" },
      { name: "Spaghetti Carbonara", price: "$18" },
      { name: "Tiramisu", price: "$10" },
      { name: "Bruschetta", price: "$8" }
    ]
  },
  {
    id: 4,
    name: "Spice Route",
    location: "Mumbai, India",
    cuisine: "Indian",
    rating: 4.6,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Spice+Route",
    menu: [
      { name: "Butter Chicken", price: "$16" },
      { name: "Vegetable Biryani", price: "$14" },
      { name: "Garlic Naan", price: "$4" },
      { name: "Gulab Jamun", price: "$6" }
    ]
  },
  {
    id: 5,
    name: "Le Bistro",
    location: "Paris, France",
    cuisine: "French",
    rating: 4.9,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Le+Bistro",
    menu: [
      { name: "Coq au Vin", price: "$32" },
      { name: "Bouillabaisse", price: "$38" },
      { name: "Crème Brûlée", price: "$12" },
      { name: "Escargot", price: "$18" }
    ]
  },
  {
    id: 6,
    name: "Dragon Palace",
    location: "Beijing, China",
    cuisine: "Chinese",
    rating: 4.7,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Dragon+Palace",
    menu: [
      { name: "Peking Duck", price: "$45" },
      { name: "Dim Sum Platter", price: "$22" },
      { name: "Kung Pao Chicken", price: "$16" },
      { name: "Hot & Sour Soup", price: "$8" }
    ]
  },
  {
    id: 7,
    name: "Taco Fiesta",
    location: "Mexico City, Mexico",
    cuisine: "Mexican",
    rating: 4.5,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Taco+Fiesta",
    menu: [
      { name: "Carne Asada Tacos", price: "$12" },
      { name: "Chicken Enchiladas", price: "$15" },
      { name: "Guacamole", price: "$8" },
      { name: "Churros", price: "$6" }
    ]
  },
  {
    id: 8,
    name: "The Grill House",
    location: "Sydney, Australia",
    cuisine: "Australian",
    rating: 4.6,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Grill+House",
    menu: [
      { name: "Grilled Barramundi", price: "$28" },
      { name: "Kangaroo Steak", price: "$32" },
      { name: "Pavlova", price: "$10" },
      { name: "Meat Pie", price: "$12" }
    ]
  },
  {
    id: 9,
    name: "Mediterranean Delight",
    location: "Athens, Greece",
    cuisine: "Greek",
    rating: 4.8,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Mediterranean",
    menu: [
      { name: "Moussaka", price: "$18" },
      { name: "Greek Salad", price: "$12" },
      { name: "Baklava", price: "$8" },
      { name: "Souvlaki", price: "$14" }
    ]
  },
  {
    id: 10,
    name: "BBQ King",
    location: "Austin, USA",
    cuisine: "American",
    rating: 4.7,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=BBQ+King",
    menu: [
      { name: "Brisket Platter", price: "$24" },
      { name: "Ribs", price: "$28" },
      { name: "Mac & Cheese", price: "$8" },
      { name: "Cornbread", price: "$6" }
    ]
  }
];

const Restaurant = () => {
  const { isAuthenticated } = useAuth();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    location: ''
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', bookingForm);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    const matchesPrice = selectedPrice === 'All' || restaurant.priceRange === selectedPrice;
    return matchesSearch && matchesCuisine && matchesPrice;
  });

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <ChefHat className="w-16 h-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">Discover Culinary Excellence</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of the finest restaurants from around the world. 
              From local favorites to international cuisine, find your perfect dining experience.
            </p>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cuisine</label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {priceRanges.map((price) => (
                      <option key={price} value={price}>
                        {price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRestaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {restaurant.rating}
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-sm">
                  {restaurant.priceRange}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Utensils className="w-4 h-4 mr-1" />
                  <span>{restaurant.cuisine}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium">Popular Dishes:</h4>
                  {Array.isArray(restaurant.menu) ? (
                    restaurant.menu.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.price}</span>
                      </div>
                    ))
                  ) : (
                    restaurant.menu.mainCourses.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.price}</span>
                      </div>
                    ))
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedRestaurant(restaurant.name)}
                >
                  View Full Menu
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Section */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Book a Restaurant</h2>
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-lg mb-4">Please login to book a restaurant</p>
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Restaurant</label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.name}>
                      {restaurant.name} - {restaurant.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  value={bookingForm.guests}
                  onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Special Requests</label>
                <textarea
                  value={bookingForm.location}
                  onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                Book Now
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant; 