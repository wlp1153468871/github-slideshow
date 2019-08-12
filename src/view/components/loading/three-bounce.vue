<template>
  <div class="spinner">
    <div class="bounce one"></div>
    <div class="bounce two"></div>
    <div class="bounce three"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingThreeBounce',
};
</script>

<style lang="scss">
@-webkit-keyframes bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0.0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes bouncedelay {
  0%, 80%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  }
  40% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}

.spinner {
  margin: 0 auto;
  text-align: center;

  .bounce {
    width: 6px;
    height: 6px;
    display: inline-block;
    margin: 0 4px 4px;
    background-color: #d1d1d1;
    border-radius: 100%;
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;

    &.one {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }

    &.two {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }
  }
}
</style>
