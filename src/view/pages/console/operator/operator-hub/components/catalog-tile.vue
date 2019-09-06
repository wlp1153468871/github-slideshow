<template>
  <div class="catalog-tile" :style="{ color }">
    <div class="catalog-tile-header">
      <img
        class="catalog-tile-icon"
        :src="tile.imgUrl"
        alt=""
      />
      <!--<span class="catalog-tile-badge">{{ badge }}</span>-->
    </div>
    <div class="catalog-tile-body">
      <div class="catalog-tile-title">{{ tile.name }}</div>
      <div class="catalog-tile-subtitle">provided by {{ tile.provider }}.</div>
      <div
        :style="{ maxHeight }"
        class="catalog-tile-description"
        ref="desc"
      >
        {{ tile.description }}
      </div>
      <div class="catalog-tile-footer" v-if="tile.installed">
        <i class="el-icon-success"></i>
        Installed
      </div>
    </div>
  </div>
</template>

<script>
const COMMUNITY_PROVIDER_TYPE = 'Community';
const CUSTOM_PROVIDER_TYPE = 'Custom';

export default {
  name: 'CatalogTile',

  props: {
    tile: { type: Object },
  },

  data() {
    return {
      descFullHeight: 0,
      descLineHeight: 0,
      maxHeight: 'none',
      color: '#9BA3AF',
    };
  },

  computed: {
    badge() {
      return [COMMUNITY_PROVIDER_TYPE, CUSTOM_PROVIDER_TYPE].includes(this.tile.providerType)
        ? this.tile.providerType
        : '';
    },
  },

  created() {
    this.color = this.tile.installed ? '#22C36A' : '#9BA3AF';
  },

  mounted() {
    this.$nextTick(() => {
      const ref = this.$refs.desc;
      this.descFullHeight = ref.clientHeight;
      this.descLineHeight = parseInt(
        window.getComputedStyle(ref).getPropertyValue('line-height'),
        10,
      );
      this.maxHeight = `${Math.floor(this.descFullHeight / this.descLineHeight) *
        this.descLineHeight}px`;
    });
  },
};
</script>

<style lang="scss">
.catalog-tile {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  height: 235px;
  margin: 0 15px 15px 0;
  padding: 15px;
  width: 220px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: 0.3s;
  cursor: pointer;

  &::before {
    position: absolute;
    content: '';
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    border-top: 5px solid currentColor;
    border-radius: 4px 4px 0 0;
  }

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
    transition: 0.3s;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 400;
  }

  &-icon {
    font-size: 40px;
    height: 40px;
    max-width: 80px;
    min-width: 40px;
  }

  &-badge {
    font-size: 15px;
    color: $black-light;
  }

  &-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-top: 10px;
    min-height: 0;
  }

  &-title {
    font-size: 15px;
    font-weight: 400;
    color: $black-dark;
  }

  &-subtitle {
    color: $grey-dark;
    font-size: 14px;
  }

  &-description {
    flex: 1;
    margin-top: 15px;
    overflow: hidden;
    position: relative;
    color: $black-light;

    &::after {
      background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), #fff 75%);
      bottom: 0;
      color: transparent;
      content: '.';
      position: absolute;
      right: 0;
      width: 50%;
      text-align: right;
    }
  }

  &-footer {
    color: $green;
    border-top: 1px solid #e4e7ed;
    padding: 5px 15px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
