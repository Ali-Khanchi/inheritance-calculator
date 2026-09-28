import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InheritanceCalculator from './pages/InheritanceCalculator';
import CalculatorExamples from './pages/CalculatorExamples';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function NavigationBar() {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-neutral-100 px-5 py-2.5 shadow-sm h-12">
      <div className="flex gap-4">
        <Link
          to="/"
          className="text-gray-700 hover:text-black transition-colors"
        >
          {t('Home')}
        </Link>
        <Link
          to="/examples"
          className="text-gray-700 hover:text-black transition-colors"
        >
          {t('Examples')}
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router basename="/">
        <div className="min-h-screen">
          <NavigationBar />
          <main className="pt-12">
            <Routes>
              <Route path="/" element={<InheritanceCalculator />} />
              <Route path="/examples" element={<CalculatorExamples />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}
