import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { SearchIcon, Map, Ticket, PlaneTakeoff } from "lucide-react";

interface ApiFeature {
  id: string;
  title: string;
  description: string;
  method: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

interface FlightApiFeaturesProps {
  location: string | null;
}

const FlightApiFeatures = ({ location }: FlightApiFeaturesProps) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const features: ApiFeature[] = [
    {
      id: "searchLocation",
      title: "Search Flight Location",
      description: "Find airports and cities by name or code",
      method: "GET",
      icon: SearchIcon,
    },
    {
      id: "searchFlights",
      title: "Search Flights",
      description: "Find direct flights between destinations",
      method: "GET",
      icon: PlaneTakeoff,
    },
    {
      id: "searchMultiStops",
      title: "Search Flights Multi Stops",
      description: "Find flights with multiple stops",
      method: "GET",
      icon: PlaneTakeoff,
    },
    {
      id: "flightDetails",
      title: "Get Flight Details",
      description: "Detailed information about a specific flight",
      method: "GET",
      icon: Ticket,
    },
    {
      id: "minPrice",
      title: "Get Min Price",
      description: "Find the lowest price for a route",
      method: "GET",
      icon: Ticket,
    },
    {
      id: "minPriceMultiStops",
      title: "Get Min Price Multi Stops",
      description: "Lowest price for routes with multiple stops",
      method: "GET",
      icon: Ticket,
    },
    {
      id: "seatMap",
      title: "Get Seat Map",
      description: "View available seats for a flight",
      method: "GET",
      icon: Map,
      comingSoon: true,
    },
  ];

  const handleFeatureClick = (id: string) => {
    setActiveFeature(id);
    toast.info("Feature documentation will be available soon!", {
      description: "We're currently working on comprehensive API documentation."
    });
  };

  if (!location) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50 z-[-1]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">
          API Features for <span className="text-blue-600">{location}</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-100">
          Powerful flight search capabilities to enhance your booking experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
          {features.map((feature, index) => (
            <Card 
              key={feature.id}
              className={`p-6 overflow-hidden card-hover-effect animate-slide-up border border-gray-100 hover:border-gray-300 ${
                activeFeature === feature.id ? "ring-2 ring-black" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleFeatureClick(feature.id)}
            >
              <div className="flex items-start gap-4">
                <div className="bg-black/5 p-3 rounded-lg">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {feature.method}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                  
                  {feature.comingSoon ? (
                    <div className="mt-4">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4 text-xs hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      View Documentation
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightApiFeatures;
