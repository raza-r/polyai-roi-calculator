import React, { useState } from 'react';
import type { DealInputs } from '../types';

interface AssumptionEditorProps {
  inputs: DealInputs;
  onChange: (inputs: DealInputs) => void;
}

const AssumptionEditor: React.FC<AssumptionEditorProps> = ({ inputs, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = (field: keyof DealInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="assumption-editor">
      <h3>Key Assumptions</h3>
      
      {/* Always-on dials */}
      <div className="key-dials">
        <div className="dial-group">
          <label>
            Annual Calls
            <input
              type="number"
              value={inputs.annual_calls}
              onChange={(e) => updateField('annual_calls', parseInt(e.target.value))}
              min="1000"
              step="1000"
            />
          </label>
        </div>
        
        <div className="dial-group">
          <label>
            Agent Cost/Min (£)
            <input
              type="number"
              value={inputs.agent_cost_per_min}
              onChange={(e) => updateField('agent_cost_per_min', parseFloat(e.target.value))}
              min="0.1"
              step="0.1"
            />
          </label>
        </div>
        
        <div className="dial-group">
          <label>
            PolyAI Cost/Min (£)
            <input
              type="number"
              value={inputs.polyai_cost_per_min}
              onChange={(e) => updateField('polyai_cost_per_min', parseFloat(e.target.value))}
              min="0.01"
              step="0.01"
            />
          </label>
        </div>
      </div>

      {/* Advanced accordion */}
      <div className="advanced-section">
        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced Settings {showAdvanced ? '▼' : '▶'}
        </button>
        
        {showAdvanced && (
          <div className="advanced-grid">
            <div className="input-group">
              <label>
                Telco Cost/Min (£)
                <input
                  type="number"
                  value={inputs.telco_cost_per_min}
                  onChange={(e) => updateField('telco_cost_per_min', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                ACW Minutes
                <input
                  type="number"
                  value={inputs.acw_minutes}
                  onChange={(e) => updateField('acw_minutes', parseFloat(e.target.value))}
                  min="0"
                  step="0.1"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                Baseline Abandon Rate
                <input
                  type="number"
                  value={inputs.baseline_abandon_rate}
                  onChange={(e) => updateField('baseline_abandon_rate', parseFloat(e.target.value))}
                  min="0"
                  max="1"
                  step="0.01"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                AI Abandon Rate
                <input
                  type="number"
                  value={inputs.ai_abandon_rate}
                  onChange={(e) => updateField('ai_abandon_rate', parseFloat(e.target.value))}
                  min="0"
                  max="1"
                  step="0.01"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  checked={inputs.business_hours_only}
                  onChange={(e) => updateField('business_hours_only', e.target.checked)}
                />
                Business Hours Only
              </label>
            </div>
            
            <div className="input-group">
              <label>
                Night Fraction
                <input
                  type="number"
                  value={inputs.night_fraction}
                  onChange={(e) => updateField('night_fraction', parseFloat(e.target.value))}
                  min="0"
                  max="1"
                  step="0.1"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                Inflation Rate
                <input
                  type="number"
                  value={inputs.inflation}
                  onChange={(e) => updateField('inflation', parseFloat(e.target.value))}
                  min="0"
                  max="0.2"
                  step="0.01"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                Volume Growth Rate
                <input
                  type="number"
                  value={inputs.volume_growth}
                  onChange={(e) => updateField('volume_growth', parseFloat(e.target.value))}
                  min="0"
                  max="0.5"
                  step="0.01"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                Discount Rate
                <input
                  type="number"
                  value={inputs.discount_rate}
                  onChange={(e) => updateField('discount_rate', parseFloat(e.target.value))}
                  min="0"
                  max="0.3"
                  step="0.01"
                />
              </label>
            </div>
            
            <div className="input-group">
              <label>
                Risk Adjustment
                <input
                  type="number"
                  value={inputs.risk_adjustment}
                  onChange={(e) => updateField('risk_adjustment', parseFloat(e.target.value))}
                  min="0"
                  max="1"
                  step="0.01"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssumptionEditor;