import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InheritanceCalculator from './pages/InheritanceCalculator';
import CalculatorExamples from './pages/CalculatorExamples';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function NavigationBar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: '#f4f4f4'
      }}
    >
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/">{t('Home')}</Link>
        <Link to="/examples">{t('Examples')}</Link>
      </div>

      {/* <button
        onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
        style={{
          padding: '6px 12px',
          cursor: 'pointer',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          background: '#fff',
          fontWeight: '600',
          fontSize: '14px'
        }}
      >
        {lang === 'en' ? 'العربية' : 'English'}
      </button> */}
    </nav>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router basename="/inheritance-calculator">
        <NavigationBar />
        <main>
          <Routes>
            <Route path="/" element={<InheritanceCalculator />} />
            <Route path="/examples" element={<CalculatorExamples />} />
          </Routes>
        </main>
      </Router>
    </LanguageProvider>
  );
}
