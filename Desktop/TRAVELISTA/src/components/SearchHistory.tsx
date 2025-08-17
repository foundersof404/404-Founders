
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight } from 'lucide-react';

interface SearchHistoryProps {
  items: string[];
  onSelect: (term: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ items, onSelect }) => {
  if (items.length === 0) return null;
  
  return (
    <motion.div
      className="absolute mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden border border-border"
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-3 py-2.5 text-xs font-medium text-muted-foreground flex items-center">
        <Clock className="h-3 w-3 mr-1.5" />
        Recent searches
      </div>
      
      <ul className="max-h-60 overflow-auto py-1">
        {items.map((item, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <button
              onClick={() => onSelect(item)}
              className="w-full text-left px-4 py-2.5 hover:bg-accent flex items-center justify-between text-sm transition-colors group"
            >
              <span className="truncate">{item}</span>
              <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SearchHistory;
