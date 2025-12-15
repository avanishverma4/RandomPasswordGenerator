import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrengthLevel, StrengthResult } from '../types';

interface StrengthMeterProps {
  strength: StrengthResult;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ strength }) => {
  const getBarStyles = (index: number) => {
    const isActive = index <= strength.score;
    
    // Default empty state colors
    let backgroundColor = 'transparent';
    let borderColor = '#E6E5EA'; // almost-white

    if (isActive) {
      switch (strength.score) {
        case StrengthLevel.TOO_WEAK:
        case StrengthLevel.WEAK:
          backgroundColor = '#F64A4A'; // red
          borderColor = '#F64A4A';
          break;
        case StrengthLevel.MEDIUM:
          backgroundColor = '#FB7C58'; // orange
          borderColor = '#FB7C58';
          break;
        case StrengthLevel.STRONG:
          backgroundColor = '#A4FFAF'; // neon-green
          borderColor = '#A4FFAF';
          break;
      }
    }

    return { backgroundColor, borderColor };
  };

  return (
    <div className="bg-very-dark-grey p-4 md:p-6 mt-6">
      <div className="flex justify-between items-center relative z-10">
        <span className="text-grey font-bold text-base md:text-lg uppercase tracking-wider">Strength</span>
        
        <div className="flex items-center gap-4">
          <div className="h-8 flex items-center justify-end w-24">
              <AnimatePresence mode="wait">
                  {strength.label && (
                  <motion.span
                      key={strength.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="text-almost-white font-bold text-lg md:text-2xl uppercase mr-2"
                  >
                      {strength.label}
                  </motion.span>
                  )}
              </AnimatePresence>
          </div>
          
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((index) => (
              <motion.div 
                key={index} 
                className="w-2.5 h-7 border-2"
                animate={getBarStyles(index)}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {strength.entropy > 0 && (
            <motion.div 
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-grey/20"
            >
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex flex-col">
                        <span className="text-grey text-xs uppercase tracking-wider mb-1">Entropy</span>
                        <span className="text-neon-green font-mono text-sm md:text-base font-bold">~{strength.entropy} bits</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-grey text-xs uppercase tracking-wider mb-1">Est. Crack Time</span>
                        <span className="text-neon-green font-mono text-sm md:text-base font-bold">{strength.crackTime}</span>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};