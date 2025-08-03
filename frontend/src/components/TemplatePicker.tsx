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

  // Executive-focused sector configurations with business outcomes and ROI focus
  const sectorConfig: Record<string, { emoji: string; title: string; description: string; proof: string }> = {
    utilities: {
      emoji: '⚡',
      title: 'Utilities & Energy',
      description: 'Protect revenue during outages, reduce customer churn, and scale support during crisis events.',
      proof: 'PG&E: 22% CSAT increase during outages, 41% call containment, handles 4M+ calls yearly'
    },
    restaurants: {
      emoji: '🍽️',
      title: 'Restaurants & Hospitality',
      description: 'Capture after-hours bookings, reduce no-shows, and increase table utilization.',
      proof: 'Côte Brasserie: £250k after-hours revenue, 76% booking conversion, 24/7 availability'
    },
    financial_services: {
      emoji: '💳',
      title: 'Financial Services',
      description: 'Reduce compliance costs, improve customer satisfaction, and scale during peak periods.',
      proof: 'Quicken: 21% containment growth, zero customer complaints, significant agent efficiency gains'
    },
    healthcare: {
      emoji: '🏥',
      title: 'Healthcare',
      description: 'Reduce no-shows, improve patient outcomes, and scale support during health crises.',
      proof: 'Howard Brown: 30% containment, 72% AHT reduction, seamless crisis scaling capability'
    },
    travel: {
      emoji: '✈️',
      title: 'Travel & Tourism',
      description: 'Handle booking disruptions, reduce customer frustration, and provide 24/7 global support.',
      proof: 'Hopper: 15% containment, 24/7 support across 100+ countries, immediate resolution'
    },
    retail: {
      emoji: '🛍️',
      title: 'Retail & E-commerce',
      description: 'Increase sales conversion, reduce cart abandonment, and improve customer experience.',
      proof: 'Big Table Group: £140k monthly revenue, 3,800+ reservations, 100% call answer rate'
    },
    contact_center: {
      emoji: '📞',
      title: 'Contact Centers',
      description: 'Reduce operational costs, improve agent satisfaction, and scale without hiring.',
      proof: 'Atos: 30% call reduction, 187% ROI on labor savings, improved agent well-being'
    }
  };


  return (
    <div className="template-picker">
      <div className="simple-template-grid">
        {/* Start from Scratch Option */}
        <div className="simple-template-card" onClick={() => handleCardClick('custom')}>
          <div className="template-icon">⚙️</div>
          <h4>Custom Business Case</h4>
          <p>Build your own scenario</p>
          {selectedTemplate === 'custom' && showDetails && (
            <div className="template-details">
              <p className="detail-text">Perfect for unique business models or when you want complete control over your assumptions. Set all parameters to match your specific operational requirements.</p>
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

        {templates.verticals.map((vertical) => {
          const config = sectorConfig[vertical];
          if (!config) return null;
          
          return (
            <div 
              key={vertical} 
              className="simple-template-card"
              onClick={() => handleCardClick(vertical)}
            >
              <div className="template-icon">{config.emoji}</div>
              <h4>{config.title}</h4>
              <p>Real customer data</p>
              {selectedTemplate === vertical && showDetails && (
                <div className="template-details">
                  <p className="detail-text">{config.description}</p>
                  <div className="case-study">
                    <strong>Proof Point:</strong>
                    <p>{config.proof}</p>
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
          );
        })}
      </div>
      
      {!showDetails && (
        <p className="help-text">Select your industry to see relevant case studies and business outcomes</p>
      )}
    </div>
  );
};

export default TemplatePicker;