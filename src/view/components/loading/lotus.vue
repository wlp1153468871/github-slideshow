<template>
  <div class="loading">
    <div class="loading__square"></div>
    <div class="loading__square"></div>
    <div class="loading__square"></div>
    <div class="loading__square"></div>
    <div class="loading__square"></div>
    <div class="loading__square"></div>
    <div class="loading__square"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingLotus',
};
</script>

<style lang="scss" scoped>
$square: 32px;
$duration: 10s;

@keyframes square-animation {
  0% {
    top: 0;
    left: 0;
  }

  10.5% {
    top: 0;
    left: 0;
  }
  12.5% {
    top: 0;
    left: $square;
  }

  23% {
    top: 0;
    left: $square;
  }
  25% {
    top: 0;
    left: $square * 2;
  }

  35.5% {
    top: 0;
    left: $square * 2;
  }
  37.5% {
    top: $square;
    left: $square * 2;
  }

  48% {
    top: $square;
    left: $square * 2;
  }
  50% {
    top: $square;
    left: $square;
  }

  60.5% {
    top: $square;
    left: $square;
  }
  62.5% {
    top: $square * 2;
    left: $square;
  }

  73% {
    top: $square * 2;
    left: $square;
  }
  75% {
    top: $square * 2;
    left: 0;
  }

  85.5% {
    top: $square * 2;
    left: 0;
  }
  87.5% {
    top: $square;
    left: 0;
  }

  98% {
    top: $square;
    left: 0;
  }
  100% {
    top: 0;
    left: 0;
  }
}

@keyframes hue-rotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading {
  position: relative;
  width: $square * 3;
  height: $square * 3;
  transform: rotate(45deg);
  animation: hue-rotate $duration linear infinite both;
}

.loading__square {
  position: absolute;
  top: 0;
  left: 0;
  width: $square - 4px;
  height: $square - 4px;
  margin: 2px;
  background: #07a;
  background-attachment: fixed;
  background-image: linear-gradient(45deg, #fa0 40%, #0c9 60%);
  background-image: -moz-linear-gradient(#fa0, #fa0);
  background-position: center;
  background-size: cover;
  border-radius: 2px;
  animation: square-animation $duration ease-in-out infinite both;
  @for $i from 0 through 7 {
    &:nth-of-type(#{$i}) {
      animation-delay: -($duration / 7) * $i;
    }
  }
}
</style>
