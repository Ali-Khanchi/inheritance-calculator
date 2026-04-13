import { useState } from 'react';

const InheritanceCalculator = () => {
  const [heirs, setHeirs] = useState({
    fatherAlive: true,
    motherAlive: true,
    hasSC: false, // Siblings Condition (Ruling 2749/2750)
    wives: 1,
    husband: false,
    deceasedIsMale: true,
    sons: 4,
    daughters: 0
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHeirs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculate = () => {
    const {
      fatherAlive,
      motherAlive,
      hasSC,
      wives,
      husband,
      deceasedIsMale,
      sons,
      daughters
    } = heirs;
    const numChildren = sons + daughters;
    const hasChildren = numChildren > 0;
    const ratioParts = sons * 2 + daughters || 1; // Integer divisor for children split

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

    // Weights are now strictly integers
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
      weights.cDiv = ratioParts; // Move ratioParts to divisor
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

    // Ensure L is a multiple of all potential denominators
    const L = weights.total * spouseDenominator * (wives || 1) * weights.cDiv;
    const remainderN = spouseDenominator - spouseNumerator;
    const remainderD = spouseDenominator;

    // Use Math.round to strip floating point noise
    const getShare = (w, isChild = false) => {
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

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

    let allVals = [result.total, result.settle];
    if (fatherAlive) {
      allVals.push(result.father);
    }
    if (motherAlive) {
      allVals.push(result.mother);
    }
    if (husband) {
      allVals.push(result.husband);
    }
    if (wives > 0) {
      allVals.push(result.wife);
    }
    if (sons > 0) {
      allVals.push(result.son);
    }
    if (daughters > 0) {
      allVals.push(result.daughter);
    }
    allVals = allVals.filter((v) => v > 0);

    const common = allVals.reduce((a, b) => gcd(a, b), allVals[0]);
    console.log(result);
    console.log(allVals, common);

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

  const res = calculate();

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif',
        maxWidth: '800px',
        margin: 'auto'
      }}
    >
      <h2>Inheritance Calculator</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          background: '#f4f4f4',
          padding: '20px',
          borderRadius: '8px'
        }}
      >
        <div>
          <h4>Deceased Info</h4>
          <label>
            <input
              type="radio"
              checked={heirs.deceasedIsMale}
              onChange={() =>
                setHeirs({ ...heirs, deceasedIsMale: true, husband: false })
              }
            />{' '}
            Male
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="radio"
              checked={!heirs.deceasedIsMale}
              onChange={() =>
                setHeirs({ ...heirs, deceasedIsMale: false, wives: 0 })
              }
            />{' '}
            Female
          </label>
          <br />
          <br />
          {heirs.deceasedIsMale ? (
            <label>
              Number of Wives:{' '}
              <input
                type="number"
                name="wives"
                value={heirs.wives}
                onChange={handleChange}
                style={{ width: '40px' }}
              />
            </label>
          ) : (
            <label>
              <input
                type="checkbox"
                name="husband"
                checked={heirs.husband}
                onChange={handleChange}
              />{' '}
              Husband is alive
            </label>
          )}
        </div>

        <div>
          <h4>Parents & Siblings</h4>
          <label>
            <input
              type="checkbox"
              name="fatherAlive"
              checked={heirs.fatherAlive}
              onChange={handleChange}
            />{' '}
            Father alive
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="motherAlive"
              checked={heirs.motherAlive}
              onChange={handleChange}
            />{' '}
            Mother alive
          </label>
          <br />
          {heirs.fatherAlive &&
            heirs.motherAlive &&
            heirs.sons === 0 &&
            heirs.daughters <= 1 && (
              <label style={{ color: '#666', fontSize: '0.9em' }}>
                <input
                  type="checkbox"
                  name="hasSC"
                  checked={heirs.hasSC}
                  onChange={handleChange}
                />
                Sibling condition?
              </label>
            )}
        </div>

        <div>
          <h4>Children</h4>
          <label>
            Sons:{' '}
            <input
              type="number"
              name="sons"
              value={heirs.sons}
              onChange={handleChange}
              style={{ width: '40px' }}
            />
          </label>
          <br />
          <label>
            Daughters:{' '}
            <input
              type="number"
              name="daughters"
              value={heirs.daughters}
              onChange={handleChange}
              style={{ width: '40px' }}
            />
          </label>
        </div>
      </div>

      <table
        border="1"
        style={{
          width: '100%',
          marginTop: '20px',
          borderCollapse: 'collapse',
          textAlign: 'center'
        }}
      >
        <thead style={{ background: '#eee' }}>
          <tr>
            <th>Total Units</th>
            {heirs.fatherAlive && <th>Father</th>}
            {heirs.motherAlive && <th>Mother</th>}
            {heirs.husband && <th>Husband</th>}
            {heirs.wives > 0 && <th>Each Wife</th>}
            {heirs.sons > 0 && <th>Each Son</th>}
            {heirs.daughters > 0 && <th>Each Daughter</th>}
            {res.settle > 0 && <th>Musalahah</th>}
          </tr>
        </thead>
        <tbody>
          <tr style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            <td>{res.total}</td>
            {heirs.fatherAlive && <td>{res.father}</td>}
            {heirs.motherAlive && <td>{res.mother}</td>}
            {heirs.husband && <td>{res.husband}</td>}
            {heirs.wives > 0 && <td>{res.wife}</td>}
            {heirs.sons > 0 && <td>{res.son}</td>}
            {heirs.daughters > 0 && <td>{res.daughter}</td>}
            {res.settle > 0 && <td style={{ color: 'blue' }}>{res.settle}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InheritanceCalculator;
