import React from 'react';
import type { DealInputs, IntentRow } from '../types';

interface IntentGridProps {
  inputs: DealInputs;
  onChange: (inputs: DealInputs) => void;
}

const IntentGrid: React.FC<IntentGridProps> = ({ inputs, onChange }) => {
  const updateIntent = (index: number, field: keyof IntentRow, value: string | number | undefined) => {
    const newIntents = [...inputs.intents];
    newIntents[index] = { ...newIntents[index], [field]: value };
    onChange({ ...inputs, intents: newIntents });
  };

  const addIntent = () => {
    const newIntent: IntentRow = {
      name: 'New Call Type',
      volume_share: 0.1,
      avg_minutes: 3.0,
      containment_m0: 0.5,
      containment_m3: 0.8,
      handoff_minutes: 1.0,
      revenue_per_abandon: undefined
    };
    onChange({ ...inputs, intents: [...inputs.intents, newIntent] });
  };

  const removeIntent = (index: number) => {
    const newIntents = inputs.intents.filter((_, i) => i !== index);
    onChange({ ...inputs, intents: newIntents });
  };

  const totalVolumeShare = inputs.intents.reduce((sum, intent) => sum + intent.volume_share, 0);
  const isValidShare = Math.abs(totalVolumeShare - 1.0) <= 0.01;

  return (
    <div className="intent-grid">
      <div className="intent-header">
        <h4>📞 Call Type Configuration</h4>
        <div className={`volume-status ${isValidShare ? 'valid' : 'invalid'}`}>
          <span>Total Volume: {(totalVolumeShare * 100).toFixed(1)}%</span>
          {!isValidShare && <span className="error-text">Must equal 100%</span>}
        </div>
      </div>

      <div className="intent-table-container">
        <div className="intent-table">
          {/* Header Row */}
          <div className="table-header">
            <div className="col-name">Call Type</div>
            <div className="col-volume">Volume %</div>
            <div className="col-duration">Duration</div>
            <div className="col-automation">AI Automation</div>
            <div className="col-revenue">Revenue Protection</div>
            <div className="col-actions">Actions</div>
          </div>

          {/* Data Rows */}
          {inputs.intents.map((intent, index) => (
            <div key={index} className="table-row">
              <div className="col-name">
                <input
                  type="text"
                  value={intent.name}
                  onChange={(e) => updateIntent(index, 'name', e.target.value)}
                  className="name-input"
                  placeholder="e.g., Reservations, Support, Sales"
                />
              </div>
              
              <div className="col-volume">
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={(intent.volume_share * 100).toFixed(1)}
                    onChange={(e) => updateIntent(index, 'volume_share', (parseFloat(e.target.value) || 0) / 100)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="table-input"
                  />
                  <span className="unit">%</span>
                </div>
                <div className="field-help">Share of total calls</div>
              </div>
              
              <div className="col-duration">
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={intent.avg_minutes}
                    onChange={(e) => updateIntent(index, 'avg_minutes', parseFloat(e.target.value) || 0)}
                    min="0.1"
                    step="0.1"
                    className="table-input"
                  />
                  <span className="unit">min</span>
                </div>
                <div className="field-help">Average call length</div>
              </div>
              
              <div className="col-automation">
                <div className="automation-inputs">
                  <div className="automation-row">
                    <label>Launch:</label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        value={(intent.containment_m0 * 100).toFixed(0)}
                        onChange={(e) => updateIntent(index, 'containment_m0', (parseFloat(e.target.value) || 0) / 100)}
                        min="0"
                        max="100"
                        step="1"
                        className="table-input small"
                      />
                      <span className="unit">%</span>
                    </div>
                  </div>
                  <div className="automation-row">
                    <label>Month 3:</label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        value={(intent.containment_m3 * 100).toFixed(0)}
                        onChange={(e) => updateIntent(index, 'containment_m3', (parseFloat(e.target.value) || 0) / 100)}
                        min="0"
                        max="100"
                        step="1"
                        className="table-input small"
                      />
                      <span className="unit">%</span>
                    </div>
                  </div>
                </div>
                <div className="field-help">% handled by AI</div>
              </div>
              
              <div className="col-revenue">
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={intent.revenue_per_abandon || ''}
                    onChange={(e) => updateIntent(index, 'revenue_per_abandon', e.target.value ? parseFloat(e.target.value) : undefined)}
                    min="0"
                    step="1"
                    placeholder="0"
                    className="table-input"
                  />
                  <span className="unit">£</span>
                </div>
                <div className="field-help">Revenue lost per abandoned call</div>
              </div>
              
              <div className="col-actions">
                {inputs.intents.length > 1 && (
                  <button
                    onClick={() => removeIntent(index)}
                    className="remove-btn"
                    title="Remove this call type"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={addIntent} className="add-intent-button">
        + Add Call Type
      </button>
    </div>
  );
};

export default IntentGrid;