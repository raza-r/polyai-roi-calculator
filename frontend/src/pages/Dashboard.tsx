import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  Plus,
  Eye,
  Users,
  TrendingUp,
  LogOut,
  Copy,
  ExternalLink,
  Loader2,
  Sparkles
} from 'lucide-react';
import { calculatorAPI, templateAPI } from '../utils/api';
import { useAuthStore } from '../store/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, organization, clearAuth } = useAuthStore();

  const [calculators, setCalculators] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [creatingFrom, setCreatingFrom] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [calcsData, templatesData] = await Promise.all([
        calculatorAPI.list(),
        templateAPI.list(),
      ]);
      setCalculators(calcsData.items || []);
      setTemplates(templatesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFromTemplate = async (templateId: string) => {
    setCreatingFrom(templateId);
    try {
      const template = await templateAPI.get(templateId);
      const newCalc = await calculatorAPI.create({
        name: `${template.name} (Copy)`,
        description: template.description,
        config: template.config,
      });
      setShowTemplateModal(false);
      loadData();
    } catch (error) {
      console.error('Error creating calculator:', error);
      alert('Failed to create calculator. Please try again.');
    } finally {
      setCreatingFrom(null);
    }
  };

  const copyEmbedCode = (calc: any) => {
    const embedCode = `<iframe src="${window.location.origin}/c/${organization?.slug}/${calc.slug}" width="100%" height="600px" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">CalcForge</span>
              <p className="text-xs text-gray-500">{organization?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">👋 {user?.full_name || user?.email}</span>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-lg text-gray-600">Manage your ROI calculators and track performance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-black">{calculators.length}</span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Total Calculators</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-black">
                {calculators.reduce((sum, c) => sum + (c.views_count || 0), 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Total Views</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-black">
                {calculators.reduce((sum, c) => sum + (c.completions_count || 0), 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-semibold">Completions</p>
          </div>
        </div>

        {/* Calculators Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Your Calculators</h2>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Calculator
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : calculators.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Create Your First Calculator</h3>
            <p className="text-gray-600 mb-6">
              Start with a pre-built template and customize it to your needs
            </p>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-5 h-5" />
              Choose Template
            </button>
          </div>
        ) : (
          <div className="grid md:grid-2 lg:grid-3 gap-6">
            {calculators.map((calc) => (
              <div key={calc.id} className="card group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{calc.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{calc.description || 'No description'}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      calc.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {calc.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{calc.views_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{calc.completions_count || 0}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {calc.status === 'published' && (
                    <>
                      <a
                        href={`/c/${organization?.slug}/${calc.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary btn-sm flex-1 flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                      <button
                        onClick={() => copyEmbedCode(calc)}
                        className="btn-secondary btn-sm flex-1 flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Embed
                      </button>
                    </>
                  )}
                  {calc.status === 'draft' && (
                    <button className="btn-secondary btn-sm flex-1">
                      Edit Draft
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="mb-6">
              <h2 className="text-3xl font-black mb-2">Choose a Template</h2>
              <p className="text-gray-600">Start with a proven ROI calculator template</p>
            </div>

            <div className="grid md:grid-2 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="card group cursor-pointer hover:border-blue-600">
                  <div className="text-4xl mb-3">{template.category === 'AI & Automation' ? '🤖' : template.category === 'SaaS' ? '💼' : template.category === 'General' ? '💰' : '📈'}</div>
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <button
                    onClick={() => createFromTemplate(template.id)}
                    disabled={creatingFrom === template.id}
                    className="btn-primary w-full"
                  >
                    {creatingFrom === template.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Use This Template
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
