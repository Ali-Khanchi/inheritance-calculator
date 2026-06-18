import { describe, test, expect } from 'vitest';
import { calculateFirstGroupInheritance } from './first-group-calculation';

describe('calculateFirstGroupInheritance() Islamic Inheritance of First Group', () => {
  describe('Base/Fall-through Scenarios', () => {
    test('No relatives in first circle', () => {
      const result = calculateFirstGroupInheritance({});

      expect(result.settlement).toBe(1);
      expect(result.total).toBe(1);
      expect(result.father).toBe(0);
    });
  });

  describe('Children Calculations', () => {
    test('Single son gets full share', () => {
      const result = calculateFirstGroupInheritance({ sons: 1 });

      expect(result.total).toBe(1);
      expect(result.son).toBe(1);
    });

    test('Single daughter gets full share', () => {
      const result = calculateFirstGroupInheritance({ daughters: 1 });

      expect(result.total).toBe(1);
      expect(result.daughter).toBe(1);
    });

    test('Children get full share, son twice daughter', () => {
      const result = calculateFirstGroupInheritance({ sons: 1, daughters: 1 });

      expect(result.total).toBe(3);
      expect(result.son).toBe(2);
      expect(result.daughter).toBe(1);
    });

    test('Children get full share, sons get same share', () => {
      const result = calculateFirstGroupInheritance({ sons: 3 });

      expect(result.total).toBe(3);
      expect(result.son).toBe(1);
    });

    test('Children get full share, daughters get same share', () => {
      const result = calculateFirstGroupInheritance({ daughters: 3 });

      expect(result.total).toBe(3);
      expect(result.daughter).toBe(1);
    });

    test('Many children, equal number of sons and daughters', () => {
      const result = calculateFirstGroupInheritance({ sons: 3, daughters: 3 });

      expect(result.total).toBe(9);
      expect(result.son).toBe(2);
      expect(result.daughter).toBe(1);
    });

    test('Many children, uneven number of sons and daughters', () => {
      const result = calculateFirstGroupInheritance({ sons: 3, daughters: 5 });

      expect(result.total).toBe(11);
      expect(result.son).toBe(2);
      expect(result.daughter).toBe(1);
    });
  });

  describe('Spouse Calculations (Deceased Male)', () => {
    test('No children, wife gets one quarter', () => {
      const result = calculateFirstGroupInheritance({ wives: 1 });

      expect(result.wife).toBe(1);
      expect(result.settlement).toBe(3);
      expect(result.total).toBe(4);
    });

    test('No children, wives split one quarter', () => {
      const result = calculateFirstGroupInheritance({ wives: 3 });

      expect(result.total).toBe(12);
      expect(result.wife).toBe(1);
      expect(result.settlement).toBe(9);
    });

    test('One son, wife gets one eighth', () => {
      const result = calculateFirstGroupInheritance({ wives: 1, sons: 1 });

      expect(result.total).toBe(8);
      expect(result.wife).toBe(1);
      expect(result.son).toBe(7);
    });

    test('One daughter, wife gets one eighth', () => {
      const result = calculateFirstGroupInheritance({ wives: 1, daughters: 1 });

      expect(result.total).toBe(8);
      expect(result.wife).toBe(1);
      expect(result.daughter).toBe(7);
    });

    test('Many children, wife gets one eighth', () => {
      const result = calculateFirstGroupInheritance({
        wives: 1,
        daughters: 3,
        sons: 5
      });

      expect(result.total).toBe(104);
      expect(result.wife).toBe(13);
      expect(result.son).toBe(14);
      expect(result.daughter).toBe(7);
    });
  });

  describe('Spouse Calculations (Deceased Female)', () => {
    test('No children, husband gets one half', () => {
      const result = calculateFirstGroupInheritance({
        deceasedIsMale: false,
        husband: true
      });

      expect(result.husband).toBe(1);
      expect(result.settlement).toBe(1);
      expect(result.total).toBe(2);
    });

    test('One daughter, husband gets one quarter', () => {
      const result = calculateFirstGroupInheritance({
        deceasedIsMale: false,
        husband: true,
        daughters: 1
      });

      expect(result.husband).toBe(1);
      expect(result.daughter).toBe(3);
      expect(result.total).toBe(4);
    });

    test('One son, husband gets one quarter', () => {
      const result = calculateFirstGroupInheritance({
        deceasedIsMale: false,
        husband: true,
        sons: 1
      });

      expect(result.husband).toBe(1);
      expect(result.son).toBe(3);
      expect(result.total).toBe(4);
    });

    test('Many children, husband gets one quarter', () => {
      const result = calculateFirstGroupInheritance({
        deceasedIsMale: false,
        husband: true,
        sons: 3,
        daughters: 5
      });

      expect(result.husband).toBe(11);
      expect(result.son).toBe(6);
      expect(result.daughter).toBe(3);
      expect(result.total).toBe(44);
    });
  });

  describe('Both Parents Calculations', () => {
    test('No children, no siblings, both parents alive', () => {
      const result = calculateFirstGroupInheritance({
        fatherAlive: true,
        motherAlive: true
      });

      expect(result.total).toBe(3);
      expect(result.father).toBe(2);
      expect(result.mother).toBe(1);
    });

    test('No children, has siblings, both parents alive', () => {
      const result = calculateFirstGroupInheritance({
        fatherAlive: true,
        motherAlive: true,
        hasSC: true
      });

      expect(result.total).toBe(6);
      expect(result.father).toBe(5);
      expect(result.mother).toBe(1);
    });

    test('One daughter, no siblings, both parents alive', () => {
      const result = calculateFirstGroupInheritance({
        fatherAlive: true,
        motherAlive: true,
        daughters: 1
      });

      expect(result.father).toBe(1);
      expect(result.mother).toBe(1);
      expect(result.daughter).toBe(3);
      expect(result.total).toBe(5);
    });

    test('One daughter, has siblings, both parents alive', () => {
      const result = calculateFirstGroupInheritance({
        fatherAlive: true,
        motherAlive: true,
        daughters: 1,
        hasSC: true
      });

      expect(result.father).toBe(6);
      expect(result.mother).toBe(5);
      expect(result.daughter).toBe(18);
      expect(result.settlement).toBe(1);
      expect(result.total).toBe(30);
    });

    test('One son, both parents alive', () => {
      const result = calculateFirstGroupInheritance({
        fatherAlive: true,
        motherAlive: true,
        sons: 1
      });

      expect(result.father).toBe(1);
      expect(result.mother).toBe(1);
      expect(result.son).toBe(4);
      expect(result.total).toBe(6);
    });

    test('Two daughters, both parents alive', () => {
      const result = calculateFirstGroupInheritance({
        fatherAlive: true,
        motherAlive: true,
        daughters: 2
      });

      expect(result.father).toBe(1);
      expect(result.mother).toBe(1);
      expect(result.daughter).toBe(2);
      expect(result.total).toBe(6);
    });
  });

  describe('Single Parent Calculations', () => {
    test('One daughter, single parent', () => {
      const result = calculateFirstGroupInheritance({
        motherAlive: true,
        daughters: 1
      });

      expect(result.mother).toBe(1);
      expect(result.daughter).toBe(3);
      expect(result.total).toBe(4);
    });

    test('Two daughters, single parent', () => {
      const result = calculateFirstGroupInheritance({
        motherAlive: true,
        daughters: 2
      });

      expect(result.mother).toBe(1);
      expect(result.daughter).toBe(2);
      expect(result.total).toBe(5);
    });

    test('One son, single parent', () => {
      const result = calculateFirstGroupInheritance({
        motherAlive: true,
        sons: 1
      });

      expect(result.mother).toBe(1);
      expect(result.son).toBe(5);
      expect(result.total).toBe(6);
    });

    test('Two sons, single parent', () => {
      const result = calculateFirstGroupInheritance({
        motherAlive: true,
        sons: 2
      });

      expect(result.mother).toBe(2);
      expect(result.son).toBe(5);
      expect(result.total).toBe(12);
    });

    test('Multiple children, single parent', () => {
      const result = calculateFirstGroupInheritance({
        motherAlive: true,
        sons: 2,
        daughters: 2
      });

      expect(result.mother).toBe(6);
      expect(result.son).toBe(10);
      expect(result.daughter).toBe(5);
      expect(result.total).toBe(36);
    });
  });

  describe('Extra Complex Scenarios', () => {
    test('One wife, one daughter, has siblings, both parents', () => {
      const result = calculateFirstGroupInheritance({
        wives: 1,
        hasSC: true,
        fatherAlive: true,
        motherAlive: true,
        daughters: 1
      });

      expect(result.father).toBe(42);
      expect(result.mother).toBe(35);
      expect(result.wife).toBe(30);
      expect(result.daughter).toBe(126);
      expect(result.settlement).toBe(7);
      expect(result.total).toBe(240);
    });
  });
});
