<template>
  <div></div>
</template>

<script>
let d3 = null;
export default {
  name: 'PercentCircle',
  props: {
    data: { type: Number, default: 50 },
  },
  mounted() {
    d3 = window.d3; // eslint-disable-line
    this.draw();
    window.addEventListener('resize', () => {
      this.onResize();
    });
  },
  data() {
    return {
      hasDrawn: false,
      margin: {
        left: 32,
        top: 14,
        right: 0,
        bottom: 14,
      },
      bgCircle: undefined,
      fillCircle: undefined,
    };
  },
  computed: {
    el() {
      return this.$el;
    },
    width() {
      return this.el.parentElement.clientWidth;
    },
    height() {
      return this.el.parentElement.clientHeight;
    },
    r() {
      return (
        Math.min(
          this.width - this.margin.left,
          this.height - this.margin.top - this.margin.bottom,
        ) / 2
      );
    },
    circumference() {
      return Math.PI * this.r * 2;
    },
    svg() {
      return d3.select(this.el).append('svg').attr('width', this.width).attr('height', this.height);
    },
  },
  watch: {
    data(val) {
      if (val) this.draw();
    },
  },
  methods: {
    draw() {
      this.bgCircle = this.svg
        .append('circle')
        .attr('fill', 'none')
        .attr('cx', this.margin.left + this.r)
        .attr('cy', this.height / 2)
        .attr('r', this.r)
        .attr('stroke-width', 12)
        .attr('stroke', '#e4e7ed');

      this.fillCircle = this.svg
        .append('circle')
        .attr('fill', 'none')
        .attr('cx', this.margin.left + this.r)
        .attr('cy', this.height / 2)
        .attr('r', this.r)
        .attr('stroke-width', 12)
        .attr('stroke', '#3890ff')
        .style('stroke-linecap', 'round')
        .style('stroke-dasharray', this.circumference)
        .style('stroke-dashoffset', `${(1 - this.data) * this.circumference}px`)
        .style('transform', 'rotate(-90deg)')
        .style('transform-origin', `${this.margin.left + this.r}px ${this.height / 2}px`);

      this.hasDrawn = true;
    },
    redraw() {
      this.svg.attr('width', this.width).attr('height', this.height);

      this.bgCircle
        .attr('cx', this.margin.left + this.r)
        .attr('cy', this.height / 2)
        .attr('r', this.r);

      this.fillCircle
        .attr('cx', this.margin.left + this.r)
        .attr('cy', this.height / 2)
        .attr('r', this.r)
        .style('stroke-dasharray', this.circumference)
        .style('stroke-dashoffset', `${(1 - this.data) * this.circumference}px`);
    },
    onResize() {
      if (this.hasDrawn && this.el.parentElement.clientWidth) {
        this.redraw();
      }
    },
  },
};
</script>
