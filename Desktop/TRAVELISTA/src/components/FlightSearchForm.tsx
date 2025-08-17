import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, UsersIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import SearchBox from "./SearchBox";

interface FlightSearchFormProps {
  onSearch: (searchData: any) => void;
}

const FlightSearchForm = ({ onSearch }: FlightSearchFormProps) => {
  const [tripType, setTripType] = useState("oneWay");
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState("economy");
  const [isSearching, setIsSearching] = useState(false);
  const [stops, setStops] = useState<string>("none");
  const [sort, setSort] = useState<string>("BEST");
  const [pageNo, setPageNo] = useState<number>(1);
  const [currencyCode, setCurrencyCode] = useState<string>("AED");
  
  const handleSearch = () => {
    // Validate form
    if (!origin) {
      toast.error("Please select an origin");
      return;
    }
    
    if (!destination) {
      toast.error("Please select a destination");
      return;
    }
    
    if (!departDate) {
      toast.error("Please select a departure date");
      return;
    }
    
    if (tripType === "roundTrip" && !returnDate) {
      toast.error("Please select a return date");
      return;
    }
    
    setIsSearching(true);
    
    // Prepare children ages string (example: "0,1,17")
    let childrenAges = undefined;
    if (passengers.children > 0) {
      // For demo, assume all children are 8 years old
      childrenAges = Array(passengers.children).fill(8).join(",");
    }
    
    // Prepare search data
    const searchData = {
      tripType,
      origin: origin.iata || origin.id,
      destination: destination.iata || destination.id,
      // Store the airport codes for filtering in FlightResults
      originCode: origin.code || origin.iata,
      destinationCode: destination.code || destination.iata,
      departDate: format(departDate, "yyyy-MM-dd"),
      returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
      passengers,
      cabinClass,
      stops,
      sort,
      pageNo,
      currency_code: currencyCode,
      childrenAges,
    };
    
    // Call parent's onSearch with the search data
    onSearch(searchData);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };
  
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  
  return (
    <div className="w-full max-w-none border-4 rounded-3xl p-16" style={{ borderColor: 'hsl(214, 57%, 51%)' }}>
      <Tabs defaultValue="oneWay" onValueChange={(value) => setTripType(value)}>
        <TabsList className="grid w-full grid-cols-2 mb-8" style={{ background: 'white', border: 'none' }}>
          <TabsTrigger value="oneWay" className="text-lg" style={{ color: 'hsl(214, 57%, 51%)' }}>One Way</TabsTrigger>
          <TabsTrigger value="roundTrip" className="text-lg" style={{ color: 'hsl(214, 57%, 51%)' }}>Round Trip</TabsTrigger>
        </TabsList>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchBox
              label="From"
              placeholder="City or Airport"
              onSelect={setOrigin}
              className="py-4 px-5 text-lg h-14"
            />
            <SearchBox
              label="To"
              placeholder="City or Airport"
              onSelect={setDestination}
              className="py-4 px-5 text-lg h-14"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal flight-input",
                      !departDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departDate ? format(departDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departDate}
                    onSelect={setDepartDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {tripType === "roundTrip" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal flight-input",
                        !returnDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={(date) => date < (departDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between flight-input">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4" />
                      <span>
                        {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Passengers</h4>
                      <Separator />
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Adults</p>
                            <p className="text-xs text-muted-foreground">12+ years</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPassengers(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))}
                              disabled={passengers.adults <= 1}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{passengers.adults}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPassengers(prev => ({...prev, adults: Math.min(9, prev.adults + 1)}))}
                              disabled={totalPassengers >= 9}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Children</p>
                            <p className="text-xs text-muted-foreground">2-11 years</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPassengers(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}
                              disabled={passengers.children <= 0}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{passengers.children}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPassengers(prev => ({...prev, children: Math.min(8, prev.children + 1)}))}
                              disabled={totalPassengers >= 9}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Infants</p>
                            <p className="text-xs text-muted-foreground">0-2 years</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPassengers(prev => ({...prev, infants: Math.max(0, prev.infants - 1)}))}
                              disabled={passengers.infants <= 0}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{passengers.infants}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPassengers(prev => ({...prev, infants: Math.min(passengers.adults, prev.infants + 1)}))}
                              disabled={passengers.infants >= passengers.adults || totalPassengers >= 9}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
              <Select onValueChange={(value) => setCabinClass(value)} defaultValue="economy">
                <SelectTrigger className="w-full flight-input">
                  <SelectValue placeholder="Select cabin class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium_economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stops Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stops</label>
              <Select onValueChange={setStops} defaultValue="none">
                <SelectTrigger className="w-full flight-input">
                  <SelectValue placeholder="Select stops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">No Preference</SelectItem>
                    <SelectItem value="0">Non-stop</SelectItem>
                    <SelectItem value="1">One-stop</SelectItem>
                    <SelectItem value="2">Two-stop</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* Sort Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
              <Select onValueChange={setSort} defaultValue="BEST">
                <SelectTrigger className="w-full flight-input">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="BEST">Best</SelectItem>
                    <SelectItem value="CHEAPEST">Cheapest</SelectItem>
                    <SelectItem value="FASTEST">Fastest</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Page Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Number</label>
              <input
                type="number"
                min={1}
                value={pageNo}
                onChange={e => setPageNo(Number(e.target.value))}
                className="w-full flight-input border rounded px-5 py-4 text-lg h-14"
                style={{ borderColor: 'hsl(214, 57%, 51%)', color: 'hsl(214, 57%, 51%)' }}
              />
            </div>
            {/* Currency Code Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
              <Select onValueChange={setCurrencyCode} defaultValue="AED">
                <SelectTrigger className="w-full flight-input">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Tabs>
      
      <div className="px-8 py-6 bg-gray-50 flex">
        <Button 
          onClick={handleSearch}
          style={{ backgroundColor: 'hsl(214, 57%, 51%)', color: 'white', borderColor: 'hsl(214, 57%, 51%)' }}
          className="px-10 py-4 rounded-xl font-semibold text-lg h-14 transform transition hover:shadow-md hover:scale-105"
          disabled={isSearching}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'hsl(214, 57%, 45%)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'hsl(214, 57%, 51%)'}
        >
          {isSearching ? "Searching..." : "Search Flights"}
        </Button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
