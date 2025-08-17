import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import BookFlight from '@/pages/flight';
import BookHotel from '@/pages/BookHotel';
import Car from '@/pages/Car';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import ForgotPassword from '@/pages/ForgotPassword';
import NotFound from '@/pages/NotFound';
import Gallery from '@/pages/Gallery';
import GalleryUploadPage from '@/pages/GalleryUploadPage';
import Admin from '@/pages/Admin';
import Restaurant from '@/pages/Restaurant';
import { JobProvider } from '@/contexts/JobContext';
import AgentDashboard from '@/pages/AgentDashboard';
import PrivateRoute from '@/components/PrivateRoute';
import Shop from '@/pages/Shop';
import Travelmate from '@/pages/Travelmate';
import CarDetail from './pages/CarDetail';
import TravelPackages from '@/pages/TravelPackages';
import Attractions from '@/pages/Attractions';
import TaxiPage from './pages/TaxiPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <JobProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/upload" element={
                <PrivateRoute>
                  <GalleryUploadPage />
                </PrivateRoute>
              } />
              <Route path="/book-flight" element={<BookFlight />} />
              <Route path="/book-hotel" element={<BookHotel />} />
              <Route path="/rent-car" element={<Car />} />
              <Route path="/restaurant" element={<Restaurant />} />
              <Route path="/travel-packages" element={<TravelPackages />} />
              <Route path="/attractions" element={<Attractions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/agent" element={<AgentDashboard />} />
              <Route path="/travelmate" element={<Travelmate />} />
              <Route path="/car/:vehicle_id" element={<CarDetail />} />
              <Route path="/taxi" element={<TaxiPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </JobProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App; 