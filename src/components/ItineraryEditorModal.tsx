import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Camera, Trash2, Upload, Loader2 } from 'lucide-react';
import { ItineraryItem } from '../data/itinerary';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

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

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newUrls.push(url);
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== indexToRemove)
    }));
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
            className="absolute bottom-0 left-0 right-0 bg-[#FDFBF7] z-50 p-6 rounded-t-[20px] max-h-[90vh] overflow-y-auto shadow-2xl"
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

              {/* Photos Upload */}
              <div>
                <label className="block text-xs font-bold text-k-coffee/60 mb-2 uppercase tracking-wider">Photos</label>
                
                {/* Image Preview Grid */}
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={url} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-k-coffee/10 rounded-xl text-k-coffee/70 hover:bg-gray-50 transition-colors text-sm font-medium w-full justify-center"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Add Photos'}
                  </button>
                </div>
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
