export type SupportedCurrency = 'ILS' | 'USD';

export interface PriceRules {
  min: number;
  preferredMin: number;
  preferredMax: number;
  midMax: number;
  max: number;
}

export const PRICE_RULES_BY_CURRENCY: Record<SupportedCurrency, PriceRules> = {
  ILS: {
    min: 8,
    preferredMin: 8,
    preferredMax: 110,
    midMax: 185,
    max: 280,
  },
  USD: {
    min: 2,
    preferredMin: 2,
    preferredMax: 30,
    midMax: 50,
    max: 75,
  },
};
