import React from 'react';
import { motion } from 'framer-motion';
import { ItineraryItem } from '../data/itinerary';
import { MapPin, Utensils, Plane, Bus, Hotel, Camera, ShoppingBag, Ticket } from 'lucide-react';
import { cn } from '../lib/utils';

const getCategoryInfo = (type: string) => {
  switch (type) {
    case 'food': return { label: 'FOOD', icon: Utensils };
    case 'sight': return { label: 'SPOTS', icon: Camera };
    case 'transport': 
      return { label: 'TRANSPORT', icon: Bus };
    case 'accommodation': return { label: 'HOTEL', icon: Hotel };
    case 'shopping': return { label: 'SHOPPING', icon: ShoppingBag };
    case 'activity': return { label: 'ACTIVITY', icon: Ticket };
    default: return { label: 'SPOTS', icon: MapPin };
  }
};

interface ItineraryCardProps {
  item: ItineraryItem;
  onClick: () => void;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ item, onClick }) => {
  const { label, icon: CategoryIcon } = getCategoryInfo(item.type);
  
  const isFlight = item.title.includes('航空') || (item.title.includes('機場') && !item.title.includes('抵達機場')) || item.description?.includes('EVA');
  const displayLabel = isFlight ? 'FLIGHT' : label;
  const DisplayIcon = isFlight ? Plane : CategoryIcon;

  const getBarColor = (type: string, isFlight: boolean) => {
    if (isFlight || type === 'transport') return 'bg-[#cdc8c3]';
    if (type === 'accommodation') return 'bg-[#ad9c8f]';
    if (type === 'food') return 'bg-[#f4af63]';
    return 'bg-[#d9e9f5]';
  };

  const barColor = getBarColor(item.type, isFlight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex group cursor-pointer min-h-[6rem]"
      onClick={onClick}
    >
      {/* Time Column */}
      <div className="w-20 text-right shrink-0 pt-0 relative pr-4">
        <span className="text-xl text-k-coffee font-cream tracking-widest">{item.time}</span>
        <span className="absolute right-1 top-1.5 text-[8px] text-k-coffee/60 border border-k-coffee/60 rounded-full w-1.5 h-1.5 inline-block"></span>
      </div>

      {/* Vertical Line */}
      <div className="w-px bg-k-coffee/20 relative shrink-0 -ml-px">
        {/* We can add a dot here if needed, but the image shows a clean line with a circle in the time column */}
      </div>

      {/* Content Column */}
      <div className="flex-1 pl-6 pb-10">
        <div className="flex gap-4 items-stretch">
          {/* Accent Bar */}
          <div className={`w-[4px] shrink-0 rounded-full mt-1.5 ${barColor}`} />

          <div className="space-y-1.5 flex-1">
            {/* Title */}
            <h3 className="text-xl font-bold text-k-coffee leading-tight font-sans tracking-wide">{item.title}</h3>
            
            {/* Category */}
            <div className="flex items-center gap-2 text-[#A89F91]">
              <DisplayIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-sans">{displayLabel}</span>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-k-coffee/60 leading-relaxed font-medium font-sans mt-1">
                {item.description}
              </p>
            )}


            {/* Reservation Badge */}
            {item.isReservation && (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32] mt-1 font-sans">
                <span className="text-[10px] border border-[#2E7D32] px-1.5 py-0.5 rounded-md">已預約</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
