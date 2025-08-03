import { useState, useEffect } from 'react';
import type { DealInputs, Results } from './types';
import { calculateROI } from './api';
import TemplatePicker from './components/TemplatePicker';
import AssumptionEditor from './components/AssumptionEditor';
import IntentGrid from './components/IntentGrid';
import ResultsPanel from './components/ResultsPanel';
import ExportButtons from './components/ExportButtons';
import AuditTrail from './components/AuditTrail';
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

  // Throttled calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateResults();
    }, 250);

    return () => clearTimeout(timer);
  }, [inputs]);

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

  const isValidConfiguration = () => {
    const totalVolumeShare = inputs.intents.reduce((sum, intent) => sum + intent.volume_share, 0);
    return Math.abs(totalVolumeShare - 1.0) <= 0.01 && inputs.intents.length > 0;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Voice AI ROI Calculator</h1>
        <p className="disclaimer">
          Illustrative analysis - not official pricing. All assumptions are editable.
        </p>
      </header>

      <div className="app-content">
        <div className="input-section">
          <TemplatePicker onTemplateLoad={handleTemplateLoad} />
          <AssumptionEditor inputs={inputs} onChange={setInputs} />
          <IntentGrid inputs={inputs} onChange={setInputs} />
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="results-section">
          <ResultsPanel results={results} loading={loading} />
          
          {results && (
            <>
              <ExportButtons 
                inputs={inputs} 
                disabled={!isValidConfiguration()}
              />
              <AuditTrail inputs={inputs} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;