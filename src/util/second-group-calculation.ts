export interface SecondHeirsState {
  deceasedIsFemale: boolean;
  wives: number;
  hasHusband: boolean;
  fullBrothers: number;
  fullSisters: number;
  paternalBrothers: number;
  paternalSisters: number;
  maternalBrothers: number;
  maternalSisters: number;
  paternalGrandpa: boolean;
  paternalGrandma: boolean;
  maternalGrandpa: boolean;
  maternalGrandma: boolean;
}

export interface SecondHeirsShares {
  total: number;
  wife: number;
  husband: number;
  fullBrother: number;
  fullSister: number;
  paternalBrother: number;
  paternalSister: number;
  maternalBrother: number;
  maternalSister: number;
  paternalGrandpa: number;
  paternalGrandma: number;
  maternalGrandpa: number;
  maternalGrandma: number;
  settlement: number;
}

export const calculateSecondGroupInheritance = (
  heirs: Partial<SecondHeirsState>
): SecondHeirsShares => {
  const {
    deceasedIsFemale = false,
    wives = 0,
    hasHusband = false,
    fullBrothers = 0,
    fullSisters = 0,
    paternalBrothers = 0,
    paternalSisters = 0,
    maternalBrothers = 0,
    maternalSisters = 0,
    paternalGrandpa = false,
    paternalGrandma = false,
    maternalGrandpa = false,
    maternalGrandma = false
  } = heirs;

  // 1. Identify presence of sides
  const hasFull = fullBrothers > 0 || fullSisters > 0;
  const hasPaternalSib = paternalBrothers > 0 || paternalSisters > 0;
  const hasPaternalGrand = paternalGrandpa || paternalGrandma;
  const hasMaternalSib = maternalBrothers > 0 || maternalSisters > 0;
  const hasMaternalGrand = maternalGrandpa || maternalGrandma;

  const hasPaternalSide =
    hasFull || (!hasFull && hasPaternalSib) || hasPaternalGrand;
  const hasMaternalSide = hasMaternalSib || hasMaternalGrand;

  // 2. Count maternal individuals (they split their pool completely equally)
  const numMaternalSiblings = maternalBrothers + maternalSisters;
  const numMaternalGrandparents =
    (maternalGrandpa ? 1 : 0) + (maternalGrandma ? 1 : 0);
  const totalMaternalHeirs = numMaternalSiblings + numMaternalGrandparents;

  // 3. Determine active paternal parts (Male = 2, Female = 1)
  let paternalParts = 0;
  if (hasPaternalSide) {
    if (hasFull) {
      paternalParts =
        fullBrothers * 2 +
        fullSisters * 1 +
        (paternalGrandpa ? 2 : 0) +
        (paternalGrandma ? 1 : 0);
    } else {
      paternalParts =
        paternalBrothers * 2 +
        paternalSisters * 1 +
        (paternalGrandpa ? 2 : 0) +
        (paternalGrandma ? 1 : 0);
    }
  }

  let maternalFraction = 0;
  let paternalFraction = 0;
  let settlementFraction = 0;

  // Check the explicit mandatory compromise case: maternal grandparents + exactly 1 paternal half-sister
  const isSpecialSisterCase =
    hasMaternalGrand &&
    !hasMaternalSib &&
    !hasFull &&
    paternalBrothers === 0 &&
    paternalSisters === 1 &&
    !hasPaternalGrand;

  if (isSpecialSisterCase) {
    maternalFraction = 1 / 3;
    paternalFraction = 1 / 2;
    settlementFraction = 1 / 6; // Musalahah
  } else if (hasPaternalSide && hasMaternalSide) {
    // If there is exactly 1 maternal sibling and NO maternal grandparents, maternal side gets 1/6
    maternalFraction =
      numMaternalSiblings === 1 && !hasMaternalGrand ? 1 / 6 : 1 / 3;
    paternalFraction = 1 - maternalFraction;
  } else if (hasPaternalSide && !hasMaternalSide) {
    paternalFraction = 1;
  } else if (!hasPaternalSide && hasMaternalSide) {
    maternalFraction = 1;
  } else {
    settlementFraction = 1;
  }

  let spouseFraction = deceasedIsFemale ? 1 / 2 : 1 / 4;
  if (wives > 0 || hasHusband) {
    if (paternalFraction >= spouseFraction) {
      paternalFraction -= spouseFraction;
    } else {
      paternalFraction = 0;
      maternalFraction = 1 - spouseFraction;
    }
  }

  const L =
    24 * (wives || 1) * (totalMaternalHeirs || 1) * (paternalParts || 1);

  const wifeShare = wives > 0 ? Math.round((spouseFraction / wives) * L) : 0;
  const husbandShare = hasHusband ? Math.round(spouseFraction * L) : 0;
  const maternalIndividualShare =
    totalMaternalHeirs > 0
      ? Math.round((maternalFraction / totalMaternalHeirs) * L)
      : 0;
  const paternalUnitShare =
    paternalParts > 0 ? (paternalFraction / paternalParts) * L : 0;
  const settlementShare = Math.round(settlementFraction * L);

  const result = {
    total: L,
    wife: wifeShare,
    husband: husbandShare,
    fullBrother: fullBrothers > 0 ? Math.round(paternalUnitShare * 2) : 0,
    fullSister: fullSisters > 0 ? Math.round(paternalUnitShare * 1) : 0,
    paternalBrother:
      !hasFull && paternalBrothers > 0 ? Math.round(paternalUnitShare * 2) : 0,
    paternalSister:
      !hasFull && paternalSisters > 0 ? Math.round(paternalUnitShare * 1) : 0,
    maternalBrother: maternalBrothers > 0 ? maternalIndividualShare : 0,
    maternalSister: maternalSisters > 0 ? maternalIndividualShare : 0,
    paternalGrandpa: paternalGrandpa ? Math.round(paternalUnitShare * 2) : 0,
    paternalGrandma: paternalGrandma ? Math.round(paternalUnitShare * 1) : 0,
    maternalGrandpa: maternalGrandpa ? maternalIndividualShare : 0,
    maternalGrandma: maternalGrandma ? maternalIndividualShare : 0,
    settlement: settlementShare
  };

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  let allVals = [
    result.total,
    result.wife,
    result.husband,
    result.fullBrother,
    result.fullSister,
    result.paternalBrother,
    result.paternalSister,
    result.maternalBrother,
    result.maternalSister,
    result.paternalGrandpa,
    result.paternalGrandma,
    result.maternalGrandpa,
    result.maternalGrandma,
    result.settlement
  ].filter((v) => v > 0);

  const common = allVals.reduce((a, b) => gcd(a, b), allVals[0] || 1);

  return {
    total: result.total / common,
    wife: result.wife / common,
    husband: result.husband / common,
    fullBrother: result.fullBrother / common,
    fullSister: result.fullSister / common,
    paternalBrother: result.paternalBrother / common,
    paternalSister: result.paternalSister / common,
    maternalBrother: result.maternalBrother / common,
    maternalSister: result.maternalSister / common,
    paternalGrandpa: result.paternalGrandpa / common,
    paternalGrandma: result.paternalGrandma / common,
    maternalGrandpa: result.maternalGrandpa / common,
    maternalGrandma: result.maternalGrandma / common,
    settlement: result.settlement / common
  };
};
