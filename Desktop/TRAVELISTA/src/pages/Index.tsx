import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TravelistaLayout from '@/components/TravelistaLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Globe, MapPin, Search, Sun, Umbrella, Star } from 'lucide-react';
import Shop from '@/components/Shop';
import PopularDestinations from '@/components/PopularDestinations';
import FadeInOnScroll from '@/components/FadeInOnScroll';
import { motion } from 'framer-motion';

const galleryImages = [
  'https://images.unsplash.com/photo-1632812452083-72d3c8abe533?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1526945870720-88be78ede6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1605446994677-9b99e0d6647f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1677636665023-d7ad240fdb6a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1679515085468-d09e7c9d7ca6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1683120768716-d4242ac2ea4c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1464069668014-99e9cd4abf16?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1740443106696-a8083237543a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const Index = () => {
  const { isAuthenticated } = useAuth();

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log('Index page mounted');
    console.log('Auth state:', isAuthenticated);
  }, [isAuthenticated]);

  // Update CSS for faster animation
  const galleryAnimationStyles = `
  @keyframes gallery-slide {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  `;
  
  // Gallery animation effect
  useEffect(() => {
    // Get the gallery cards
    const container = document.getElementById('gallery-cards');
    if (!container) return;
    
    const cards = Array.from(container.querySelectorAll('.gallery-card'));
    if (!cards.length) return;

    const cardsCount = cards.length;
    let activeIndex = 0;
    let isAnimating = false;
    
    // Precompute positions for better performance
    const positions = [];
    for (let i = 0; i < cardsCount; i++) {
      let relativePos = (i - 0 + cardsCount) % cardsCount;
      if (relativePos > cardsCount / 2) {
        relativePos = relativePos - cardsCount;
      }
      
      let scale, translateX, zIndex, opacity;
      
      if (relativePos === 0) {
        scale = 1.3; // Significantly bigger middle image
        translateX = 0;
        zIndex = 10;
        opacity = 1;
      } else if (relativePos === 1) {
        scale = 0.7; // Reduced from 0.85 to create more contrast
        translateX = 90; // Moved further to accommodate larger center image
        zIndex = 9;
        opacity = 0.8;
      } else if (relativePos === 2) {
        scale = 0.6; // Reduced from 0.7
        translateX = 150; // Moved further
        zIndex = 8;
        opacity = 0.6;
      } else if (relativePos === -1 || relativePos === cardsCount - 1) {
        scale = 0.7; // Reduced from 0.85
        translateX = -90; // Moved further
        zIndex = 9;
        opacity = 0.8;
      } else if (relativePos === -2 || relativePos === cardsCount - 2) {
        scale = 0.6; // Reduced from 0.7
        translateX = -150; // Moved further
        zIndex = 8;
        opacity = 0.6;
      } else {
        scale = 0.4; // Reduced from 0.5
        translateX = relativePos > 0 ? 220 : -220; // Moved further
        zIndex = 0;
        opacity = 0.3;
      }
      
      positions.push({ relativePos, scale, translateX, zIndex, opacity });
    }
    
    // Function to update cards position and size
    const updateCardsPosition = (newActiveIndex) => {
      if (isAnimating) return;
      isAnimating = true;
      
      // Calculate new positions based on active index
      const newPositions = positions.map((pos, i) => {
        let relativePos = (i - newActiveIndex + cardsCount) % cardsCount;
        if (relativePos > cardsCount / 2) {
          relativePos = relativePos - cardsCount;
        }
        
        let scale, translateX, zIndex, opacity;
        
        if (relativePos === 0) {
          scale = 1.3; // Match the bigger size in the calculation for new positions
          translateX = 0;
          zIndex = 10;
          opacity = 1;
        } else if (relativePos === 1) {
          scale = 0.7;
          translateX = 90;
          zIndex = 9;
          opacity = 0.8;
        } else if (relativePos === 2) {
          scale = 0.6;
          translateX = 150;
          zIndex = 8;
          opacity = 0.6;
        } else if (relativePos === -1 || relativePos === cardsCount - 1) {
          scale = 0.7;
          translateX = -90;
          zIndex = 9;
          opacity = 0.8;
        } else if (relativePos === -2 || relativePos === cardsCount - 2) {
          scale = 0.6;
          translateX = -150;
          zIndex = 8;
          opacity = 0.6;
        } else {
          scale = 0.4;
          translateX = relativePos > 0 ? 220 : -220;
          zIndex = 0;
          opacity = 0.3;
        }
        
        return { relativePos, scale, translateX, zIndex, opacity };
      });
      
      // Apply new positions
      cards.forEach((card, index) => {
        const el = card as HTMLElement;
        const pos = newPositions[index];
        
        // Set z-index separately (without transition)
        el.style.zIndex = pos.zIndex.toString();
        
        // Apply transformations with hardware acceleration
        el.style.transform = `translate3d(${pos.translateX}%, 0, 0) scale(${pos.scale})`;
        el.style.opacity = pos.opacity.toString();
        
        // Add special styling for active card (the card that is currently in the middle)
        if (pos.relativePos === 0) {
          el.classList.add('active-card');
          el.style.filter = 'brightness(1.1)';
          el.style.boxShadow = '0 0 30px 5px rgba(59, 130, 246, 0.5), 0 15px 30px rgba(0,0,0,0.2)';
          el.style.border = '4px solid rgba(59, 130, 246, 0.6)';
        } else {
          el.classList.remove('active-card');
          el.style.filter = 'brightness(0.85)';
          el.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
          el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }
      });
      
      // Reset animation flag after transition completes
      setTimeout(() => {
        isAnimating = false;
      }, 350); // Slightly less than transition duration
    };
    
    // Initial position setup
    cards.forEach((card, index) => {
      const el = card as HTMLElement;
      const pos = positions[index];
      
      // Apply initial styles without transition
      el.style.transition = 'none';
      el.style.transform = `translate3d(${pos.translateX}%, 0, 0) scale(${pos.scale})`;
      el.style.opacity = pos.opacity.toString();
      el.style.zIndex = pos.zIndex.toString();
      
      // Set initial active card
      if (pos.relativePos === 0) {
        el.classList.add('active-card');
        el.style.filter = 'brightness(1.1)';
        el.style.boxShadow = '0 0 30px 5px rgba(59, 130, 246, 0.5), 0 15px 30px rgba(0,0,0,0.2)';
        el.style.border = '4px solid rgba(59, 130, 246, 0.6)';
      } else {
        el.classList.remove('active-card');
        el.style.filter = 'brightness(0.85)';
        el.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        } 
    });
    
    // Force reflow to apply initial positions
    container.offsetHeight;
    
    // Enable transitions after initial setup
    cards.forEach((card) => {
      const el = card as HTMLElement;
      el.style.transition = 'transform 0.35s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.35s ease, box-shadow 0.35s ease, border 0.35s ease, filter 0.35s ease';
    });
    
    // Animation interval
    const animationInterval = setInterval(() => {
      activeIndex = (activeIndex + 1) % cardsCount;
      updateCardsPosition(activeIndex);
    }, 1800); // Slightly faster at 1.8 seconds
    
    // Cleanup
    return () => {
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <TravelistaLayout>
      <FadeInOnScroll>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-secondary/60 to-background pt-16 pb-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                Discover Your Perfect Travel Experience
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in animation-delay-100">
                Explore incredible destinations around the world with tailor-made travel packages that fit your style and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-200">
                <Button asChild size="lg" className="px-8">
                  <Link to="/destinations">Explore Destinations</Link>
                </Button>
                {!isAuthenticated && (
                  <Button asChild variant="outline" size="lg">
                    <Link to="/signup">Create Account</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
          
          <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        </section>
      </FadeInOnScroll>

      {/* Popular Destinations Section - Moved to appear first */}
      <FadeInOnScroll delay={0.2}>
        <PopularDestinations />
      </FadeInOnScroll>

      {/* Featured Packages Section - Now appears after Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <p className="text-lg text-blue-600 font-medium">POPULAR PACKAGES</p>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <span className="text-blue-500">✈️</span> 
              CHECKOUT OUR PACKAGES 
              <span className="text-blue-500">✈️</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our exclusive flight packages tailored to offer you the best in
              comfort, convenience, and value for your next adventure
            </p>
          </div>
          
          {/* Add keyframes for package animations */}
          <style>
            {`
              @keyframes package-slide-in {
                0% { opacity: 0; transform: translateX(-50px); }
                100% { opacity: 1; transform: translateX(0); }
              }
              
              .package-card {
                box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                border: 1px solid rgba(226, 232, 240, 0.7);
                transition: all 0.3s ease;
              }
              
              .package-card:hover {
                box-shadow: 15px 15px 30px rgba(59, 130, 246, 0.3);
                border-color: rgba(59, 130, 246, 0.3);
                transform: translateY(-5px);
              }
              
              .package-image {
                overflow: hidden;
              }
              
              .package-image img {
                transition: transform 0.6s ease;
              }
              
              .package-card:hover .package-image img {
                transform: scale(1.1);
              }
              
              .package-price {
                position: relative;
                transition: all 0.3s ease;
              }
              
              .package-card:hover .package-price {
                transform: scale(1.05);
              }
            `}
          </style>
          
          <div className="flex flex-col gap-8 mt-12">
            {[
              {
                title: 'EXPERIENCE THE GREAT HOLIDAY ON BEACH',
                image: 'https://images.unsplash.com/photo-1520483601560-389dff434fdf',
                description: 'Experience the ultimate beach holiday, where relaxation, adventure, and unforgettable memories await under the sun.',
                price: '$750',
                duration: '7D/6N',
                capacity: 'pax: 8',
                location: 'Malaysia',
                rating: 4.8,
                reviews: 32
              },
              {
                title: 'DISCOVER ANCIENT TEMPLES OF ASIA',
                image: 'https://images.unsplash.com/photo-1580889272861-dc2dbea5468d',
                description: 'Embark on a spiritual journey through the mystical temples of Asia, discovering ancient cultures and breathtaking architecture.',
                price: '$950',
                duration: '10D/9N',
                capacity: 'pax: 6',
                location: 'Thailand',
                rating: 4.9,
                reviews: 45
              },
              {
                title: 'ADVENTURE IN THE SWISS ALPS',
                image: 'https://images.unsplash.com/photo-1531400158697-004a3a06fd3f',
                description: 'Experience the breathtaking majesty of the Swiss Alps with hiking, skiing, and panoramic mountain views that will leave you speechless.',
                price: '$1,200',
                duration: '8D/7N',
                capacity: 'pax: 4',
                location: 'Switzerland',
                rating: 4.7,
                reviews: 28
              }
            ].map((travelPackage, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row max-w-4xl mx-auto package-card"
              >
                {/* Left side - Image */}
                <div className="md:w-1/3 relative overflow-hidden package-image">
                  <div className="aspect-[4/3] h-[200px] md:h-[240px]">
                    <img 
                      src={travelPackage.image} 
                      alt={travelPackage.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs py-1 px-2 rounded-full">
                    {travelPackage.duration}
                  </div>
                </div>

                {/* Middle - Content */}
                <div className="md:w-1/2 p-6 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    {travelPackage.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {travelPackage.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <div className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {travelPackage.capacity}
                    </div>
                    <div className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {travelPackage.location}
                    </div>
                  </div>
                </div>

                {/* Right side - Price */}
                <div className="md:w-1/6 p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col items-center justify-center package-price">
                  <div className="text-center mb-2">
                    <div className="text-xs mb-1">({travelPackage.reviews} reviews)</div>
                    <div className="flex justify-center">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(travelPackage.rating) ? 'text-white' : 'text-white/40'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold mb-1">
                    {travelPackage.price}
                  </div>
                  <div className="text-xs mb-2">/ per person</div>
                  
                  <Button size="sm" className="w-full bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 text-xs py-1 px-3 h-8">
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="px-8 py-3">
              <Link to="/travel-packages">
                View All Packages
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <FadeInOnScroll delay={0.1}>
        <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-50 text-gray-800 relative">
          <div className="gallery relative w-full overflow-hidden min-h-[80vh] p-0 m-0">
            <div className="text-center pt-8 relative z-10">
              <h2 className="text-3xl font-bold mb-4">Immersive Travel Gallery</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                Step into our travelers' most breathtaking moments from around the world
              </p>
            </div>
            
            {/* CSS for the gallery */}
            <style>{`
              .gallery-container {
                position: relative;
                width: 90%;
                max-width: 1000px;
                height: 450px;
                margin: 0 auto;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px 0;
                perspective: 1000px;
              }
              
              .gallery-cards {
                position: relative;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform-style: preserve-3d;
              }
              
              .gallery-card {
                position: absolute;
                width: 350px;
                height: 260px;
                list-style: none;
                border-radius: 10px;
                background-size: cover;
                background-position: center;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                overflow: hidden;
                transform-origin: center;
                transition: transform 0.35s cubic-bezier(0.2, 0, 0.2, 1), 
                           opacity 0.35s ease, 
                           box-shadow 0.35s ease,
                           border 0.35s ease,
                           filter 0.35s ease;
                will-change: transform, opacity, z-index, box-shadow, filter;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                -webkit-transform-style: preserve-3d;
                filter: brightness(0.85);
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              
              .active-card {
                animation: pulse-border 2s infinite alternate;
              }
              
              @keyframes pulse-border {
                0% {
                  box-shadow: 0 0 30px 5px rgba(59, 130, 246, 0.5), 0 15px 30px rgba(0,0,0,0.2);
                  border-color: rgba(59, 130, 246, 0.6);
                }
                100% {
                  box-shadow: 0 0 40px 8px rgba(59, 130, 246, 0.7), 0 15px 30px rgba(0,0,0,0.3);
                  border-color: rgba(99, 159, 255, 0.8);
                }
              }
              
              .gallery-card::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 40%;
                background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%);
                z-index: 1;
              }
              
              .card-caption {
                position: absolute;
                bottom: 20px;
                left: 0;
                right: 0;
                text-align: center;
                color: white;
                z-index: 2;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
              }
              
              .gallery-card:hover .card-caption {
                opacity: 1;
                transform: translateY(0);
              }
            `}</style>
            
            {/* Gallery container */}
            <div className="gallery-container">
  <div className="gallery-cards" id="gallery-cards">
    {galleryImages.map((image, index) => (
      <div 
        key={index}
        className="gallery-card"
        style={{
          backgroundImage: `url(${image}?w=600&h=400&fit=fill&auto=format)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}
      >
        <div className="card-caption">
          <h3 className="text-lg font-bold">Amazing Destination</h3>
          <p className="text-sm">Discover breathtaking views</p>
        </div>
      </div>
    ))}
  </div>
</div>
            
            <div className="text-center mt-8 mb-8 relative z-10">
              <p className="text-gray-600 italic mb-4">Explore our complete collection of travel moments</p>
              <Button asChild size="lg" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 border-none">
                <Link to="/gallery">Enter Full Gallery</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Shop Section */}
      <section className="py-5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2"></h2>
            <p className="text-sm uppercase text-blue-600 font-medium mb-2"></p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              
            </p>
          </div>
          <Shop />
        </div>
      </section>
      {/* Shop Button */}
      <div className="flex flex-col items-center mb-16">
        <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold shadow-lg primary-btn">
          <Link to="/shop">Go to Shop</Link>
        </Button>
      </div>

      {/* Travelmate Section */}
      <FadeInOnScroll delay={0.2}>
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true }}
              >
                Find Your Perfect Travelmate
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true }}
              >
                Connect with fellow travelers who share your passion for adventure
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="space-y-8">
                  {[
                    {
                      title: "Find Compatible Travel Partners",
                      description: "Match with travelers who share your interests, travel style, and destination preferences.",
                      icon: "👋"
                    },
                    {
                      title: "Plan Together",
                      description: "Collaborate on itineraries, split costs, and make the most of your journey together.",
                      icon: "🗺️"
                    },
                    {
                      title: "Travel Safely",
                      description: "Verified profiles, ratings, and secure messaging for peace of mind.",
                      icon: "🔒"
                    },
                    {
                      title: "Create Lasting Memories",
                      description: "Share experiences that turn strangers into lifelong friends.",
                      icon: "✨"
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex gap-4 bg-white p-5 rounded-xl shadow-md"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.5,
                        delay: index * 0.15,
                        ease: "easeOut"
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="order-1 md:order-2">
                <motion.div
                  className="relative max-w-md mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" 
                    alt="Friends traveling together" 
                    className="rounded-lg shadow-2xl"
                  />
                  <div className="absolute -top-4 -right-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">2,438 travelers online</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-lg px-4 py-2 shadow-lg">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                            <img 
                              src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                              alt={`User ${i}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">+48 new matches today</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Button size="lg" className="px-8 py-6 text-lg font-semibold shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                Find Your Travelmate
              </Button>
              <p className="mt-4 text-sm text-gray-500">Join 10,000+ travelers already connected</p>
            </motion.div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* CTA Section */}
      <FadeInOnScroll delay={0.3}>
        <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="bg-card border border-border rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg animate-fade-in">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to start your adventure?</h2>
                <p className="text-[#8aafdf] max-w-lg">
                  Create an account today and get access to exclusive travel deals and personalized recommendations.
                </p>
              </div>
              <div className="shrink-0">
                <Button asChild size="lg" className="px-8 primary-btn">
                  <Link to={isAuthenticated ? "/profile" : "/signup"}>
                    {isAuthenticated ? "View Your Profile" : "Sign Up Now"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>
    </TravelistaLayout>
  );
};

export default Index;
