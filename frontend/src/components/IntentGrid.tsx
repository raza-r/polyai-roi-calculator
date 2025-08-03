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
        <div className={`volume-status ${isValidShare ? 'valid' : 'invalid'}`}>
          <span>Total Volume: {(totalVolumeShare * 100).toFixed(1)}%</span>
          {!isValidShare && <span className="error-text">Must equal 100%</span>}
        </div>
      </div>

      <div className="intent-cards">
        {inputs.intents.map((intent, index) => (
          <div key={index} className="intent-card">
            <div className="intent-card-header">
              <input
                type="text"
                value={intent.name}
                onChange={(e) => updateIntent(index, 'name', e.target.value)}
                className="intent-name-input"
                placeholder="Call type name"
              />
              {inputs.intents.length > 1 && (
                <button
                  onClick={() => removeIntent(index)}
                  className="remove-intent-btn"
                  title="Remove this call type"
                >
                  ×
                </button>
              )}
            </div>

            <div className="intent-fields">
              <div className="field-group">
                <label>Volume Share</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={(intent.volume_share * 100).toFixed(1)}
                    onChange={(e) => updateIntent(index, 'volume_share', (parseFloat(e.target.value) || 0) / 100)}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="unit">%</span>
                </div>
              </div>

              <div className="field-group">
                <label>Avg Duration</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={intent.avg_minutes}
                    onChange={(e) => updateIntent(index, 'avg_minutes', parseFloat(e.target.value) || 0)}
                    min="0.1"
                    step="0.1"
                  />
                  <span className="unit">min</span>
                </div>
              </div>

              <div className="field-group">
                <label>AI Success (Month 0)</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={(intent.containment_m0 * 100).toFixed(0)}
                    onChange={(e) => updateIntent(index, 'containment_m0', (parseFloat(e.target.value) || 0) / 100)}
                    min="0"
                    max="100"
                    step="1"
                  />
                  <span className="unit">%</span>
                </div>
              </div>

              <div className="field-group">
                <label>AI Success (Month 3)</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={(intent.containment_m3 * 100).toFixed(0)}
                    onChange={(e) => updateIntent(index, 'containment_m3', (parseFloat(e.target.value) || 0) / 100)}
                    min="0"
                    max="100"
                    step="1"
                  />
                  <span className="unit">%</span>
                </div>
              </div>

              <div className="advanced-fields">
                <div className="field-group">
                  <label>Handoff Time</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={intent.handoff_minutes}
                      onChange={(e) => updateIntent(index, 'handoff_minutes', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                    <span className="unit">min</span>
                  </div>
                </div>

                <div className="field-group">
                  <label>Revenue/Abandon <span className="optional">(optional)</span></label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={intent.revenue_per_abandon || ''}
                      onChange={(e) => updateIntent(index, 'revenue_per_abandon', e.target.value ? parseFloat(e.target.value) : undefined)}
                      min="0"
                      step="1"
                      placeholder="0"
                    />
                    <span className="unit">£</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addIntent} className="add-intent-button">
        + Add Another Call Type
      </button>
    </div>
  );
};

export default IntentGrid;