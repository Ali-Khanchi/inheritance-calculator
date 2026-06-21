import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InheritanceCalculator from './pages/InheritanceCalculator';
import CalculatorExamples from './pages/CalculatorExamples';

export default function App() {
  return (
    <Router basename="/inheritance-calculator">
      <nav
        style={{
          display: 'flex',
          gap: '15px',
          padding: '10px',
          background: '#f4f4f4'
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/examples">Examples</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<InheritanceCalculator />} />
          <Route path="/examples" element={<CalculatorExamples />} />
        </Routes>
      </main>
    </Router>
  );
}
