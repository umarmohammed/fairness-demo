export interface Metrics {
  performance: PerformanceMetric[];
  fairness: FairnessMetric[];
}

export interface Metric {
  name: string;
}

export interface PerformanceMetric extends Metric {
  value: number;
  name: string;
}

export interface FairnessMetric extends Metric {
  value: number;
  name: string;
}
