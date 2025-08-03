import React from 'react';
import type { Results } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';

interface ResultsPanelProps {
  results: Results | null;
  loading: boolean;
  detailedView: boolean;
  onToggleView: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, loading, detailedView, onToggleView }) => {
  if (loading) {
    return (
      <div className={`results-panel loading ${detailedView ? 'detailed' : 'compact'}`}>
        <div className="results-header">
          <h2>Calculating...</h2>
          <p className="results-subtitle">Processing your scenario</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className={`results-panel ${detailedView ? 'detailed' : 'compact'}`}>
        <div className="results-header">
          <h2>Ready to calculate</h2>
          <p className="results-subtitle">Select a template or adjust parameters</p>
        </div>
        <div className="key-metrics">
          <div className="metric-card">
            <div className="metric-value">—</div>
            <div className="metric-label">5-Year Value</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">—</div>
            <div className="metric-label">Payback</div>
          </div>
          {detailedView && (
            <>
              <div className="metric-card">
                <div className="metric-value">—</div>
                <div className="metric-label">5-Year NPV</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">—</div>
                <div className="metric-label">5-Year ROI</div>
              </div>
            </>
          )}
        </div>
        <div className="view-toggle">
          <button className="view-toggle-btn" onClick={onToggleView}>
            {detailedView ? '← Compact View' : 'Explore Details →'}
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => `£${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  // Prepare chart data with better formatting
  const costOverTimeData = results.yearly.map((yr, index) => ({
    year: `Year ${index + 1}`,
    baseline: Math.round(yr.baseline_cost),
    ai: Math.round(yr.ai_cost),
    savings: Math.round(yr.ops_savings)
  }));

  // Fix minutes funnel data - ensure we have valid data
  const firstYear = results.yearly[0];
  const minutesFunnelData = firstYear ? [
    { 
      name: 'Baseline Minutes', 
      value: Math.round(firstYear.baseline_minutes),
      color: '#6B7280'
    },
    { 
      name: 'Automated Minutes', 
      value: Math.round(firstYear.automated_minutes),
      color: '#10B981'
    },
    { 
      name: 'Human Minutes', 
      value: Math.round(firstYear.human_minutes),
      color: '#F59E0B'
    },
    { 
      name: 'Handoff Minutes', 
      value: Math.round(firstYear.handoff_minutes),
      color: '#EF4444'
    }
  ].filter(item => item.value > 0) : [];

  // Fix tornado data - ensure we have valid data and limit to top 5
  const tornadoData = results.tornado
    .slice(0, 5)
    .map(([driver, impact]) => ({
      driver: driver.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      impact: Math.abs(Math.round(impact))
    }))
    .filter(item => item.impact > 0);

  return (
    <div className={`results-panel ${detailedView ? 'detailed' : 'compact'}`}>
      <div className="results-header">
        <h2>{detailedView ? 'Voice AI Impact Analysis' : 'ROI Summary'}</h2>
        <p className="results-subtitle">
          {detailedView ? 'Comprehensive financial analysis' : 'Key metrics at a glance'}
        </p>
      </div>

      {/* Key Metrics - Client-focused */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(results.yearly.reduce((sum, yr) => sum + yr.total_value, 0))}</div>
          <div className="metric-label">Total Value (5 Years)</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">
            {results.payback_months ? `${results.payback_months.toFixed(1)}m` : '—'}
          </div>
          <div className="metric-label">Payback Period</div>
        </div>
        
        {detailedView && (
          <>
            <div className="metric-card">
              <div className="metric-value">{formatCurrency(results.npv_5y)}</div>
              <div className="metric-label">5-Year NPV</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatPercent(results.roi_5y * 100)}</div>
              <div className="metric-label">5-Year ROI</div>
            </div>
          </>
        )}
      </div>

      <div className="view-toggle">
        <button className="view-toggle-btn" onClick={onToggleView}>
          {detailedView ? '← Compact View' : 'Explore Details →'}
        </button>
      </div>

      {/* Detailed Content */}
      <div className="detailed-content">
        <div className="charts-grid">
          <div className="chart-container">
            <h4>💰 Cost Evolution Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costOverTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tickFormatter={(value) => `£${(value/1000).toFixed(0)}k`}
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#374151', fontWeight: 600 }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  name="Baseline Cost"
                  dot={{ fill: '#6B7280', r: 4 }}
                  activeDot={{ r: 6, stroke: '#6B7280', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ai" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  name="AI Cost"
                  dot={{ fill: '#4F46E5', r: 4 }}
                  activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Net Savings"
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {minutesFunnelData.length > 0 && (
            <div className="chart-container">
              <h4>⚙️ Operating Impact (Year 1)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={minutesFunnelData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" strokeOpacity={0.3} />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} 
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={140} 
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} mins`, '']}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#4F46E5"
                    radius={[0, 4, 4, 0]}
                    stroke="#4F46E5"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {tornadoData.length > 0 && (
            <div className="chart-container">
              <h4>⚡ Risk Sensitivity</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tornadoData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" strokeOpacity={0.3} />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `£${(value/1000).toFixed(0)}k`} 
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="driver" 
                    width={140} 
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="impact" 
                    fill="#F59E0B"
                    radius={[0, 4, 4, 0]}
                    stroke="#F59E0B"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div> {/* End detailed-content */}
    </div>
  );
};

export default ResultsPanel;