import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, Star, Wifi, Coffee, FileText } from 'lucide-react';
import { ItineraryItem } from '../data/itinerary';

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: ItineraryItem | undefined;
}

export const HotelModal: React.FC<HotelModalProps> = ({ isOpen, onClose, hotel }) => {
  if (!hotel) return null;

  // Use real data or fallbacks
  const images = hotel.images || ["https://picsum.photos/seed/hotel/800/600"];
  const checkInTime = hotel.bookingInfo?.checkIn.split(' ')[1] || "15:00";
  const checkOutTime = hotel.bookingInfo?.checkOut.split(' ')[1] || "11:00";

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#FDFBF7] z-50 p-0 flex flex-col overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 shrink-0">
              <img 
                src={images[0]} 
                alt="Hotel" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="px-2 py-1 bg-k-blue/80 text-[10px] font-bold rounded-md mb-2 inline-block">HOTEL</span>
                <h2 className="text-2xl font-bold font-serif tracking-wide">{hotel.title.replace('住宿：', '')}</h2>
                <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.location}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-[15px] border border-k-coffee/5 text-center">
                  <p className="text-xs text-k-coffee/50 font-bold mb-1 uppercase tracking-wider">Check-in</p>
                  <p className="text-xl font-bold text-k-coffee font-mono">{checkInTime}</p>
                </div>
                <div className="bg-white p-4 rounded-[15px] border border-k-coffee/5 text-center">
                  <p className="text-xs text-k-coffee/50 font-bold mb-1 uppercase tracking-wider">Check-out</p>
                  <p className="text-xl font-bold text-k-coffee font-mono">{checkOutTime}</p>
                </div>
              </div>

              {/* Booking Info */}
              {hotel.bookingInfo && (
                <div className="bg-white rounded-[15px] border border-k-coffee/5 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-k-coffee/40 uppercase tracking-widest">Booking Details</h3>
                    {hotel.pdfUrl && (
                      <a 
                        href={hotel.pdfUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1 text-xs font-bold text-k-coffee/60 hover:text-k-coffee transition-colors bg-k-coffee/5 px-2 py-1 rounded-md"
                        title="Download Booking Confirmation"
                      >
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                      </a>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-dashed border-k-coffee/10 pb-2">
                      <span className="text-sm text-k-coffee/60 font-bold">Booking ID</span>
                      <span className="text-sm font-bold text-k-coffee font-mono">{hotel.bookingInfo.bookingId}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-k-coffee/10 pb-2">
                      <span className="text-sm text-k-coffee/60 font-bold">Room Type</span>
                      <span className="text-sm font-bold text-k-coffee">{hotel.bookingInfo.roomType}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-k-coffee/10 pb-2">
                      <span className="text-sm text-k-coffee/60 font-bold">Guests</span>
                      <span className="text-sm font-bold text-k-coffee">{hotel.bookingInfo.guests} Adults</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-k-coffee/10 pb-2">
                      <span className="text-sm text-k-coffee/60 font-bold">Price</span>
                      <span className="text-sm font-bold text-k-coffee font-mono">{hotel.bookingInfo.price}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
                        {hotel.bookingInfo.policy}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description & Notes */}
              <div>
                <h3 className="text-lg font-bold text-k-coffee font-serif mb-3">About Hotel</h3>
                <p className="text-k-coffee/70 leading-relaxed text-sm mb-4">
                  {hotel.description}
                </p>
                {hotel.notes && (
                  <div className="bg-k-coffee/5 p-4 rounded-[15px] text-sm text-k-coffee/80 font-medium">
                    <span className="font-bold mr-2">Note:</span>
                    {hotel.notes}
                  </div>
                )}
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-bold text-k-coffee font-serif mb-3">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-k-coffee/70">
                    <MapPin className="w-5 h-5 text-k-coffee/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-k-coffee">{hotel.koreanAddress}</p>
                      {hotel.bookingInfo?.address && (
                         <p className="text-xs text-k-coffee/50 mt-1">{hotel.bookingInfo.address}</p>
                      )}
                    </div>
                  </div>
                  {hotel.bookingInfo?.contact && (
                    <div className="flex items-center gap-3 text-k-coffee/70">
                      <Phone className="w-5 h-5 text-k-coffee/40" />
                      <span className="text-sm font-mono">{hotel.bookingInfo.contact}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Photo if available */}
              {images.length > 1 && (
                <div>
                  <h3 className="text-lg font-bold text-k-coffee font-serif mb-3">Room Preview</h3>
                  <div className="rounded-[15px] overflow-hidden shadow-sm aspect-video">
                    <img src={images[1]} alt="Room" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-k-coffee/5 bg-white shrink-0">
              {hotel.naverMapLink ? (
                <a 
                  href={hotel.naverMapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#03C75A] text-white font-bold rounded-[15px] shadow-lg hover:bg-[#02b351] transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Open in Naver Map
                </a>
              ) : (
                <button className="w-full py-3 bg-k-coffee text-white font-bold rounded-[15px] shadow-lg hover:bg-k-coffee/90 transition-colors flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Open in Maps
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
