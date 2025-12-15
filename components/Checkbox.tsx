import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-5 cursor-pointer group select-none">
      <motion.div 
        className="w-5 h-5 border-2 flex items-center justify-center"
        animate={{
          backgroundColor: checked ? '#A4FFAF' : 'rgba(0,0,0,0)',
          borderColor: checked ? '#A4FFAF' : '#E6E5EA',
        }}
        whileHover={{
          borderColor: checked ? '#A4FFAF' : '#A4FFAF',
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {checked && <Check className="w-3.5 h-3.5 text-very-dark-grey stroke-[4]" />}
        </motion.div>
      </motion.div>
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked} 
        onChange={onChange}
      />
      <span className="text-base md:text-lg font-bold">{label}</span>
    </label>
  );
};