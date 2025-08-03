import React from 'react';
import type { Results, DealInputs } from '../types';

interface ResultsPanelProps {
  results: Results | null;
  inputs: DealInputs | null;
  loading: boolean;
  detailedView: boolean;
  onToggleView: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, inputs, loading, detailedView, onToggleView }) => {
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

  return (
    <div className={`results-panel ${detailedView ? 'detailed' : 'compact'}`}>
      <div className="results-header">
        <h2>{detailedView ? 'Voice AI Impact Analysis' : 'ROI Summary'}</h2>
        <p className="results-subtitle">
          {detailedView ? 'Comprehensive financial analysis' : 'Key metrics at a glance'}
        </p>
      </div>

      {/* Key Metrics - Executive-focused */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(results.yearly.reduce((sum, yr) => sum + yr.total_value, 0))}</div>
          <div className="metric-label">5-Year Business Value</div>
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
              <div className="metric-label">Net Present Value</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatPercent(results.roi_5y * 100)}</div>
              <div className="metric-label">Return on Investment</div>
            </div>
          </>
        )}
      </div>

      {/* Operational Insights - Calculated from Inputs */}
      {detailedView && inputs && (
        <div className="operational-insights">
          <h4>🎯 Key Operational Benefits</h4>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">👥</div>
              <div className="insight-content">
                <h5>Agent Productivity</h5>
                <div className="insight-metrics">
                  <div className="metric-row">
                    <span>Hours saved per agent/month:</span>
                    <span className="metric-value">{Math.round((results.yearly[0].automated_minutes / 60) / 12).toLocaleString()}</span>
                  </div>
                  <div className="metric-row">
                    <span>Focus on complex work:</span>
                    <span className="metric-value">{formatPercent((results.yearly[0].human_minutes / results.yearly[0].baseline_minutes) * 100)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="insight-card">
              <div className="insight-icon">🕒</div>
              <div className="insight-content">
                <h5>24/7 Availability</h5>
                <div className="insight-metrics">
                  <div className="metric-row">
                    <span>After-hours coverage:</span>
                    <span className="metric-value">{inputs.business_hours_only ? 'No' : '24/7'}</span>
                  </div>
                  <div className="metric-row">
                    <span>Revenue protection:</span>
                    <span className="metric-value">{formatCurrency(results.yearly[0].revenue_retained)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Story - When Available */}
      {detailedView && results && results.roi_5y > 0.5 && (
        <div className="success-story">
          <h4>🏆 Similar Success Stories</h4>
          <div className="story-content">
            <p>Companies like yours are achieving similar results with PolyAI:</p>
            <ul>
              <li><strong>Atos:</strong> 187% ROI on labor cost savings, 30% call reduction</li>
              <li><strong>Côte Brasserie:</strong> 76% booking conversion, £250k after-hours revenue</li>
              <li><strong>PG&E:</strong> 22% CSAT increase during outages, 41% call containment</li>
            </ul>
          </div>
        </div>
      )}

      <div className="view-toggle">
        <button className="view-toggle-btn" onClick={onToggleView}>
          {detailedView ? '← Compact View' : 'Explore Details →'}
        </button>
      </div>

      {/* Detailed Content - Tables instead of charts */}
      <div className="detailed-content">
        <div className="tables-grid">
          
          {/* Cost Evolution Table */}
          <div className="table-container cost-evolution">
            <h4>💰 Financial Impact Over Time</h4>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th className="baseline-col">Current Cost</th>
                    <th className="ai-col">With PolyAI</th>
                    <th className="savings-col">Net Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearly.map((yr, index) => (
                    <tr key={index}>
                      <td className="year-cell">Year {index + 1}</td>
                      <td className="baseline-col">{formatCurrency(yr.baseline_cost)}</td>
                      <td className="ai-col">{formatCurrency(yr.ai_cost)}</td>
                      <td className="savings-col">{formatCurrency(yr.ops_savings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operating Impact Table */}
          <div className="table-container operating-impact">
            <h4>⚙️ Operational Efficiency (Year 1)</h4>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Call Type</th>
                    <th className="minutes-col">Minutes</th>
                    <th className="percentage-col">% Automated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="category-cell">Total Call Volume</td>
                    <td className="minutes-col">{Math.round(results.yearly[0].baseline_minutes).toLocaleString()}</td>
                    <td className="percentage-col">100%</td>
                  </tr>
                  <tr>
                    <td className="category-cell">Fully Automated</td>
                    <td className="minutes-col">{Math.round(results.yearly[0].automated_minutes).toLocaleString()}</td>
                    <td className="percentage-col">{formatPercent((results.yearly[0].automated_minutes / results.yearly[0].baseline_minutes) * 100)}</td>
                  </tr>
                  <tr>
                    <td className="category-cell">Agent Handled</td>
                    <td className="minutes-col">{Math.round(results.yearly[0].human_minutes).toLocaleString()}</td>
                    <td className="percentage-col">{formatPercent((results.yearly[0].human_minutes / results.yearly[0].baseline_minutes) * 100)}</td>
                  </tr>
                  <tr>
                    <td className="category-cell">Handoff Time</td>
                    <td className="minutes-col">{Math.round(results.yearly[0].handoff_minutes).toLocaleString()}</td>
                    <td className="percentage-col">{formatPercent((results.yearly[0].handoff_minutes / results.yearly[0].baseline_minutes) * 100)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Sensitivity Table */}
          <div className="table-container risk-sensitivity">
            <h4>⚡ Key Value Drivers</h4>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Business Factor</th>
                    <th className="impact-col">NPV Impact</th>
                    <th className="rank-col">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {results.tornado.slice(0, 5).map(([driver, impact], index) => (
                    <tr key={index}>
                      <td className="driver-cell">{driver.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                      <td className="impact-col">{formatCurrency(Math.abs(impact))}</td>
                      <td className="rank-col">#{index + 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div> {/* End detailed-content */}
    </div>
  );
};

export default ResultsPanel;