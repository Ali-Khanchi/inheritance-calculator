import React, { useState, ChangeEvent } from 'react';

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
    sons: 2,
    daughters: 2
  });
  const [showSummary, setShowSummary] = useState<boolean>(false);

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

  const showSiblings =
    heirs.fatherAlive &&
    heirs.motherAlive &&
    heirs.sons === 0 &&
    heirs.daughters <= 1;

  // --- STYLES ---

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh',
    margin: '0 auto',
    padding: '10px 12px',
    boxSizing: 'border-box',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    alignItems: 'center'
  };

  const innerWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '420px'
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    padding: '10px 14px',
    borderRadius: '12px',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    border: '0.5px solid #e2e8f0'
  };

  const btnStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    fontSize: '18px',
    backgroundColor: '#f1f5f9',
    border: '0.5px solid #cbd5e1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    lineHeight: 1
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0'
  };

  const rowDividerStyle: React.CSSProperties = {
    borderTop: '0.5px solid #f1f5f9'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#334155',
    fontWeight: 500
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
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          style={btnStyle}
          onClick={() => updateCount(name, -1)}
          aria-label="decrease"
        >
          −
        </button>
        <span
          style={{
            minWidth: '24px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500,
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

  const DistributionRow = ({
    label,
    share
  }: {
    label: string;
    share: number;
  }) => (
    <tr style={{ borderTop: '0.5px solid #f1f5f9' }}>
      <td style={{ padding: '6px 8px', color: '#475569' }}>{label}</td>
      <td
        style={{
          padding: '6px 8px',
          textAlign: 'right',
          fontWeight: 500
        }}
      >
        {share}
      </td>
    </tr>
  );

  const wifeDistributionRows = showSummary ? (
    <DistributionRow label={`Wife (each)`} share={res.wife} />
  ) : (
    Array.from({ length: heirs.wives }, (_, index) => (
      <DistributionRow label={`Wife ${index + 1}`} share={res.wife} />
    ))
  );

  const sonDistributionRows = showSummary ? (
    <DistributionRow label={`Son (each)`} share={res.son} />
  ) : (
    Array.from({ length: heirs.sons }, (_, index) => (
      <DistributionRow label={`Son ${index + 1}`} share={res.son} />
    ))
  );

  const daughterDistributionRows = showSummary ? (
    <DistributionRow label={`Daughter (each)`} share={res.daughter} />
  ) : (
    Array.from({ length: heirs.daughters }, (_, index) => (
      <DistributionRow label={`Daughter ${index + 1}`} share={res.daughter} />
    ))
  );

  return (
    <div style={containerStyle}>
      <div style={innerWrapperStyle}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h3
            style={{
              margin: '0',
              fontSize: '20px',
              fontWeight: 700,
              color: '#0f172a'
            }}
          >
            Inheritance calculator
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '18px', color: '#64748b' }}>
            Islamic estate distribution
          </p>
        </header>

        {/* Gender / Spouse Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <button
              onClick={() =>
                setHeirs({ ...heirs, deceasedIsMale: true, husband: false })
              }
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                border: heirs.deceasedIsMale
                  ? '1.5px solid #2563eb'
                  : '0.5px solid #e2e8f0',
                backgroundColor: heirs.deceasedIsMale ? '#eff6ff' : '#fff',
                color: heirs.deceasedIsMale ? '#1d4ed8' : '#64748b',
                fontWeight: 500,
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Male deceased
            </button>
            <button
              onClick={() =>
                setHeirs({ ...heirs, deceasedIsMale: false, wives: 0 })
              }
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                border: !heirs.deceasedIsMale
                  ? '1.5px solid #2563eb'
                  : '0.5px solid #e2e8f0',
                backgroundColor: !heirs.deceasedIsMale ? '#eff6ff' : '#fff',
                color: !heirs.deceasedIsMale ? '#1d4ed8' : '#64748b',
                fontWeight: 500,
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Female deceased
            </button>
          </div>

          <div style={{ borderTop: '0.5px solid #f1f5f9', paddingTop: '2px' }}>
            {heirs.deceasedIsMale ? (
              <Stepper label="Wives" name="wives" value={heirs.wives} />
            ) : (
              <div style={rowStyle}>
                <span style={labelStyle}>Husband</span>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <input
                    type="checkbox"
                    name="husband"
                    style={{
                      width: '24px',
                      height: '24px',
                      accentColor: '#2563eb'
                    }}
                    checked={heirs.husband}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Parents Card */}
        <div style={cardStyle}>
          <div style={{ ...rowStyle }}>
            <span style={labelStyle}>Parents alive</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {showSiblings && (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '13px',
                    color: '#dc2626',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    name="hasSC"
                    style={{
                      width: '24px',
                      height: '24px',
                      accentColor: '#dc2626'
                    }}
                    checked={heirs.hasSC}
                    onChange={handleChange}
                  />
                  Siblings
                </label>
              )}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '13px',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  name="fatherAlive"
                  style={{
                    width: '24px',
                    height: '24px',
                    accentColor: '#2563eb'
                  }}
                  checked={heirs.fatherAlive}
                  onChange={handleChange}
                />
                Father
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '13px',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  name="motherAlive"
                  style={{
                    width: '24px',
                    height: '24px',
                    accentColor: '#2563eb'
                  }}
                  checked={heirs.motherAlive}
                  onChange={handleChange}
                />
                Mother
              </label>
            </div>
          </div>
        </div>

        {/* Children Card */}
        <div style={cardStyle}>
          <Stepper label="Sons" name="sons" value={heirs.sons} />
          <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
          <Stepper label="Daughters" name="daughters" value={heirs.daughters} />
        </div>

        {/* Results */}
        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '0.5px solid #e2e8f0'
          }}
        >
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: '#1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#fff'
              }}
            >
              Distribution shares
            </span>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#cbd5e1',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <input
                type="checkbox"
                checked={showSummary}
                onChange={(e) => setShowSummary(e.target.checked)}
                style={{ accentColor: '#2563eb' }}
              />
              Summary
            </label>
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '16px'
            }}
          >
            <tbody>
              {heirs.fatherAlive && (
                <DistributionRow label={'Father'} share={res.father} />
              )}
              {heirs.motherAlive && (
                <DistributionRow label={'Mother'} share={res.mother} />
              )}
              {heirs.husband && (
                <DistributionRow label={'Husband'} share={res.husband} />
              )}
              {heirs.wives > 0 && wifeDistributionRows}
              {heirs.sons > 0 && sonDistributionRows}
              {heirs.daughters > 0 && daughterDistributionRows}
              {res.settle > 0 && (
                <DistributionRow label={'Musalahah'} share={res.settle} />
              )}
              <tr>
                <td
                  colSpan={2}
                  style={{
                    borderTop: '1px solid black',
                    padding: '4px 0' // Optional: adds a little space around the line
                  }}
                />
              </tr>
              <DistributionRow label={'Total'} share={res.total} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InheritanceCalculator;
