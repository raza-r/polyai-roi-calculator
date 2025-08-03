import React, { useState } from 'react';
import type { DealInputs } from '../types';

interface AuditTrailProps {
  inputs: DealInputs;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ inputs }) => {
  const [notes, setNotes] = useState('');
  const [showJson, setShowJson] = useState(false);

  const timestamp = new Date().toISOString();

  const auditData = {
    timestamp,
    assumptions_notes: notes,
    inputs: inputs
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(auditData, null, 2))
      .then(() => alert('Audit trail copied to clipboard'))
      .catch(() => alert('Failed to copy to clipboard'));
  };

  return (
    <div className="audit-trail">
      <h4>Audit Trail</h4>
      
      <div className="notes-section">
        <label>
          Assumptions Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about assumptions, data sources, or methodology..."
            rows={3}
          />
        </label>
      </div>

      <div className="audit-controls">
        <button onClick={() => setShowJson(!showJson)}>
          {showJson ? 'Hide' : 'Show'} JSON
        </button>
        <button onClick={copyToClipboard}>
          Copy Audit Trail
        </button>
      </div>

      {showJson && (
        <div className="json-display">
          <pre>{JSON.stringify(auditData, null, 2)}</pre>
        </div>
      )}

      <div className="timestamp">
        Generated: {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default AuditTrail;