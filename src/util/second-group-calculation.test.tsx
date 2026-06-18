import { describe, test, expect } from 'vitest';
import { calculateSecondGroupInheritance } from './second-group-calculation';

describe('calculateSecondGroupInheritance() Islamic Inheritance of Second Group', () => {
  describe('Siblings Only Calculations', () => {
    test('Rule 1: Only 1 full brother inherits entire estate', () => {
      const result = calculateSecondGroupInheritance({ fullBrothers: 1 });
      expect(result.total).toBe(1);
      expect(result.fullBrother).toBe(1);
    });

    test('Rule 2: Multiple full brothers divide estate equally', () => {
      const result = calculateSecondGroupInheritance({ fullBrothers: 3 });
      expect(result.total).toBe(3);
      expect(result.fullBrother).toBe(1);
    });

    test('Rule 2: Multiple full sisters divide estate equally', () => {
      const result = calculateSecondGroupInheritance({ fullSisters: 3 });
      expect(result.total).toBe(3);
      expect(result.fullSister).toBe(1);
    });

    test('Rule 3: Full brothers and sisters split with brother receiving twice the share of sister', () => {
      const result = calculateSecondGroupInheritance({
        fullBrothers: 1,
        fullSisters: 1
      });
      expect(result.total).toBe(3);
      expect(result.fullBrother).toBe(2);
      expect(result.fullSister).toBe(1);
    });

    test('Rule 4: Paternal half-siblings do not inherit if full brothers and sisters exist', () => {
      const result = calculateSecondGroupInheritance({
        fullBrothers: 1,
        fullSisters: 1,
        paternalBrothers: 1,
        paternalSisters: 1
      });
      expect(result.total).toBe(3);
      expect(result.fullBrother).toBe(2);
      expect(result.fullSister).toBe(1);
      expect(result.paternalBrother).toBe(0);
      expect(result.paternalSister).toBe(0);
    });

    test('Rule 5: Only 1 paternal half-brother gets entire estate if no full siblings exist', () => {
      const result = calculateSecondGroupInheritance({ paternalBrothers: 1 });
      expect(result.total).toBe(1);
      expect(result.paternalBrother).toBe(1);
    });

    test('Rule 5: Only 1 paternal half-sister gets entire estate if no full siblings exist', () => {
      const result = calculateSecondGroupInheritance({
        paternalSisters: 1
      });
      expect(result.total).toBe(1);
      expect(result.paternalSister).toBe(1);
    });

    test('Rule 6: Paternal half-siblings split with brother twice the share of sister if no full siblings exist', () => {
      const result = calculateSecondGroupInheritance({
        paternalBrothers: 1,
        paternalSisters: 1
      });
      expect(result.total).toBe(3);
      expect(result.paternalBrother).toBe(2);
      expect(result.paternalSister).toBe(1);
    });

    test('Rule 7: Only 1 maternal half-sibling inherits entire estate', () => {
      const result = calculateSecondGroupInheritance({ maternalBrothers: 1 });
      expect(result.total).toBe(1);
      expect(result.maternalBrother).toBe(1);
    });

    test('Rule 7: Only 1 maternal half-sibling inherits entire estate', () => {
      const result = calculateSecondGroupInheritance({
        maternalSisters: 1
      });
      expect(result.total).toBe(1);
      expect(result.maternalSister).toBe(1);
    });

    test('Rule 8: Multiple maternal half-siblings divide estate equally regardless of gender', () => {
      const result = calculateSecondGroupInheritance({
        maternalBrothers: 1,
        maternalSisters: 1
      });
      expect(result.total).toBe(2);
      expect(result.maternalBrother).toBe(1);
      expect(result.maternalSister).toBe(1);
    });
  });

  describe('Mixed Siblings Complex Calculations', () => {
    test('Rule 9: Full siblings, paternal half-siblings, and 1 maternal half-sibling', () => {
      const result = calculateSecondGroupInheritance({
        fullBrothers: 1,
        fullSisters: 1,
        paternalBrothers: 1,
        paternalSisters: 1,
        maternalBrothers: 1
      });
      expect(result.total).toBe(18);
      expect(result.maternalBrother).toBe(3);
      expect(result.paternalBrother).toBe(0);
      expect(result.paternalSister).toBe(0);
      expect(result.fullBrother).toBe(10);
      expect(result.fullSister).toBe(5);
    });

    test('Rule 10: Full siblings, paternal half-siblings, and multiple maternal half-siblings', () => {
      const result = calculateSecondGroupInheritance({
        fullBrothers: 1,
        fullSisters: 1,
        paternalBrothers: 1,
        paternalSisters: 1,
        maternalBrothers: 1,
        maternalSisters: 1
      });
      expect(result.total).toBe(18);
      expect(result.maternalBrother).toBe(3);
      expect(result.maternalSister).toBe(3);
      expect(result.paternalBrother).toBe(0);
      expect(result.paternalSister).toBe(0);
      expect(result.fullBrother).toBe(8);
      expect(result.fullSister).toBe(4);
    });

    test('Rule 11: No full siblings, paternal half-siblings, and 1 maternal half-sibling', () => {
      const result = calculateSecondGroupInheritance({
        paternalBrothers: 1,
        paternalSisters: 1,
        maternalBrothers: 1
      });
      expect(result.total).toBe(18);
      expect(result.maternalBrother).toBe(3);
      expect(result.paternalBrother).toBe(10);
      expect(result.paternalSister).toBe(5);
    });

    test('Rule 12: No full siblings, paternal half-siblings, and multiple maternal half-siblings', () => {
      const result = calculateSecondGroupInheritance({
        paternalBrothers: 1,
        paternalSisters: 1,
        maternalBrothers: 1,
        maternalSisters: 1
      });
      expect(result.total).toBe(18);
      expect(result.maternalBrother).toBe(3);
      expect(result.maternalSister).toBe(3);
      expect(result.paternalBrother).toBe(8);
      expect(result.paternalSister).toBe(4);
    });

    test('Rule 13: Deduction for spouse is taken from full/paternal siblings, not maternal siblings', () => {
      const result = calculateSecondGroupInheritance({
        wives: 1,
        maternalBrothers: 1,
        fullBrothers: 1
      });
      expect(result.total).toBe(12);
      expect(result.wife).toBe(3); // 1/4 of estate
      expect(result.maternalBrother).toBe(2); // 1/6 untouched base
      expect(result.fullBrother).toBe(7); // Receives the deducted remainder
    });
  });

  describe('Grandparents Only Calculations', () => {
    test('Rule 14: Only grandfather, inherits entire estate', () => {
      const result = calculateSecondGroupInheritance({ paternalGrandpa: true });
      expect(result.total).toBe(1);
      expect(result.paternalGrandpa).toBe(1);
    });

    test('Rule 14: Only grandmother, inherits entire estate', () => {
      const result = calculateSecondGroupInheritance({
        maternalGrandma: true
      });
      expect(result.total).toBe(1);
      expect(result.maternalGrandma).toBe(1);
    });

    test('Rule 15: Only paternal grandparents split 2:1 (grandfather twice grandmother)', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandpa: true,
        paternalGrandma: true
      });
      expect(result.total).toBe(3);
      expect(result.paternalGrandpa).toBe(2);
      expect(result.paternalGrandma).toBe(1);
    });

    test('Rule 16: Only maternal grandparents split estate equally', () => {
      const result = calculateSecondGroupInheritance({
        maternalGrandpa: true,
        maternalGrandma: true
      });
      expect(result.total).toBe(2);
      expect(result.maternalGrandpa).toBe(1);
      expect(result.maternalGrandma).toBe(1);
    });

    test('Rule 17: One paternal and one maternal grandparent split 2:1 by side (2 grandpas)', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandpa: true,
        maternalGrandpa: true
      });
      expect(result.total).toBe(3);
      expect(result.paternalGrandpa).toBe(2);
      expect(result.maternalGrandpa).toBe(1);
    });

    test('Rule 17: One paternal and one maternal grandparent split 2:1 by side (paternal grandma and maternal grandpa)', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandma: true,
        maternalGrandpa: true
      });
      expect(result.total).toBe(3);
      expect(result.paternalGrandma).toBe(2);
      expect(result.maternalGrandpa).toBe(1);
    });

    test('Rule 18: Both paternal and maternal grandparents mix', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandpa: true,
        paternalGrandma: true,
        maternalGrandpa: true,
        maternalGrandma: true
      });
      expect(result.total).toBe(18);
      expect(result.maternalGrandpa).toBe(3); // 1/3 shared equally (3/18 each)
      expect(result.maternalGrandma).toBe(3);
      expect(result.paternalGrandpa).toBe(8); // 2/3 shared 2:1 (8/18 vs 4/18)
      expect(result.paternalGrandma).toBe(4);
    });
  });

  describe('Grandparents and Spouses', () => {
    test('Rule 19: Only wife and grandparents', () => {
      const result = calculateSecondGroupInheritance({
        wives: 1,
        paternalGrandpa: true,
        paternalGrandma: true,
        maternalGrandpa: true
      });
      expect(result.total).toBe(36);
      expect(result.wife).toBe(9); // 1/4 of total
      expect(result.maternalGrandpa).toBe(12); // 1/3 of total
      expect(result.paternalGrandpa).toBe(10); // Remainder split 2:1
      expect(result.paternalGrandma).toBe(5);
    });

    test('Rule 20: Only husband and grandparents', () => {
      const result = calculateSecondGroupInheritance({
        deceasedIsFemale: true,
        hasHusband: true,
        paternalGrandpa: true,
        paternalGrandma: true,
        maternalGrandpa: true
      });
      expect(result.total).toBe(18);
      expect(result.husband).toBe(9); // 1/2 of total
      expect(result.maternalGrandpa).toBe(6); // 1/3 of total
      expect(result.paternalGrandpa).toBe(2); // Remainder split 2:1
      expect(result.paternalGrandma).toBe(1);
    });
  });

  describe('Grandparents and Siblings Combinations', () => {
    test('Rule 21: All maternal relatives divide estate equally', () => {
      const result = calculateSecondGroupInheritance({
        maternalGrandpa: true,
        maternalBrothers: 1,
        maternalSisters: 1
      });
      expect(result.total).toBe(3);
      expect(result.maternalGrandpa).toBe(1);
      expect(result.maternalBrother).toBe(1);
      expect(result.maternalSister).toBe(1);
    });

    test('Rule 22: All paternal relatives split with male twice female', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandpa: true,
        paternalGrandma: true,
        paternalBrothers: 1,
        paternalSisters: 1
      });
      expect(result.total).toBe(6);
      expect(result.paternalGrandpa).toBe(2);
      expect(result.paternalGrandma).toBe(1);
      expect(result.paternalBrother).toBe(2);
      expect(result.paternalSister).toBe(1);
    });

    test('Rule 23: Paternal and maternal mix (1/3 maternal, 2/3 paternal male twice female)', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandpa: true,
        paternalSisters: 1,
        maternalGrandpa: true,
        maternalBrothers: 1
      });
      expect(result.total).toBe(18);
      expect(result.paternalGrandpa).toBe(8); // 2/3 of total split 2:1
      expect(result.paternalSister).toBe(4);
      expect(result.maternalGrandpa).toBe(3); // 1/3 of total
      expect(result.maternalBrother).toBe(3); // 1/3 of total
    });

    test('Rule 24: Paternal grandparents and 1 maternal half-sibling (1/6 maternal, remainder paternal)', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandpa: true,
        paternalGrandma: true,
        maternalBrothers: 1
      });
      expect(result.total).toBe(18);
      expect(result.maternalBrother).toBe(3); // 1/6 of total
      expect(result.paternalGrandpa).toBe(10); // Remainder split 2:1
      expect(result.paternalGrandma).toBe(5);
    });

    test('Rule 25: Paternal grandparents and multiple maternal half-siblings (1/3 maternal, remainder paternal)', () => {
      const result = calculateSecondGroupInheritance({
        paternalGrandpa: true,
        paternalGrandma: true,
        maternalBrothers: 1,
        maternalSisters: 1
      });
      expect(result.total).toBe(18);
      expect(result.maternalBrother).toBe(3); // 1/3 shared equally (3/18 each)
      expect(result.maternalSister).toBe(3); // 1/3 shared equally (3/18 each)
      expect(result.paternalGrandpa).toBe(8); // Remainder split 2:1
      expect(result.paternalGrandma).toBe(4);
    });

    test('Rule 26: Maternal grandparents and multiple paternal half-siblings', () => {
      const result = calculateSecondGroupInheritance({
        maternalGrandpa: true,
        maternalGrandma: true,
        paternalBrothers: 2
      });
      expect(result.total).toBe(6);
      expect(result.maternalGrandpa).toBe(1); // 1/3 shared equally
      expect(result.maternalGrandma).toBe(1);
      expect(result.paternalBrother).toBe(2); // 2/3 shared equally among brothers (2/6 each)
    });

    test('Rule 27: Maternal grandparents and only 1 paternal half-sister (includes musalahah)', () => {
      const result = calculateSecondGroupInheritance({
        maternalGrandpa: true,
        maternalGrandma: true,
        paternalSisters: 1
      });
      expect(result.total).toBe(6);
      expect(result.maternalGrandpa).toBe(1); // 1/3 shared equally (1/6 each)
      expect(result.maternalGrandma).toBe(1);
      expect(result.paternalSister).toBe(3); // 1/2 to sister
      expect(result.settlement).toBe(1); // 1/6 Musalahah settlement
    });

    test('Rule 28: Maternal/Paternal grandparents mixed with paternal half-siblings', () => {
      const result = calculateSecondGroupInheritance({
        maternalGrandpa: true,
        maternalGrandma: true,
        paternalGrandpa: true,
        paternalSisters: 1
      });
      expect(result.total).toBe(18);
      expect(result.maternalGrandpa).toBe(3); // 1/3 shared equally
      expect(result.maternalGrandma).toBe(3);
      expect(result.paternalGrandpa).toBe(8); // 2/3 shared among paternal side
      expect(result.paternalSister).toBe(4);
    });

    test('Rule 29: Grandparents and maternal half-sibling mix', () => {
      const result = calculateSecondGroupInheritance({
        maternalGrandpa: true,
        maternalGrandma: true,
        maternalSisters: 1,
        paternalGrandpa: true,
        paternalGrandma: true
      });
      expect(result.total).toBe(9);
      expect(result.maternalGrandpa).toBe(1); // 1/3 shared equally across maternal side
      expect(result.maternalGrandma).toBe(1);
      expect(result.maternalSister).toBe(1);
      expect(result.paternalGrandpa).toBe(4); // 2/3 split 2:1 across paternal side
      expect(result.paternalGrandma).toBe(2);
    });

    test('Rule 30: Paternal and maternal siblings with paternal grandparent (only 1 maternal sibling)', () => {
      const result = calculateSecondGroupInheritance({
        maternalBrothers: 1,
        paternalBrothers: 1,
        paternalGrandpa: true
      });
      expect(result.total).toBe(12);
      expect(result.maternalBrother).toBe(2); // 1/6 to single maternal sibling
      expect(result.paternalBrother).toBe(5); // Remainder shared equally among paternal males
      expect(result.paternalGrandpa).toBe(5);
    });

    test('Rule 30: Paternal and maternal siblings with paternal grandparent (2 maternal siblings)', () => {
      const result = calculateSecondGroupInheritance({
        maternalBrothers: 1,
        maternalSisters: 1,
        paternalBrothers: 1,
        paternalGrandpa: true
      });
      expect(result.total).toBe(6);
      expect(result.maternalBrother).toBe(1);
      expect(result.maternalSister).toBe(1);
      expect(result.paternalBrother).toBe(2);
      expect(result.paternalGrandpa).toBe(2);
    });

    test('Rule 31: Paternal and maternal siblings with maternal grandparent', () => {
      const result = calculateSecondGroupInheritance({
        maternalSisters: 1,
        maternalGrandpa: true,
        paternalBrothers: 1
      });
      expect(result.total).toBe(6);
      expect(result.maternalSister).toBe(1); // 1/3 shared equally on maternal side
      expect(result.maternalGrandpa).toBe(1);
      expect(result.paternalBrother).toBe(4); // 2/3 to paternal side
    });
  });
});
