import React, { useState, useEffect } from 'react';
import type { VerticalTemplate, DealInputs } from '../types';
import { getTemplates, getTemplate } from '../api';

interface TemplatePickerProps {
  onTemplateLoad: (inputs: DealInputs) => void;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({ onTemplateLoad }) => {
  const [templates, setTemplates] = useState<{ verticals: string[]; descriptions: Record<string, string> } | null>(null);
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

  return (
    <div className="template-picker">
      <h3>Quick Start Templates</h3>
      <div className="template-grid">
        {templates.verticals.map((vertical) => (
          <button
            key={vertical}
            className="template-button"
            onClick={() => handleTemplateSelect(vertical as VerticalTemplate)}
            disabled={loading}
          >
            <strong>{vertical.toUpperCase()}</strong>
            <p>{templates.descriptions[vertical]}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplatePicker;