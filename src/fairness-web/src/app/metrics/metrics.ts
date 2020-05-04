export interface Metrics {
  threshold: number;
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
  thresholds: number[];
}

export function fairnessMetricsForDisplay(metrics: FairnessMetric[]) {
  return metrics.map(fairnessMetricForDisplay);
}

function fairnessMetricForDisplay(metric: FairnessMetric) {
  function thresholdsToLineSeries() {
    return metric.thresholds.map((value) => ({
      name: 'Fair',
      series: [
        { name: 'foo', value },
        { name: 'bar', value },
      ],
    }));
  }

  return {
    ...metric,
    lineSeries: thresholdsToLineSeries(),
  };
}
