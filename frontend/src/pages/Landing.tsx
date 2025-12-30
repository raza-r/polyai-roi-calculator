import { Link } from 'react-router-dom';
import { Calculator, Zap, BarChart3, Code2, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function Landing() {
  const templates = [
    {
      name: 'Voice AI ROI',
      description: 'Calculate ROI for call center automation',
      icon: '🤖',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'SaaS ROI',
      description: 'Product adoption ROI calculator',
      icon: '💼',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Cost Savings',
      description: 'Before/after cost comparison',
      icon: '💰',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Payback Period',
      description: 'Investment payback calculator',
      icon: '📈',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Launch in 2 Minutes',
      description: 'Pick a template, customize your branding, and go live instantly'
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Easy Embedding',
      description: 'Copy-paste embed code. Works everywhere. No technical skills required.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Track Everything',
      description: 'See who uses your calculator, capture leads, measure conversion'
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: 'Smart Formulas',
      description: 'Safe, powerful calculation engine. Edit formulas without coding.'
    }
  ];

  const pricingFeatures = [
    'Unlimited calculators',
    'Unlimited sessions',
    'Lead capture & analytics',
    'Custom branding',
    'Embed anywhere',
    'Email support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              CalcForge
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Built for Sales Teams</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Create ROI Calculators
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              In 2 Minutes
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop losing deals because prospects can't see the value. Show them ROI with
            beautiful, embeddable calculators. No coding required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup" className="btn-primary btn-lg group">
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#templates"
              className="btn-secondary btn-lg"
            >
              See Templates
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Launch in minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything you need to
              <span className="text-blue-600"> close more deals</span>
            </h2>
            <p className="text-xl text-gray-600">
              Purpose-built for B2B sales teams who need to show value, fast
            </p>
          </div>

          <div className="grid md:grid-3 lg:grid-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Pre-built Templates
              <span className="text-blue-600"> Ready to Use</span>
            </h2>
            <p className="text-xl text-gray-600">
              Start with a proven template. Customize in seconds.
            </p>
          </div>

          <div className="grid md:grid-2 gap-6">
            {templates.map((template, index) => (
              <div
                key={index}
                className="card group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`text-5xl bg-gradient-to-br ${template.color} rounded-2xl p-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                    <p className="text-gray-600">{template.description}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:translate-x-2 group-hover:text-blue-600 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup" className="btn-primary btn-lg">
              Try All Templates Free
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Simple, Honest Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Free forever. Seriously.
            </p>
          </div>

          <div className="card max-w-2xl mx-auto border-4 border-blue-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-sm font-bold">
              BETA PRICING
            </div>

            <div className="pt-8 text-center">
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-6xl font-black">$0</span>
                <span className="text-2xl text-gray-500">/month</span>
              </div>

              <p className="text-lg text-gray-600 mb-8">
                We're in beta. Everything is free while we build this together.
              </p>

              <ul className="space-y-4 text-left max-w-md mx-auto mb-8">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="btn-primary btn-lg w-full">
                Get Started Free
              </Link>

              <p className="text-sm text-gray-500 mt-4">
                No credit card required. Start building in 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to close more deals?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join sales teams using CalcForge to show ROI and win customers
          </p>
          <Link to="/signup" className="btn-lg bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center gap-2">
            Create Your First Calculator
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CalcForge</span>
          </div>
          <p className="text-sm">
            © 2025 CalcForge. Built for sales teams who show value.
          </p>
        </div>
      </footer>
    </div>
  );
}
