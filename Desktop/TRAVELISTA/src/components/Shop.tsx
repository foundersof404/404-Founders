import React, { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Travel Backpack',
    price: '$49.99',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    category: 'Accessories',
    amazonLink: 'https://www.amazon.com/Lanedo-Backpack-Approved-Expandable-isolation/dp/B0DJ38CTWL/ref=sxin_16_pa_sp_search_thematic_sspa?content-id=amzn1.sym.245d6db4-f924-4d02-a9dc-78be7e9c7abd%3Aamzn1.sym.245d6db4-f924-4d02-a9dc-78be7e9c7abd&cv_ct_cx=travel+backpack&keywords=travel+backpack&pd_rd_i=B0DJ38CTWL&pd_rd_r=8c5280ae-df6a-4591-8c03-1abfd3677976&pd_rd_w=3ayIm&pd_rd_wg=JmxSa&pf_rd_p=245d6db4-f924-4d02-a9dc-78be7e9c7abd&pf_rd_r=347X2G3D7VWQ509CQ9EZ&qid=1748090314&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sr=1-4-7efdef4d-9875-47e1-927f-8c2c1c47ed49-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&psc=1'
  },
  {
    id: 2,
    name: 'Water Bottle',
    price: '$19.99',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
    category: 'Essentials',
    amazonLink: 'https://www.amazon.com/s?k=water+bottle&crid=1KH3IBD4Z0X6B&sprefix=water+bottle%2Caps%2C4189&ref=nb_sb_ss_ts-doa-p_3_5'
  },
  {
    id: 3,
    name: 'Power Bank',
    price: '$29.99',
    image: 'https://images.unsplash.com/photo-1706275400998-7fc21c8cd8ed?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Books',
    amazonLink: 'https://www.amazon.com/s?k=power+bank&crid=1RO457BRUGXEY&sprefix=water+b%2Caps%2C2778&ref=nb_sb_noss_2'
  }
];

const Shop = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-blue-800 mb-4 tracking-tight">
            Premium Collection
          </h2>
          <p className="text-gray-600 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Discover our carefully curated selection of extraordinary products
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-8 max-w-6xl">
          {products.map((product, index) => (
              <div
              key={product.id}
                className="group relative w-80 h-96"
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: hoveredCard === product.id ? 'translateY(-12px) rotateY(5deg)' : 'translateY(0) rotateY(0)',
                  transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Card */}
                <div className="relative h-full w-full rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100">
                  
                  {/* Animated border glow */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(45deg, hsl(214, 57%, 51%), hsl(214, 70%, 60%), hsl(214, 57%, 51%))',
                      backgroundSize: '300% 300%',
                      animation: hoveredCard === product.id ? 'gradientShift 3s ease infinite' : 'none',
                      padding: '2px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'exclude'
                    }}
                  ></div>

                  {/* Image container */}
                  <div className="relative h-60 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      style={{
                        filter: hoveredCard === product.id ? 'saturate(1.2) contrast(1.1)' : 'saturate(1)'
                      }}
                    />
                    
                    {/* Shimmer effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        transform: hoveredCard === product.id ? 'translateX(100%)' : 'translateX(-100%)',
                        transition: 'transform 0.8s ease-in-out'
                      }}
                    ></div>

                    {/* Hot badge */}
                    <div 
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, hsl(214, 57%, 51%), hsl(214, 70%, 60%))'
                      }}
                    >
                      🔥 HOT
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between h-36">
                    <div>
                      <span 
                        className="text-xs font-semibold uppercase tracking-widest mb-2 block"
                        style={{ color: 'hsl(214, 57%, 51%)' }}
                      >
                        {product.category}
                      </span>
                      <h3 
                        className="text-xl font-bold text-gray-800 mb-2 transition-all duration-300"
                        style={{
                          color: hoveredCard === product.id ? 'hsl(214, 57%, 51%)' : '#1f2937'
                        }}
                      >
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-gray-800">
                        {product.price}
                      </span>
                      
                      <a
                        href={product.amazonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 rounded-full font-semibold text-sm relative overflow-hidden group/btn transition-all duration-300 border-2"
                        style={{
                          backgroundColor: hoveredCard === product.id ? 'hsl(214, 57%, 51%)' : 'white',
                          color: hoveredCard === product.id ? 'white' : 'hsl(214, 57%, 51%)',
                          borderColor: 'hsl(214, 57%, 51%)'
                        }}
                      >
                        <span className="relative z-10">View Item</span>
                        <div 
                          className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
                            transform: 'translateX(-100%)',
                            animation: hoveredCard === product.id ? 'slideShine 1.5s ease-in-out infinite' : 'none'
                          }}
                        ></div>
                      </a>
                    </div>
                  </div>
              </div>

                {/* Floating particles */}
                {hoveredCard === product.id && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full opacity-60"
                        style={{
                          backgroundColor: 'hsl(214, 57%, 51%)',
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      ></div>
                    ))}
                  </>
                )}
              </div>
          ))}
          </div>
        </div>
      </div>

      <style >{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes slideShine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @media (max-width: 1024px) {
          .grid-cols-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .grid-cols-3 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
};

export default Shop; 