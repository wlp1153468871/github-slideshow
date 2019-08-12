<template>
  <svg></svg>
</template>

<script>
let d3 = null;

export default {
  name: 'PieChart',
  props: {
    data: { type: Array, default: () => [] },
  },
  mounted() {
    d3 = window.d3; // eslint-disable-line
    this.draw();
    window.addEventListener('resize', () => {
      this.onResize();
    });
  },
  watch: {
    data(val) {
      if (val) this.draw();
    },
  },
  data() {
    return {
      hasDrawn: false,
      margin: {
        left: 32, top: 14, right: 0, bottom: 14,
      },
      color: ['#3890ff', '#e4e7ed'],
      path: undefined,
    };
  },
  computed: {
    // 元素
    el() {
      return this.$el;
    },
    // 外圆半径
    outerRadius() {
      return Math.min(
        this.width - this.margin.left,
        this.height - this.margin.top - this.margin.bottom,
      ) / 2;
    },
    // 内圆半径
    innerRadius() {
      return this.outerRadius - 8;
    },
    // 高度
    height() {
      return this.el.parentElement.clientHeight;
    },
    // 宽度
    width() {
      return this.el.parentElement.clientWidth;
    },
    // 饼图
    pie() {
      return d3.pie().value(d => d).sort(null);
    },
    // 弧度
    arc() {
      return d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);
    },
    svg() {
      return d3.select(this.el).attr('width', this.width).attr('height', this.height);
    },
    group() {
      return this.svg.append('g')
        .attr(
          'transform',
          `translate(${(this.margin.left + this.outerRadius)},
          ${this.height / 2})`,
        );
    },
  },
  methods: {
    // 绘制
    draw() {
      this.path = this.group.datum(this.data).selectAll('path')
        .data(this.pie)
        .enter()
        .append('path')
        .attr('fill', (d, i) => this.color[i])
        .attr('stroke', 'white')
        .attr('d', this.arc);

      this.hasDrawn = true;
    },
    // 重绘
    redraw() {
      this.arc.innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius);

      this.svg.attr('width', this.width)
        .attr('height', this.height);

      this.group
        .attr('transform', `translate(${this.margin.left + this.outerRadius},${this.height / 2})`);

      this.path.attr('d', this.arc);
    },
    // 大小调整
    onResize() {
      if (this.hasDrawn && this.el.parentElement.clientWidth) {
        this.redraw();
      }
    },
  },
};
</script>
