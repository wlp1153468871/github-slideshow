<template>
  <div class="page-tags">
    <circle-loading v-if="loadings.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource">
        <template #description>
          <span class="description">镜像扫描结果：</span>
          <scan-status v-if="isScan" :status="tag.scan_overview | scan_overview_status">
          </scan-status>
          <span v-else class="description">未扫描</span>
        </template>
      </resource-header>
      <div class="tag-content">
        <h3>基本信息</h3>
        <div class="row">
          <div class="col-md-4">
            <span class="detail-label">作者:</span>
            <span class="detail-content">{{ tag.author || '暂无' }}</span>
          </div>
          <div class="col-md-4">
            <span class="detail-label">架构:</span>
            <span class="detail-content">{{ tag.architecture || '暂无' }}</span>
          </div>
          <div class="col-md-4">
            <span class="detail-label">操作系统:</span>
            <span class="detail-content">{{ tag.os || '暂无' }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <span class="detail-label">系统版本:</span>
            <span class="detail-content">{{ tag['os.version'] || '暂无' }}</span>
          </div>
          <div class="col-md-4">
            <span class="detail-label">Docker版本:</span>
            <span class="detail-content">{{ tag.docker_version || '暂无' }}</span>
          </div>
          <div class="col-md-4">
            <span class="detail-label">扫描完成时间:</span>
            <span class="detail-content" v-if="scanOverview">{{
              scanOverview.update_time | date
            }}</span>
            <span class="detail-content" v-else>暂无</span>
          </div>
        </div>
        <h3 class="title">详细信息</h3>
        <template v-if="isScan && summary.length > 0">
          <div v-for="(item, index) in summary" :key="index">
            <p v-if="item.severity === 5">
              <svg class="icon" style="color: #d52218;">
                <use xlink:href="#icon_info-line"></use>
              </svg>
              <span class="count">{{ item.count }}</span>
              <span class="content">组件存在严重漏洞</span>
            </p>
            <p v-if="item.severity === 4">
              <svg class="icon" style="color: #f7b32b;">
                <use xlink:href="#icon_warning-line"></use>
              </svg>
              <span class="count">{{ item.count }}</span>
              <span class="content">组件存在中等漏洞</span>
            </p>
            <p v-if="item.severity === 3">
              <svg class="icon" style="color: #f0dbb1;">
                <use xlink:href="#icon_warning-line"></use>
              </svg>
              <span class="count">{{ item.count }}</span>
              <span class="content">组件存在较低漏洞</span>
            </p>
            <p v-if="item.severity === 2">
              <svg class="icon" style="color: #3d444f;">
                <use xlink:href="#icon_question-mark"></use>
              </svg>
              <span class="count">{{ item.count }}</span>
              <span class="content">组件存在未知漏洞</span>
            </p>
            <p v-if="item.severity === 1">
              <svg class="icon" style="color: #25d475;">
                <use xlink:href="#icon_success-line"></use>
              </svg>
              <span class="count">{{ item.count }}</span>
              <span class="content">组件没有漏洞</span>
            </p>
          </div>
        </template>
        <template v-else>
          <p>
            <svg class="icon" style="color: #d52218;">
              <use xlink:href="#icon_info-line"></use>
            </svg>
            <span class="count">0</span>
            <span class="content">组件存在严重漏洞</span>
          </p>
          <p>
            <svg class="icon" style="color: #f7b32b;">
              <use xlink:href="#icon_warning-line"></use>
            </svg>
            <span class="count">0</span>
            <span class="content">组件存在中等漏洞</span>
          </p>
          <p>
            <svg class="icon" style="color: #f0dbb1;">
              <use xlink:href="#icon_warning-line"></use>
            </svg>
            <span class="count">0</span>
            <span class="content">组件存在较低漏洞</span>
          </p>
          <p>
            <svg class="icon" style="color: #3d444f;">
              <use xlink:href="#icon_question-mark"></use>
            </svg>
            <span class="count">0</span>
            <span class="content">组件存在未知漏洞</span>
          </p>
          <p>
            <svg class="icon" style="color: #25d475;">
              <use xlink:href="#icon_success-line"></use>
            </svg>
            <span class="count">0</span>
            <span class="content">组件没有漏洞</span>
          </p>
        </template>
        <h3 class="title">漏洞列表</h3>
        <div class="row loopholeList">
          <div class="col-md-12">
            <el-table :data="details">
              <el-table-column type="expand">
                <template slot-scope="{ row: detail }">
                  <span>{{ detail.description }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="缺陷编号" sortable> </el-table-column>
              <el-table-column prop="severity" label="等级">
                <template slot-scope="{ row: detail }">
                  <scan-status :status="detail | scan_overview_status"></scan-status>
                </template>
              </el-table-column>
              <el-table-column prop="package" sortable label="组件"> </el-table-column>
              <el-table-column sortable prop="version" label="当前版本"> </el-table-column>
              <el-table-column sortable prop="fixedVersion" label="修复版本"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { has, get as getValue } from 'lodash';
import RegistryService from '@/core/services/registry.service';
import ScanStatus from '@/view/components/scan-overview-status/scan-status';

export default {
  name: 'RegistryTag',
  components: { ScanStatus },
  computed: {
    ...mapState(['space', 'zone']),
    isScan() {
      return has(this.tag, 'scan_overview');
    },
    scanOverview() {
      return getValue(this.tag, 'scan_overview');
    },
    summary() {
      return getValue(this.tag, 'scan_overview.components.summary', []);
    },
  },
  data() {
    const { tagName, repositoryName: registryName } = this.$route.params;
    return {
      resource: {
        logo: '#icon_image-logo',
        links: [
          {
            text: '镜像仓库',
            route: { name: 'console.registry' },
          },
          { text: `${registryName}:${tagName}` },
        ],
      },
      registryName,
      tagName,
      tag: {},
      details: [],
      loadings: {
        page: false,
        table: false,
      },
    };
  },

  created() {
    this.getTag();
    this.getTagDetails();
  },

  methods: {
    getTag() {
      this.loadings.page = true;
      RegistryService.getTag(this.space.id, this.registryName, this.tagName, this.zone.id).then(
        res => {
          this.tag = res;
          this.loadings.page = false;
        },
      );
    },

    getTagDetails() {
      this.loadings.table = true;
      RegistryService.getTagDetails(
        this.space.id,
        this.registryName,
        this.tagName,
        this.zone.id,
      ).then(res => {
        this.details = res;
      });
      this.loadings.table = false;
    },
  },
};
</script>

<style lang="scss">
.page-tags {
  .tag-content {
    background: #fff;
    border-radius: 2px;
    margin: 20px;
    .col-md-4 {
      display: flex;
    }

    .detail-label {
      flex-basis: 100px;
      flex-shrink: 0;
      color: rgba(0, 0, 0, 0.85);
      text-align: right;
      line-height: 22px;
      margin-bottom: 16px;
    }

    .detail-content {
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      font-size: 14px;
      padding-left: 10px;
    }

    .loopholeList {
      padding: 0 20px 20px 20px;
    }

    .title {
      border-top: solid 1px #e8e8e8;
      margin: 10px 20px;
      padding-top: 20px;
    }

    .icon {
      margin-left: 51.3px;
      margin-right: 11.3px;
    }

    .count {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      margin-right: 21px;
    }

    .content {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  h3 {
    margin: 10px 20px;
    padding-top: 20px;
  }

  .tag-content p {
    margin: 10px;
  }
}
</style>
