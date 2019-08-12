<template>
  <div class="error-info">
    <img src="~@/assets/images/empty.png" alt=""/>
    <p class="error-info-text">请求数据失败，请刷新重试！</p>
  </div>
</template>

<script>
export default {
  name: 'error-info',

  props: {},
};
</script>

<style lang="scss">
.error-info {
  img {
    width: 100px;
  }

  padding: 100px 0;
  text-align: center;

  .error-info-text {
    margin-top: 20px;
    font-size: 16px;
    color: #9ba3af;
  }
}
</style>
