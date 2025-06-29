'use client';

import { ChakraInfo } from '@/lib/chakra-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ChakraDetailProps {
  chakra: ChakraInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const ChakraDetail = ({ chakra, isOpen, onClose }: ChakraDetailProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-none shadow-2xl transition-all duration-300 ease-out"
        style={{
          boxShadow: `0 25px 50px -12px ${chakra.color}40, 0 0 0 1px ${chakra.color}20`
        }}
      >
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: chakra.color,
                  boxShadow: `0 0 20px ${chakra.color}40`
                }}
              >
                {/* You can add chakra icon here if desired */}
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-slate-800">
                  {chakra.name}
                </DialogTitle>
                <p className="text-sm text-slate-600 italic">{chakra.sanskrit}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <p className="text-slate-700 leading-relaxed">
              {chakra.description}
            </p>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 mb-2">Element</h4>
              <p className="text-slate-600">{chakra.element}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-2">Location</h4>
              <p className="text-slate-600">{chakra.location}</p>
            </div>
          </div>

          {/* Properties */}
          <div>
            <h4 className="font-medium text-slate-800 mb-3">Core Properties</h4>
            <div className="flex flex-wrap gap-2">
              {chakra.properties.map((property, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-700"
                >
                  {property}
                </span>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div>
            <h4 className="font-medium text-slate-800 mb-3">Associated Emotions</h4>
            <div className="flex flex-wrap gap-2">
              {chakra.emotions.map((emotion, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full text-white"
                  style={{ backgroundColor: `${chakra.color}dd` }}
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          {/* Physical & Mental Aspects */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 mb-3">Physical Aspects</h4>
              <ul className="space-y-1">
                {chakra.physicalAspects.map((aspect, index) => (
                  <li key={index} className="text-slate-600 text-sm flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: chakra.color }}
                    />
                    {aspect}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-3">Mental Aspects</h4>
              <ul className="space-y-1">
                {chakra.mentalAspects.map((aspect, index) => (
                  <li key={index} className="text-slate-600 text-sm flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: chakra.color }}
                    />
                    {aspect}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Affirmation */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-3">Daily Affirmation</h4>
            <p 
              className="italic text-lg font-medium leading-relaxed"
              style={{ color: chakra.color }}
            >
              "{chakra.affirmation}"
            </p>
          </div>

          {/* Wellness tip */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-medium">Wellness Tip:</span> Focus on this chakra during your 
              journaling practice to explore and balance these aspects of your well-being.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};