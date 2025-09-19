// Real KMRL Depot Operations Data (From Actual Operations Board - 16/09/2025)
export interface RealDepotData {
  date: string;
  powerStatus: {
    depot: string; // DC ENERGIZED
    tt: string; // DC ENERGIZED
  };
  milts: {
    [key: string]: number;
  };
  depotBays: {
    [key: string]: {
      openEnd: string;
      bufferedEnd: string;
    };
  };
  instructions: {
    shunting: string[];
    depotMovement: string[];
    workingInstructions: string[];
  };
}

// Real data from the operations board (16/09/2025)
export const realDepotData: RealDepotData = {
  date: '16/09/2025',
  powerStatus: {
    depot: 'DC ENERGIZED',
    tt: 'DC ENERGIZED'
  },
  milts: {
    '12': 17,
    '17': 14,
    '20': 5,
    '21': 24,
    '1': 11,
    '05': 1
  },
  depotBays: {
    'SBL1': { openEnd: '05', bufferedEnd: '', noStabling: false },
    'SBL2': { openEnd: '', bufferedEnd: '', noStabling: false },
    'SBL3': { openEnd: '', bufferedEnd: '25', noStabling: false },
    'SBL4': { openEnd: '', bufferedEnd: '', noStabling: false },
    'SBL5': { openEnd: '', bufferedEnd: '', noStabling: false },
    'SBL6': { openEnd: '', bufferedEnd: '', noStabling: true }, // X marked - no stabling
    'SBL7': { openEnd: '', bufferedEnd: '2', noStabling: true }, // X marked - no stabling  
    'SBL8': { openEnd: '', bufferedEnd: '', noStabling: false },
    'SBL9': { openEnd: '', bufferedEnd: '', noStabling: false },
    'SBL10': { openEnd: '18', bufferedEnd: '', noStabling: false },
    'SBL11': { openEnd: '', bufferedEnd: '', noStabling: false },
    'SBL12': { openEnd: '', bufferedEnd: '', noStabling: false },
    'IBL1': { openEnd: '', bufferedEnd: '', noStabling: false },
    'IBL2': { openEnd: '9', bufferedEnd: '', noStabling: false },
    'IBL3': { openEnd: '25', bufferedEnd: '', noStabling: false },
    'HICL': { openEnd: '23', bufferedEnd: '', noStabling: false },
    'HIS1': { openEnd: '13', bufferedEnd: '', noStabling: false },
    'HIS2': { openEnd: '05', bufferedEnd: '', noStabling: false },
    'HIS3': { openEnd: '04', bufferedEnd: '', noStabling: false },
    'FULL': { openEnd: '15', bufferedEnd: '', noStabling: false },
    'ETU': { openEnd: '', bufferedEnd: '', noStabling: false },
    'ERL': { openEnd: '', bufferedEnd: '', noStabling: false },
    'UBL': { openEnd: '', bufferedEnd: '', noStabling: false }
  },
  instructions: {
    shunting: [
      'Any Movement - ATO BY PASS',
      'ATC TRIP CONDITION',
      'TRAIN POWER OFF',
      'Note in Shunting Register'
    ],
    depotMovement: [
      'All Revenue Train in ATO',
      'Induction/Withdrawal',
      '1st Train in ETP',
      'Trains scheduled for washing in ATO',
      'Washing to RM'
    ],
    workingInstructions: [
      '10:05 2025',
      'Do Stabling SBL 04 & 05',
      'Till Further Instruction'
    ]
  }
};

// Real train positions from the board
export const realTrainPositions = [
  { bay: 'SBL1', openEnd: '05', bufferedEnd: '', status: 'Occupied' },
  { bay: 'SBL2', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'SBL3', openEnd: '', bufferedEnd: '25', status: 'Occupied' },
  { bay: 'SBL4', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'SBL5', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'SBL6', openEnd: '', bufferedEnd: '05', status: 'Occupied' },
  { bay: 'SBL7', openEnd: '2', bufferedEnd: '', status: 'Occupied' },
  { bay: 'SBL8', openEnd: '', bufferedEnd: '15', status: 'Occupied' },
  { bay: 'SBL9', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'SBL10', openEnd: '19', bufferedEnd: '', status: 'Occupied' },
  { bay: 'SBL11', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'SBL12', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'IBL1', openEnd: '9', bufferedEnd: '', status: 'Occupied' },
  { bay: 'IBL2', openEnd: '9', bufferedEnd: '', status: 'Occupied' },
  { bay: 'IBL3', openEnd: '25', bufferedEnd: '', status: 'Occupied' },
  { bay: 'HICL', openEnd: '23', bufferedEnd: '', status: 'Occupied' },
  { bay: 'HIS1', openEnd: '13', bufferedEnd: '', status: 'Occupied' },
  { bay: 'HIS2', openEnd: '05', bufferedEnd: '', status: 'Occupied' },
  { bay: 'HIS3', openEnd: '04', bufferedEnd: '', status: 'Occupied' },
  { bay: 'FULL', openEnd: '15', bufferedEnd: '', status: 'Occupied' },
  { bay: 'ETU', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'ERL', openEnd: '', bufferedEnd: '', status: 'Empty' },
  { bay: 'UBL', openEnd: '', bufferedEnd: '', status: 'Empty' }
];

// MILTS data from the board
export const miltsData = [
  { train: '12', value: 17 },
  { train: '17', value: 14 },
  { train: '20', value: 5 },
  { train: '21', value: 24 },
  { train: '1', value: 11 },
  { train: '05', value: 1 }
];

// Operational status from the board
export const operationalStatus = {
  date: '16/09/2025',
  powerStatus: {
    depot: 'DC ENERGIZED',
    trackingSystem: 'DC ENERGIZED'
  },
  stablingInstructions: {
    noStabling: ['SBL 04', 'SBL 05'],
    roadSideGate: '1 OPEN',
    ttAndWspSideGate: '5 OPEN',
    closeInstruction: '4 CLOSE'
  },
  drills: 'SEP 2025',
  systemStatus: {
    ets: false,
    sdd: false,
    esp: false,
    mdd: false
  },
  currentInstructions: [
    'Do Stabling SBL 04 & 05',
    'Till Further Instruction'
  ]
};