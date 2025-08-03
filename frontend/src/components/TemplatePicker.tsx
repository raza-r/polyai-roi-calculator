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

  // Professional sector configurations with emojis and client-ready copy
  const sectorConfig: Record<string, { emoji: string; title: string; description: string; proof: string }> = {
    utilities: {
      emoji: '⚡',
      title: 'Utilities',
      description: 'Automate outage reporting and status updates at scale.',
      proof: 'Deployed for a national utility; 4M+ calls/year handled by Voice AI.'
    },
    restaurants: {
      emoji: '🍽️',
      title: 'Restaurants',
      description: 'Deflect reservation, hours, and order-status calls with natural language.',
      proof: '>50% containment on peak weekends.'
    },
    financial_services: {
      emoji: '💳',
      title: 'Financial Services',
      description: 'Authenticate, service balances, and route complex issues securely.',
      proof: 'Reduce average handling time by 20–30%.'
    },
    healthcare: {
      emoji: '🏥',
      title: 'Healthcare',
      description: 'Scheduling, reminders, and triage with HIPAA-ready workflows.',
      proof: 'Lower no-shows by 10–15% with proactive outreach.'
    },
    travel: {
      emoji: '✈️',
      title: 'Travel',
      description: 'Handle bookings, cancellations, and travel disruptions seamlessly.',
      proof: 'Process 80%+ routine inquiries without agent intervention.'
    },
    retail: {
      emoji: '🛍️',
      title: 'Retail',
      description: 'Support order tracking, returns, and product inquiries at scale.',
      proof: 'Reduce call center volume by 40% during peak seasons.'
    },
    contact_center: {
      emoji: '📞',
      title: 'Contact Center',
      description: 'Generic contact center operations with flexible call routing.',
      proof: 'Typical enterprise deployment with multi-intent handling.'
    }
  };


  return (
    <div className="template-picker">
      <div className="simple-template-grid">
        {/* Start from Scratch Option */}
        <div className="simple-template-card" onClick={() => handleCardClick('custom')}>
          <div className="template-icon">⚙️</div>
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
        <p className="help-text">Click any option above to see details and select</p>
      )}
    </div>
  );
};

export default TemplatePicker;