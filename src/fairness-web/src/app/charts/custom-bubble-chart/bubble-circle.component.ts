import {
  Component,
  Input,
  Output,
  TemplateRef,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { formatLabel, escapeLabel } from '@swimlane/ngx-charts';
import { select } from 'd3-selection';

@Component({
  selector: 'g[fai-bubble-circle]',
  template: `
    <svg:g
      ngx-charts-circle
      class="circle bubble-circle"
      [cx]="0"
      [cy]="0"
      [r]="circle.radius"
      [style.opacity]="circle.opacity"
      [class.active]="circle.isActive"
      [pointerEvents]="'all'"
      [data]="circle.value"
      [classNames]="circle.classNames"
      (select)="onClick(circle.data)"
      (activate)="activateCircle(circle)"
      (deactivate)="deactivateCircle(circle)"
      ngx-tooltip
      [tooltipDisabled]="tooltipDisabled"
      [tooltipPlacement]="'top'"
      [tooltipType]="'tooltip'"
      [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(circle)"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipContext]="circle.data"
    />
  `,
})
export class BubbleCircleComponent implements OnChanges {
  @Input() circle: any;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  element: any;

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.update();
  }

  update() {
    const node = select(this.element).select('.bubble-circle');

    node
      .transition()
      .duration(500)
      .attr('transform', this.circle.transform)
      .attr('fill', this.circle.color);
  }

  onClick(data): void {
    this.select.emit(data);
  }

  activateCircle(circle): void {
    this.activate.emit(circle);
  }

  deactivateCircle(circle): void {
    this.deactivate.emit(circle);
  }

  getTooltipText(circle): string {
    const hasRadius = typeof circle.r !== 'undefined';
    const hasTooltipLabel = circle.tooltipLabel && circle.tooltipLabel.length;
    const hasSeriesName = circle.seriesName && circle.seriesName.length;

    const radiusValue = hasRadius ? formatLabel(circle.r) : '';
    const xAxisLabel =
      this.xAxisLabel && this.xAxisLabel !== '' ? `${this.xAxisLabel}:` : '';
    const yAxisLabel =
      this.yAxisLabel && this.yAxisLabel !== '' ? `${this.yAxisLabel}:` : '';
    const x = formatLabel(circle.x);
    const y = formatLabel(circle.y);
    const name =
      hasSeriesName && hasTooltipLabel
        ? `${circle.seriesName} • ${circle.tooltipLabel}`
        : circle.seriesName + circle.tooltipLabel;
    const tooltipTitle =
      hasSeriesName || hasTooltipLabel
        ? `<span class="tooltip-label">${escapeLabel(name)}</span>`
        : '';

    return `
      ${tooltipTitle}
      <span class="tooltip-label">
        <label>${escapeLabel(xAxisLabel)}</label> ${escapeLabel(x)}<br />
        <label>${escapeLabel(yAxisLabel)}</label> ${escapeLabel(y)}
      </span>
      <span class="tooltip-val">
        ${escapeLabel(radiusValue)}
      </span>
    `;
  }
}
