import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Mail, Download, Loader2 } from 'lucide-react';
import axios from 'axios';

interface CalculatorConfig {
  metadata: {
    name: string;
    description?: string;
  };
  branding: {
    company_name: string;
    primary_color?: string;
    secondary_color?: string;
  };
  inputs: {
    global_parameters: Array<{
      id: string;
      label: string;
      type: string;
      default: number;
      min?: number;
      max?: number;
      help_text?: string;
      required?: boolean;
    }>;
  };
  outputs: {
    primary_metrics: Array<{
      id: string;
      label: string;
      format: string;
      highlight?: boolean;
    }>;
  };
  lead_capture?: {
    enabled: boolean;
    trigger?: string;
    roi_threshold?: number;
  };
}

interface CalculatorViewProps {
  orgSlug: string;
  calcSlug: string;
  embedded?: boolean;
}

export default function CalculatorView({ orgSlug, calcSlug, embedded = false }: CalculatorViewProps) {
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Load calculator config
  useEffect(() => {
    loadCalculator();
  }, [orgSlug, calcSlug]);

  // Auto-calculate when inputs change
  useEffect(() => {
    if (Object.keys(inputs).length > 0) {
      const debounce = setTimeout(() => {
        calculate();
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [inputs]);

  const loadCalculator = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/calculators/public/${orgSlug}/${calcSlug}`);
      const calculatorData = response.data;
      setConfig(calculatorData.config);

      // Initialize inputs with defaults
      const defaultInputs: Record<string, number> = {};
      calculatorData.config.inputs.global_parameters.forEach((param: any) => {
        defaultInputs[param.id] = param.default;
      });
      setInputs(defaultInputs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading calculator:', error);
      setLoading(false);
    }
  };

  const calculate = async () => {
    if (!config) return;

    setCalculating(true);
    try {
      const response = await axios.post(`${API_BASE}/api/calculators/public/${orgSlug}/${calcSlug}/calculate`, inputs);
      setResults(response.data.results);
      setSessionToken(response.data.session_token);

      // Check if we should show lead capture
      const leadConfig = config.lead_capture;
      if (leadConfig?.enabled && !leadCaptured) {
        // Show lead capture based on trigger
        if (leadConfig.trigger === 'on_export') {
          // Don't show immediately
        } else if (leadConfig.trigger === 'smart' && leadConfig.roi_threshold) {
          // Show if ROI exceeds threshold
          const roiValue = response.data.results.roi_5y || response.data.results.roi_3y || 0;
          if (roiValue > leadConfig.roi_threshold) {
            setShowLeadCapture(true);
          }
        }
      }
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken || !leadEmail) return;

    try {
      await axios.post(`${API_BASE}/api/sessions/capture-lead`, {
        session_token: sessionToken,
        email: leadEmail,
        name: leadName,
        company: leadCompany
      });
      setLeadCaptured(true);
      setShowLeadCapture(false);
    } catch (error) {
      console.error('Lead capture error:', error);
    }
  };

  const formatValue = (value: number, format: string): string => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } else if (format === 'percentage') {
      return `${value.toFixed(1)}%`;
    } else if (format === 'months') {
      return `${value.toFixed(1)} months`;
    } else {
      return value.toLocaleString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading calculator...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculator not found</h2>
          <p className="text-gray-600">This calculator may have been removed or made private.</p>
        </div>
      </div>
    );
  }

  const primaryColor = config.branding.primary_color || '#3B82F6';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${embedded ? '' : 'p-4'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {!embedded && (
          <div className="mb-8 text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, #6366F1)` }}
              >
                <Calculator className="w-7 h-7" />
              </div>
              <h1 className="text-4xl font-black">{config.metadata.name}</h1>
            </div>
            {config.metadata.description && (
              <p className="text-lg text-gray-600">{config.metadata.description}</p>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                1
              </span>
              Your Information
            </h2>

            <div className="space-y-5">
              {config.inputs.global_parameters.map((param) => (
                <div key={param.id}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {param.label}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="number"
                    value={inputs[param.id] || param.default}
                    onChange={(e) => setInputs({ ...inputs, [param.id]: parseFloat(e.target.value) || 0 })}
                    min={param.min}
                    max={param.max}
                    className="input-field w-full"
                    style={{ borderColor: `${primaryColor}33` }}
                  />
                  {param.help_text && (
                    <p className="text-xs text-gray-500 mt-1">{param.help_text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="card bg-gradient-to-br from-white to-blue-50 border-2" style={{ borderColor: primaryColor }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-7 h-7" style={{ color: primaryColor }} />
              Your Results
            </h2>

            {calculating ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
              </div>
            ) : results ? (
              <div className="space-y-4">
                {config.outputs.primary_metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className={`p-5 rounded-xl ${
                      metric.highlight
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${metric.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      {metric.label}
                    </div>
                    <div className={`text-3xl font-black ${metric.highlight ? '' : 'text-gray-900'}`}>
                      {formatValue(results[metric.id] || 0, metric.format)}
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (config.lead_capture?.enabled) {
                        setShowLeadCapture(true);
                      }
                    }}
                    className="btn-primary w-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Download className="w-5 h-5" />
                    Download Full Report
                  </button>
                </div>

                {!embedded && (
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Powered by <span className="font-semibold">{config.branding.company_name}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Adjust the values to see your results</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Capture Modal */}
        {showLeadCapture && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Mail className="w-8 h-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Get Your Full Report</h3>
                <p className="text-gray-600">
                  Enter your email to receive a detailed ROI analysis
                </p>
              </div>

              <form onSubmit={handleLeadCapture} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    required
                    className="input-field w-full"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="input-field w-full"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="input-field w-full"
                    placeholder="Acme Corp"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLeadCapture(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Get Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
