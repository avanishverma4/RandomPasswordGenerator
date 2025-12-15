export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export enum StrengthLevel {
  TOO_WEAK = 0,
  WEAK = 1,
  MEDIUM = 2,
  STRONG = 3
}

export interface StrengthResult {
  score: StrengthLevel;
  label: string;
  entropy: number;
  crackTime: string;
}