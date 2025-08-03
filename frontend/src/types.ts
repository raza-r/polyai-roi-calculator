export interface IntentRow {
  name: string;
  volume_share: number;
  avg_minutes: number;
  containment_m0: number;
  containment_m3: number;
  handoff_minutes: number;
  revenue_per_abandon?: number;
}

export interface DealInputs {
  annual_calls: number;
  intents: IntentRow[];
  agent_cost_per_min: number;
  telco_cost_per_min: number;
  polyai_cost_per_min: number;
  acw_minutes: number;
  baseline_abandon_rate: number;
  ai_abandon_rate: number;
  business_hours_only: boolean;
  night_fraction: number;
  inflation: number;
  volume_growth: number;
  discount_rate: number;
  risk_adjustment: number;
}

export interface YearResult {
  year: number;
  baseline_minutes: number;
  automated_minutes: number;
  handoff_minutes: number;
  human_minutes: number;
  baseline_cost: number;
  ai_cost: number;
  ops_savings: number;
  revenue_retained: number;
  total_value: number;
  cumulative_value: number;
  discounted_value: number;
}

export interface Results {
  payback_months?: number;
  roi_5y: number;
  npv_5y: number;
  ops_vs_revenue_split: {
    ops_savings: number;
    revenue_retained: number;
  };
  tornado: Array<[string, number]>;
  p10_p50_p90: {
    p10: number;
    p50: number;
    p90: number;
  };
  yearly: YearResult[];
}

export type VerticalTemplate = 'retail' | 'fs' | 'telco' | 'hospitality';