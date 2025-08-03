import { useState, useEffect } from 'react';
import type { DealInputs, Results } from './types';
import { calculateROI } from './api';
import TemplatePicker from './components/TemplatePicker';
import AssumptionEditor from './components/AssumptionEditor';
import IntentGrid from './components/IntentGrid';
import ResultsPanel from './components/ResultsPanel';
import './App.css';

const defaultInputs: DealInputs = {
  annual_calls: 100000,
  intents: [
    {
      name: "General Inquiry",
      volume_share: 1.0,
      avg_minutes: 3.0,
      containment_m0: 0.5,
      containment_m3: 0.8,
      handoff_minutes: 1.0,
      revenue_per_abandon: undefined
    }
  ],
  agent_cost_per_min: 0.8,
  telco_cost_per_min: 0.05,
  polyai_cost_per_min: 0.12,
  acw_minutes: 1.0,
  baseline_abandon_rate: 0.15,
  ai_abandon_rate: 0.08,
  business_hours_only: true,
  night_fraction: 0.3,
  inflation: 0.03,
  volume_growth: 0.05,
  discount_rate: 0.10,
  risk_adjustment: 0.1
};

function App() {
  const [inputs, setInputs] = useState<DealInputs>(defaultInputs);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailedView, setDetailedView] = useState(false);

  // Throttled calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateResults();
    }, 250);

    return () => clearTimeout(timer);
  }, [inputs]); // calculateResults is stable, no need to include in deps

  const calculateResults = async () => {
    // Validate inputs
    const totalVolumeShare = inputs.intents.reduce((sum, intent) => sum + intent.volume_share, 0);
    if (Math.abs(totalVolumeShare - 1.0) > 0.01) {
      setError('Intent volume shares must sum to 100%');
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await calculateROI(inputs);
      setResults(result);
    } catch (err) {
      setError('Failed to calculate ROI. Please check your inputs.');
      setResults(null);
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateLoad = (templateInputs: DealInputs) => {
    setInputs(templateInputs);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Voice AI Business Case Builder</h1>
          <p className="disclaimer">
            Build a compelling business case for Voice AI. See how PolyAI drives revenue protection, operational efficiency, and customer experience improvements across industries.
          </p>
        </div>
      </header>

      <div className={`app-content ${detailedView ? 'detailed-view' : ''}`}>
        <div className="input-section">
          <div className="input-step">
            <div className="step-header">
              <div className="step-number">1</div>
              <h3 className="step-title">Select Your Industry</h3>
            </div>
            <TemplatePicker onTemplateLoad={handleTemplateLoad} />
          </div>

          <div className="input-step">
            <div className="step-header">
              <div className="step-number">2</div>
              <h3 className="step-title">Business Parameters</h3>
            </div>
            <AssumptionEditor inputs={inputs} onChange={setInputs} />
          </div>

          <div className="input-step">
            <div className="step-header">
              <div className="step-number">3</div>
              <h3 className="step-title">Call Types & Volumes</h3>
            </div>
            <IntentGrid inputs={inputs} onChange={setInputs} />
          </div>
          
          {error && (
            <div className="error-message">
              <strong>Configuration Issue:</strong> {error}
            </div>
          )}
        </div>

        <div className="results-section">
          <ResultsPanel 
            results={results} 
            loading={loading} 
            detailedView={detailedView}
            onToggleView={() => setDetailedView(!detailedView)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;