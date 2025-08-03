import React from 'react';
import type { DealInputs, IntentRow } from '../types';

interface IntentGridProps {
  inputs: DealInputs;
  onChange: (inputs: DealInputs) => void;
}

const IntentGrid: React.FC<IntentGridProps> = ({ inputs, onChange }) => {
  const updateIntent = (index: number, field: keyof IntentRow, value: any) => {
    const newIntents = [...inputs.intents];
    newIntents[index] = { ...newIntents[index], [field]: value };
    onChange({ ...inputs, intents: newIntents });
  };

  const addIntent = () => {
    const newIntent: IntentRow = {
      name: 'New Intent',
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
        <h3>Intent Configuration</h3>
        <div className={`volume-total ${isValidShare ? 'valid' : 'invalid'}`}>
          Total Volume Share: {(totalVolumeShare * 100).toFixed(1)}%
          {!isValidShare && <span className="error"> (Must equal 100%)</span>}
        </div>
      </div>

      <div className="intent-table">
        <div className="table-header">
          <div>Intent Name</div>
          <div>Volume %</div>
          <div>Avg Min</div>
          <div>M0 Contain</div>
          <div>M3 Contain</div>
          <div>Handoff Min</div>
          <div>Revenue/Abandon</div>
          <div>Actions</div>
        </div>

        {inputs.intents.map((intent, index) => (
          <div key={index} className="table-row">
            <input
              type="text"
              value={intent.name}
              onChange={(e) => updateIntent(index, 'name', e.target.value)}
              className="intent-name"
            />
            
            <input
              type="number"
              value={intent.volume_share}
              onChange={(e) => updateIntent(index, 'volume_share', parseFloat(e.target.value) || 0)}
              min="0"
              max="1"
              step="0.01"
              className="volume-input"
            />
            
            <input
              type="number"
              value={intent.avg_minutes}
              onChange={(e) => updateIntent(index, 'avg_minutes', parseFloat(e.target.value) || 0)}
              min="0.1"
              step="0.1"
            />
            
            <input
              type="number"
              value={intent.containment_m0}
              onChange={(e) => updateIntent(index, 'containment_m0', parseFloat(e.target.value) || 0)}
              min="0"
              max="1"
              step="0.01"
            />
            
            <input
              type="number"
              value={intent.containment_m3}
              onChange={(e) => updateIntent(index, 'containment_m3', parseFloat(e.target.value) || 0)}
              min="0"
              max="1"
              step="0.01"
            />
            
            <input
              type="number"
              value={intent.handoff_minutes}
              onChange={(e) => updateIntent(index, 'handoff_minutes', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
            />
            
            <input
              type="number"
              value={intent.revenue_per_abandon || ''}
              onChange={(e) => updateIntent(index, 'revenue_per_abandon', e.target.value ? parseFloat(e.target.value) : undefined)}
              min="0"
              step="1"
              placeholder="Optional"
            />
            
            <button
              onClick={() => removeIntent(index)}
              className="remove-button"
              disabled={inputs.intents.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button onClick={addIntent} className="add-intent-button">
        + Add Intent
      </button>
    </div>
  );
};

export default IntentGrid;