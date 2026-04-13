import { useState } from 'react';

const InheritanceCalculator = () => {
  const [heirs, setHeirs] = useState({
    fatherAlive: true,
    motherAlive: true,
    hasSC: false,
    wives: 1,
    husband: false,
    deceasedIsMale: true,
    sons: 4,
    daughters: 0
  });

  // --- LOGIC UNCHANGED ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHeirs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Math.max(0, parseInt(value) || 0)
    }));
  };

  const updateCount = (name, delta) => {
    setHeirs((prev) => ({
      ...prev,
      [name]: Math.max(0, prev[name] + delta)
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

  const res = calculate();

  // --- STYLES ---
  const btnStyle = {
    padding: '10px 15px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '45px'
  };

  const checkboxStyle = {
    width: '24px',
    height: '24px',
    verticalAlign: 'middle',
    marginRight: '10px'
  };

  const cardStyle = {
    background: '#fff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  // Reusable component for +/- inputs
  const Stepper = ({ label, name, value }) => (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button style={btnStyle} onClick={() => updateCount(name, -1)}>
          -
        </button>
        <input
          type="number"
          name={name}
          value={value}
          onChange={handleChange}
          style={{
            width: '60px',
            textAlign: 'center',
            fontSize: '18px',
            padding: '8px',
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
        />
        <button style={btnStyle} onClick={() => updateCount(name, 1)}>
          +
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: '15px',
        fontFamily: 'sans-serif',
        maxWidth: '500px',
        margin: 'auto',
        backgroundColor: '#f9f9f9'
      }}
    >
      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>

      <h2 style={{ textAlign: 'center' }}>Inheritance Calculator</h2>

      <div style={cardStyle}>
        <h4>Deceased Info</h4>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
          <label style={{ fontSize: '18px' }}>
            <input
              type="radio"
              style={checkboxStyle}
              checked={heirs.deceasedIsMale}
              onChange={() =>
                setHeirs({ ...heirs, deceasedIsMale: true, husband: false })
              }
            />{' '}
            Male
          </label>
          <label style={{ fontSize: '18px' }}>
            <input
              type="radio"
              style={checkboxStyle}
              checked={!heirs.deceasedIsMale}
              onChange={() =>
                setHeirs({ ...heirs, deceasedIsMale: false, wives: 0 })
              }
            />{' '}
            Female
          </label>
        </div>

        {heirs.deceasedIsMale ? (
          <Stepper label="Number of Wives" name="wives" value={heirs.wives} />
        ) : (
          <label
            style={{ display: 'block', fontSize: '18px', padding: '10px 0' }}
          >
            <input
              type="checkbox"
              name="husband"
              style={checkboxStyle}
              checked={heirs.husband}
              onChange={handleChange}
            />{' '}
            Husband is alive
          </label>
        )}
      </div>

      <div style={cardStyle}>
        <h4>Parents & Siblings</h4>
        <label
          style={{ display: 'block', fontSize: '18px', padding: '10px 0' }}
        >
          <input
            type="checkbox"
            name="fatherAlive"
            style={checkboxStyle}
            checked={heirs.fatherAlive}
            onChange={handleChange}
          />{' '}
          Father alive
        </label>
        <label
          style={{ display: 'block', fontSize: '18px', padding: '10px 0' }}
        >
          <input
            type="checkbox"
            name="motherAlive"
            style={checkboxStyle}
            checked={heirs.motherAlive}
            onChange={handleChange}
          />{' '}
          Mother alive
        </label>
        {heirs.fatherAlive &&
          heirs.motherAlive &&
          heirs.sons === 0 &&
          heirs.daughters <= 1 && (
            <label
              style={{
                display: 'block',
                color: '#666',
                fontSize: '16px',
                padding: '10px 0',
                marginLeft: '34px'
              }}
            >
              <input
                type="checkbox"
                name="hasSC"
                style={checkboxStyle}
                checked={heirs.hasSC}
                onChange={handleChange}
              />{' '}
              Sibling condition?
            </label>
          )}
      </div>

      <div style={cardStyle}>
        <h4>Children</h4>
        <Stepper label="Sons" name="sons" value={heirs.sons} />
        <Stepper label="Daughters" name="daughters" value={heirs.daughters} />
      </div>

      <div
        style={{
          overflowX: 'auto',
          background: '#fff',
          borderRadius: '8px',
          padding: '10px'
        }}
      >
        <table
          border={1}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
            fontSize: '14px'
          }}
        >
          <thead style={{ background: '#eee' }}>
            <tr>
              <th style={{ padding: '8px' }}>Total</th>
              {heirs.fatherAlive && <th>Father</th>}
              {heirs.motherAlive && <th>Mother</th>}
              {heirs.husband && <th>Husband</th>}
              {heirs.wives > 0 && <th>Wife</th>}
              {heirs.sons > 0 && <th>Son</th>}
              {heirs.daughters > 0 && <th>Daughter</th>}
              {res.settle > 0 && <th>Mslh.</th>}
            </tr>
          </thead>
          <tbody>
            <tr style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
              <td style={{ padding: '12px 8px' }}>{res.total}</td>
              {heirs.fatherAlive && <td>{res.father}</td>}
              {heirs.motherAlive && <td>{res.mother}</td>}
              {heirs.husband && <td>{res.husband}</td>}
              {heirs.wives > 0 && <td>{res.wife}</td>}
              {heirs.sons > 0 && <td>{res.son}</td>}
              {heirs.daughters > 0 && <td>{res.daughter}</td>}
              {res.settle > 0 && (
                <td style={{ color: 'blue' }}>{res.settle}</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InheritanceCalculator;
