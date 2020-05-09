export interface Metrics {
  threshold: number;
  performance: { [key: string]: PerformanceMetric[] };
  fairness: FairnessMetric[];
  dfPlot: any[];
}

export interface FairModelMetrics {
  performance: { [key: string]: PerformanceMetric[] };
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

export function fairnessMetricForDisplay(metric: FairnessMetric) {
  function thresholdsToLineRange(thresholds: number[]) {
    return {
      name: 'Fair',
      series: [
        {
          name: 'foo',
          max: thresholds[0],
          value: thresholds[1],
          min: thresholds[2],
        },
        {
          name: 'bar',
          max: thresholds[0],
          value: thresholds[1],
          min: thresholds[2],
        },
      ],
    };
  }

  function thresholdsToLineSeries() {
    return metric.thresholds.length === 1
      ? {
          name: 'Fair',
          series: [
            {
              name: 'foo',
              value: metric.thresholds[0],
            },
            {
              name: 'bar',
              value: metric.thresholds[0],
            },
          ],
        }
      : thresholdsToLineRange(metric.thresholds);
  }

  return {
    ...metric,
    lineSeries: [thresholdsToLineSeries()],
  };
}
