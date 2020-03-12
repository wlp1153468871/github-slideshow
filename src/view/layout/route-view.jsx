export default {
  render() {
    const {
      $route: { meta },
    } = this;
    const inKeep = (
      <keep-alive>
        <router-view />
      </keep-alive>
    );
    const notKeep = <router-view />;
    if (!meta.keepAlive) {
      return notKeep;
    }
    return meta.keepAlive ? inKeep : notKeep;
  },
};
