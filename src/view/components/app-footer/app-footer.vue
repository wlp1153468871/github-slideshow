<template>
  <footer class="app-footer">
    <inner-footer></inner-footer>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style lang="scss">
.app-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  svg {
    height: 70px;
  }
}
</style>
