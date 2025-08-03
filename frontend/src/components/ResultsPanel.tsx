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

  // Prepare chart data
  const costOverTimeData = results.yearly.map(yr => ({
    year: `Year ${yr.year}`,
    baseline: yr.baseline_cost,
    ai: yr.ai_cost,
    savings: yr.ops_savings
  }));

  const minutesFunnelData = results.yearly[0] ? [
    { name: 'Baseline Minutes', value: results.yearly[0].baseline_minutes },
    { name: 'Automated Minutes', value: results.yearly[0].automated_minutes },
    { name: 'Human Minutes', value: results.yearly[0].human_minutes },
    { name: 'Handoff Minutes', value: results.yearly[0].handoff_minutes }
  ] : [];

  const tornadoData = results.tornado.map(([driver, impact]) => ({
    driver: driver.replace(/_/g, ' '),
    impact: Math.abs(impact)
  }));

  return (
    <div className={`results-panel ${detailedView ? 'detailed' : 'compact'}`}>
      <div className="results-header">
        <h2>{detailedView ? 'Voice AI Impact Analysis' : 'Your ROI Summary'}</h2>
        <p className="results-subtitle">
          {detailedView ? 'Comprehensive financial analysis' : 'Key metrics at a glance'}
        </p>
      </div>

      {/* Key Metrics - Responsive to View Mode */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(results.yearly.reduce((sum, yr) => sum + yr.total_value, 0))}</div>
          <div className="metric-label">5-Year Value</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">
            {results.payback_months ? `${results.payback_months.toFixed(1)}` : '∞'}
          </div>
          <div className="metric-label">Payback (Mo)</div>
        </div>
        
        {detailedView && (
          <>
            <div className="metric-card">
              <div className="metric-value">{formatCurrency(results.npv_5y)}</div>
              <div className="metric-label">5-Year NPV</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-value">{formatPercent(results.roi_5y)}</div>
              <div className="metric-label">5-Year ROI</div>
            </div>
          </>
        )}
      </div>

      {/* View Toggle Button */}
      <div className="view-toggle">
        <button className="view-toggle-btn" onClick={onToggleView}>
          {detailedView ? '← Compact View' : 'Explore Details →'}
        </button>
      </div>

      {/* Detailed Content - Only shown in detailed view */}
      <div className="detailed-content">
        {/* Value Split */}
        <div className="value-split">
          <h4>Value Breakdown</h4>
          <div className="split-bars">
            <div className="split-bar ops" style={{ width: `${results.ops_vs_revenue_split.ops_savings}%` }}>
              Ops Savings: {formatPercent(results.ops_vs_revenue_split.ops_savings)}
            </div>
            <div className="split-bar revenue" style={{ width: `${results.ops_vs_revenue_split.revenue_retained}%` }}>
              Revenue Retained: {formatPercent(results.ops_vs_revenue_split.revenue_retained)}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
        <div className="chart-container">
          <h4>Cost Over Time</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={costOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `£${(value/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="baseline" stroke="#e74c3c" name="Baseline Cost" />
              <Line type="monotone" dataKey="ai" stroke="#3498db" name="AI Cost" />
              <Line type="monotone" dataKey="savings" stroke="#27ae60" name="Savings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Minutes Breakdown (Year 1)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={minutesFunnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} mins`} />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Top Sensitivity Drivers</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tornadoData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `£${(value/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="driver" width={120} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="impact" fill="#f39c12" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Scenario Analysis</h4>
          <div className="scenario-table">
            <div className="scenario-row">
              <span>P10 (Pessimistic)</span>
              <span>{formatCurrency(results.p10_p50_p90.p10)}</span>
            </div>
            <div className="scenario-row base">
              <span>P50 (Base Case)</span>
              <span>{formatCurrency(results.p10_p50_p90.p50)}</span>
            </div>
            <div className="scenario-row">
              <span>P90 (Optimistic)</span>
              <span>{formatCurrency(results.p10_p50_p90.p90)}</span>
            </div>
          </div>
        </div>
      </div>
      </div> {/* End detailed-content */}
    </div>
  );
};

export default ResultsPanel;