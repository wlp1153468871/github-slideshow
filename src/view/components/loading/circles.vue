<template>
  <div class="loader" :class="{ 'space-loader': position==='space-view' }">
    <div class="ball-triangle-path">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CircleLoading',

  props: {
    position: { type: String, default: 'content-view' },
  },
};
</script>

<style lang="scss">
.loader {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f6;
  transition: 0.3s;
  z-index: 9;
  transform: translateX(200px);
  animation: show-loading 1s forwards;

  &.space-loader {
    z-index: 10;
    opacity: 1;
    animation: none;
    transform: translateX(0);
    background: rgba(69, 94, 107, 0.8);
    .ball-triangle-path {
      transform: translate(-29.99px, -37.51px);
    }
  }

  .ball-triangle-path {
    transform: translate(-129.99px, -37.51px);
  }
}

.collapsed {
  .loader {
    transform: translateX(-32px);
  }
}

@keyframes show-loading {
  0%,
  60% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
