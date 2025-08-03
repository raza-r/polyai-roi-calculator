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
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showScheduleDemo, setShowScheduleDemo] = useState(false);

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
      
      // Commercial hooks - show CTAs for strong ROI cases
      if (result.payback_months && result.payback_months <= 12 && result.roi_5y > 2.0) {
        setTimeout(() => setShowScheduleDemo(true), 2000); // Show after 2 seconds
      }
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
          <h1>🚀 PolyAI ROI Calculator</h1>
          <div className="header-subtitle">
            <p className="value-prop">
              <strong>Discover Your Voice AI Business Case</strong> - See how industry leaders achieve <span className="highlight">200%+ ROI</span> with PolyAI
            </p>
            <div className="trust-indicators">
              <span className="trust-badge">✓ Used by Fortune 500</span>
              <span className="trust-badge">✓ 15-min Analysis</span>
              <span className="trust-badge">✓ Based on Real Data</span>
            </div>
          </div>
        </div>
      </header>

      <div className={`app-content ${detailedView ? 'detailed-view' : ''}`}>
        <div className="input-section">
          <div className="input-step">
            <div className="step-header">
              <div className="step-number">1</div>
              <h3 className="step-title">Choose Your Industry</h3>
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
            inputs={inputs}
            loading={loading} 
            detailedView={detailedView}
            onToggleView={() => setDetailedView(!detailedView)}
            onScheduleDemo={() => setShowScheduleDemo(true)}
            onDownloadReport={() => setShowLeadModal(true)}
          />
        </div>
      </div>

      {/* Commercial Modals */}
      {showScheduleDemo && (
        <div className="modal-overlay" onClick={() => setShowScheduleDemo(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎯 Your ROI looks incredible!</h3>
              <button className="modal-close" onClick={() => setShowScheduleDemo(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Based on your analysis, you could see <strong>payback in {results?.payback_months?.toFixed(1)} months</strong> with <strong>{results?.roi_5y ? (results.roi_5y * 100).toFixed(0) : 0}% ROI</strong>.</p>
              <p>Let's discuss how companies like yours are achieving these results with PolyAI.</p>
              <div className="modal-actions">
                <a href="https://calendly.com/polyai-demo" target="_blank" rel="noopener noreferrer" 
                   className="btn-primary modal-cta">
                  📅 Schedule 15-min Demo
                </a>
                <button className="btn-secondary" onClick={() => setShowScheduleDemo(false)}>
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLeadModal && (
        <div className="modal-overlay" onClick={() => setShowLeadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Get Your Custom ROI Report</h3>
              <button className="modal-close" onClick={() => setShowLeadModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Enter your email to receive a detailed ROI analysis and benchmark data from similar companies.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thanks! Check your email for the report.'); setShowLeadModal(false); }}>
                <input type="email" placeholder="your.email@company.com" className="form-input" required />
                <div className="modal-actions">
                  <button type="submit" className="btn-primary modal-cta">
                    📧 Send My Report
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowLeadModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;