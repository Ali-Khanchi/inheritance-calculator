export interface FirstHeirsState {
  fatherAlive: boolean;
  motherAlive: boolean;
  hasSC: boolean;
  wives: number;
  husband: boolean;
  deceasedIsMale: boolean;
  sons: number;
  daughters: number;
}

export interface FirstHeirsShares {
  total: number;
  father: number;
  mother: number;
  husband: number;
  wife: number;
  son: number;
  daughter: number;
  settlement: number;
}

export const calculateFirstGroupInheritance = (
  heirs: Partial<FirstHeirsState>
): FirstHeirsShares => {
  const {
    fatherAlive = false,
    motherAlive = false,
    hasSC = false,
    wives = 0,
    husband = false,
    deceasedIsMale = true,
    sons = 0,
    daughters = 0
  } = heirs;
  const numChildren = sons + daughters;
  const hasChildren = numChildren > 0;
  const ratioParts = sons * 2 + daughters || 1;
  let spouseNumerator = 0;
  let spouseDenominator = 1;

  if (deceasedIsMale) {
    if (wives > 0) {
      spouseNumerator = 1;
      spouseDenominator = hasChildren ? 8 : 4;
    }
  } else {
    if (husband) {
      spouseNumerator = 1;
      spouseDenominator = hasChildren ? 4 : 2;
    }
  }

  let weights = { f: 0, m: 0, s: 0, d: 0, settle: 0, total: 1, cDiv: 1 };

  if (fatherAlive && motherAlive && !hasChildren) {
    if (hasSC) {
      weights.m = 1;
      weights.f = 5;
      weights.total = 6;
    } else {
      weights.m = 1;
      weights.f = 2;
      weights.total = 3;
    }
  } else if (fatherAlive && motherAlive && sons === 0 && daughters === 1) {
    if (hasSC) {
      weights.f = 6;
      weights.m = 5;
      weights.d = 18;
      weights.settle = 1;
      weights.total = 30;
    } else {
      weights.f = 1;
      weights.m = 1;
      weights.d = 3;
      weights.total = 5;
    }
  } else if (fatherAlive && motherAlive && (sons >= 1 || daughters > 1)) {
    weights.f = 1;
    weights.m = 1;
    weights.total = 6;
    weights.s = 8;
    weights.d = 4;
    weights.cDiv = ratioParts;
  } else if (fatherAlive && motherAlive && sons === 0 && daughters > 1) {
    weights.f = 1;
    weights.m = 1;
    weights.total = 6;
    weights.d = 4;
    weights.cDiv = daughters;
  } else if (fatherAlive !== motherAlive && hasChildren) {
    const p = 1;
    const c = 5;
    weights.total = 6;
    if (sons === 0 && daughters === 1) {
      weights.total = 4;
      weights.d = 3;
    } else if (sons === 0 && daughters > 1) {
      weights.total = 5;
      weights.d = 4;
      weights.cDiv = daughters;
    } else {
      weights.s = c * 2;
      weights.d = c;
      weights.cDiv = ratioParts;
    }
    if (fatherAlive) weights.f = p;
    else weights.m = p;
  } else if (!fatherAlive && !motherAlive && hasChildren) {
    weights.total = 1;
    weights.s = 2;
    weights.d = 1;
    weights.cDiv = ratioParts;
  } else {
    // Determine remaining proportion weight after accounting for spouse fraction
    const parentOrSettleWeight = spouseDenominator - spouseNumerator;

    if (fatherAlive) weights.f = parentOrSettleWeight;
    else if (motherAlive) weights.m = parentOrSettleWeight;
    else weights.settle = parentOrSettleWeight;

    weights.total = spouseDenominator;
  }

  // 1. Calculate base LCD (L)
  const L = weights.total * spouseDenominator * (wives || 1) * weights.cDiv;

  // 2. Compute spouse total & individual share
  const spouseTotal =
    (deceasedIsMale && wives > 0) || (!deceasedIsMale && husband)
      ? (spouseNumerator * L) / spouseDenominator
      : 0;

  const husbandShare = !deceasedIsMale && husband ? spouseTotal : 0;
  const wifeShare = deceasedIsMale && wives > 0 ? spouseTotal / wives : 0;

  // 3. Compute parent & settlement shares directly from total L
  const fatherShare = Math.round((weights.f * L) / weights.total);
  const motherShare = Math.round((weights.m * L) / weights.total);
  const settleShare = Math.round((weights.settle * L) / weights.total);

  // 4. Calculate residue for children after deducting spouse and parents
  const totalAssigned = spouseTotal + fatherShare + motherShare + settleShare;
  const childrenResidue = L - totalAssigned;

  // 5. Distribute remaining residue to children based on ratioParts
  const sonShare =
    sons > 0 && ratioParts > 0
      ? Math.round((childrenResidue * 2) / ratioParts)
      : 0;
  const daughterShare =
    daughters > 0 && ratioParts > 0
      ? Math.round((childrenResidue * 1) / ratioParts)
      : 0;

  const result = {
    total: L,
    father: fatherShare,
    mother: motherShare,
    husband: husbandShare,
    wife: wifeShare,
    son: sonShare,
    daughter: daughterShare,
    settle: settleShare
  };

  // 6. Simplify by Greatest Common Divisor (GCD)
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let allVals = [
    result.total,
    result.father,
    result.mother,
    result.husband,
    result.wife,
    result.son,
    result.daughter,
    result.settle
  ].filter((v) => v > 0);

  const common = allVals.length > 0 ? allVals.reduce((a, b) => gcd(a, b)) : 1;

  return {
    total: result.total / common,
    father: result.father / common,
    mother: result.mother / common,
    husband: result.husband / common,
    wife: result.wife / common,
    son: result.son / common,
    daughter: result.daughter / common,
    settlement: result.settle / common
  };
};
