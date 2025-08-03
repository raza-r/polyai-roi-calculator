import React, { useState } from 'react';
import type { DealInputs } from '../types';

interface AssumptionEditorProps {
  inputs: DealInputs;
  onChange: (inputs: DealInputs) => void;
}

const AssumptionEditor: React.FC<AssumptionEditorProps> = ({ inputs, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = (field: keyof DealInputs, value: string | number | boolean) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="assumption-editor">
      {/* Business Scale */}
      <div className="param-section">
        <h4>📊 Business Scale</h4>
        <div className="param-grid">
          <div className="param-field">
            <label>Annual Call Volume</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={inputs.annual_calls}
                onChange={(e) => updateField('annual_calls', parseInt(e.target.value) || 0)}
                min="1000"
                step="1000"
              />
              <span className="unit">calls</span>
            </div>
            <div className="field-help">Total customer calls per year</div>
          </div>
        </div>
      </div>

      {/* Cost Structure */}
      <div className="param-section">
        <h4>💰 Cost Structure</h4>
        <div className="param-grid">
          <div className="param-field">
            <label>Agent Cost per Minute</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={inputs.agent_cost_per_min}
                onChange={(e) => updateField('agent_cost_per_min', parseFloat(e.target.value) || 0)}
                min="0.1"
                step="0.1"
              />
              <span className="unit">£</span>
            </div>
            <div className="field-help">Current cost per minute of agent time</div>
          </div>
          
          <div className="param-field">
            <label>Voice AI Cost per Minute</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={inputs.polyai_cost_per_min}
                onChange={(e) => updateField('polyai_cost_per_min', parseFloat(e.target.value) || 0)}
                min="0.01"
                step="0.01"
              />
              <span className="unit">£</span>
            </div>
            <div className="field-help">PolyAI cost per minute (typically 10-20% of agent cost)</div>
          </div>
        </div>
      </div>

      {/* Operational Settings */}
      <div className="param-section">
        <h4>⚙️ Operational Settings</h4>
        <div className="param-grid">
          <div className="param-field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={inputs.business_hours_only}
                onChange={(e) => updateField('business_hours_only', e.target.checked)}
              />
              <span className="checkmark"></span>
              Business Hours Only
            </label>
            <div className="field-help">Uncheck for 24/7 availability</div>
          </div>
          
          <div className="param-field">
            <label>After Hours Volume</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={(inputs.night_fraction * 100).toFixed(0)}
                onChange={(e) => updateField('night_fraction', (parseFloat(e.target.value) || 0) / 100)}
                min="0"
                max="100"
                step="1"
                disabled={inputs.business_hours_only}
              />
              <span className="unit">%</span>
            </div>
            <div className="field-help">Percentage of calls outside business hours</div>
          </div>
        </div>
      </div>

      {/* Advanced Financial Settings */}
      <div className="advanced-toggle">
        <button 
          className="toggle-button"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>Advanced Financial Settings</span>
          <span className={`toggle-icon ${showAdvanced ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
      </div>
      
      {showAdvanced && (
        <div className="param-section advanced">
          <div className="param-grid">
            <div className="param-field">
              <label>Call Abandonment (Current)</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={(inputs.baseline_abandon_rate * 100).toFixed(1)}
                  onChange={(e) => updateField('baseline_abandon_rate', (parseFloat(e.target.value) || 0) / 100)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="unit">%</span>
              </div>
              <div className="field-help">Current percentage of abandoned calls</div>
            </div>
            
            <div className="param-field">
              <label>Call Abandonment (With AI)</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={(inputs.ai_abandon_rate * 100).toFixed(1)}
                  onChange={(e) => updateField('ai_abandon_rate', (parseFloat(e.target.value) || 0) / 100)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="unit">%</span>
              </div>
              <div className="field-help">Expected abandonment rate with Voice AI</div>
            </div>
            
            <div className="param-field">
              <label>Volume Growth Rate</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={(inputs.volume_growth * 100).toFixed(1)}
                  onChange={(e) => updateField('volume_growth', (parseFloat(e.target.value) || 0) / 100)}
                  min="0"
                  max="50"
                  step="0.1"
                />
                <span className="unit">%</span>
              </div>
              <div className="field-help">Annual growth in call volume</div>
            </div>
            
            <div className="param-field">
              <label>Inflation Rate</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={(inputs.inflation * 100).toFixed(1)}
                  onChange={(e) => updateField('inflation', (parseFloat(e.target.value) || 0) / 100)}
                  min="0"
                  max="20"
                  step="0.1"
                />
                <span className="unit">%</span>
              </div>
              <div className="field-help">Annual cost inflation rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssumptionEditor;