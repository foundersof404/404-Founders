import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SearchBoxProps {
  placeholder: string;
  onSelect: (location: any) => void;
  label: string;
}

const SearchBox = ({ placeholder, onSelect, label }: SearchBoxProps) => {
  const [apiQuery, setApiQuery] = useState("");
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [showApiResults, setShowApiResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowApiResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (apiQuery.length >= 2) {
        setApiLoading(true);
        try {
          const response = await fetch(
            `https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=${encodeURIComponent(apiQuery)}`,
            {
              method: "GET",
              headers: {
                "x-rapidapi-key": "cbcd4d7e83msh4b067e82b483012p1f0647jsn06b69f1e6113",
                "x-rapidapi-host": "booking-com15.p.rapidapi.com",
              },
            }
          );
          const data = await response.json();
          setApiResults(data.data || []);
        } catch (error) {
          setApiResults([]);
        }
        setApiLoading(false);
        setShowApiResults(true);
      } else {
        setApiResults([]);
        setShowApiResults(false);
      }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [apiQuery]);

  return (
    <div className="w-full" ref={searchRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Input
          type="text"
          value={apiQuery}
          onChange={(e) => setApiQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 py-2 w-full flight-input animate-fade-in"
          onFocus={() => apiQuery.length >= 2 && setShowApiResults(true)}
        />
        {apiQuery && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => { setApiQuery(""); setApiResults([]); }}
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {showApiResults && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 animate-fade-in">
            {apiLoading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : apiResults.length > 0 ? (
              <ul>
                {apiResults.map((item, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-3 hover:bg-gray-100 border-b border-gray-100 last:border-0"
                    onClick={() => { onSelect(item); setApiQuery(item.name || ""); setShowApiResults(false); }}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {item.name} {item.code && `(${item.code})`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.cityName}, {item.countryName}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : apiQuery.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">No results found</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
