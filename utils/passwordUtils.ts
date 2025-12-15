import { PasswordOptions, StrengthLevel, StrengthResult } from '../types';

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-="\'\\'
};

export const generatePassword = (options: PasswordOptions): string => {
  let validChars = '';
  if (options.includeUppercase) validChars += CHAR_SETS.uppercase;
  if (options.includeLowercase) validChars += CHAR_SETS.lowercase;
  if (options.includeNumbers) validChars += CHAR_SETS.numbers;
  if (options.includeSymbols) validChars += CHAR_SETS.symbols;

  if (validChars.length === 0) return '';

  let generatedPassword = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    generatedPassword += validChars.charAt(array[i] % validChars.length);
  }

  return generatedPassword;
};

export const calculateStrength = (options: PasswordOptions): StrengthResult => {
  const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;
  
  let poolSize = 0;
  if (includeUppercase) poolSize += 26;
  if (includeLowercase) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += CHAR_SETS.symbols.length;

  if (length === 0 || poolSize === 0) {
    return { 
      score: StrengthLevel.TOO_WEAK, 
      label: '', 
      entropy: 0, 
      crackTime: 'instantly' 
    };
  }

  // Calculate Entropy: E = L * log2(R)
  const entropy = length * Math.log2(poolSize);

  // Determine Score based on Entropy thresholds
  let score = StrengthLevel.TOO_WEAK;
  // Thresholds: <30 (Too Weak), 30-49 (Weak), 50-69 (Medium), >=70 (Strong)
  if (entropy >= 70) score = StrengthLevel.STRONG;
  else if (entropy >= 50) score = StrengthLevel.MEDIUM;
  else if (entropy >= 30) score = StrengthLevel.WEAK;

  const labels = {
    [StrengthLevel.TOO_WEAK]: 'TOO WEAK!',
    [StrengthLevel.WEAK]: 'WEAK',
    [StrengthLevel.MEDIUM]: 'MEDIUM',
    [StrengthLevel.STRONG]: 'STRONG'
  };

  // Estimate Time to Crack
  // Assumption: Attacker can try 10^10 (10 billion) guesses per second (approx high-end GPU cluster)
  const guessesPerSecond = 1e10;
  const seconds = Math.pow(2, entropy) / guessesPerSecond;
  
  let crackTime = 'instantly';
  if (seconds > 3.154e9) crackTime = '> 100 years'; // ~100 years
  else if (seconds > 31536000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else if (seconds > 2592000) crackTime = `${Math.round(seconds / 2592000)} months`;
  else if (seconds > 604800) crackTime = `${Math.round(seconds / 604800)} weeks`;
  else if (seconds > 86400) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds > 3600) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds > 60) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds > 1) crackTime = `${Math.round(seconds)} seconds`;

  return {
    score,
    label: labels[score],
    entropy: Math.round(entropy),
    crackTime
  };
};