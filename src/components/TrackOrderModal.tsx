import React, { useState } from 'react';
import { Truck, X, Search, CheckCircle2 } from 'lucide-react';
import { ASSET_IMAGES } from '../data/productData';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery) return;
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 border border-gray-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="h-9 px-2.5 py-1 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center shrink-0">
            <img
              src={ASSET_IMAGES.brandLogo}
              alt="QAVELLE"
              className="h-6 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-950">
              Track Your Official Order
            </h3>
            <p className="text-xs text-gray-500">Real-time status from QAVELLE dispatch facility</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Order ID / 10-digit Phone"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black text-[#FFC107] text-xs font-bold rounded-lg hover:bg-gray-800"
          >
            Track Status
          </button>
        </form>

        {hasSearched && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-3.5 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
              <div>
                <span className="text-gray-500 block text-[10px]">Tracking Order:</span>
                <strong className="text-sm text-gray-900 font-mono">
                  {orderQuery.toUpperCase().startsWith('QVL') ? orderQuery.toUpperCase() : `QVL-638210`}
                </strong>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                In Transit (Bluedart Air)
              </span>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-3.5 relative pl-5 border-l-2 border-[#FFC107] ml-2 text-xs">
              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></span>
                <strong className="text-gray-900 block">Quality Inspection & Micro Gold Polish Verification Completed</strong>
                <span className="text-[10px] text-gray-500">QAVELLE Studio &bull; Yesterday 11:30 AM</span>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></span>
                <strong className="text-gray-900 block">Sealed in Black Kappa Box & Dispatched</strong>
                <span className="text-[10px] text-gray-500">Air Express AWB #BD74910294 &bull; Today 09:15 AM</span>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#FFC107] animate-pulse border-2 border-white shadow-xs"></span>
                <strong className="text-amber-900 block">In Transit to Destination Delivery Hub</strong>
                <span className="text-[10px] text-gray-500">Arriving at city sorting facility</span>
              </div>

              <div className="relative opacity-50">
                <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-white"></span>
                <strong className="text-gray-600 block">Out for Doorstep Delivery & COD Handover</strong>
                <span className="text-[10px] text-gray-400">Expected within 24-48 hours</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
