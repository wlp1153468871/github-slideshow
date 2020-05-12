<template>
  <div class="daox-slier">
    <div ref="baseline" class="daox-slier-baseline" @click="onClickBaseline">
      <div class="daox-slider-connect" :style="{ width: connect + 'px' }"></div>
      <div class="daox-slider-marker blue" style="left: 0%;"></div>
      <div class="daox-slider-marker blue" style="left: 25%;"></div>
      <div class="daox-slider-marker blue" style="left: 50%;"></div>
      <div class="daox-slider-marker" style="left: 75%;"></div>
      <div class="daox-slider-marker" style="left: 100%;"></div>
    </div>
    <div
      ref="handle"
      class="daox-slider-handle"
      :style="{ left: connect + 'px' }"
      @mousedown.prevent="mouseSlidingOn"
    ></div>
  </div>
</template>

<script>
import { throttle } from 'lodash';
import draggable from 'vuedraggable';

const THROTTLE_DELAY = 0;

export default {
  name: 'DaoSlider',
  components: {
    draggable,
  },
  props: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 },
    step: { type: Number, default: 10 },
  },
  data() {
    return {
      onHanderDrag: null,
      percent: [''],
      isMouseSliding: false,
      connect: 0,
    };
  },
  computed: {
    connectWidth() {
      return `${this.connect} px`;
    },
  },
  methods: {
    onHanderDrop() {
      this.mouseSlidingOff();
    },

    mouseSlidingOn() {
      this.isMouseSliding = true;
      this.$onHanderDrag = throttle(this.onClickBaseline.bind(this), THROTTLE_DELAY);
      window.addEventListener('mousemove', this.$onHanderDrag);
      window.addEventListener('mouseup', this.onHanderDrop);
    },

    mouseSlidingOff() {
      this.isMouseSliding = false;
      window.removeEventListener('mousemove', this.$onHanderDrag);
      window.removeEventListener('mouseup', this.onHanderDrop);
      this.$onHanderDrag = null;
    },

    onClickBaseline(event) {
      const baseline = this.$refs.baseline.getBoundingClientRect();
      const handle = this.$refs.handle.getBoundingClientRect();
      const offset = event.x - baseline.x;
      let connect = offset - (handle.width / 2);
      if (connect < 0) connect = 0;
      if (baseline.width < connect) connect = baseline.width;
      this.connect = connect;
    },
  },
};
</script>

<style lang="scss">
.daox-slier {
  $slider-height: 4px;
  $dot-height: 16px;
  $marker-height: 8px;
  position: relative;
  width: 100%;

  .daox-slier-baseline {
    height: $slider-height;
    background-color: #e4e7ed;
    .daox-slider-connect {
      width: 0;
      height: 100%;
      background-color: #79b4ff;
    }
    .daox-slider-marker {
      position: absolute;
      top: -($marker-height - $slider-height) / 2;
      width: $marker-height;
      height: $marker-height;
      background: #fff;
      // border: 2px solid #3890FF;
      border: 2px solid #ccd1d9;
      border-radius: 50%;

      &.blue {
        border: 2px solid #3890ff;
      }
    }
  }

  .daox-slider-handle {
    position: absolute;
    top: -($dot-height - $slider-height) / 2;
    width: $dot-height;
    height: $dot-height;
    background: #fff;
    border: 3px solid #3890ff;
    border-radius: 50%;
  }
}
</style>
