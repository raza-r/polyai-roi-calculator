import React, { useState, useEffect } from 'react';
import type { VerticalTemplate, DealInputs } from '../types';
import { getTemplates, getTemplate } from '../api';

interface TemplatePickerProps {
  onTemplateLoad: (inputs: DealInputs) => void;
}

interface TemplateData {
  verticals: string[];
  descriptions: Record<string, string>;
  case_studies: Record<string, string>;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({ onTemplateLoad }) => {
  const [templates, setTemplates] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  const handleTemplateSelect = async (vertical: VerticalTemplate) => {
    setLoading(true);
    try {
      const template = await getTemplate(vertical);
      onTemplateLoad(template);
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!templates) return <div>Loading templates...</div>;

  const formatVerticalName = (vertical: string) => {
    return vertical
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="template-picker">
      <p className="template-subtitle">Jump-start with real PolyAI customer scenarios, or start from scratch</p>
      <div className="template-grid">
        {/* Start from Scratch Option */}
        <button
          className="template-button"
          onClick={() => handleTemplateSelect('retail' as VerticalTemplate)} // Use retail as default
          disabled={loading}
        >
          <div className="template-header">
            <strong>Start from Scratch</strong>
            <span className="case-study-badge" style={{ background: 'var(--color-text-muted)' }}>Custom</span>
          </div>
          <p className="template-description">Build your own scenario with default parameters</p>
          <p className="case-study-detail">Perfect for unique use cases or when you want full control over assumptions</p>
          {loading && <div className="loading-overlay">Loading...</div>}
        </button>

        {templates.verticals.map((vertical) => (
          <button
            key={vertical}
            className="template-button"
            onClick={() => handleTemplateSelect(vertical as VerticalTemplate)}
            disabled={loading}
          >
            <div className="template-header">
              <strong>{formatVerticalName(vertical)}</strong>
              <span className="case-study-badge">Live Customer</span>
            </div>
            <p className="template-description">{templates.descriptions[vertical]}</p>
            <p className="case-study-detail">{templates.case_studies[vertical]}</p>
            {loading && <div className="loading-overlay">Loading...</div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplatePicker;