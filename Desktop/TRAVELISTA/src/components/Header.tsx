import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Menu, 
  User, 
  LogIn,
  LogOut,
  X,
  Plane,
  Hotel,
  Car,
  Info,
  Phone,
  ChevronDown,
  Image,
  Facebook,
  Twitter,
  Instagram,
  Search,
  ShoppingBag,
  Utensils,
  Bell,
  Package,
  Landmark,
  CarFront
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import airplane from '../../assets/images/airplane.png';
import airplaneTraveler from '../../dist/assets/airplane(traveler).png';
import NotificationsPanel from './NotificationsPanel';

const Header = ({ transparent = false }) => {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [planeAnim, setPlaneAnim] = useState(false);
  const [planeMid, setPlaneMid] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  console.log('Header transparent prop:', transparent);

  // Airplane animation on mount
  useEffect(() => {
    setPlaneMid(true);
    // Pause briefly at 50% before flying
    const timer = setTimeout(() => setPlaneAnim(true), 1000); // Pause for 1 second
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  console.log('Header: Rendering with state', { loading, isAuthenticated, user: user?.id });

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Globe className="w-5 h-5 text-primary" />
            <span>Travelista</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200 overflow-x-hidden"
      style={transparent ? (isScrolled ? { background: '#f8f8f8' } : { background: '#8aafdf' }) : { background: '#f8f8f8' }}
    >
      <div className="relative">
        <div className="container mx-auto px-4">
          {/* Logo Row */}
          <div className="flex justify-center items-center h-20">
            <Link to="/" className={`flex items-center space-x-2 group -ml-4 ${transparent && !isScrolled ? 'text-white' : ''}`}>
              <Globe className={`w-6 h-6 group-hover:rotate-12 transition-transform duration-300 ${transparent && !isScrolled ? 'text-white' : 'text-primary'}`} />
              <span className={`text-xl font-bold group-hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white' : 'text-gray-800'}`}>Travelista</span>
            </Link>
          </div>
          {/* Navigation Row */}
          <div className={`flex items-center justify-center h-16 border-t border-gray-200 relative nav-row ${transparent && !isScrolled ? 'text-white' : ''}`}>
            {/* Airplane Animation at bottom border */}
            <img
              src={airplaneTraveler}
              alt="Airplane"
              className={`airplane-header absolute left-0 bottom-0 w-48 h-48 z-50 pointer-events-none ${planeMid ? 'plane-mid' : ''} ${planeAnim ? 'plane-fly' : ''}`}
              style={{ transform: 'translate(-40px, calc(28% + 20px))' }}
            />
            {/* Mobile Menu Button */}
            <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex items-center justify-between px-4 py-4 border-b">
                    <span className="text-lg font-bold text-primary flex items-center gap-2">
                      <Globe className="w-5 h-5" /> Travelista
                    </span>
                    <SheetClose asChild>
                      <button className="p-2 rounded-md text-gray-700 hover:text-primary">
                        <X className="w-6 h-6" />
                      </button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-2 px-4 py-6">
                    <SheetClose asChild><Link to="/" className={`py-2 px-2 rounded hover:bg-primary/10 ${location.pathname === '/' ? 'text-primary font-semibold' : 'text-gray-700'}`}>Home</Link></SheetClose>
                    <SheetClose asChild><Link to="/shop" className={`py-2 px-2 rounded hover:bg-primary/10 ${location.pathname === '/shop' ? 'text-primary font-semibold' : 'text-gray-700'}`}>Shop</Link></SheetClose>
                    <SheetClose asChild><Link to="/gallery" className={`py-2 px-2 rounded hover:bg-primary/10 ${location.pathname === '/gallery' ? 'text-primary font-semibold' : 'text-gray-700'}`}>Community</Link></SheetClose>
                    <SheetClose asChild><Link to="/about" className={`py-2 px-2 rounded hover:bg-primary/10 ${location.pathname === '/about' ? 'text-primary font-semibold' : 'text-gray-700'}`}>About</Link></SheetClose>
                    <SheetClose asChild><Link to="/contact" className={`py-2 px-2 rounded hover:bg-primary/10 ${location.pathname === '/contact' ? 'text-primary font-semibold' : 'text-gray-700'}`}>Contact</Link></SheetClose>
                    <SheetClose asChild><Link to="/travelmate" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><User className="w-4 h-4" />Travelmate</Link></SheetClose>
                    {/* Services Dropdown as simple links */}
                    <div className="mt-2 mb-1 text-xs text-gray-500 font-semibold">Services</div>
                    <SheetClose asChild><Link to="/book-flight" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><Plane className="w-4 h-4" />Book Flight</Link></SheetClose>
                    <SheetClose asChild><Link to="/book-hotel" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><Hotel className="w-4 h-4" />Book Hotel</Link></SheetClose>
                    <SheetClose asChild><Link to="/rent-car" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><Car className="w-4 h-4" />Rent Car</Link></SheetClose>
                    <SheetClose asChild><Link to="/taxi" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><CarFront className="w-4 h-4" />Book Taxi</Link></SheetClose>
                    <SheetClose asChild><Link to="/restaurant" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><Utensils className="w-4 h-4" />Book Restaurant</Link></SheetClose>
                    <SheetClose asChild><Link to="/travel-packages" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><Package className="w-4 h-4" />Travel Packages</Link></SheetClose>
                    <SheetClose asChild><Link to="/attractions" className="py-2 px-2 rounded hover:bg-primary/10 flex items-center gap-2 text-gray-700"><Landmark className="w-4 h-4" />Attractions</Link></SheetClose>
                  </nav>
                  <div className="border-t px-4 py-4 flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <SheetClose asChild><Link to="/profile" className="flex items-center gap-2 py-2 px-2 rounded hover:bg-primary/10 text-gray-700"><User className="w-5 h-5" />Profile</Link></SheetClose>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={signOut}
                          className={`text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          <span className="text-sm">Logout</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild><Link to="/login" className="flex items-center gap-2 py-2 px-2 rounded hover:bg-primary/10 text-gray-700"><LogIn className="w-5 h-5" />Login</Link></SheetClose>
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 primary-btn relative overflow-visible">
                          <Link to="/signup" className="flex items-center justify-center">
                            <span className="text-white">Sign Up</span>
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {/* Social Media Icons */}
            <div className="hidden md:flex items-center space-x-4 mr-8">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center justify-center space-x-8 flex-1 ml-[115px]">
              <Link 
                to="/" 
                className={`text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:text-primary hover:text-base hover:underline ${
                  location.pathname === '/' ? 'text-primary' : 'text-gray-600'
                } ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
              >
                <Globe className="w-4 h-4" />
                Home
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-primary hover:text-base hover:underline transition-all duration-300">
                  <span>Services</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className={`w-48 ${transparent && !isScrolled ? 'bg-[#8aafdf] text-white' : ''}`}>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/book-flight" 
                      className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                    >
                      <Plane className="w-4 h-4" />
                      <span>Book Flight</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/book-hotel" 
                      className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                    >
                      <Hotel className="w-4 h-4" />
                      <span>Book Hotel</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/rent-car" 
                      className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                    >
                      <Car className="w-4 h-4" />
                      <span>Rent Car</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/taxi" 
                      className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                    >
                      <CarFront className="w-4 h-4" />
                      <span>Book Taxi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/restaurant" 
                      className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                    >
                      <Utensils className="w-4 h-4" />
                      <span>Book Restaurant</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/travel-packages" 
                      className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                    >
                      <Package className="w-4 h-4" />
                      <span>Travel Packages</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/attractions" className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Attractions</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/travelmate"
                      className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                    >
                      <User className="w-4 h-4" />
                      <span>Travelmate</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link 
                to="/shop" 
                className={`text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:text-primary hover:text-base hover:underline ${
                  location.pathname === '/shop' ? 'text-primary' : 'text-gray-600'
                } ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop</span>
              </Link>
              <Link 
                to="/gallery" 
                className={`text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:text-primary hover:text-base hover:underline ${
                  location.pathname === '/gallery' ? 'text-primary' : 'text-gray-600'
                } ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
              >
                <Image className="w-4 h-4" />
                <span>Community</span>
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:text-primary hover:text-base hover:underline ${
                  location.pathname === '/about' ? 'text-primary' : 'text-gray-600'
                } ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
              >
                <Info className="w-4 h-4" />
                About
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:text-primary hover:text-base hover:underline ${
                  location.pathname === '/contact' ? 'text-primary' : 'text-gray-600'
                } ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>
            </nav>
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-8">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={signOut}
                    className={`text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span className="text-sm">Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className={`flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300 ${transparent && !isScrolled ? 'text-white hover:text-white' : ''}`}
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="text-sm">Login</span>
                  </Link>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 primary-btn relative overflow-visible"
                  >
                    <Link to="/signup" className="flex items-center justify-center">
                      <span className="text-white">Sign Up</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            {/* Notification Icon - top right */}
            <div className={`fixed top-[10px] right-[50px] m-4 z-[100] ${transparent && !isScrolled ? 'text-white' : ''}`}>
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Notifications"
              >
                <Bell className="w-7 h-7 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
        <style>{`
          .airplane-header {
            transition: transform 3s cubic-bezier(0.4,1,0.7,1), opacity 2s cubic-bezier(0.4,1,0.7,1);
            opacity: 1;
            will-change: transform, opacity;
          }
          .plane-mid {
            transform: translate(calc(50vw - 48px), calc(28% + 20px)) scale(1.1) !important;
            opacity: 1;
          }
          .plane-fly {
            /* Diagonal fly: up and to the right, but staying within the viewport */
            transform: translate(calc(90vw - 48px), -200px) scale(1.3) rotate(-25deg) !important;
            opacity: 0;
            transition: transform 5s cubic-bezier(0.4,1,0.7,1), opacity 3s cubic-bezier(0.4,1,0.7,1);
          }
        `}</style>
      </div>
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        transparent={transparent}
        isScrolled={isScrolled}
      />
    </header>
  );
};

export default Header; 