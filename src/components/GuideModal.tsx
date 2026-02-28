import { useState } from 'react';
import { X, MapPin, Utensils, Camera, Bus, Hotel, ShoppingBag, Ticket, Plane, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItineraryItem } from '../data/itinerary';

interface GuideModalProps {
  item: ItineraryItem;
  isOpen: boolean;
  onClose: () => void;
}

interface DishModalProps {
  dish: { nameCN: string; nameKR: string; imageUrl?: string; price?: string; isRecommended?: boolean };
  isOpen: boolean;
  onClose: () => void;
}

const DishModal = ({ dish, isOpen, onClose }: DishModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[15px] p-6 w-full max-w-sm relative"
            >
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              {dish.imageUrl && (
                <div className="aspect-square bg-gray-100 rounded-[15px] mb-4 overflow-hidden">
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.nameCN}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">{dish.nameKR}</h3>
                <p className="text-lg text-gray-500 font-medium">{dish.nameCN}</p>
                {dish.price && (
                  <p className="text-xl font-bold text-k-coffee mt-2">{dish.price}</p>
                )}
                <p className="text-xs text-gray-400 mt-4">請出示此畫面給店員看</p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export function GuideModal({ item, isOpen, onClose }: GuideModalProps) {
  const [selectedDish, setSelectedDish] = useState<{ nameCN: string; nameKR: string; imageUrl?: string; price?: string; isRecommended?: boolean } | null>(null);

  const getCategoryInfo = (type: string) => {
    switch (type) {
      case 'food': return { label: 'FOOD', icon: Utensils, color: 'bg-[#f4af63]' };
      case 'sight': return { label: 'SPOTS', icon: Camera, color: 'bg-[#d9e9f5]' };
      case 'transport': return { label: 'TRANSPORT', icon: Bus, color: 'bg-[#cdc8c3]' };
      case 'accommodation': return { label: 'HOTEL', icon: Hotel, color: 'bg-[#ad9c8f]' };
      case 'shopping': return { label: 'SHOPPING', icon: ShoppingBag, color: 'bg-[#d9e9f5]' };
      case 'activity': return { label: 'ACTIVITY', icon: Ticket, color: 'bg-[#d9e9f5]' };
      default: return { label: 'SPOTS', icon: MapPin, color: 'bg-[#d9e9f5]' };
    }
  };

  const { label, color } = getCategoryInfo(item.type);
  const isFlight = item.title.includes('航空') || (item.title.includes('機場') && !item.title.includes('抵達機場')) || item.ticketInfo;
  const displayLabel = isFlight ? 'FLIGHT' : label;
  const displayColor = isFlight ? 'bg-[#cdc8c3]' : color;

  // Only show images if explicitly provided
  const displayImages = item.images || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-k-coffee/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-[#FDFBF7] z-50 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-t-[15px]"
          >
            <div className="p-6 pb-12">
              {/* Close Button */}
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 bg-k-coffee/5 rounded-full hover:bg-k-coffee/10 transition-colors z-10"
              >
                <X className="w-5 h-5 text-k-coffee" />
              </button>

              {/* 1. Header Info */}
              <div className="mb-8 mt-2">
                {/* Row 1: Category & Time */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest ${displayColor}`}>
                    {displayLabel}
                  </span>
                  <span className="text-lg font-cream text-k-coffee tracking-widest">
                    {item.time}
                  </span>
                </div>

                {/* Row 2: Title */}
                <h2 className="text-2xl font-bold text-k-coffee font-serif mb-3 leading-tight">
                  {item.title}
                </h2>

                {/* Row 3: Korean Address */}
                {item.koreanAddress && (
                  <div className="flex items-center gap-2 text-k-coffee/60">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <p className="text-sm font-medium">{item.koreanAddress}</p>
                  </div>
                )}
              </div>

              {/* Navigation Buttons - Naver Map */}
              {(item.naverMapLink || item.type === 'sight') && (
                <div className="mb-8">
                  <a
                    href={item.naverMapLink || `https://map.naver.com/p/search/${encodeURIComponent(item.koreanAddress || item.location || item.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#03C75A] text-white rounded-[15px] font-bold hover:bg-[#02b351] transition-colors shadow-lg shadow-[#03C75A]/20"
                  >
                    <MapPin className="w-4 h-4" />
                    開啟 Naver Map
                  </a>
                </div>
              )}

              {/* Bus Map Button */}
              {item.type === 'transport' && item.title.includes('公車') && (
                <div className="mb-8">
                  <a
                    href="https://bus.go.kr/app/#viewpage/1000001/main.nearbusinfo/1/title=Home%20%EB%B2%84%EC%8A%A4%EC%A0%95%EB%B3%B4"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#4A90E2] text-white rounded-[15px] font-bold hover:bg-[#357ABD] transition-colors shadow-lg shadow-[#4A90E2]/20"
                  >
                    <Bus className="w-4 h-4" />
                    查詢公車地圖
                  </a>
                </div>
              )}

              {/* SPECIAL CONTENT BLOCKS */}
              
              {/* A. Ticket Info */}
              {item.ticketInfo && (
                <div className="bg-white border border-k-coffee/10 rounded-[15px] p-5 mb-8 shadow-sm">
                  <div className="flex items-center justify-between mb-4 border-b border-dashed border-k-coffee/10 pb-4">
                    <div className="flex items-center gap-2 text-k-coffee">
                      <Plane className="w-5 h-5" />
                      <span className="font-bold tracking-wider">ELECTRONIC TICKET</span>
                    </div>
                    <span className="text-xs font-mono text-k-coffee/50">{item.ticketInfo.bookingRef}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-k-coffee/40 font-bold uppercase">Passenger</p>
                        <p className="text-sm font-bold text-k-coffee">{item.ticketInfo.passenger}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-k-coffee/40 font-bold uppercase">Class</p>
                        <p className="text-sm font-bold text-k-coffee">{item.ticketInfo.seatClass}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-k-coffee/5 p-4 rounded-[10px]">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-k-coffee font-mono">{item.ticketInfo.from.split(' ')[0]}</p>
                        <p className="text-[10px] text-k-coffee/60 font-bold mt-1">{item.ticketInfo.from.replace('TPE ', '')}</p>
                      </div>
                      <div className="flex flex-col items-center px-4">
                        <span className="text-xs font-bold text-k-coffee/40 mb-1">{item.ticketInfo.flight}</span>
                        <div className="w-20 h-px bg-k-coffee/20 relative">
                          <Plane className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-k-coffee/40 rotate-90" />
                        </div>
                        <span className="text-xs font-bold text-k-coffee/40 mt-1">{item.ticketInfo.date}</span>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-k-coffee font-mono">{item.ticketInfo.to.split(' ')[0]}</p>
                        <p className="text-[10px] text-k-coffee/60 font-bold mt-1">{item.ticketInfo.to.replace('ICN ', '')}</p>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-xs text-k-coffee/40 font-mono">TKT: {item.ticketInfo.ticketNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* B. Transfer Info */}
              {item.transferInfo && (
                <div className="bg-white border border-k-coffee/10 rounded-[15px] p-5 mb-8 shadow-sm">
                  <div className="flex items-center gap-2 text-k-coffee mb-4">
                    <Car className="w-5 h-5" />
                    <span className="font-bold tracking-wider">機場接送預約</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-k-coffee/5 pb-2">
                      <span className="text-sm text-k-coffee/60">預約時間</span>
                      <span className="text-sm font-bold text-k-coffee">{item.transferInfo.pickupTime}</span>
                    </div>
                    <div className="flex justify-between border-b border-k-coffee/5 pb-2">
                      <span className="text-sm text-k-coffee/60">服務商</span>
                      <span className="text-sm font-bold text-k-coffee">{item.transferInfo.provider}</span>
                    </div>
                    <div className="flex justify-between border-b border-k-coffee/5 pb-2">
                      <span className="text-sm text-k-coffee/60">聯絡資訊</span>
                      <span className="text-sm font-bold text-k-coffee">{item.transferInfo.contact}</span>
                    </div>
                    <div className="bg-k-coffee/5 p-3 rounded-[10px] text-sm text-k-coffee/80 mt-2">
                      {item.transferInfo.details}
                    </div>
                  </div>
                </div>
              )}

              {/* C. Airport Guide */}
              {item.airportGuide && (
                <div className="bg-white border border-k-coffee/10 rounded-[15px] p-5 mb-8 shadow-sm">
                  <div className="flex items-center gap-2 text-k-coffee mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="font-bold tracking-wider">入境指引</span>
                  </div>
                  <div className="space-y-4 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-k-coffee/10" />
                    
                    {item.airportGuide.steps.map((step, i) => (
                      <div key={i} className="flex gap-4 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-k-coffee text-white flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-k-coffee text-sm mb-1">{step.title}</h4>
                          <p className="text-xs text-k-coffee/70 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Menu Recommendations (Only for Food) */}
              {item.type === 'food' && item.menuRecommendations && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-k-coffee/40 uppercase tracking-widest mb-4">Recommended Menu</h3>
                  <div className="space-y-3">
                    {item.menuRecommendations.map((dish, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDish(dish)}
                        className={`w-full flex items-center justify-between p-4 bg-white rounded-[15px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${
                          dish.isRecommended 
                            ? 'border-2 border-[#f4af63] ring-1 ring-[#f4af63]/20' 
                            : 'border border-k-coffee/5'
                        }`}
                      >
                        <span className="font-bold text-k-coffee text-sm">{dish.nameCN}</span>
                        <div className="flex-1 border-b border-dashed border-k-coffee/10 mx-4" />
                        <span className="font-bold text-k-coffee/60 text-sm">{dish.nameKR}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2.5 Shopping List (Any Type) */}
              {item.shoppingList && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-k-coffee/40 uppercase tracking-widest mb-4">Shopping List</h3>
                  <div className="space-y-4">
                    {item.shoppingList.map((shop, index) => {
                      const shopName = typeof shop === 'string' ? shop : shop.name;
                      const products = typeof shop === 'string' ? [] : (shop.items || []);

                      return (
                        <div key={index} className="bg-white rounded-[15px] border border-k-coffee/5 shadow-sm overflow-hidden">
                          {/* Shop Header */}
                          <div className="flex items-center justify-between p-4 bg-k-coffee/5">
                            <span className="font-bold text-k-coffee text-sm">{shopName}</span>
                            <ShoppingBag className="w-4 h-4 text-k-coffee/40" />
                          </div>

                          {/* Products List */}
                          {products && products.length > 0 && (
                            <div className="divide-y divide-k-coffee/5">
                              {products.map((product, pIndex) => (
                                <a 
                                  key={pIndex}
                                  href={product.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group"
                                >
                                  {/* Product Image */}
                                  {product.image && (
                                    <div className="w-[72px] h-[72px] rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Product Info */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-k-coffee line-clamp-2 mb-1">{product.name}</h4>
                                    {product.price && (
                                      <p className="text-xs font-mono text-k-coffee/60">{product.price}</p>
                                    )}
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Introduction (Carousel + Description) */}
              {!item.ticketInfo && !item.transferInfo && !item.airportGuide && (
                <div>
                  <h3 className="text-sm font-bold text-k-coffee/40 uppercase tracking-widest mb-4">Introduction</h3>
                  
                  {/* Image Carousel */}
                  {displayImages.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide snap-x">
                      {displayImages.map((img, i) => (
                        <div key={i} className="snap-center shrink-0 w-64 aspect-[4/3] rounded-[15px] overflow-hidden shadow-sm">
                          <img src={img} alt="Spot" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual Description */}
                  {item.description && (
                  <p className="text-k-coffee/80 leading-relaxed mb-6 font-medium">
                    {item.description}
                  </p>
                )}
              </div>
              )}

              {/* Navigation Button (Bottom Fixed or Inline) - Removed as it's now at the top */}
            </div>
          </motion.div>

          {/* Dish Modal */}
          {selectedDish && (
            <DishModal 
              dish={selectedDish} 
              isOpen={!!selectedDish} 
              onClose={() => setSelectedDish(null)} 
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
