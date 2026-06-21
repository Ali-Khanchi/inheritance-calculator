import {
  SecondHeirsShares,
  SecondHeirsState
} from './second-group-calculation';

export interface StaticSecondExample {
  title: string;
  category: string;
  subCategory: string;
  inputs: Partial<SecondHeirsState>;
  expected: Partial<SecondHeirsShares>;
}

export const secondGroupExamples: StaticSecondExample[] = [
  // --- Siblings Only Calculations ---
  {
    title: 'Rule 1: Only 1 full brother inherits entire estate',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { fullBrothers: 1 },
    expected: { total: 1, fullBrother: 1 }
  },
  {
    title: 'Rule 2: Multiple full brothers divide estate equally',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { fullBrothers: 3 },
    expected: { total: 3, fullBrother: 1 }
  },
  {
    title: 'Rule 2: Multiple full sisters divide estate equally',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { fullSisters: 3 },
    expected: { total: 3, fullSister: 1 }
  },
  {
    title:
      'Rule 3: Full brothers and sisters split with brother receiving twice the share of sister',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { fullBrothers: 1, fullSisters: 1 },
    expected: { total: 3, fullBrother: 2, fullSister: 1 }
  },
  {
    title:
      'Rule 4: Paternal half-siblings do not inherit if full brothers and sisters exist',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: {
      fullBrothers: 1,
      fullSisters: 1,
      paternalBrothers: 1,
      paternalSisters: 1
    },
    expected: {
      total: 3,
      fullBrother: 2,
      fullSister: 1,
      paternalBrother: 0,
      paternalSister: 0
    }
  },
  {
    title:
      'Rule 5: Only 1 paternal half-brother gets entire estate if no full siblings exist',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { paternalBrothers: 1 },
    expected: { total: 1, paternalBrother: 1 }
  },
  {
    title:
      'Rule 5: Only 1 paternal half-sister gets entire estate if no full siblings exist',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { paternalSisters: 1 },
    expected: { total: 1, paternalSister: 1 }
  },
  {
    title:
      'Rule 6: Paternal half-siblings split with brother twice the share of sister if no full siblings exist',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { paternalBrothers: 1, paternalSisters: 1 },
    expected: { total: 3, paternalBrother: 2, paternalSister: 1 }
  },
  {
    title:
      'Rule 7: Only 1 maternal half-sibling inherits entire estate (Brother)',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { maternalBrothers: 1 },
    expected: { total: 1, maternalBrother: 1 }
  },
  {
    title:
      'Rule 7: Only 1 maternal half-sibling inherits entire estate (Sister)',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { maternalSisters: 1 },
    expected: { total: 1, maternalSister: 1 }
  },
  {
    title:
      'Rule 8: Multiple maternal half-siblings divide estate equally regardless of gender',
    category: 'Second Group Inheritance',
    subCategory: 'Siblings Only Calculations',
    inputs: { maternalBrothers: 1, maternalSisters: 1 },
    expected: { total: 2, maternalBrother: 1, maternalSister: 1 }
  },

  // --- Mixed Siblings Complex Calculations ---
  {
    title:
      'Rule 9: Full siblings, paternal half-siblings, and 1 maternal half-sibling',
    category: 'Second Group Inheritance',
    subCategory: 'Mixed Siblings Complex Calculations',
    inputs: {
      fullBrothers: 1,
      fullSisters: 1,
      paternalBrothers: 1,
      paternalSisters: 1,
      maternalBrothers: 1
    },
    expected: {
      total: 18,
      maternalBrother: 3,
      paternalBrother: 0,
      paternalSister: 0,
      fullBrother: 10,
      fullSister: 5
    }
  },
  {
    title:
      'Rule 10: Full siblings, paternal half-siblings, and multiple maternal half-siblings',
    category: 'Second Group Inheritance',
    subCategory: 'Mixed Siblings Complex Calculations',
    inputs: {
      fullBrothers: 1,
      fullSisters: 1,
      paternalBrothers: 1,
      paternalSisters: 1,
      maternalBrothers: 1,
      maternalSisters: 1
    },
    expected: {
      total: 18,
      maternalBrother: 3,
      maternalSister: 3,
      paternalBrother: 0,
      paternalSister: 0,
      fullBrother: 8,
      fullSister: 4
    }
  },
  {
    title:
      'Rule 11: No full siblings, paternal half-siblings, and 1 maternal half-sibling',
    category: 'Second Group Inheritance',
    subCategory: 'Mixed Siblings Complex Calculations',
    inputs: { paternalBrothers: 1, paternalSisters: 1, maternalBrothers: 1 },
    expected: {
      total: 18,
      maternalBrother: 3,
      paternalBrother: 10,
      paternalSister: 5
    }
  },
  {
    title:
      'Rule 12: No full siblings, paternal half-siblings, and multiple maternal half-siblings',
    category: 'Second Group Inheritance',
    subCategory: 'Mixed Siblings Complex Calculations',
    inputs: {
      paternalBrothers: 1,
      paternalSisters: 1,
      maternalBrothers: 1,
      maternalSisters: 1
    },
    expected: {
      total: 18,
      maternalBrother: 3,
      maternalSister: 3,
      paternalBrother: 8,
      paternalSister: 4
    }
  },
  {
    title:
      'Rule 13: Deduction for spouse is taken from full/paternal siblings, not maternal siblings',
    category: 'Second Group Inheritance',
    subCategory: 'Mixed Siblings Complex Calculations',
    inputs: { wives: 1, maternalBrothers: 1, fullBrothers: 1 },
    expected: { total: 12, wife: 3, maternalBrother: 2, fullBrother: 7 }
  },

  // --- Grandparents Only Calculations ---
  {
    title: 'Rule 14: Only grandfather, inherits entire estate',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents Only Calculations',
    inputs: { paternalGrandpa: true },
    expected: { total: 1, paternalGrandpa: 1 }
  },
  {
    title: 'Rule 14: Only grandmother, inherits entire estate',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents Only Calculations',
    inputs: { maternalGrandma: true },
    expected: { total: 1, maternalGrandma: 1 }
  },
  {
    title:
      'Rule 15: Only paternal grandparents split 2:1 (grandfather twice grandmother)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents Only Calculations',
    inputs: { paternalGrandpa: true, paternalGrandma: true },
    expected: { total: 3, paternalGrandpa: 2, paternalGrandma: 1 }
  },
  {
    title: 'Rule 16: Only maternal grandparents split estate equally',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents Only Calculations',
    inputs: { maternalGrandpa: true, maternalGrandma: true },
    expected: { total: 2, maternalGrandpa: 1, maternalGrandma: 1 }
  },
  {
    title:
      'Rule 17: One paternal and one maternal grandparent split 2:1 by side (2 grandpas)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents Only Calculations',
    inputs: { paternalGrandpa: true, maternalGrandpa: true },
    expected: { total: 3, paternalGrandpa: 2, maternalGrandpa: 1 }
  },
  {
    title:
      'Rule 17: One paternal and one maternal grandparent split 2:1 by side (paternal grandma and maternal grandpa)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents Only Calculations',
    inputs: { paternalGrandma: true, maternalGrandpa: true },
    expected: { total: 3, paternalGrandma: 2, maternalGrandpa: 1 }
  },
  {
    title: 'Rule 18: Both paternal and maternal grandparents mix',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents Only Calculations',
    inputs: {
      paternalGrandpa: true,
      paternalGrandma: true,
      maternalGrandpa: true,
      maternalGrandma: true
    },
    expected: {
      total: 18,
      maternalGrandpa: 3,
      maternalGrandma: 3,
      paternalGrandpa: 8,
      paternalGrandma: 4
    }
  },

  // --- Grandparents and Spouses ---
  {
    title: 'Rule 19: Only wife and grandparents',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Spouses',
    inputs: {
      wives: 1,
      paternalGrandpa: true,
      paternalGrandma: true,
      maternalGrandpa: true
    },
    expected: {
      total: 36,
      wife: 9,
      maternalGrandpa: 12,
      paternalGrandpa: 10,
      paternalGrandma: 5
    }
  },
  {
    title: 'Rule 20: Only husband and grandparents',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Spouses',
    inputs: {
      deceasedIsFemale: true,
      hasHusband: true,
      paternalGrandpa: true,
      paternalGrandma: true,
      maternalGrandpa: true
    },
    expected: {
      total: 18,
      husband: 9,
      maternalGrandpa: 6,
      paternalGrandpa: 2,
      paternalGrandma: 1
    }
  },

  // --- Grandparents and Siblings Combinations ---
  {
    title: 'Rule 21: All maternal relatives divide estate equally',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: { maternalGrandpa: true, maternalBrothers: 1, maternalSisters: 1 },
    expected: {
      total: 3,
      maternalGrandpa: 1,
      maternalBrother: 1,
      maternalSister: 1
    }
  },
  {
    title: 'Rule 22: All paternal relatives split with male twice female',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      paternalGrandpa: true,
      paternalGrandma: true,
      paternalBrothers: 1,
      paternalSisters: 1
    },
    expected: {
      total: 6,
      paternalGrandpa: 2,
      paternalGrandma: 1,
      paternalBrother: 2,
      paternalSister: 1
    }
  },
  {
    title:
      'Rule 23: Paternal and maternal mix (1/3 maternal, 2/3 paternal male twice female)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      paternalGrandpa: true,
      paternalSisters: 1,
      maternalGrandpa: true,
      maternalBrothers: 1
    },
    expected: {
      total: 18,
      paternalGrandpa: 8,
      paternalSister: 4,
      maternalGrandpa: 3,
      maternalBrother: 3
    }
  },
  {
    title:
      'Rule 24: Paternal grandparents and 1 maternal half-sibling (1/6 maternal, remainder paternal)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      paternalGrandpa: true,
      paternalGrandma: true,
      maternalBrothers: 1
    },
    expected: {
      total: 18,
      maternalBrother: 3,
      paternalGrandpa: 10,
      paternalGrandma: 5
    }
  },
  {
    title:
      'Rule 25: Paternal grandparents and multiple maternal half-siblings (1/3 maternal, remainder paternal)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      paternalGrandpa: true,
      paternalGrandma: true,
      maternalBrothers: 1,
      maternalSisters: 1
    },
    expected: {
      total: 18,
      maternalBrother: 3,
      maternalSister: 3,
      paternalGrandpa: 8,
      paternalGrandma: 4
    }
  },
  {
    title: 'Rule 26: Maternal grandparents and multiple paternal half-siblings',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      maternalGrandpa: true,
      maternalGrandma: true,
      paternalBrothers: 2
    },
    expected: {
      total: 6,
      maternalGrandpa: 1,
      maternalGrandma: 1,
      paternalBrother: 2
    }
  },
  {
    title:
      'Rule 27: Maternal grandparents and only 1 paternal half-sister (includes musalahah)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      maternalGrandpa: true,
      maternalGrandma: true,
      paternalSisters: 1
    },
    expected: {
      total: 6,
      maternalGrandpa: 1,
      maternalGrandma: 1,
      paternalSister: 3,
      settlement: 1
    }
  },
  {
    title:
      'Rule 28: Maternal/Paternal grandparents mixed with paternal half-siblings',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      maternalGrandpa: true,
      maternalGrandma: true,
      paternalGrandpa: true,
      paternalSisters: 1
    },
    expected: {
      total: 18,
      maternalGrandpa: 3,
      maternalGrandma: 3,
      paternalGrandpa: 8,
      paternalSister: 4
    }
  },
  {
    title: 'Rule 29: Grandparents and maternal half-sibling mix',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      maternalGrandpa: true,
      maternalGrandma: true,
      maternalSisters: 1,
      paternalGrandpa: true,
      paternalGrandma: true
    },
    expected: {
      total: 9,
      maternalGrandpa: 1,
      maternalGrandma: 1,
      maternalSister: 1,
      paternalGrandpa: 4,
      paternalGrandma: 2
    }
  },
  {
    title:
      'Rule 30: Paternal and maternal siblings with paternal grandparent (only 1 maternal sibling)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: { maternalBrothers: 1, paternalBrothers: 1, paternalGrandpa: true },
    expected: {
      total: 12,
      maternalBrother: 2,
      paternalBrother: 5,
      paternalGrandpa: 5
    }
  },
  {
    title:
      'Rule 30: Paternal and maternal siblings with paternal grandparent (2 maternal siblings)',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: {
      maternalBrothers: 1,
      maternalSisters: 1,
      paternalBrothers: 1,
      paternalGrandpa: true
    },
    expected: {
      total: 6,
      maternalBrother: 1,
      maternalSister: 1,
      paternalBrother: 2,
      paternalGrandpa: 2
    }
  },
  {
    title: 'Rule 31: Paternal and maternal siblings with maternal grandparent',
    category: 'Second Group Inheritance',
    subCategory: 'Grandparents and Siblings Combinations',
    inputs: { maternalSisters: 1, maternalGrandpa: true, paternalBrothers: 1 },
    expected: {
      total: 6,
      maternalSister: 1,
      maternalGrandpa: 1,
      paternalBrother: 4
    }
  }
];
