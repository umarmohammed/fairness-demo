export interface Metrics {
  performance: PerformanceMetric[];
  fairness: FairnessMetric[];
}

export interface PerformanceMetric {
  value: number;
  name: string;
}

export interface FairnessMetric {
  value: number;
  name: string;
}
