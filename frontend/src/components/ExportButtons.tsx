import React, { useState } from 'react';
import type { DealInputs } from '../types';
import { exportXLSX, exportPDF, exportCSV } from '../api';

interface ExportButtonsProps {
  inputs: DealInputs;
  disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ inputs, disabled = false }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExport = async (type: 'xlsx' | 'pdf' | 'csv') => {
    if (disabled) return;
    
    setLoading(type);
    try {
      let blob: Blob;
      let filename: string;

      switch (type) {
        case 'xlsx':
          blob = await exportXLSX(inputs);
          filename = 'roi_analysis.xlsx';
          break;
        case 'pdf':
          blob = await exportPDF(inputs);
          filename = 'roi_report.pdf';
          break;
        case 'csv':
          blob = await exportCSV(inputs);
          filename = 'roi_analysis.csv';
          break;
      }

      downloadBlob(blob, filename);
    } catch (error: any) {
      console.error(`Failed to export ${type}:`, error);
      // Show more helpful error messages
      if (error.message.includes('temporarily unavailable')) {
        alert(`${error.message}\n\nCSV export is available as an alternative.`);
      } else {
        alert(`Failed to export ${type.toUpperCase()}. Please try again.`);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="export-buttons">
      <h3 className="mb-3">Share your business case</h3>
      <div className="grid grid-3">
        <button
          onClick={() => handleExport('xlsx')}
          disabled={disabled || loading === 'xlsx'}
          className="btn btn-secondary"
          title="Excel export temporarily unavailable - use CSV instead"
        >
          {loading === 'xlsx' ? 'Exporting...' : 'Excel Analysis'}
        </button>
        
        <button
          onClick={() => handleExport('pdf')}
          disabled={disabled || loading === 'pdf'}
          className="btn btn-secondary"
          title="PDF export temporarily unavailable - use CSV instead"
        >
          {loading === 'pdf' ? 'Exporting...' : 'Executive Report'}
        </button>
        
        <button
          onClick={() => handleExport('csv')}
          disabled={disabled || loading === 'csv'}
          className="btn btn-secondary"
          title="Download comprehensive CSV report"
        >
          {loading === 'csv' ? 'Exporting...' : '📊 CSV Report'}
        </button>
      </div>
      
      {disabled && (
        <p className="text-muted text-center mt-3">Complete your configuration to enable exports</p>
      )}
      
      <p className="text-muted text-center mt-2 text-sm">
        💡 CSV export includes summary metrics, yearly breakdown, and input assumptions
      </p>
    </div>
  );
};

export default ExportButtons;