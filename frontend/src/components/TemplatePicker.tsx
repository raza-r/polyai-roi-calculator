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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleCardClick = (vertical: string) => {
    if (selectedTemplate === vertical) {
      setShowDetails(!showDetails);
    } else {
      setSelectedTemplate(vertical);
      setShowDetails(true);
    }
  };

  if (!templates) return <div className="loading-state">Loading templates...</div>;

  const formatVerticalName = (vertical: string) => {
    return vertical
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="template-picker">
      <div className="simple-template-grid">
        {/* Start from Scratch Option */}
        <div className="simple-template-card" onClick={() => handleCardClick('custom')}>
          <div className="template-icon">🎯</div>
          <h4>Start from Scratch</h4>
          <p>Build your own scenario</p>
          {selectedTemplate === 'custom' && showDetails && (
            <div className="template-details">
              <p className="detail-text">Perfect for unique business models. Set all parameters yourself with complete control over assumptions.</p>
              <button 
                className="select-button" 
                onClick={(e) => { e.stopPropagation(); handleTemplateSelect('retail' as VerticalTemplate); }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Use This Template'}
              </button>
            </div>
          )}
        </div>

        {templates.verticals.map((vertical) => (
          <div 
            key={vertical} 
            className="simple-template-card"
            onClick={() => handleCardClick(vertical)}
          >
            <div className="template-icon">🏢</div>
            <h4>{formatVerticalName(vertical)}</h4>
            <p>Real customer data</p>
            {selectedTemplate === vertical && showDetails && (
              <div className="template-details">
                <p className="detail-text">{templates.descriptions[vertical]}</p>
                <div className="case-study">
                  <strong>Case Study:</strong>
                  <p>{templates.case_studies[vertical]}</p>
                </div>
                <button 
                  className="select-button" 
                  onClick={(e) => { e.stopPropagation(); handleTemplateSelect(vertical as VerticalTemplate); }}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Use This Template'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!showDetails && (
        <p className="help-text">👆 Click any option above to see details and select</p>
      )}
    </div>
  );
};

export default TemplatePicker;