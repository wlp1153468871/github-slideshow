<template>
  <div class="logo-placeholder" :class="size">
    <div class="default-logo">
      <svg>
        <use xlink:href="#icon_container-small"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoPlaceholder',
  props: {
    size: { type: String, default: '' },
  },
};
</script>

<style lang="scss">
.logo-placeholder {
  &.radius {
    .default-logo {
      border-radius: 8px;
      &.medium {
        border-radius: 4px;
      }
    }
  }
  &.logo {
    .default-logo {
      display: inline-block;
      width: 100px;
      height: 100px;
      text-align: center;
      background-color: #e4e7ed;
      border-radius: 8px;
      svg {
        width: 64px;
        height: 64px;
        margin: 18px auto;
        margin-top: 15px;

        fill: #ccd1d9;
      }
    }
  }
  &.large {
    .default-logo {
      display: inline-block;
      width: 100%;
      height: 100%;
      text-align: center;
      background-color: #e4e7ed;
      border-radius: 2px;
    }
  }
  .default-logo {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    background-color: #e4e7ed;
    border-radius: 4px;
    svg {
      width: 64px;
      height: 64px;
      margin: 18px auto;

      fill: #ccd1d9;
      // margin-top: 1px;
    }
  }
  &.medium {
    .default-logo {
      width: 50px;
      height: 50px;
      border-radius: 2px;
    }
    svg {
      width: 32px;
      height: 32px;
      margin: 9px auto;

      fill: #ccd1d9;
    }
  }
  &.large-logo {
    .default-logo {
      position: absolute;
      width: 85px;
      height: 85px;
      border-radius: 10px;
      svg {
        width: 85px;
        height: 85px;
        margin-top: 1px;
      }
    }
  }
}
</style>
