<template>
  <div class="space-card">
    <div class="space-card-top">
      <a
        class="big"
        href="javascript:void(0)"
        :title="space.short_name"
        @click="gotoSpace()">
        {{ space.name }}
      </a>
      <p>{{ space.description }}</p>
    </div>
    <div class="space-card-bottom">
      {{ space.created_at | unix_date }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpaceCard',
  props: {
    space: { type: Object, default: () => ({}) },
  },
  methods: {
    gotoSpace() {
      this.$emit('goto', this.space);
    },
  },
};
</script>

<style lang="scss">
.space-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // width: 300px;
  height: 180px;
  padding: 21px 20px 16px;
  background-color: #fff;
  border: solid 1px #e4e7ed;
  border-top: 5px solid #9ba3af;
  border-radius: 4px;

  .space-card-top {
    color: #9ba3af;
    word-wrap: break-word;
    .big {
      color: #3d444f;
      font-size: 18px;
      font-weight: 500;
      list-style: 1.2;
    }
    p {
      font-size: 14px;
      line-height: 1.4;
    }
  }
  .space-card-bottom {
    font-size: 14px;
  }
}
</style>
