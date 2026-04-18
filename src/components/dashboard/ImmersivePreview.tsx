"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ImmersivePreviewProps {
  url: string;
  onClose: () => void;
  businessName: string;
}

export const ImmersivePreview: React.FC<ImmersivePreviewProps> = ({ url, onClose, businessName }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col overflow-hidden"
    >
      {/* Ghost Close Button */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        whileHover={{ opacity: 0.8 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-50 flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full transition-all border border-white/10"
      >
        <X size={20} />
      </motion.button>

      {/* The Demo Site */}
      <iframe 
        src={url} 
        className="w-full h-full border-none select-none"
        title={businessName}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </motion.div>
  );
};
