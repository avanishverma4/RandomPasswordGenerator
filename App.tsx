import React, { useState, useEffect, useCallback } from 'react';
import { Copy, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PasswordOptions, StrengthResult, StrengthLevel } from './types';
import { generatePassword, calculateStrength } from './utils/passwordUtils';
import { Checkbox } from './components/Checkbox';
import { StrengthMeter } from './components/StrengthMeter';

const App: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 10,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  });
  const [strength, setStrength] = useState<StrengthResult>({ 
    score: 0, 
    label: '',
    entropy: 0,
    crackTime: ''
  });

  // Update slider background gradient dynamically
  const getSliderBackgroundSize = () => {
    const min = 0;
    const max = 20;
    return { backgroundSize: `${((options.length - min) * 100) / (max - min)}% 100%` };
  };

  const handleGenerate = useCallback(() => {
    // Ensure at least one option is selected
    if (!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols) {
       // Auto select lowercase if nothing is selected
       setOptions(prev => ({ ...prev, includeLowercase: true }));
       // We still want to generate immediately after updating state, but state updates are async.
       // For simplicity in this logical flow, we'll just derive the "next" options locally for generation
       const nextOptions = { ...options, includeLowercase: true };
       const newPassword = generatePassword(nextOptions);
       setPassword(newPassword);
       setStrength(calculateStrength(nextOptions));
       setCopied(false);
       return;
    }

    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setStrength(calculateStrength(options));
    setCopied(false);
  }, [options]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Generate on mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, length: Number(e.target.value) }));
  };

  const toggleOption = (key: keyof PasswordOptions) => {
    setOptions(prev => {
        // Prevent unchecking the last remaining option
        const checkedCount = [
            prev.includeUppercase, 
            prev.includeLowercase, 
            prev.includeNumbers, 
            prev.includeSymbols
        ].filter(Boolean).length;

        if (checkedCount === 1 && prev[key]) {
            return prev;
        }

        return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      <h1 className="text-grey font-bold text-center text-xl md:text-2xl mb-2">Password Generator</h1>
      
      {/* Password Display Box */}
      <div className="bg-dark-grey p-4 md:p-8 flex justify-between items-center relative">
        <div className="w-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={password}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                >
                    <input 
                    type="text" 
                    readOnly 
                    value={password}
                    className="bg-transparent text-almost-white text-2xl md:text-[32px] font-bold w-full outline-none placeholder-opacity-25 placeholder-almost-white"
                    placeholder="P4$5W0rD!"
                    />
                </motion.div>
            </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {copied && (
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className="text-neon-green text-sm md:text-base font-bold uppercase whitespace-nowrap"
                >
                Copied
                </motion.span>
            )}
          </AnimatePresence>
          <motion.button 
            onClick={handleCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-neon-green hover:text-white transition-colors duration-200"
            aria-label="Copy to clipboard"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Copy className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Controls Container */}
      <div className="bg-dark-grey p-4 md:p-8">
        
        {/* Character Length Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <label className="text-base md:text-lg font-bold text-almost-white">Character Length</label>
            <span className="text-neon-green text-2xl md:text-[32px] font-bold">{options.length}</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={options.length}
            onChange={handleLengthChange}
            className="w-full h-2 bg-very-dark-grey rounded-lg appearance-none cursor-pointer accent-neon-green"
            style={{
                background: `linear-gradient(to right, #A4FFAF 0%, #A4FFAF ${((options.length - 0) * 100) / 20}%, #18171F ${((options.length - 0) * 100) / 20}%, #18171F 100%)`
            }}
          />
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-4 md:gap-5">
          <Checkbox 
            label="Include Uppercase Letters" 
            checked={options.includeUppercase} 
            onChange={() => toggleOption('includeUppercase')} 
          />
          <Checkbox 
            label="Include Lowercase Letters" 
            checked={options.includeLowercase} 
            onChange={() => toggleOption('includeLowercase')} 
          />
          <Checkbox 
            label="Include Numbers" 
            checked={options.includeNumbers} 
            onChange={() => toggleOption('includeNumbers')} 
          />
          <Checkbox 
            label="Include Symbols" 
            checked={options.includeSymbols} 
            onChange={() => toggleOption('includeSymbols')} 
          />
        </div>

        {/* Strength Meter */}
        <StrengthMeter strength={strength} />

        {/* Generate Button */}
        <motion.button 
          onClick={handleGenerate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-8 bg-neon-green text-very-dark-grey font-bold text-base md:text-lg py-5 px-6 flex justify-center items-center gap-4 hover:bg-transparent hover:text-neon-green border-2 border-neon-green transition-colors duration-200 group"
        >
          GENERATE
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
             <ArrowRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default App;