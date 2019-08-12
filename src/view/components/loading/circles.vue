<template>
  <div class="loader">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<script>
export default {
  name: 'CircleLoading',
};
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 50%;
  left: 40%;
  margin-left: 10%;
  transform: translate3d(-50%, -50%, 0);
  animation: show-loading 1s forwards;
  opacity: 0;
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

.dot {
  width: 20px;
  height: 20px;
  background: #cfd8dc;
  border-radius: 100%;
  display: inline-block;
  animation: slide 1s infinite;
  & + .dot {
    margin-left: 10px;
  }
}
.dot:nth-child(1) {
  animation-delay: 0.1s;
  background: #cfd8dc;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #b0bec5;
}
.dot:nth-child(3) {
  animation-delay: 0.3s;
  background: #90a4ae;
}
.dot:nth-child(4) {
  animation-delay: 0.4s;
  background: #78909c;
}
.dot:nth-child(5) {
  animation-delay: 0.5s;
  background: #607d8b;
}
@keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
