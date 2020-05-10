import {
  Component,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { formatLabel, escapeLabel } from '@swimlane/ngx-charts';

@Component({
  selector: 'g[ngx-charts-custom-bubble-series]',
  template: `
    <svg:g *ngFor="let circle of circles; trackBy: trackBy">
      <svg:g
        fai-bubble-circle
        [circle]="circle"
        [tooltipDisabled]="tooltipDisabled"
        [tooltipTemplate]="tooltipTemplate"
        [xAxisLabel]="xAxisLabel"
        [yAxisLabel]="yAxisLabel"
        (select)="onClick($event)"
        (activate)="activateCircle($event)"
        (deactivate)="deactivateCircle($event)"
      ></svg:g>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0)',
        }),
        animate(250, style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class CustomBubbleSeriesComponent implements OnChanges {
  @Input() data;
  @Input() xScale;
  @Input() yScale;
  @Input() rScale;
  @Input() xScaleType;
  @Input() yScaleType;
  @Input() colors;
  @Input() visibleValue;
  @Input() activeEntries: any[];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  areaPath: any;
  circles: any[];

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.circles = this.getCircles();
  }

  getCircles(): any[] {
    return this.data.series
      .map((d, i) => {
        if (typeof d.y !== 'undefined' && typeof d.x !== 'undefined') {
          const y = d.y;
          const x = d.x;
          const r = d.r;

          const radius = this.rScale(r || 1);
          const tooltipLabel = formatLabel(d.name);

          const cx =
            this.xScaleType === 'linear'
              ? this.xScale(Number(x))
              : this.xScale(x);
          const cy =
            this.yScaleType === 'linear'
              ? this.yScale(Number(y))
              : this.yScale(y);

          const color =
            this.colors.scaleType === 'linear'
              ? this.colors.getColor(r)
              : this.colors.getColor(d.seriesName);

          const isActive = !this.activeEntries.length
            ? true
            : this.isActive({ name: d.seriesName });
          const opacity = isActive ? 1 : 0.3;

          const data = Object.assign({}, d, {
            series: d.seriesName,
            name: d.name,
            value: d.y,
            x: d.x,
            radius: d.r,
          });

          return {
            data,
            x,
            y,
            r,
            classNames: [`circle-data-${i}`],
            value: y,
            label: x,
            cx,
            cy,
            radius,
            tooltipLabel,
            color,
            opacity,
            seriesName: d.seriesName,
            isActive,
            transform: `translate(${cx},${cy})`,
          };
        }
      })
      .filter((circle) => circle !== undefined);
  }

  onClick(data): void {
    this.select.emit(data);
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find((d) => {
      return entry.name === d.name;
    });
    return item !== undefined;
  }

  isVisible(circle): boolean {
    if (this.activeEntries.length > 0) {
      return this.isActive({ name: circle.seriesName });
    }

    return circle.opacity !== 0;
  }

  activateCircle(circle): void {
    circle.barVisible = true;
    this.activate.emit({ name: this.data.name });
  }

  deactivateCircle(circle): void {
    circle.barVisible = false;
    this.deactivate.emit({ name: this.data.name });
  }

  trackBy(index, circle): string {
    return `${circle.data.name}`;
  }
}
