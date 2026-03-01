import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { ItineraryItem } from '../data/itinerary';

interface ItineraryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ItineraryItem) => void;
  initialItem?: ItineraryItem | null;
}

export const ItineraryEditorModal: React.FC<ItineraryEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialItem 
}) => {
  const [formData, setFormData] = useState<Partial<ItineraryItem>>({
    time: '09:00',
    type: 'sight',
    title: '',
    description: '',
    koreanAddress: '',
    naverMapLink: '',
    notes: '',
    images: []
  });

  useEffect(() => {
    if (isOpen) {
      if (initialItem) {
        setFormData({ 
          ...initialItem,
          images: initialItem.images || (initialItem.image ? [initialItem.image] : [])
        });
      } else {
        setFormData({
          time: '09:00',
          type: 'sight',
          title: '',
          description: '',
          koreanAddress: '',
          naverMapLink: '',
          notes: '',
          images: []
        });
      }
    }
  }, [initialItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return; // Basic validation
    
    // Ensure we have an ID
    const itemToSave = {
      ...formData,
      id: formData.id || `new-${Date.now()}`,
    } as ItineraryItem;

    onSave(itemToSave);
    onClose();
  };

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
            className="absolute bottom-0 left-0 right-0 bg-[#FDFBF7] z-50 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] rounded-t-[20px] max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-k-coffee font-serif tracking-wide">
                {initialItem ? 'EDIT ITEM' : 'NEW ITEM'}
              </h3>
              <button onClick={onClose} className="p-2 bg-k-coffee/5 rounded-full hover:bg-k-coffee/10 transition-colors">
                <X className="w-5 h-5 text-k-coffee" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Time */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-1 uppercase tracking-wider">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-k-coffee/10 rounded-xl focus:outline-none focus:border-k-coffee/30 font-mono"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-1 uppercase tracking-wider">Category</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-k-coffee/10 rounded-xl focus:outline-none focus:border-k-coffee/30 font-sans"
                >
                  <option value="sight">Sightseeing (景點)</option>
                  <option value="food">Food (美食)</option>
                  <option value="shopping">Shopping (購物)</option>
                  <option value="transport">Transport (交通)</option>
                  <option value="accommodation">Accommodation (住宿)</option>
                  <option value="activity">Activity (活動)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-1 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Location Name"
                  className="w-full p-3 bg-white border border-k-coffee/10 rounded-xl focus:outline-none focus:border-k-coffee/30 font-sans font-bold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Short description..."
                  className="w-full p-3 bg-white border border-k-coffee/10 rounded-xl focus:outline-none focus:border-k-coffee/30 font-sans"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-1 uppercase tracking-wider">Notes (備註)</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Additional notes..."
                  className="w-full p-3 bg-white border border-k-coffee/10 rounded-xl focus:outline-none focus:border-k-coffee/30 font-sans"
                />
              </div>
              
              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-1 uppercase tracking-wider">Address (Korean)</label>
                <input
                  type="text"
                  name="koreanAddress" 
                  value={formData.koreanAddress || ''}
                  onChange={handleChange}
                  placeholder="Korean Address for Taxi"
                  className="w-full p-3 bg-white border border-k-coffee/10 rounded-xl focus:outline-none focus:border-k-coffee/30 font-sans"
                />
              </div>

              {/* Naver Map Link */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-1 uppercase tracking-wider">Naver Map Link</label>
                <input
                  type="text"
                  name="naverMapLink"
                  value={formData.naverMapLink || ''}
                  onChange={handleChange}
                  placeholder="https://naver.me/..."
                  className="w-full p-3 bg-white border border-k-coffee/10 rounded-xl focus:outline-none focus:border-k-coffee/30 font-sans text-sm text-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-k-coffee text-white font-bold py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2 hover:bg-k-coffee/90 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>SAVE ITINERARY</span>
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
