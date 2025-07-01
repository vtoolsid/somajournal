'use client';

import { ChakraInfo } from '@/lib/chakra-data';
import { Dialog, DialogContentWithoutClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ChakraDetailProps {
  chakra: ChakraInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const ChakraDetail = ({ chakra, isOpen, onClose }: ChakraDetailProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContentWithoutClose 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-none shadow-2xl transition-all duration-300 ease-out"
        style={{
          boxShadow: `0 25px 50px -12px ${chakra.color}40, 0 0 0 1px ${chakra.color}20`
        }}
      >
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-gray-200 shadow-lg flex items-center justify-center overflow-hidden bg-white">
                <Image
                  src={`/images/chakras/${chakra.id}.png`}
                  alt={`${chakra.name} symbol`}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <DialogTitle className="text-2xl font-semibold text-slate-800 leading-tight">
                  {chakra.name}
                </DialogTitle>
                <p className="text-sm text-slate-500 italic mt-0.5">{chakra.sanskrit}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
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
              &ldquo;{chakra.affirmation}&rdquo;
            </p>
          </div>

          {/* Alignment Guidance */}
          <div 
            className="rounded-xl p-4 border"
            style={{
              backgroundColor: `${chakra.color}10`,
              borderColor: `${chakra.color}30`
            }}
          >
            <h4 className="font-medium text-slate-800 mb-2">How to Align This Chakra</h4>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: `${chakra.color}` }}
            >
              {chakra.alignmentGuidance}
            </p>
          </div>
        </div>
      </DialogContentWithoutClose>
    </Dialog>
  );
};