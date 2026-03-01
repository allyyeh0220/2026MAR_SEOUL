import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  MouseSensor,
  TouchSensor,
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  pointerWithin,
  CollisionDetection
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

import { itineraryData as initialItineraryData, ItineraryItem } from '../data/itinerary';
import { PreTripView } from './PreTripView';
import { SortableItineraryItem } from './SortableItineraryItem';
import { ItineraryEditorModal } from './ItineraryEditorModal';
import { WeatherWidget } from './WeatherWidget';
import { InfoModal } from './InfoModal';
import { ExpenseModal } from './ExpenseModal';
import { HotelModal } from './HotelModal';
import { GuideModal } from './GuideModal';
import { TrashBin } from './TrashBin';
import { ChevronLeft, ChevronRight, Info, Wallet, BedDouble, MapPin, Clock, Plus } from 'lucide-react';

export function ItineraryView() {
  // State for Itinerary Data
  const [itinerary, setItinerary] = useState(initialItineraryData);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const index = initialItineraryData.findIndex(day => day.date === todayStr);
    
    if (index !== -1) return index;
    
    // If today is before the first day of the trip, show Pre-Trip
    if (initialItineraryData.length > 0 && todayStr < initialItineraryData[0].date) {
      return -1;
    }
    
    return 0;
  });

  // Scroll to top when day changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentDayIndex]);

  // Fetch data from Firestore on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "itinerary"));

        if (querySnapshot.empty) {
          // Seed data if empty
          const batch = writeBatch(db);
          initialItineraryData.forEach(day => {
            day.items.forEach((item, index) => {
              const docRef = doc(db, "itinerary", item.id);
              batch.set(docRef, { ...item, day: day.day, sortOrder: index });
            });
          });
          await batch.commit();
          setItinerary(initialItineraryData);
        } else {
          // Parse data
          const items = querySnapshot.docs.map(doc => doc.data());
          setItinerary(prev => {
            return prev.map(day => {
              const dayItems = items.filter((i: any) => i.day === day.day);
              // Sort is already done by query, but good to be safe or if we change query
              dayItems.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
              return {
                ...day,
                items: dayItems as ItineraryItem[]
              };
            });
          });
        }
      } catch (err) {
        console.error("Failed to load itinerary from Firestore", err);
      }
    };

    fetchData();
  }, []);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [selectedItineraryItem, setSelectedItineraryItem] = useState<ItineraryItem | null>(null);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);

  const currentDay = currentDayIndex === -1 ? null : itinerary[currentDayIndex];
  
  // Find accommodation for the day if it exists
  const accommodation = currentDay?.items.find(item => item.type === 'accommodation');
  const checkInTime = accommodation?.bookingInfo?.checkIn?.split(' ')[1] || '15:00';

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const itemImages = currentDay?.items
    .filter(item => (item.images && item.images.length > 0) || item.image)
    .flatMap(item => {
      const images = item.images || (item.image ? [item.image] : []);
      // Clean up title for caption
      let caption = item.title;
      // Remove prefix like "行程："
      if (caption.includes('：')) {
        caption = caption.split('：')[1];
      }
      // Remove suffix like "(English/Korean Name)"
      if (caption.includes('(')) {
        caption = caption.split('(')[0];
      }
      caption = caption.trim();
      
      return images.map(url => ({ url, caption }));
    }) || [];

  const heroImages = (currentDay?.heroImages && currentDay.heroImages.length > 0)
    ? currentDay.heroImages
    : (itemImages.length > 0 
      ? itemImages 
      : [{ url: `https://picsum.photos/seed/pretrip/800/450`, caption: '首爾' }]);

  // Ensure index is valid to prevent crashes when switching days with different image counts
  const validImageIndex = (currentImageIndex >= 0 && currentImageIndex < heroImages.length) 
    ? currentImageIndex 
    : 0;

  useEffect(() => {
    setCurrentImageIndex(0);
    setDirection(0);
  }, [currentDayIndex]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Long press 0.2s
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    
    if (!over) return;

    // Handle Deletion
    if (over.id === 'trash-bin') {
      setItinerary((prev) => {
        const newItinerary = [...prev];
        const day = { ...newItinerary[currentDayIndex] };
        day.items = day.items.filter((item) => item.id !== active.id);
        newItinerary[currentDayIndex] = day;
        return newItinerary;
      });

      // Firestore Delete
      deleteDoc(doc(db, "itinerary", active.id as string))
        .catch(err => console.error("Failed to delete item", err));
      return;
    }
    
    if (active.id !== over.id) {
      setItinerary((prev) => {
        const newItinerary = [...prev];
        const day = { ...newItinerary[currentDayIndex] };
        const items = [...day.items];
        
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        day.items = newItems;
        newItinerary[currentDayIndex] = day;
        
        // Firestore Reorder
        const batch = writeBatch(db);
        newItems.forEach((item, index) => {
            const ref = doc(db, "itinerary", item.id);
            batch.update(ref, { sortOrder: index });
        });
        batch.commit().catch(err => console.error("Failed to reorder", err));

        return newItinerary;
      });
    }
  };

  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // First, check if we are over the trash bin (using pointerWithin)
    const pointerCollisions = pointerWithin(args);
    const trashBin = pointerCollisions.find((c) => c.id === 'trash-bin');
    
    if (trashBin) {
      return [trashBin];
    }

    // Otherwise, fallback to closestCenter for the sortable list
    return closestCenter(args);
  }, []);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
    // Close the guide modal if it's open (it should be, as we edit from there)
    setSelectedItineraryItem(null); 
  };

  const handleSaveItem = (item: ItineraryItem) => {
    const existingItemIndex = currentDay.items.findIndex(i => i.id === item.id);
    const isNew = existingItemIndex === -1;

    setItinerary((prev) => {
      const newItinerary = [...prev];
      const day = { ...newItinerary[currentDayIndex] };
      const items = [...day.items];
      
      if (!isNew) {
        // Edit existing
        const index = items.findIndex((i) => i.id === item.id);
        items[index] = item;
      } else {
        // Add new
        items.push(item);
      }
      
      day.items = items;
      newItinerary[currentDayIndex] = day;
      return newItinerary;
    });

    // Firestore Save
    const itemToSave = { ...item, day: currentDay.day };
    
    if (isNew) {
        const newSortOrder = currentDay.items.length; // Append to end
        setDoc(doc(db, "itinerary", item.id), { ...itemToSave, sortOrder: newSortOrder })
            .catch(err => console.error("Failed to create item", err));
    } else {
        setDoc(doc(db, "itinerary", item.id), itemToSave, { merge: true })
            .catch(err => console.error("Failed to update item", err));
    }
  };

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
          {/* Pre-Trip Button */}
          <button
            onClick={() => setCurrentDayIndex(-1)}
            className={`flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] rounded-[15px] transition-all duration-300 shrink-0 ${
              currentDayIndex === -1
                ? 'bg-k-coffee text-white shadow-lg' 
                : 'bg-[#EAE6D6] text-[#A89F91] hover:bg-[#E0DCC8]'
            }`}
          >
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-80 font-serif">PRE</span>
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-80 font-serif my-0.5">TRIP</span>
          </button>

          {itinerary.map((day, index) => {
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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide relative">
        
        {currentDayIndex === -1 ? (
          <PreTripView />
        ) : (
          currentDay && (
            <>
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
                      key={validImageIndex}
                      src={heroImages[validImageIndex].url}
                      alt={heroImages[validImageIndex].caption}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  
                  {/* Location Tag */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white font-bold z-10">
                    <MapPin className="w-4 h-4" />
                    <span className="font-sans">{heroImages[validImageIndex].caption}</span>
                  </div>

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
                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === validImageIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
                          />
                        ))}
                      </div>
                    </>
                  )}

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

              {/* 6. Timeline List (Sortable) */}
              <div className="px-4 pb-24">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={customCollisionDetection}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={currentDay.items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {currentDay.items.map((item) => (
                      <React.Fragment key={item.id}>
                        {item.isSeparateSection && (
                          <div className="py-8 flex items-center justify-center">
                            <div className="h-px bg-k-coffee/20 w-1/3"></div>
                            <span className="mx-4 text-k-coffee/40 text-xs font-serif italic tracking-widest">{item.sectionTitle || 'Separate Section'}</span>
                            <div className="h-px bg-k-coffee/20 w-1/3"></div>
                          </div>
                        )}
                        <SortableItineraryItem 
                          item={item} 
                          onClick={() => setSelectedItineraryItem(item)}
                        />
                      </React.Fragment>
                    ))}
                  </SortableContext>

                  {/* Trash Bin - Only visible when dragging */}
                  <AnimatePresence>
                    {isDragging && (
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.5 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                      >
                        <TrashBin />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DndContext>
                
                <div className="text-center py-12 opacity-30">
                  <p className="text-xs text-k-coffee font-serif italic tracking-widest">End of Day {currentDay.day}</p>
                </div>
              </div>
            </>
          )
        )}
      </div>

      {/* Floating Add Button - Hidden when dragging or in Pre-Trip mode */}
      <AnimatePresence>
        {!isDragging && currentDayIndex !== -1 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleAddItem}
            className="absolute bottom-6 right-6 w-14 h-14 bg-k-coffee text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-k-coffee/90 transition-transform active:scale-95 z-40"
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modals */}
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
      <HotelModal isOpen={isHotelModalOpen} onClose={() => setIsHotelModalOpen(false)} hotel={accommodation} />
      
      {selectedItineraryItem && (
        <GuideModal 
          item={selectedItineraryItem} 
          isOpen={!!selectedItineraryItem} 
          onClose={() => setSelectedItineraryItem(null)}
          onEdit={() => handleEditItem(selectedItineraryItem)}
        />
      )}

      <ItineraryEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
      />
    </div>
  );
}
