import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, BedDouble, Phone, AlertTriangle } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
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
            className="absolute inset-0 bg-[#FDFBF7] z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-k-coffee font-serif tracking-wide">TRIP INFO</h3>
              <button onClick={onClose} className="p-2 bg-k-coffee/5 rounded-full hover:bg-k-coffee/10 transition-colors">
                <X className="w-5 h-5 text-k-coffee" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Flight Info */}
              <div className="bg-white p-5 rounded-[15px] shadow-sm border border-k-coffee/5">
                <div className="flex items-center gap-2 mb-4 text-k-coffee">
                  <Plane className="w-5 h-5" />
                  <h4 className="font-bold font-sans">航班資訊</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-k-coffee/50 font-bold mb-1">去程 DEPARTURE</p>
                      <p className="font-bold text-k-coffee">BR170</p>
                      <p className="text-sm text-k-coffee/70">07:05 TPE - 10:30 ICN</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold bg-k-blue/20 text-k-coffee px-2 py-1 rounded-full">3/24</span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-k-coffee/5" />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-k-coffee/50 font-bold mb-1">回程 RETURN</p>
                      <p className="font-bold text-k-coffee">BR159</p>
                      <p className="text-sm text-k-coffee/70">19:45 ICN - 21:25 TPE</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold bg-k-blue/20 text-k-coffee px-2 py-1 rounded-full">3/29</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accommodation Info */}
              <div className="bg-white p-5 rounded-[15px] shadow-sm border border-k-coffee/5">
                <div className="flex items-center gap-2 mb-4 text-k-coffee">
                  <BedDouble className="w-5 h-5" />
                  <h4 className="font-bold font-sans">住宿資訊</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-k-coffee">Le Seoul Hotel</p>
                    <p className="text-sm text-k-coffee/70">明洞 Myeongdong</p>
                    <p className="text-xs text-k-coffee/50 mt-1">3/24 - 3/28 (4 Nights)</p>
                  </div>
                  <div className="w-full h-px bg-k-coffee/5" />
                  <div>
                    <p className="font-bold text-k-coffee">Dream House</p>
                    <p className="text-sm text-k-coffee/70">弘大 Hongdae</p>
                    <p className="text-xs text-k-coffee/50 mt-1">3/28 - 3/29 (1 Night)</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white p-5 rounded-[15px] shadow-sm border border-k-coffee/5">
                <div className="flex items-center gap-2 mb-4 text-[#D32F2F]">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-bold font-sans">緊急聯絡電話</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FFF5F5] p-3 rounded-xl text-center">
                    <p className="text-xs text-[#D32F2F]/70 font-bold mb-1">報警 Police</p>
                    <p className="text-xl font-bold text-[#D32F2F] font-mono">112</p>
                  </div>
                  <div className="bg-[#FFF5F5] p-3 rounded-xl text-center">
                    <p className="text-xs text-[#D32F2F]/70 font-bold mb-1">救護 Fire/Amb</p>
                    <p className="text-xl font-bold text-[#D32F2F] font-mono">119</p>
                  </div>
                  <div className="col-span-2 bg-[#FFF5F5] p-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-[#D32F2F]/70 font-bold">外交部緊急聯絡</span>
                    <span className="text-sm font-bold text-[#D32F2F] font-mono">+82-10-9093-5912</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
