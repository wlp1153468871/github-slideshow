<template>
  <div
    class="catalog-tile"
    :style="{ color }"
    @click="$emit('click', tile)"
  >
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
      color: '#9ba3af',
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
    this.color = this.tile.installed ? '#22c36a' : '#9ba3af';
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
  flex-direction: column;
  flex: 0 0 auto;
  width: 220px;
  height: 235px;
  padding: 15px;
  margin: 0 15px 15px 0;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: .3s;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    border-top: 5px solid currentColor;
    border-radius: 4px 4px 0 0;
  }

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, .1);
    transform: translateY(-5px);
    transition: .3s;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 400;
  }

  &-icon {
    min-width: 40px;
    max-width: 80px;
    height: 40px;
    font-size: 40px;
  }

  &-badge {
    color: $black-light;
    font-size: 15px;
  }

  &-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    margin-top: 10px;
  }

  &-title {
    color: $black-dark;
    font-size: 15px;
    font-weight: 400;
  }

  &-subtitle {
    color: $grey-dark;
    font-size: 14px;
  }

  &-description {
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-top: 15px;
    color: $black-light;

    &::after {
      content: ".";
      position: absolute;
      right: 0;
      bottom: 0;
      width: 50%;
      color: transparent;
      text-align: right;
      background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), #fff 75%);
    }
  }

  &-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5px 15px;
    color: $green;
    border-top: 1px solid #e4e7ed;
  }
}
</style>
