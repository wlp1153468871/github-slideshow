<template>
  <div id="servicedetail">
    <div class="layout-content-header detail-header">
      <div class="header-text">服务 > 服务详情(Nginx)</div>
    </div>
    <div class="detail-title">
      <span>
        <svg class="icon icon-size">
          <use :xlink:href="`#color-icon_microsoft`"></use>
        </svg>
      </span>
      <div class="title-name">nginx-example-1</div>
      <div class="title-desc">
        应用版本:
        <div class="title-desc-name">0.10</div>
        <div class="title1">Chart 版本:</div>
        <div class="title-desc-name">2.6.0</div>
        <div class="title1">创建时间:</div>
        <div class="title-desc-name">2020-05-26 10:23:34</div>
      </div>
    </div>
    <el-tabs v-model="activeName" style="position:relative;">
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
      <el-tab-pane label="项目组" name="second">
        <dao-input
          search
          placeholder="搜索">
        </dao-input>
        <span style="float: right;">
          <el-button size="mini" style="margin-left: 10px;">
            <span>
              <svg class="icon">
                <use :xlink:href="`#icon_cw`"></use>
              </svg>
            </span>
          </el-button>
        </span>
        <div style="margin-top: 20px;">
          <el-table
            style="width: 100%; height: 420px;"
            :data="tableData"
          >
            <el-table-column label="项目组名" prop="groupName"></el-table-column>
            <el-table-column label="项目组唯一标识符" prop="groupUnique"></el-table-column>
            <el-table-column label="租户名" prop="tenantName"></el-table-column>
            <el-table-column label="租户唯一标识符" prop="tenantUnique"></el-table-column>
            <el-table-column label="添加日期" prop="date"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="实例" name="thrid">
        <dao-input
          search
          placeholder="搜索">
        </dao-input>
        <span style="float: right;">
          <el-button size="mini" style="margin-left: 10px;">
            <span>
              <svg class="icon">
                <use :xlink:href="`#icon_cw`"></use>
              </svg>
            </span>
          </el-button>
        </span>
        <div style="margin-top: 20px;">
          <el-table
            style="width: 100%; height: 420px;"
            :data="tableData1"
          >
            <el-table-column label="实例名" prop="exampleName"></el-table-column>
            <el-table-column label="Chart 版本" prop="chartType" width="100"></el-table-column>
            <el-table-column label="应用版本" prop="applyName" width="100"></el-table-column>
            <el-table-column label="租户/项目组" prop="tenant"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <svg class="icon" style="color: #25D473">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>{{ scope.row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" prop="creator"></el-table-column>
            <el-table-column label="创建日期" prop="date"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
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
      tableData: [
        {
          groupName: '数据应用',
          groupUnique: 'data-app',
          tenantName: '大数据团队',
          tenantUnique: 'bigdata',
          date: '2020-5-23',
        },
      ],
      tableData1: [
        {
          exampleName: 'example',
          chartType: '1.9.1',
          applyName: '0.25.0',
          tenant: 'demo/demo',
          state: '运行中',
          creator: 'User01',
          date: '2020-5-23 12:34',
        },
      ],
    };
  },
};
</script>

<style lang="scss" src="./detail.scss"></style>
