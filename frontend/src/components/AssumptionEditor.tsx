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
      <p className="text-muted mb-4">Adjust these core parameters to match your contact center operations</p>
      
      {/* Always-on dials */}
      <div className="grid grid-3" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="form-group">
          <label className="form-label">Annual Calls</label>
          <input
            className="form-input"
            type="number"
            value={inputs.annual_calls}
            onChange={(e) => updateField('annual_calls', parseInt(e.target.value))}
            min="1000"
            step="1000"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Agent Cost/Min (£)</label>
          <input
            className="form-input"
            type="number"
            value={inputs.agent_cost_per_min}
            onChange={(e) => updateField('agent_cost_per_min', parseFloat(e.target.value))}
            min="0.1"
            step="0.1"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">PolyAI Cost/Min (£)</label>
          <input
            className="form-input"
            type="number"
            value={inputs.polyai_cost_per_min}
            onChange={(e) => updateField('polyai_cost_per_min', parseFloat(e.target.value))}
            min="0.01"
            step="0.01"
          />
        </div>
      </div>

      {/* Advanced accordion */}
      <div className="advanced-section">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ marginBottom: showAdvanced ? 'var(--space-4)' : '0' }}
        >
          <span className="text-accent">Advanced Parameters</span>
          {showAdvanced ? ' ▼' : ' ▶'}
        </button>
        
        {showAdvanced && (
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Telco Cost/Min (£)</label>
              <input
                className="form-input"
                type="number"
                value={inputs.telco_cost_per_min}
                onChange={(e) => updateField('telco_cost_per_min', parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">ACW Minutes</label>
              <input
                className="form-input"
                type="number"
                value={inputs.acw_minutes}
                onChange={(e) => updateField('acw_minutes', parseFloat(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Baseline Abandon Rate</label>
              <input
                className="form-input"
                type="number"
                value={inputs.baseline_abandon_rate}
                onChange={(e) => updateField('baseline_abandon_rate', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">AI Abandon Rate</label>
              <input
                className="form-input"
                type="number"
                value={inputs.ai_abandon_rate}
                onChange={(e) => updateField('ai_abandon_rate', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={inputs.business_hours_only}
                  onChange={(e) => updateField('business_hours_only', e.target.checked)}
                />
                <span>Business Hours Only</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="form-label">Night Fraction</label>
              <input
                className="form-input"
                type="number"
                value={inputs.night_fraction}
                onChange={(e) => updateField('night_fraction', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Inflation Rate</label>
              <input
                className="form-input"
                type="number"
                value={inputs.inflation}
                onChange={(e) => updateField('inflation', parseFloat(e.target.value))}
                min="0"
                max="0.2"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Volume Growth Rate</label>
              <input
                className="form-input"
                type="number"
                value={inputs.volume_growth}
                onChange={(e) => updateField('volume_growth', parseFloat(e.target.value))}
                min="0"
                max="0.5"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Discount Rate</label>
              <input
                className="form-input"
                type="number"
                value={inputs.discount_rate}
                onChange={(e) => updateField('discount_rate', parseFloat(e.target.value))}
                min="0"
                max="0.3"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Risk Adjustment</label>
              <input
                className="form-input"
                type="number"
                value={inputs.risk_adjustment}
                onChange={(e) => updateField('risk_adjustment', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssumptionEditor;