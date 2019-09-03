<template>
  <div :class="alertCls">
    <svg class="icon" v-if="showIcon">
      <use :xlink:href="icon"></use>
    </svg>
    <span class="dsp-alert-message">{{ message }}</span>
    <span class="dsp-alert-description">
      <slot name="description">{{ description }}</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'd-alert',

  props: {
    type: {
      type: String,
      validator: value => {
        return ['success', 'info', 'warning', 'error'].indexOf(value) !== -1;
      },
      default: 'info',
    },
    message: { type: String },
    description: { type: String },
    showIcon: { type: Boolean },
  },

  data() {
    return {
      prefixCls: 'dsp-alert',
    };
  },

  computed: {
    icon() {
      let iconType;
      switch (this.type) {
        case 'success':
          iconType = '#icon_success';
          break;
        case 'info':
          iconType = '#icon_info';
          break;
        case 'error':
          iconType = '#icon_close-circled';
          break;
        case 'warning':
          iconType = '#icon_warning';
          break;
        default:
          iconType = '#icon_info';
      }

      return iconType;
    },

    alertCls() {
      const {
        prefixCls, type, showIcon, description,
      } = this;
      return {
        [prefixCls]: true,
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-with-description`]: !!description,
        [`${prefixCls}-no-icon`]: !showIcon,
      };
    },
  },
};
</script>

<style lang="scss" src="./_alert.scss">
</style>
