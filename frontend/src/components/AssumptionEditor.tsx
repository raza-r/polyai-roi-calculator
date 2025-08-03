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
      {/* Core Parameters */}
      <div className="param-section">
        <h4>Essential Parameters</h4>
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
          </div>
          
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
          </div>
        </div>
      </div>

      {/* Advanced Parameters Toggle */}
      <div className="advanced-toggle">
        <button 
          className="toggle-button"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>Advanced Settings</span>
          <span className={`toggle-icon ${showAdvanced ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
      </div>
      
      {showAdvanced && (
        <div className="param-section advanced">
          <div className="param-grid">
            <div className="param-field">
              <label>Telephony Cost per Minute</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={inputs.telco_cost_per_min}
                  onChange={(e) => updateField('telco_cost_per_min', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
                <span className="unit">£</span>
              </div>
            </div>
            
            <div className="param-field">
              <label>After Call Work Time</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={inputs.acw_minutes}
                  onChange={(e) => updateField('acw_minutes', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                />
                <span className="unit">min</span>
              </div>
            </div>
            
            <div className="param-field">
              <label>Current Abandon Rate</label>
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
            </div>
            
            <div className="param-field">
              <label>AI Abandon Rate</label>
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
            </div>
            
            <div className="param-field">
              <label>Out of Hours Volume</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={(inputs.night_fraction * 100).toFixed(0)}
                  onChange={(e) => updateField('night_fraction', (parseFloat(e.target.value) || 0) / 100)}
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="unit">%</span>
              </div>
            </div>
            
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
            </div>
            
            <div className="param-field">
              <label>Annual Inflation</label>
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
            </div>
            
            <div className="param-field">
              <label>Discount Rate</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={(inputs.discount_rate * 100).toFixed(1)}
                  onChange={(e) => updateField('discount_rate', (parseFloat(e.target.value) || 0) / 100)}
                  min="0"
                  max="30"
                  step="0.1"
                />
                <span className="unit">%</span>
              </div>
            </div>
            
            <div className="param-field">
              <label>Risk Adjustment</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={(inputs.risk_adjustment * 100).toFixed(1)}
                  onChange={(e) => updateField('risk_adjustment', (parseFloat(e.target.value) || 0) / 100)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="unit">%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssumptionEditor;