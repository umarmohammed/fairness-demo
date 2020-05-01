export interface Metrics {
  performance: PerformanceMetric[];
}

export interface PerformanceMetric {
  value: number;
  name: string;
}
