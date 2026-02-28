import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { itineraryData, ItineraryItem } from '../data/itinerary';
import { ItineraryCard } from './ItineraryCard';
import { WeatherWidget } from './WeatherWidget';
import { InfoModal } from './InfoModal';
import { ExpenseModal } from './ExpenseModal';
import { HotelModal } from './HotelModal';
import { GuideModal } from './GuideModal';
import { ChevronLeft, ChevronRight, Info, Wallet, BedDouble, MapPin, Clock } from 'lucide-react';

export function ItineraryView() {
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const index = itineraryData.findIndex(day => day.date === todayStr);
    return index !== -1 ? index : 0;
  });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [selectedItineraryItem, setSelectedItineraryItem] = useState<ItineraryItem | null>(null);
  
  const currentDay = itineraryData[currentDayIndex];
  
  // Find accommodation for the day if it exists
  const accommodation = currentDay.items.find(item => item.type === 'accommodation');
  const checkInTime = accommodation?.bookingInfo?.checkIn?.split(' ')[1] || '15:00';

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const heroImages = currentDay.heroImages || [{ url: `https://picsum.photos/seed/${currentDay.date}/800/450`, caption: '首爾' }];

  useEffect(() => {
    setCurrentImageIndex(0);
    setDirection(0);
  }, [currentDayIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentImageIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % heroImages.length;
      }
      return (prev - 1 + heroImages.length) % heroImages.length;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="h-full flex flex-col bg-k-cream font-sans relative">
      {/* 1. Header Bar */}
      <header className="bg-k-coffee px-4 py-3 flex items-center justify-between shrink-0">
        <div className="px-3 py-1 rounded-[15px] border border-k-header-text/30 text-k-header-text text-xs font-serif tracking-wider">
          2026 Mar.
        </div>
        <h1 className="text-k-header-text font-serif text-lg tracking-widest font-bold">SEOUL TRIP</h1>
        <div className="flex gap-3 text-k-header-text">
          <button onClick={() => setIsExpenseModalOpen(true)} className="hover:text-white transition-colors">
            <Wallet className="w-5 h-5" />
          </button>
          <button onClick={() => setIsInfoModalOpen(true)} className="hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Day Selector */}
      <div className="bg-k-cream pt-4 pb-2 px-4 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {itineraryData.map((day, index) => {
            const dayDate = day.date.split('-')[2];
            const weekdays = ["TUE", "WED", "THR", "FRI", "SAT", "SUN"];
            const weekday = weekdays[index]; 
            const isActive = index === currentDayIndex;
            
            return (
              <button
                key={day.day}
                onClick={() => setCurrentDayIndex(index)}
                className={`flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] rounded-[15px] transition-all duration-300 shrink-0 ${
                  isActive 
                    ? 'bg-k-coffee text-white shadow-lg' 
                    : 'bg-[#EAE6D6] text-[#A89F91] hover:bg-[#E0DCC8]'
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-80 font-serif">DAY{day.day}</span>
                <span className="text-2xl font-bold leading-none font-sans my-0.5">{dayDate}</span>
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-80 font-serif">{weekday}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {/* 3. Day Title & Weather */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-k-coffee font-bold text-xl tracking-widest uppercase font-serif">DAY{currentDay.day}</span>
            <span className="text-k-coffee/60 font-bold text-lg font-sans">{currentDay.date.slice(5)}({currentDay.weekday})</span>
          </div>
          <WeatherWidget />
        </div>

        {/* 4. Hero Image Slider */}
        <div className="px-4 mb-6 relative">
          <div className="relative aspect-[16/9] shadow-lg rounded-[15px] overflow-hidden group bg-gray-200">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentImageIndex}
                src={heroImages[currentImageIndex].url}
                alt={heroImages[currentImageIndex].caption}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag={heroImages.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            
            {/* Navigation Arrows */}
            {heroImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); paginate(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {heroImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
                    />
                  ))}
                </div>
              </>
            )}

            {/* Location Tag */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white font-bold">
              <MapPin className="w-4 h-4" />
              <span className="font-sans">{heroImages[currentImageIndex].caption}</span>
            </div>
          </div>
        </div>

        {/* 5. Accommodation Info Block */}
        {accommodation && (
          <div className="px-4 mb-8">
            <div 
              onClick={() => setIsHotelModalOpen(true)}
              className="flex items-center bg-[#F9F9F9] p-4 border-l-4 border-k-blue cursor-pointer hover:bg-white transition-colors shadow-sm"
            >
              <div className="flex-1">
                <p className="text-xs text-k-coffee/60 font-bold tracking-wider mb-1 font-sans">當日入住旅館</p>
                <p className="text-lg font-bold text-k-coffee font-serif tracking-wide mb-1">{accommodation.title.replace('住宿：', '')}</p>
                <div className="flex items-center gap-1.5 text-k-coffee/50">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-bold font-mono">Check-in: {checkInTime}</span>
                </div>
              </div>
              <BedDouble className="w-6 h-6 text-k-coffee/30" />
            </div>
          </div>
        )}

        {/* 6. Timeline List */}
        <div className="px-4 pb-24">
          {currentDay.items.map((item) => (
            <React.Fragment key={item.id}>
              {item.isSeparateSection && (
                <div className="py-8 flex items-center justify-center">
                  <div className="h-px bg-k-coffee/20 w-1/3"></div>
                  <span className="mx-4 text-k-coffee/40 text-xs font-serif italic tracking-widest">{item.sectionTitle || 'Separate Section'}</span>
                  <div className="h-px bg-k-coffee/20 w-1/3"></div>
                </div>
              )}
              <ItineraryCard 
                item={item} 
                onClick={() => setSelectedItineraryItem(item)}
              />
            </React.Fragment>
          ))}
          
          <div className="text-center py-12 opacity-30">
            <p className="text-xs text-k-coffee font-serif italic tracking-widest">End of Day {currentDay.day}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
      <HotelModal isOpen={isHotelModalOpen} onClose={() => setIsHotelModalOpen(false)} hotel={accommodation} />
      {selectedItineraryItem && (
        <GuideModal 
          item={selectedItineraryItem} 
          isOpen={!!selectedItineraryItem} 
          onClose={() => setSelectedItineraryItem(null)} 
        />
      )}
    </div>
  );
}
