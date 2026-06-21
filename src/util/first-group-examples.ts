import {
  FirstHeirsShares,
  FirstHeirsState
} from '../util/first-group-calculation';

export interface StaticExample {
  title: string;
  category: string;
  subCategory: string;
  inputs: Partial<FirstHeirsState>;
  expected: Partial<FirstHeirsShares>;
}

export const firstGroupExamples: StaticExample[] = [
  // --- Base/Fall-through Scenarios ---
  {
    title: 'No relatives in first circle',
    category: 'First Group Inheritance',
    subCategory: 'Base/Fall-through Scenarios',
    inputs: {},
    expected: { total: 1, settlement: 1, father: 0 }
  },

  // --- Children Calculations ---
  {
    title: 'Single son gets full share',
    category: 'First Group Inheritance',
    subCategory: 'Children Calculations',
    inputs: { sons: 1 },
    expected: { total: 1, son: 1 }
  },
  {
    title: 'Single daughter gets full share',
    category: 'First Group Inheritance',
    subCategory: 'Children Calculations',
    inputs: { daughters: 1 },
    expected: { total: 1, daughter: 1 }
  },
  {
    title: 'Children get full share, son twice daughter',
    category: 'First Group Inheritance',
    subCategory: 'Children Calculations',
    inputs: { sons: 1, daughters: 1 },
    expected: { total: 3, son: 2, daughter: 1 }
  },
  {
    title: 'Children get full share, sons get same share',
    category: 'First Group Inheritance',
    subCategory: 'Children Calculations',
    inputs: { sons: 3 },
    expected: { total: 3, son: 1 }
  },
  {
    title: 'Children get full share, daughters get same share',
    category: 'First Group Inheritance',
    subCategory: 'Children Calculations',
    inputs: { daughters: 3 },
    expected: { total: 3, daughter: 1 }
  },
  {
    title: 'Many children, equal number of sons and daughters',
    category: 'First Group Inheritance',
    subCategory: 'Children Calculations',
    inputs: { sons: 3, daughters: 3 },
    expected: { total: 9, son: 2, daughter: 1 }
  },
  {
    title: 'Many children, uneven number of sons and daughters',
    category: 'First Group Inheritance',
    subCategory: 'Children Calculations',
    inputs: { sons: 3, daughters: 5 },
    expected: { total: 11, son: 2, daughter: 1 }
  },

  // --- Spouse Calculations (Deceased Male) ---
  {
    title: 'No children, wife gets one quarter',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Male)',
    inputs: { wives: 1 },
    expected: { total: 4, wife: 1, settlement: 3 }
  },
  {
    title: 'No children, wives split one quarter',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Male)',
    inputs: { wives: 3 },
    expected: { total: 12, wife: 1, settlement: 9 }
  },
  {
    title: 'One son, wife gets one eighth',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Male)',
    inputs: { wives: 1, sons: 1 },
    expected: { total: 8, wife: 1, son: 7 }
  },
  {
    title: 'One daughter, wife gets one eighth',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Male)',
    inputs: { wives: 1, daughters: 1 },
    expected: { total: 8, wife: 1, daughter: 7 }
  },
  {
    title: 'Many children, wife gets one eighth',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Male)',
    inputs: { wives: 1, daughters: 3, sons: 5 },
    expected: { total: 104, wife: 13, son: 14, daughter: 7 }
  },

  // --- Spouse Calculations (Deceased Female) ---
  {
    title: 'No children, husband gets one half',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Female)',
    inputs: { deceasedIsMale: false, husband: true },
    expected: { total: 2, husband: 1, settlement: 1 }
  },
  {
    title: 'One daughter, husband gets one quarter',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Female)',
    inputs: { deceasedIsMale: false, husband: true, daughters: 1 },
    expected: { total: 4, husband: 1, daughter: 3 }
  },
  {
    title: 'One son, husband gets one quarter',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Female)',
    inputs: { deceasedIsMale: false, husband: true, sons: 1 },
    expected: { total: 4, husband: 1, son: 3 }
  },
  {
    title: 'Many children, husband gets one quarter',
    category: 'First Group Inheritance',
    subCategory: 'Spouse Calculations (Deceased Female)',
    inputs: { deceasedIsMale: false, husband: true, sons: 3, daughters: 5 },
    expected: { total: 44, husband: 11, son: 6, daughter: 3 }
  },

  // --- Both Parents Calculations ---
  {
    title: 'No children, no siblings, both parents alive',
    category: 'First Group Inheritance',
    subCategory: 'Both Parents Calculations',
    inputs: { fatherAlive: true, motherAlive: true },
    expected: { total: 3, father: 2, mother: 1 }
  },
  {
    title: 'No children, has siblings, both parents alive',
    category: 'First Group Inheritance',
    subCategory: 'Both Parents Calculations',
    inputs: { fatherAlive: true, motherAlive: true, hasSC: true },
    expected: { total: 6, father: 5, mother: 1 }
  },
  {
    title: 'One daughter, no siblings, both parents alive',
    category: 'First Group Inheritance',
    subCategory: 'Both Parents Calculations',
    inputs: { fatherAlive: true, motherAlive: true, daughters: 1 },
    expected: { total: 5, father: 1, mother: 1, daughter: 3 }
  },
  {
    title: 'One daughter, has siblings, both parents alive',
    category: 'First Group Inheritance',
    subCategory: 'Both Parents Calculations',
    inputs: { fatherAlive: true, motherAlive: true, daughters: 1, hasSC: true },
    expected: { total: 30, father: 6, mother: 5, daughter: 18, settlement: 1 }
  },
  {
    title: 'One son, both parents alive',
    category: 'First Group Inheritance',
    subCategory: 'Both Parents Calculations',
    inputs: { fatherAlive: true, motherAlive: true, sons: 1 },
    expected: { total: 6, father: 1, mother: 1, son: 4 }
  },
  {
    title: 'Two daughters, both parents alive',
    category: 'First Group Inheritance',
    subCategory: 'Both Parents Calculations',
    inputs: { fatherAlive: true, motherAlive: true, daughters: 2 },
    expected: { total: 6, father: 1, mother: 1, daughter: 2 }
  },

  // --- Single Parent Calculations ---
  {
    title: 'One daughter, single parent',
    category: 'First Group Inheritance',
    subCategory: 'Single Parent Calculations',
    inputs: { motherAlive: true, daughters: 1 },
    expected: { total: 4, mother: 1, daughter: 3 }
  },
  {
    title: 'Two daughters, single parent',
    category: 'First Group Inheritance',
    subCategory: 'Single Parent Calculations',
    inputs: { motherAlive: true, daughters: 2 },
    expected: { total: 5, mother: 1, daughter: 2 }
  },
  {
    title: 'One son, single parent',
    category: 'First Group Inheritance',
    subCategory: 'Single Parent Calculations',
    inputs: { motherAlive: true, sons: 1 },
    expected: { total: 6, mother: 1, son: 5 }
  },
  {
    title: 'Two sons, single parent',
    category: 'First Group Inheritance',
    subCategory: 'Single Parent Calculations',
    inputs: { motherAlive: true, sons: 2 },
    expected: { total: 12, mother: 2, son: 5 }
  },
  {
    title: 'Multiple children, single parent',
    category: 'First Group Inheritance',
    subCategory: 'Single Parent Calculations',
    inputs: { motherAlive: true, sons: 2, daughters: 2 },
    expected: { total: 36, mother: 6, son: 10, daughter: 5 }
  },

  // --- Extra Complex Scenarios ---
  {
    title: 'One wife, one daughter, has siblings, both parents',
    category: 'First Group Inheritance',
    subCategory: 'Extra Complex Scenarios',
    inputs: {
      wives: 1,
      hasSC: true,
      fatherAlive: true,
      motherAlive: true,
      daughters: 1
    },
    expected: {
      total: 240,
      father: 42,
      mother: 35,
      wife: 30,
      daughter: 126,
      settlement: 7
    }
  }
];
