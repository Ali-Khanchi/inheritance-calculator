export interface HeirsState {
  fatherAlive: boolean;
  motherAlive: boolean;
  hasSC: boolean;
  wives: number;
  husband: boolean;
  deceasedIsMale: boolean;
  sons: number;
  daughters: number;
}

export interface CalculationResult {
  total: number;
  father: number;
  mother: number;
  husband: number;
  wife: number;
  son: number;
  daughter: number;
  settle: number;
}

export const calculate = (heirs: Partial<HeirsState>): CalculationResult => {
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
    if (fatherAlive) weights.f = 1;
    else if (motherAlive) weights.m = 1;
    else weights.settle = 1;
    weights.total = 1;
  }

  const L = weights.total * spouseDenominator * (wives || 1) * weights.cDiv;
  const remainderN = spouseDenominator - spouseNumerator;
  const remainderD = spouseDenominator;

  const getShare = (w: number, isChild = false) => {
    const div = isChild
      ? weights.total * remainderD * weights.cDiv
      : weights.total * remainderD;
    return Math.round((w * remainderN * L) / div);
  };

  const result = {
    total: L,
    father: getShare(weights.f),
    mother: getShare(weights.m),
    husband:
      !deceasedIsMale && husband
        ? (spouseNumerator * L) / spouseDenominator
        : 0,
    wife:
      deceasedIsMale && wives > 0
        ? (spouseNumerator * L) / (spouseDenominator * wives)
        : 0,
    son: getShare(weights.s, true),
    daughter: getShare(weights.d, true),
    settle: getShare(weights.settle)
  };

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let allVals = [result.total, result.settle];
  if (fatherAlive) allVals.push(result.father);
  if (motherAlive) allVals.push(result.mother);
  if (husband) allVals.push(result.husband);
  if (wives > 0) allVals.push(result.wife);
  if (sons > 0) allVals.push(result.son);
  if (daughters > 0) allVals.push(result.daughter);
  allVals = allVals.filter((v) => v > 0);
  const common = allVals.reduce((a, b) => gcd(a, b), allVals[0]);

  return {
    total: result.total / common,
    father: result.father / common,
    mother: result.mother / common,
    husband: result.husband / common,
    wife: result.wife / common,
    son: result.son / common,
    daughter: result.daughter / common,
    settle: result.settle / common
  };
};
