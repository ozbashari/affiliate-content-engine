export interface ProductTypeRule {
  intent: string;
  positiveTypes: string[];
  conflictingTypes: string[];
  accessoryTypes: string[];
  replacementTypes: string[];
}

export const productTypeRules: Record<string, ProductTypeRule> = {
  'car phone holder': {
    intent: 'car phone holder',
    positiveTypes: [
      'car phone holder',
      'dashboard mount',
      'windshield mount',
      'vent mount',
      'magnetic car mount',
      'phone stand for car',
      'holder stand',
      'car mount',
      'phone holder'
    ],
    conflictingTypes: [
      'phone case',
      'protective case',
      'shockproof case',
      'cover',
      'shell'
    ],
    accessoryTypes: [
      'magnetic ring',
      'metal plate',
      'mount plate'
    ],
    replacementTypes: [
      'replacement pad',
      'adhesive plate',
      'replacement suction'
    ]
  },
  'car vacuum cleaner': {
    intent: 'car vacuum cleaner',
    positiveTypes: [
      'vacuum cleaner',
      'handheld vacuum',
      'car vacuum'
    ],
    conflictingTypes: [
      'hose only',
      'adapter only'
    ],
    accessoryTypes: [
      'cleaning gel',
      'dust brush',
      'vacuum bag'
    ],
    replacementTypes: [
      'filter only',
      'nozzle only',
      'replacement bag',
      'motor only'
    ]
  },
  'smart plug': {
    intent: 'smart plug',
    positiveTypes: [
      'smart plug',
      'wifi socket',
      'smart outlet',
      'wifi plug',
      'smart socket'
    ],
    conflictingTypes: [
      'relay module',
      'pcb',
      'bare board'
    ],
    accessoryTypes: [
      'plug adapter',
      'socket cover'
    ],
    replacementTypes: [
      'plug adapter shell',
      'socket shell',
      'replacement switch'
    ]
  },
  'motion sensor light': {
    intent: 'motion sensor light',
    positiveTypes: [
      'motion sensor light',
      'sensor lamp',
      'night light',
      'sensor nightlight'
    ],
    conflictingTypes: [
      'radar module',
      'sensor board'
    ],
    accessoryTypes: [
      'mounting tape',
      'magnetic strip'
    ],
    replacementTypes: [
      'replacement sensor',
      'led strip only',
      'led board only'
    ]
  },
  'sink organizer': {
    intent: 'sink organizer',
    positiveTypes: [
      'sink organizer',
      'sink caddy',
      'sponge holder',
      'drain rack'
    ],
    conflictingTypes: [
      'toy sink',
      'diy kitchen set'
    ],
    accessoryTypes: [
      'sponge refill',
      'cleaning brush'
    ],
    replacementTypes: [
      'replacement tray',
      'replacement feet',
      'silicone plug'
    ]
  },
  'vegetable chopper': {
    intent: 'vegetable chopper',
    positiveTypes: [
      'vegetable chopper',
      'onion cutter',
      'garlic press',
      'mandoline slicer',
      'vegetable slicer'
    ],
    conflictingTypes: [
      'toy chopper',
      'toy kitchen'
    ],
    accessoryTypes: [
      'chopping board',
      'cutting board'
    ],
    replacementTypes: [
      'replacement blade',
      'replacement container',
      'spare lid'
    ]
  }
};
