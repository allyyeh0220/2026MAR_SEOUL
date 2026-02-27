import { ItineraryItem } from '../data/itinerary';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface DayHighlightsProps {
  items: ItineraryItem[];
}

export function DayHighlights({ items }: DayHighlightsProps) {
  // Filter items that have images or highlights
  const highlightItems = items.filter(item => item.image || (item.highlight && item.highlight.length > 0));

  if (highlightItems.length === 0) return null;

  return (
    <div className="py-4 pl-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-k-coffee fill-k-coffee" />
        <h2 className="text-sm font-bold text-k-coffee tracking-wider">今日重點行程</h2>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 pr-4 scrollbar-hide snap-x snap-mandatory">
        {highlightItems.map((item) => (
          <motion.div 
            key={item.id}
            className="snap-center shrink-0 w-[200px] h-[140px] rounded-2xl overflow-hidden relative shadow-md group"
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src={item.image || `https://picsum.photos/seed/${item.id}/400/300`} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 flex flex-col justify-end">
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 shadow-sm">{item.title.split('：')[1] || item.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
