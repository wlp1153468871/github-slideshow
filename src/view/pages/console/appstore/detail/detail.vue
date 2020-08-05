<template>
  <div id="appdetail">
    <div class="layout-content-header detail-header">
      <div class="header-text">服务 > 服务详情(Nginx)</div>
    </div>
    <div class="detail-title">
      <span>
        <svg class="icon icon-size">
          <use :xlink:href="`#color-icon_nginx`"></use>
        </svg>
      </span>
      <div class="title-name">
        Nginx
      </div>
      <div class="title-desc">
        类型:
        <div class="title-desc-name">
          Service Broker
        </div>
      </div>
      <span class="dao-btn-group select-btn">
        <dao-dropdown
          trigger="click"
          :append-to-body="true"
          placement="bottom-start"
        >
          <button class="dao-btn has-icons" style="width: 98px">
            <span class="text">创建实例</span>
            <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
          </button>
          <dao-dropdown-menu slot="list" style="min-width: 120px;">
            <dao-dropdown-item style="margin-left: 10px">
              <span @click="linktoForm">表单创建</span>
            </dao-dropdown-item>
            <dao-dropdown-item style="margin-left: 10px">
              <span @click="linktoYamlForm">YAML创建</span>
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </dao-dropdown>
      </span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="position:relative;">
      <el-tab-pane label="概览" name="first">
        <div class="lay-left">
          <div class="desc">
            <div class="desc-title">
              描述
            </div>
            <div class="desc-text">
              Nginx 是一个高性能的HTTP和反向代理服务器，也是一个 IMP/POP3/SMTP 服务器，因为它的稳定性、丰富的功能集、实例配置文件和低系统资源的消耗而闻名。
            </div>
          </div>
          <div class="title1">
            nginx-ingress
          </div>
          <div class="title1-desc">
            nginx-ingress is an Ingress controller that uses Configuration.
            To use, add the kubernetes.io/ingress.class:nginx annotation to your ingress resources.
          </div>
          <div class="title1">
            nginx-ingress
          </div>
          <div class="title2-desc">
            <div class="title2-text">
              $ helm install helm-repo>/nginx-ingress
            </div>
          </div>
          <div class="title1">
            nginx-ingress
          </div>
          <div class="title1-desc">
            nginx-ingress is an Ingress controller that uses Configuration.
            To use, add the kubernetes.io/ingress.class:nginx annotation to your ingress resources.
          </div>
        </div>
        <div class="lay-right">
          <div class="right-type">
            版本:
          </div>
          <dao-select
            v-model="select"
            size="sm"
            class="right-select"
          >
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          <div class="right-name">名称</div>
          <div class="right-desc">nginx-ingress</div>
          <div class="right-name">Chart 版本</div>
          <div class="right-desc">0.25.0</div>
          <div class="right-name">分类</div>
          <div class="right-desc">网络</div>
          <div class="right-name">供应商</div>
          <div class="right-desc">社区</div>
          <div class="right-name">帮助链接</div>
          <div class="right-link">http://nginx.org/en/docs/</div>
          <div class="right-name">帮官网链接</div>
          <div class="right-link">http://nginx.org/</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="实例" name="second">实例</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'AppStoreDetail',
  data() {
    return {
      activeName: 'first',
      select: 1,
      items: [
        {
          text: '1.9.1',
          value: 1,
        },
        {
          text: '1.10.2',
          value: 2,
        },
        {
          text: '2.1.1',
          value: 3,
        },
      ],
    };
  },
  methods: {
    handleClick() {
      console.log('暂无');
    },
    linktoForm() {
      this.$router.push({ name: 'appstore.form' });
    },
    linktoYamlForm() {
      this.$router.push({ name: 'appstore.yamlform' });
    },
  },
};
</script>

<style lang="scss" src="./detail.scss" scoped></style>
