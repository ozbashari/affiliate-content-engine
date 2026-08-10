import { CatalogProduct } from '../products/types';
import {
  PRICE_RULES_BY_CURRENCY,
  SupportedCurrency
} from './product-selection-config';
import { productTypeRules } from './product-type-rules';

export interface ScoredProductDetails {
  product: CatalogProduct;
  score: number;
  reasons: string[];
  warnings: string[];
  relevanceLevel: 'high' | 'medium' | 'low';
  matchedTerms: string[];
  missingCoreTerms: string[];
  completenessWarnings: string[];
  consumerReadinessLevel: 'high' | 'medium' | 'low';
  consumerReadinessReasons: string[];
  consumerReadinessWarnings: string[];
  discoveryKeyword?: string;
  // Inferred diagnostics
  inferredProductType: string;
  productTypeValidity: 'valid' | 'accessory' | 'replacement' | 'conflicting' | 'unregulated';
  matchedPositiveTerms: string[];
  matchedConflictingTerms: string[];
  matchedAccessoryTerms: string[];
  matchedReplacementTerms: string[];
  relevanceAdjustment: number;
  readinessAdjustment: number;
  productTypePrecedenceDiagnostics?: {
    matchedCategories: string[];
    winningCategory: string;
    precedenceRule: string;
  };
  selectionEligible: boolean;
  selectionIneligibilityReasons: string[];
}

export interface SelectionResult {
  product: CatalogProduct | null;
  reasons: string[];
  warnings: string[];
  rankedProducts?: ScoredProductDetails[];
}

const MODIFIERS = [
  'mini', 'portable', 'wireless', 'cordless', 'sliding', 'under', 'closet', 
  'dog', 'cat', 'car', 'diy', 'home', 'travel', 'outdoor', 'rechargeable', 
  'magnetic', 'silicone', 'plastic', 'wooden', 'metal', 'electric', 'manual',
  'empty'
];

export const KEYWORD_CONCEPTS: Record<string, { core: string[][]; terms: string[] }> = {
  'vegetable chopper': {
    core: [
      ['vegetable', 'veg', 'onion', 'garlic', 'fruit', 'food', 'salad'],
      ['chopper', 'slicer', 'cutter', 'shredder', 'grater', 'dicer', 'processor', 'peeler', 'mincer', 'press']
    ],
    terms: ['vegetable', 'chopper', 'slicer', 'cutter', 'kitchen', 'food', 'manual', 'electric']
  },
  'oil spray bottle': {
    core: [
      ['oil', 'vinegar', 'sauce', 'liquid'],
      ['spray', 'sprayer', 'dispenser', 'mister', 'pourer'],
      ['bottle', 'container', 'dispenser', 'pot']
    ],
    terms: ['oil', 'spray', 'bottle', 'dispenser', 'kitchen', 'cooking', 'barbecue', 'bbq']
  },
  'sink organizer': {
    core: [
      ['sink', 'faucet', 'basin', 'drain'],
      ['organizer', 'holder', 'rack', 'storage', 'caddy', 'tray', 'shelf']
    ],
    terms: ['sink', 'organizer', 'kitchen', 'bathroom', 'soap', 'sponge', 'caddy', 'rack']
  },
  'car phone holder': {
    core: [
      ['car', 'auto', 'vehicle'],
      ['phone', 'mobile', 'smartphone', 'gps'],
      ['holder', 'mount', 'stand', 'clip', 'support', 'cradle']
    ],
    terms: ['car', 'phone', 'holder', 'mount', 'magnetic', 'dashboard', 'air vent', 'windshield']
  },
  'car vacuum cleaner': {
    core: [
      ['car', 'auto', 'vehicle'],
      ['vacuum', 'cleaner', 'blower', 'duster'],
      ['portable', 'handheld', 'wireless', 'cordless', 'mini']
    ],
    terms: ['car', 'vacuum', 'cleaner', 'handheld', 'wireless', 'suction', 'portable']
  },
  'tire inflator': {
    core: [
      ['tire', 'tyre', 'wheel', 'ball', 'motorcycle', 'bicycle', 'bike'],
      ['inflator', 'pump', 'compressor']
    ],
    terms: ['tire', 'inflator', 'pump', 'compressor', 'car', 'portable', 'electric', 'digital']
  },
  'motion sensor light': {
    core: [
      ['motion', 'sensor', 'pir', 'detector', 'body induction', 'human body'],
      ['light', 'lamp', 'led', 'nightlight', 'bulb', 'luminaire']
    ],
    terms: ['motion', 'sensor', 'light', 'led', 'wireless', 'cabinet', 'wardrobe', 'hallway']
  },
  'under cabinet light': {
    core: [
      ['cabinet', 'wardrobe', 'closet', 'cupboard', 'shelf', 'kitchen'],
      ['light', 'lamp', 'led', 'bar', 'strip', 'puck']
    ],
    terms: ['cabinet', 'light', 'led', 'wireless', 'rechargeable', 'magnetic', 'under']
  },
  'smart plug': {
    core: [
      ['smart', 'wifi', 'zigbee', 'tuya', 'alexa', 'google home', 'bluetooth'],
      ['plug', 'socket', 'outlet', 'adapter']
    ],
    terms: ['smart', 'plug', 'socket', 'wifi', 'app', 'remote', 'control', 'home']
  },
  'wireless charger': {
    core: [
      ['wireless', 'qi', 'magnetic', 'magsafe', 'induction'],
      ['charger', 'charging', 'dock', 'stand', 'pad', 'station']
    ],
    terms: ['wireless', 'charger', 'fast', 'phone', 'charging', 'qi', 'stand', 'magnetic']
  }
};

export const RECOGNIZED_PHRASES: Record<string, string[]> = {
  'smart plug': ['smart plug', 'wifi socket', 'smart outlet', 'wifi plug', 'smart socket', 'zigbee plug', 'zigbee socket', 'tuya plug', 'tuya socket'],
  'motion sensor light': ['motion sensor light', 'sensor light', 'sensor lamp', 'night light', 'sensor nightlight', 'cabinet light', 'closet light', 'wardrobe light'],
  'car phone holder': ['phone holder', 'phone stand', 'phone mount', 'car holder', 'car mount', 'dashboard mount', 'vent mount', 'windshield mount'],
  'car vacuum cleaner': ['vacuum cleaner', 'handheld vacuum', 'car vacuum', 'portable vacuum'],
  'sink organizer': ['sink organizer', 'sink caddy', 'sponge holder', 'drain rack', 'sink rack'],
  'vegetable chopper': ['vegetable chopper', 'onion cutter', 'garlic press', 'mandoline slicer', 'vegetable slicer'],
  'oil spray bottle': ['oil spray', 'oil sprayer', 'oil dispenser', 'spray bottle', 'oil bottle'],
  'tire inflator': ['tire inflator', 'tyre inflator', 'tire pump', 'tyre pump', 'compressor pump'],
  'under cabinet light': ['cabinet light', 'closet light', 'wardrobe light', 'under cabinet'],
  'wireless charger': ['wireless charger', 'wireless charging', 'magsafe charger', 'magnetic charger']
};

export function normalizeTitleForInvariant(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0590-\u05FF]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function computeKeywordRelevance(title: string, keyword: string) {
  const titleLower = title.toLowerCase();
  const kwLower = keyword.toLowerCase();

  const matchedTerms: string[] = [];
  const missingCoreTerms: string[] = [];

  const keyConfig = KEYWORD_CONCEPTS[kwLower];
  let coreWords: string[] = [];
  if (keyConfig) {
    keyConfig.core.forEach((group) => {
      const match = group.find(word => titleLower.includes(word));
      if (match) {
        matchedTerms.push(match);
      } else {
        missingCoreTerms.push(group.join('|'));
      }
    });

    keyConfig.terms.forEach(word => {
      if (titleLower.includes(word) && !matchedTerms.includes(word)) {
        matchedTerms.push(word);
      }
    });

    // Extract matched core words for proximity check
    coreWords = keyConfig.core.map(group => group.find(word => titleLower.includes(word))).filter(Boolean) as string[];
  } else {
    // Fallback core words: filter out modifiers
    coreWords = kwLower.split(/\s+/).filter(w => w.length > 2 && !MODIFIERS.includes(w));
    if (coreWords.length === 0) {
      coreWords = kwLower.split(/\s+/).filter(w => w.length > 2);
    }
    coreWords.forEach(word => {
      if (titleLower.includes(word)) {
        matchedTerms.push(word);
      } else {
        missingCoreTerms.push(word);
      }
    });
  }

  const hasCoreMatch = missingCoreTerms.length === 0;
  let isEarlyMatch = false;
  if (hasCoreMatch && coreWords.length > 0) {
    const idx = titleLower.indexOf(coreWords[0]);
    if (idx !== -1 && idx < 60) {
      isEarlyMatch = true;
    }
  }

  let relevanceLevel: 'high' | 'medium' | 'low' = 'low';
  if (keyConfig) {
    if (missingCoreTerms.length === 0) {
      relevanceLevel = isEarlyMatch ? 'high' : 'medium';
    } else if (matchedTerms.length > 0) {
      relevanceLevel = 'medium';
    } else {
      relevanceLevel = 'low';
    }
  } else {
    const totalWords = kwLower.split(/\s+/).filter(w => w.length > 2).length;
    if (missingCoreTerms.length === 0) {
      relevanceLevel = isEarlyMatch ? 'high' : 'medium';
    } else if (matchedTerms.length >= Math.ceil(totalWords / 2)) {
      relevanceLevel = 'medium';
    } else {
      relevanceLevel = 'low';
    }
  }

  // Cap relevance at medium for focused intents if phrase level check is absent
  const phrases = RECOGNIZED_PHRASES[kwLower];
  if (phrases) {
    const hasPhraseMatch = phrases.some(phrase => titleLower.includes(phrase));
    if (!hasPhraseMatch && relevanceLevel === 'high') {
      relevanceLevel = 'medium';
    }
  }

  return {
    relevanceLevel,
    matchedTerms,
    missingCoreTerms
  };
}

export function computeConsumerReadiness(title: string) {
  const titleLower = title.toLowerCase();
  const reasons: string[] = [];
  const warnings: string[] = [];

  const normalizedTitle = normalizeTitleForInvariant(title);

  // Dollhouse indicator check (forces low readiness immediately)
  const miniatureIndicators = [
    'dollhouse', 'dolls house', 'miniature', '1/12', '1:12', 'pretend play',
    'simulation dollhouse', 'doll accessories', 'miniature model'
  ];
  const matchedMiniatures = miniatureIndicators.filter(ind => normalizedTitle.includes(ind));
  if (matchedMiniatures.length > 0) {
    warnings.push(`Miniature or dollhouse indicator matched: ${matchedMiniatures.join(', ')}`);
  }

  // Low readiness warning groups
  // 1. Electrical installation requiring panel/wiring
  const electricalInstallationTerms = [
    'circuit breaker', 'mcb', 'din rail', 'electrical panel', 'voltage regulator', 'breaker switch'
  ];
  // More specific installation/wiring check to prevent penalizing simple "switch"
  const specialistWiringTerms = ['specialist wiring', 'electrician', 'mains installation'];
  
  // 2. Technical modules & components
  const technicalModuleTerms = [
    'pcb', 'controller board', 'relay board', 'radar sensor module', 'development board', 'chipset'
  ];
  const hasModule = titleLower.includes('module') && !titleLower.includes('housing module') && !titleLower.includes('laser module');
  
  // 3. Professional or industrial
  const industrialTerms = [
    'industrial', 'commercial equipment', 'heavy duty machine'
  ];

  // 4. DIY or incomplete
  const diyTerms = [
    'diy kit', 'bare board', 'component only', 'shell only', 'replacement', 'spare part', 'nozzle only', 'filter only', 'accessory only'
  ];

  // Match checks
  const matchedElectrical = electricalInstallationTerms.filter(t => titleLower.includes(t));
  const matchedSpecialist = specialistWiringTerms.filter(t => titleLower.includes(t));
  const matchedTechModule = technicalModuleTerms.filter(t => titleLower.includes(t));
  const matchedIndustrial = industrialTerms.filter(t => titleLower.includes(t));
  const matchedDiy = diyTerms.filter(t => titleLower.includes(t));

  // Contextual check for general terms:
  if (titleLower.includes('wiring') && !titleLower.includes('harness') && !titleLower.includes('cam')) {
    warnings.push('Requires custom wiring');
  }
  if (titleLower.includes('ampere') || (titleLower.includes(' 63a') || titleLower.includes(' 16a') || titleLower.includes(' 32a')) && (titleLower.includes('breaker') || titleLower.includes('mcb'))) {
    warnings.push('Indicates high-amp electrical breaker');
  }

  // Check matched groups
  if (matchedElectrical.length > 0) {
    warnings.push(`Requires electrical panel installation or wiring: matched "${matchedElectrical.join(', ')}"`);
  }
  if (matchedSpecialist.length > 0) {
    warnings.push(`Requires specialist wiring or professional electrician: matched "${matchedSpecialist.join(', ')}"`);
  }
  if (matchedTechModule.length > 0 || hasModule) {
    const matchedStr = matchedTechModule.length > 0 ? matchedTechModule.join(', ') : 'module';
    warnings.push(`Technical module or developer board component: matched "${matchedStr}"`);
  }
  if (matchedIndustrial.length > 0) {
    warnings.push(`Professional or industrial equipment: matched "${matchedIndustrial.join(', ')}"`);
  }
  if (matchedDiy.length > 0) {
    warnings.push(`DIY or incomplete assembly part: matched "${matchedDiy.join(', ')}"`);
  }

  // Mains installation indicators
  if (titleLower.includes('professional installation') || titleLower.includes('requires installation') && titleLower.includes('electrical')) {
    warnings.push('Indicates professional electrical installation requirement');
  }

  let level: 'high' | 'medium' | 'low' = 'high';
  if (warnings.length > 0) {
    level = 'low';
  } else {
    // Check if it's a normal consumer product matching a positive search intent term
    const consumerSignals = [
      'chopper', 'peeler', 'organizer', 'holder', 'vacuum', 'inflator', 'light', 'plug', 'charger', 'bottle',
      'sealer', 'diffuser', 'wristband', 'lock', 'pen', 'adapter', 'converter', 'ring', 'paste', 'kit', 'bag',
      'towel', 'cloth', 'tape', 'mirror', 'pad'
    ];
    const hasSignal = consumerSignals.some(s => {
      const regex = new RegExp('\\b' + s + 's?\\b', 'i');
      return regex.test(titleLower);
    });
    if (hasSignal) {
      level = 'high';
      reasons.push('Clear complete consumer product with understandable purpose');
    } else {
      level = 'medium';
      reasons.push('General consumer accessibility');
    }
  }

  return {
    level,
    reasons,
    warnings
  };
}

// Reusable Classification Invariant framework
export interface ClassificationInvariantRule {
  name: string;
  check: (details: {
    title: string;
    normalizedTitle: string;
    consumerReadinessLevel: 'high' | 'medium' | 'low';
    productTypeValidity: 'valid' | 'accessory' | 'replacement' | 'conflicting' | 'unregulated';
    warnings: string[];
  }) => { violated: boolean; errorMsg?: string };
}

export const CLASSIFICATION_INVARIANTS: ClassificationInvariantRule[] = [
  {
    name: 'Dollhouse/Miniature Invariant',
    check: ({ normalizedTitle, consumerReadinessLevel }) => {
      const miniatureIndicators = [
        'dollhouse', 'dolls house', 'miniature', '1/12', '1:12', 'pretend play',
        'simulation dollhouse', 'doll accessories', 'miniature model'
      ];
      const hasMiniature = miniatureIndicators.some(ind => normalizedTitle.includes(ind));
      if (hasMiniature && consumerReadinessLevel === 'high') {
        return {
          violated: true,
          errorMsg: `Invariant Violation: Product has miniature/dollhouse indicators but has consumerReadinessLevel: "high"`
        };
      }
      return { violated: false };
    }
  },
  {
    name: 'Technical Module Invariant',
    check: ({ warnings, consumerReadinessLevel }) => {
      const hasTechnicalWarning = warnings.some(w => 
        w.toLowerCase().includes('technical module') || 
        w.toLowerCase().includes('developer board') ||
        w.toLowerCase().includes('circuit breaker') ||
        w.toLowerCase().includes('mcb') ||
        w.toLowerCase().includes('din rail')
      );
      if (hasTechnicalWarning && consumerReadinessLevel === 'high') {
        return {
          violated: true,
          errorMsg: `Invariant Violation: Product has technical warning/module indicators but has consumerReadinessLevel: "high"`
        };
      }
      return { violated: false };
    }
  },
  {
    name: 'Replacement Part Invariant',
    check: ({ productTypeValidity, consumerReadinessLevel }) => {
      if (productTypeValidity === 'replacement' && consumerReadinessLevel === 'high') {
        return {
          violated: true,
          errorMsg: `Invariant Violation: Product is a replacement part but has consumerReadinessLevel: "high"`
        };
      }
      return { violated: false };
    }
  }
];

export function selectBestProduct(products: CatalogProduct[]): SelectionResult {
  const eligibleProducts = products.filter((product) => {
    if (product.price && product.price.amount !== undefined) {
      const currencyUpper = product.price.currency?.toUpperCase();
      const isSupported = currencyUpper === 'USD' || currencyUpper === 'ILS';
      if (!isSupported) {
        return false;
      }
      const rules = PRICE_RULES_BY_CURRENCY[currencyUpper as SupportedCurrency];
      if (product.price.amount > rules.max) {
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
          const sym = currencyUpper === 'ILS' ? '₪' : '$';
          throw new Error(
            `Invariant Violation: Product ${product.externalId} exceeds maximum price of ${sym}${rules.max} inside selectBestProduct`
          );
        }
        return false;
      }
    }
    return true;
  });

  if (eligibleProducts.length === 0) {
    return {
      product: null,
      reasons: ['No products available for selection'],
      warnings: ['No products available for selection'],
      rankedProducts: []
    };
  }

  const scoredProducts = eligibleProducts.map((product) => {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];

    const titleLower = product.title.toLowerCase();
    const normalizedTitle = normalizeTitleForInvariant(product.title);

    // A. Keyword Relevance Analysis
    let relevanceLevel: 'high' | 'medium' | 'low' = 'high';
    let matchedTerms: string[] = [];
    let missingCoreTerms: string[] = [];
    let discoveryKeyword = '';

    if (product.origins && product.origins.length > 0) {
      const originsList = product.origins as { strategyType: string; strategyValue: string; page: number }[];
      const keywordOrigins = originsList.filter((o) => o.strategyType === 'keyword');
      if (keywordOrigins.length > 0) {
        let bestRelevance: 'high' | 'medium' | 'low' = 'low';
        let bestMatched: string[] = [];
        let bestMissing: string[] = [];
        let bestKeyword = '';

        for (const origin of keywordOrigins) {
          const res = computeKeywordRelevance(product.title, origin.strategyValue);
          if (res.relevanceLevel === 'high') {
            bestRelevance = 'high';
            bestMatched = res.matchedTerms;
            bestMissing = res.missingCoreTerms;
            bestKeyword = origin.strategyValue;
            break;
          } else if (res.relevanceLevel === 'medium') {
            bestRelevance = 'medium';
            bestMatched = res.matchedTerms;
            bestMissing = res.missingCoreTerms;
            bestKeyword = origin.strategyValue;
          } else if (bestRelevance === 'low') {
            bestMatched = res.matchedTerms;
            bestMissing = res.missingCoreTerms;
            bestKeyword = origin.strategyValue;
          }
        }
        relevanceLevel = bestRelevance;
        matchedTerms = bestMatched;
        missingCoreTerms = bestMissing;
        discoveryKeyword = bestKeyword;
      }
    }

    let relevanceAdjustment = 0;
    let readinessAdjustment = 0;

    // B. Consumer Readiness Layer
    const readiness = computeConsumerReadiness(product.title);
    let consumerReadinessLevel = readiness.level;
    const consumerReadinessReasons = readiness.reasons;
    const consumerReadinessWarnings = readiness.warnings;

    // C. Product Type Validation (independent scoring concept with strict precedence rules)
    let inferredProductType = 'unknown';
    let productTypeValidity: 'valid' | 'accessory' | 'replacement' | 'conflicting' | 'unregulated' = 'unregulated';
    const matchedPositiveTerms: string[] = [];
    const matchedConflictingTerms: string[] = [];
    const matchedAccessoryTerms: string[] = [];
    const matchedReplacementTerms: string[] = [];
    let productTypePrecedenceDiagnostics: ScoredProductDetails['productTypePrecedenceDiagnostics'] = undefined;

    const rule = discoveryKeyword ? productTypeRules[discoveryKeyword.toLowerCase()] : undefined;
    if (rule) {
      rule.positiveTypes.forEach(term => {
        if (titleLower.includes(term)) matchedPositiveTerms.push(term);
      });
      rule.conflictingTypes.forEach(term => {
        if (titleLower.includes(term)) matchedConflictingTerms.push(term);
      });
      rule.accessoryTypes.forEach(term => {
        if (titleLower.includes(term)) matchedAccessoryTerms.push(term);
      });
      rule.replacementTypes.forEach(term => {
        if (titleLower.includes(term)) matchedReplacementTerms.push(term);
      });

      const matchedCategories: string[] = [];
      if (matchedReplacementTerms.length > 0) matchedCategories.push('replacement');
      if (matchedConflictingTerms.length > 0) matchedCategories.push('conflicting');
      if (matchedAccessoryTerms.length > 0) matchedCategories.push('accessory');
      if (matchedPositiveTerms.length > 0) matchedCategories.push('valid');

      // Precedence order: replacement > conflicting > accessory > valid
      if (matchedReplacementTerms.length > 0) {
        productTypeValidity = 'replacement';
        inferredProductType = matchedReplacementTerms[0];
        warnings.push(`Replacement component or part detected: ${inferredProductType}`);
      } else if (matchedConflictingTerms.length > 0) {
        productTypeValidity = 'conflicting';
        inferredProductType = matchedConflictingTerms[0];
        warnings.push(`Conflicting product type detected for intent "${discoveryKeyword}": ${inferredProductType}`);
      } else if (matchedAccessoryTerms.length > 0) {
        productTypeValidity = 'accessory';
        inferredProductType = matchedAccessoryTerms[0];
        warnings.push(`Accessory type detected: ${inferredProductType}`);
      } else if (matchedPositiveTerms.length > 0) {
        productTypeValidity = 'valid';
        inferredProductType = matchedPositiveTerms[0];
      } else {
        productTypeValidity = 'unregulated';
      }

      productTypePrecedenceDiagnostics = {
        matchedCategories,
        winningCategory: productTypeValidity,
        precedenceRule: 'replacement > conflicting > accessory > valid > unregulated'
      };
    }

    // D. Unregulated Product Behavior Override Rules
    if (rule && productTypeValidity === 'unregulated') {
      if (consumerReadinessLevel === 'high') {
        consumerReadinessLevel = 'medium';
      }
      if (relevanceLevel === 'high') {
        relevanceLevel = 'medium';
      }
    }

    // E. Relevance Level Demotion for accessory/replacement type under car phone holder
    if (discoveryKeyword && discoveryKeyword.toLowerCase() === 'car phone holder') {
      if (productTypeValidity === 'accessory' && relevanceLevel === 'high') {
        relevanceLevel = 'medium';
      } else if (productTypeValidity === 'replacement' && relevanceLevel === 'high') {
        relevanceLevel = 'low';
      }
    }

    // F. Hierarchical Base Score computation (precedence tiers)
    let baseScore = 0;
    if (consumerReadinessLevel === 'high') {
      if (relevanceLevel === 'high') {
        baseScore = 200;
        relevanceAdjustment = 50;
        readinessAdjustment = 50;
        reasons.push('Tier 1: High core-intent relevance match and high consumer readiness');
      } else if (relevanceLevel === 'medium') {
        baseScore = 100;
        relevanceAdjustment = 10;
        readinessAdjustment = 50;
        reasons.push(`Tier 2: Medium relevance match: missing [${missingCoreTerms.join(', ')}]`);
      } else {
        baseScore = 0;
        relevanceAdjustment = 0;
        readinessAdjustment = 50;
        warnings.push(`Tier 3: Low relevance match: missing [${missingCoreTerms.join(', ')}]`);
      }
    } else if (consumerReadinessLevel === 'medium') {
      baseScore = 50;
      relevanceAdjustment = relevanceLevel === 'high' ? 50 : (relevanceLevel === 'medium' ? 10 : 0);
      readinessAdjustment = 0;
      reasons.push('Tier 2.5: Medium consumer readiness');
    } else {
      baseScore = 0;
      relevanceAdjustment = relevanceLevel === 'high' ? 50 : (relevanceLevel === 'medium' ? 10 : 0);
      readinessAdjustment = -150;
      warnings.push('Tier 3: Low consumer readiness');
    }
    score = baseScore;

    // G. Independent Modifiers & Penalties

    // Product Type Accessory demotion
    if (productTypeValidity === 'accessory') {
      score -= 50;
    }

    // Decorative and Low-Value Relevance check
    const decorativeKeywords = ['pendant', 'charm', 'organizer', 'ornament', 'jewelry', 'sticker', 'decorative accessory', 'keychain'];
    const functionalIntents = ['car phone holder', 'car vacuum cleaner', 'smart plug', 'sink organizer'];
    const matchedDecorative = decorativeKeywords.filter(term => titleLower.includes(term));
    const isFunctionalIntent = discoveryKeyword && functionalIntents.includes(discoveryKeyword.toLowerCase());

    if (matchedDecorative.length > 0 && isFunctionalIntent) {
      score -= 80;
      warnings.push(`Decorative product weakly satisfies functional intent "${discoveryKeyword}": matched "${matchedDecorative.join(', ')}"`);
    }

    // Completeness & Niche Warnings
    const miniatureTerms = ['dollhouse', 'dolls house', 'miniature', '1/12', '1:12', 'pretend play', 'simulation model', 'toy accessory'];
    const characterTerms = ['anime', 'cosplay', 'pokémon', 'pokemon', 'sanrio', 'kuromi', 'one piece', 'character merchandise'];
    const partTerms = ['replacement', 'spare', 'component', 'handle only', 'accessory only', 'knob', 'screw', 'clamp', 'cover only'];

    const matchedMiniature = miniatureTerms.filter((term) => titleLower.includes(term));
    const matchedCharacter = characterTerms.filter((term) => titleLower.includes(term));
    const matchedPart = partTerms.filter((term) => titleLower.includes(term));

    const completenessWarnings: string[] = [];
    const miniatureIndicators = [
      'dollhouse', 'dolls house', 'miniature', '1/12', '1:12', 'pretend play',
      'simulation dollhouse', 'doll accessories', 'miniature model'
    ];
    const hasMiniatureIndicator = miniatureIndicators.some(ind => normalizedTitle.includes(ind));

    if (matchedMiniature.length > 0 || hasMiniatureIndicator) {
      completenessWarnings.push(`Miniature or toy warning`);
    }
    if (matchedCharacter.length > 0) {
      completenessWarnings.push(`Character merchandise warning: matched "${matchedCharacter.join(', ')}"`);
    }
    if (matchedPart.length > 0 || productTypeValidity === 'replacement') {
      completenessWarnings.push(`Incomplete product or replacement part warning`);
    }

    if (completenessWarnings.length > 0) {
      score -= 100;
      warnings.push(...completenessWarnings);
    }

    // Commodity Demotion (-40)
    const commodityTerms = ['microfiber', 'cloth', 'glue', 'gel pen', 'clothespin', 'peg', 'sponge'];
    if (commodityTerms.some(t => titleLower.includes(t))) {
      score -= 40;
      warnings.push('Commodity product penalty applied');
    }

    // Brand Power
    const trustedBrands = ['ugreen', 'baseus', 'anker', 'xiaomi', 'lenovo', 'sandisk', 'soundpeats'];
    const foundBrand = trustedBrands.find((b) => titleLower.includes(b));
    if (foundBrand) {
      score += 3;
      reasons.push(`Recognizable trusted brand found: ${foundBrand.toUpperCase()}`);
    }

    // H. Unified Price Scoring
    if (product.price && product.price.amount !== undefined) {
      const priceAmount = product.price.amount;
      const currencyUpper = product.price.currency?.toUpperCase();
      const isSupported = currencyUpper === 'USD' || currencyUpper === 'ILS';
      if (isSupported) {
        const rules = PRICE_RULES_BY_CURRENCY[currencyUpper as SupportedCurrency];
        const sym = currencyUpper === 'ILS' ? '₪' : '$';
        
        // Sweet spot pricing (15 to 60 ILS or 4 to 15 USD)
        const sweetMin = currencyUpper === 'ILS' ? 15 : 4;
        const sweetMax = currencyUpper === 'ILS' ? 60 : 15;
        
        if (priceAmount < rules.preferredMin) {
          score -= 15;
          warnings.push(`Very low price may indicate a small item or component (${sym}${priceAmount})`);
        } else if (priceAmount >= rules.preferredMin && priceAmount <= rules.preferredMax) {
          reasons.push(`Price is within the preferred ${rules.preferredMin}–${rules.preferredMax} USD/ILS range (${sym}${priceAmount})`);
          if (priceAmount >= sweetMin && priceAmount <= sweetMax) {
            score += 15;
            reasons.push('Price is within the sweet spot range');
          } else {
            const isLowerPref = priceAmount >= rules.preferredMin && priceAmount < sweetMin;
            score += isLowerPref ? 5 : 10;
          }
        } else if (priceAmount > rules.preferredMax && priceAmount <= rules.midMax) {
          score += 5;
          reasons.push(`Price is above the preferred range but below the ${rules.max} USD/ILS maximum (${sym}${priceAmount})`);
        } else if (priceAmount > rules.midMax && priceAmount <= rules.max) {
          score -= 5;
          warnings.push(`Higher price range (above ${rules.midMax} USD/ILS): ${sym}${priceAmount}`);
        }
      }
    }

    // I. Unified Sales Volume Scoring
    if (product.salesCount !== undefined) {
      if (product.salesCount >= 1000) {
        score += 20;
        reasons.push(`Massive sales volume: ${product.salesCount} orders`);
      } else if (product.salesCount >= 100) {
        score += 10;
        reasons.push(`High sales volume: ${product.salesCount} orders`);
      } else if (product.salesCount >= 50) {
        score += 2;
        reasons.push(`Good sales volume: ${product.salesCount} orders`);
      } else if (product.salesCount > 0) {
        reasons.push(`Some sales volume: ${product.salesCount} orders`);
      } else {
        score -= 1;
        warnings.push('Zero recorded orders.');
      }
    } else {
      score -= 20;
      warnings.push('No sales history available.');
    }

    // J. Unified Rating Scoring
    let normRating = product.rating;
    if (normRating !== undefined && normRating <= 5.0) {
      normRating = normRating * 20;
    }
    if (normRating !== undefined) {
      if (normRating >= 94) {
        score += 10;
        reasons.push(`Strong rating signal: ${normRating}%`);
      } else if (normRating >= 92) {
        score += 2;
        reasons.push(`Good rating signal: ${normRating}%`);
      } else {
        score -= 2;
        warnings.push(`Weak rating signal: ${normRating}%`);
      }
    } else {
      score -= 15;
      warnings.push('No rating signal available.');
    }

    // K. Unified Discount & Commission (Secondary bonuses)
    if (product.discountPercent !== undefined && product.discountPercent >= 50 && product.discountPercent <= 80) {
      score += 5;
      reasons.push(`Strong discount commercial bonus: ${product.discountPercent}%`);
    } else if (product.discountPercent !== undefined && product.discountPercent >= 10 && product.discountPercent <= 80) {
      score += 1;
      reasons.push(`Meaningful discount: ${product.discountPercent}%`);
    }

    if (product.commissionRate !== undefined && product.commissionRate >= 8.0) {
      score += 10;
      reasons.push(`High commission commercial bonus: ${product.commissionRate}%`);
    }

    // L. Suspicious original-price gaps
    if (product.price && product.originalPrice && product.originalPrice.amount > 0) {
      const ratio = product.originalPrice.amount / product.price.amount;
      if (ratio > 8) {
        score -= 3;
        warnings.push(`Suspicious original-to-sale price gap (Ratio: ${ratio.toFixed(1)}x)`);
      }
    }

    // M. Cheap & Cold Penalty
    if (product.price && product.price.amount !== undefined) {
      const currencyUpper = product.price.currency?.toUpperCase();
      let isCheapAndCold = false;
      if (currencyUpper === 'ILS') {
        isCheapAndCold = product.price.amount < 8 && (product.salesCount ?? 0) < 100;
      } else if (currencyUpper === 'USD') {
        isCheapAndCold = product.price.amount < 2 && (product.salesCount ?? 0) < 100;
      }
      if (isCheapAndCold) {
        score -= 50;
        warnings.push(`Cheap and low-sales product penalty applied`);
      }
    }

    // O. Explicit Hard Selection Eligibility Rules
    const selectionIneligibilityReasons: string[] = [];

    if (productTypeValidity === 'conflicting') {
      selectionIneligibilityReasons.push('Conflicting product type detected');
    }
    if (productTypeValidity === 'replacement') {
      selectionIneligibilityReasons.push('Replacement component or part detected');
    }
    if (consumerReadinessLevel === 'low') {
      selectionIneligibilityReasons.push('Low consumer readiness level');
    }
    if (matchedMiniature.length > 0 || hasMiniatureIndicator) {
      selectionIneligibilityReasons.push('Miniature/dollhouse indicator warning exists');
    }
    const hasTechnicalWarning = consumerReadinessWarnings.some(w =>
      w.toLowerCase().includes('technical module') ||
      w.toLowerCase().includes('developer board') ||
      w.toLowerCase().includes('circuit breaker') ||
      w.toLowerCase().includes('mcb') ||
      w.toLowerCase().includes('din rail')
    );
    if (hasTechnicalWarning) {
      selectionIneligibilityReasons.push('Technical module or installer warning exists');
    }
    if (product.price && product.price.amount !== undefined) {
      const currencyUpper = product.price.currency?.toUpperCase();
      const isSupported = currencyUpper === 'USD' || currencyUpper === 'ILS';
      if (!isSupported) {
        selectionIneligibilityReasons.push(`Unsupported or unknown currency: "${product.price.currency || 'unknown'}"`);
      } else {
        const rules = PRICE_RULES_BY_CURRENCY[currencyUpper as SupportedCurrency];
        if (product.price.amount > rules.max) {
          const sym = currencyUpper === 'ILS' ? '₪' : '$';
          selectionIneligibilityReasons.push(`Price ${sym}${product.price.amount} exceeds the ${currencyUpper} maximum of ${sym}${rules.max}`);
        }
      }
    } else {
      selectionIneligibilityReasons.push('Invalid or missing price');
    }

    // Known salesCount < 5 hard reject
    if (product.salesCount !== undefined && product.salesCount < 5) {
      selectionIneligibilityReasons.push(`Low sales volume: ${product.salesCount} orders`);
    }

    // Known rating < 84 hard reject (equivalent to 4.2 / 5.0 stars)
    if (normRating !== undefined && normRating < 84) {
      selectionIneligibilityReasons.push(`Low product rating: ${normRating}`);
    }

    // Narrowly targeted bad-product phrases hard reject
    const blacklistedPhrases = [
      'replacement blade', 'replacement filter', 'nozzle only', 'filter only', 
      'cpu thermal grease', 'thermal grease', 'thermal paste', 'heatsink compound', 
      'valve adapter', 'step up ring', 'lens adapter', 'empty medical bag', 
      'empty first aid bag', 'scratch repair pen'
    ];
    const matchedPhrase = blacklistedPhrases.find(phrase => titleLower.includes(phrase));
    if (matchedPhrase) {
      selectionIneligibilityReasons.push(`Matches blacklisted phrase: "${matchedPhrase}"`);
    }

    const selectionEligible = selectionIneligibilityReasons.length === 0;

    // Enforce Invariant framework in dev/test
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      for (const rule of CLASSIFICATION_INVARIANTS) {
        const result = rule.check({
          title: product.title,
          normalizedTitle,
          consumerReadinessLevel,
          productTypeValidity,
          warnings
        });
        if (result.violated && result.errorMsg) {
          throw new Error(result.errorMsg);
        }
      }
    }

    return {
      product,
      score,
      reasons,
      warnings,
      relevanceLevel,
      matchedTerms,
      missingCoreTerms,
      completenessWarnings,
      consumerReadinessLevel,
      consumerReadinessReasons,
      consumerReadinessWarnings,
      discoveryKeyword,
      inferredProductType,
      productTypeValidity,
      matchedPositiveTerms,
      matchedConflictingTerms,
      matchedAccessoryTerms,
      matchedReplacementTerms,
      relevanceAdjustment,
      readinessAdjustment,
      productTypePrecedenceDiagnostics,
      selectionEligible,
      selectionIneligibilityReasons
    };
  });

  // Filter selection eligible candidates
  const eligibleCandidates = scoredProducts.filter(item => item.selectionEligible);

  // Sort overall list: eligible candidates at the top, ineligible candidates at the bottom
  scoredProducts.sort((a, b) => {
    if (a.selectionEligible && !b.selectionEligible) return -1;
    if (!a.selectionEligible && b.selectionEligible) return 1;

    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    const salesA = a.product.salesCount || 0;
    const salesB = b.product.salesCount || 0;
    if (salesB !== salesA) {
      return salesB - salesA;
    }

    const ratingA = a.product.rating || 0;
    const ratingB = b.product.rating || 0;
    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }

    return a.product.externalId.localeCompare(b.product.externalId);
  });

  if (eligibleCandidates.length === 0) {
    return {
      product: null,
      reasons: ['No eligible products found for selection'],
      warnings: ['All candidates failed selection eligibility rules'],
      rankedProducts: scoredProducts
    };
  }

  // Sort eligible candidates by score
  eligibleCandidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    const salesA = a.product.salesCount || 0;
    const salesB = b.product.salesCount || 0;
    if (salesB !== salesA) {
      return salesB - salesA;
    }

    const ratingA = a.product.rating || 0;
    const ratingB = b.product.rating || 0;
    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }

    return a.product.externalId.localeCompare(b.product.externalId);
  });

  const best = eligibleCandidates[0];

  return {
    product: best.product,
    reasons: best.reasons.length > 0 ? best.reasons : ['No specific strong signals found, default selection.'],
    warnings: best.warnings,
    rankedProducts: scoredProducts
  };
}
