<template>
  <div class="service-logo" :class="size">
    <div v-if="!!src" class="image-container" v-bg-image="src"></div>
    <div v-else class="default-logo">
      <svg>
        <use xlink:href="#icon_container-small"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceLogo',

  props: {
    src: { type: String, default: '' },
    size: { type: String, default: 'medium' },
  },
};
</script>

<style lang="scss">
.service-logo {
  &.medium {
    width: 54px;
    height: 54px;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  &.small {
    display: inline-block;
    margin-right: 10px;
    margin-left: 5px;
    width: 15px;
    height: 15px;
  }

  .image-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin-bottom: 7px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 2px;
  }

  .default-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #e4e7ed;
    border-radius: 2px;

    svg {
      width: 100%;
      height: 100%;
      background: #e5e7ec;
    }
  }

  svg {
    fill: #ccd1d9;
  }
}
</style>
