import React, { useState, ChangeEvent } from 'react';

// --- TYPES (UNTOUCHED) ---
interface HeirsState {
  fatherAlive: boolean;
  motherAlive: boolean;
  hasSC: boolean;
  wives: number;
  husband: boolean;
  deceasedIsMale: boolean;
  sons: number;
  daughters: number;
}

interface CalculationResult {
  total: number;
  father: number;
  mother: number;
  husband: number;
  wife: number;
  son: number;
  daughter: number;
  settle: number;
}

const InheritanceCalculator: React.FC = () => {
  const [heirs, setHeirs] = useState<HeirsState>({
    fatherAlive: true,
    motherAlive: true,
    hasSC: false,
    wives: 1,
    husband: false,
    deceasedIsMale: true,
    sons: 4,
    daughters: 0
  });

  // --- LOGIC (UNTOUCHED) ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setHeirs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Math.max(0, parseInt(value) || 0)
    }));
  };

  const updateCount = (name: keyof HeirsState, delta: number) => {
    setHeirs((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] as number) + delta)
    }));
  };

  const calculate = (): CalculationResult => {
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

  const res = calculate();

  // --- STYLES ---
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh',
    margin: '0 auto',
    padding: '16px 12px',
    boxSizing: 'border-box',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    alignItems: 'center'
  };

  const innerWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '500px' // Centers and prevents stretching on desktop
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  };

  const btnStyle: React.CSSProperties = {
    padding: '8px',
    fontSize: '20px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none'
  };

  const Stepper = ({
    label,
    name,
    value
  }: {
    label: string;
    name: keyof HeirsState;
    value: number;
  }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '12px 0'
      }}
    >
      <span style={{ fontWeight: 600, fontSize: '16px', color: '#334155' }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          style={btnStyle}
          onClick={() => updateCount(name, -1)}
          aria-label="decrease"
        >
          -
        </button>
        <span
          style={{
            minWidth: '30px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          {value}
        </span>
        <button
          style={btnStyle}
          onClick={() => updateCount(name, 1)}
          aria-label="increase"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={innerWrapperStyle}>
        <header style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3
            style={{
              margin: '0',
              fontSize: '22px',
              fontWeight: '800',
              color: '#0f172a'
            }}
          >
            Inheritance Calculator
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
            Islamic Estate Distribution
          </p>
        </header>

        {/* Gender/Spouse Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={() =>
                setHeirs({ ...heirs, deceasedIsMale: true, husband: false })
              }
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: heirs.deceasedIsMale
                  ? '2px solid #2563eb'
                  : '1px solid #e2e8f0',
                backgroundColor: heirs.deceasedIsMale ? '#eff6ff' : '#fff',
                color: heirs.deceasedIsMale ? '#1d4ed8' : '#64748b',
                fontWeight: '600',
                fontSize: '15px'
              }}
            >
              Male Deceased
            </button>
            <button
              onClick={() =>
                setHeirs({ ...heirs, deceasedIsMale: false, wives: 0 })
              }
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: !heirs.deceasedIsMale
                  ? '2px solid #2563eb'
                  : '1px solid #e2e8f0',
                backgroundColor: !heirs.deceasedIsMale ? '#eff6ff' : '#fff',
                color: !heirs.deceasedIsMale ? '#1d4ed8' : '#64748b',
                fontWeight: '600',
                fontSize: '15px'
              }}
            >
              Female Deceased
            </button>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
            {heirs.deceasedIsMale ? (
              <Stepper label="Wives" name="wives" value={heirs.wives} />
            ) : (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  cursor: 'pointer'
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#334155'
                  }}
                >
                  Husband
                </span>
                <input
                  type="checkbox"
                  name="husband"
                  style={{
                    width: '28px',
                    height: '28px',
                    accentColor: '#2563eb'
                  }}
                  checked={heirs.husband}
                  onChange={handleChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Parents Card */}
        <div style={cardStyle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '15px'
            }}
          >
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}
              >
                Father
              </span>
              <input
                type="checkbox"
                name="fatherAlive"
                style={{
                  width: '32px',
                  height: '32px',
                  accentColor: '#2563eb'
                }}
                checked={heirs.fatherAlive}
                onChange={handleChange}
              />
            </label>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569'
                }}
              >
                Mother
              </span>
              <input
                type="checkbox"
                name="motherAlive"
                style={{
                  width: '32px',
                  height: '32px',
                  accentColor: '#2563eb'
                }}
                checked={heirs.motherAlive}
                onChange={handleChange}
              />
            </label>
            {heirs.fatherAlive &&
              heirs.motherAlive &&
              heirs.sons === 0 &&
              heirs.daughters <= 1 && (
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#dc2626',
                      textAlign: 'center'
                    }}
                  >
                    Siblings
                  </span>
                  <input
                    type="checkbox"
                    name="hasSC"
                    style={{
                      width: '32px',
                      height: '32px',
                      accentColor: '#dc2626'
                    }}
                    checked={heirs.hasSC}
                    onChange={handleChange}
                  />
                </label>
              )}
          </div>
        </div>

        {/* Children Card */}
        <div style={cardStyle}>
          <Stepper label="Sons" name="sons" value={heirs.sons} />
          <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
          <Stepper label="Daughters" name="daughters" value={heirs.daughters} />
        </div>

        {/* Results Card */}
        <div style={{ ...cardStyle, padding: '0', overflow: 'hidden' }}>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#1e293b',
              color: '#fff'
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Distribution Shares
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'center'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#f1f5f9',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <th
                    style={{
                      padding: '12px 8px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}
                  >
                    HEIR
                  </th>
                  <th
                    style={{
                      padding: '12px 8px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}
                  >
                    SHARE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td
                    style={{
                      padding: '12px 8px',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}
                  >
                    Total Base
                  </td>
                  <td
                    style={{
                      padding: '12px 8px',
                      fontWeight: '800',
                      fontSize: '18px',
                      color: '#2563eb'
                    }}
                  >
                    {res.total}
                  </td>
                </tr>
                {heirs.fatherAlive && (
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>
                      Father
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: '700' }}>
                      {res.father}
                    </td>
                  </tr>
                )}
                {heirs.motherAlive && (
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>
                      Mother
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: '700' }}>
                      {res.mother}
                    </td>
                  </tr>
                )}
                {heirs.husband && (
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>
                      Husband
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: '700' }}>
                      {res.husband}
                    </td>
                  </tr>
                )}
                {heirs.wives > 0 && (
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>
                      Wife (each)
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: '700' }}>
                      {res.wife}
                    </td>
                  </tr>
                )}
                {heirs.sons > 0 && (
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>
                      Son (each)
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: '700' }}>
                      {res.son}
                    </td>
                  </tr>
                )}
                {heirs.daughters > 0 && (
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>
                      Daughter (each)
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: '700' }}>
                      {res.daughter}
                    </td>
                  </tr>
                )}
                {res.settle > 0 && (
                  <tr>
                    <td
                      style={{
                        padding: '12px 8px',
                        color: '#1d4ed8',
                        fontStyle: 'italic'
                      }}
                    >
                      Musalahah
                    </td>
                    <td
                      style={{
                        padding: '12px 8px',
                        fontWeight: '700',
                        color: '#1d4ed8'
                      }}
                    >
                      {res.settle}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InheritanceCalculator;
