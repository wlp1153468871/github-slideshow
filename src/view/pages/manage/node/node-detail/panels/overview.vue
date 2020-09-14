<template>
    <div class="overview-page">
        <!-- 资源分配情况 -->
        <!-- <div class="dao-setting-layout">
            <div class="dao-setting-layout-title">
              <div class="dao-setting-title capitalize">资源分配情况</div>
            </div>
            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-content">
                  <table class="dao-table row">
                    <tbody> -->
                      <!-- CPU 分配情况 -->
                      <!-- <tr>
                        <td style="width: 200px;">CPU 分配情况</td>
                        <td class="fix-line-height pt-sm pb-sm">
                          <div>
                            {{ `已占用 ${cpuDistribution.used} 核，共 ${node.status.pods} 核（其中 ${cpuDistribution.systemUse} 核为系统占用）`}}
                          </div>
                          <div class="dao-progress fixed-progress node-progress">
                            <div
                              class="dao-progress-other"
                              :style="{width: cpuDistribution.precent.systemUse+'%'}"
                              v-dao-tooltip="{content:'系统占用'}"
                            ></div>
                            <div
                              class="dao-progress-basic"
                              :style="{width: cpuDistribution.precent.otherUse+'%'}"
                              v-dao-tooltip="'应用占用'"
                            ></div>
                            <div class="dao-progress-rest"></div>
                          </div>
                        </td>
                      </tr> -->

                      <!-- 内存分配情况 -->
                      <!-- <tr>
                        <td>内存分配情况</td>
                        <td class="fix-line-height pt-sm pb-sm">
                          <div>
                            {{ `已占用 ${memoryDistribution.used} G，共 ${memoryDistribution.all} G（其中 ${memoryDistribution.systemUse} G为系统占用）`}}
                          </div>
                          <div class="dao-progress fixed-progress node-progress">
                            <div
                              class="dao-progress-other"
                              :style="{width: memoryDistribution.precent.systemUse+'%'}"
                              v-dao-tooltip="{content: '系统占用'}"
                            ></div>
                            <div
                              class="dao-progress-basic"
                              :style="{width: memoryDistribution.precent.otherUse+'%'}"
                              v-dao-tooltip="{content:'应用占用'}"
                            ></div>
                            <div class="dao-progress-rest"></div>
                          </div>
                        </td>
                      </tr> -->

                      <!-- 容器组分配情况 -->
                      <!-- <tr>
                        <td>容器组分配情况</td>
                        <td class="fix-line-height pt-sm pb-sm">
                          <div>
                            {{ `已占用 ${nonTerminatedPods.length} 个，共 ${node.status.allocatable.pods} 个`}}
                          </div>
                          <div class="dao-progress fixed-progress node-progress">
                            <div
                              class="dao-progress-basic"
                              :style="{width: podDistribution + '%'}"
                              v-dao-tooltip="{content:'容器组占用'}"
                            ></div>
                            <div class="dao-progress-rest"></div>
                          </div>
                        </td>
                      </tr> -->
                    <!-- </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div> -->
        <!-- 标签 -->
        <div class="dao-setting-layout">
            <div class="dao-setting-layout-title">
              <div class="dao-setting-title capitalize">标签</div>
            </div>
            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-content" v-if="node.metadata.labels">
                  <table class="dao-table row">
                    <thead>
                      <tr>
                        <th>键</th>
                        <th>值</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(label, value, index) in node.metadata.labels" :key='index'>
                        <td>{{ value }}</td>
                        <td>{{ label ? label : nullValue}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="dao-setting-content" v-if="!node.metadata.labels">未设置</div>
              </div>
            </div>
        </div>
          <!-- 注解 -->
        <div class="dao-setting-layout">
            <div class="dao-setting-layout-title">
              <div class="dao-setting-title capitalize">注解</div>
            </div>
            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-content" v-if="node.metadata.annotations">
                  <table class="dao-table row">
                    <thead>
                      <tr>
                        <th>键</th>
                        <th>值</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(label, value, index) in node.metadata.annotations" :key='index'>
                        <td>{{ value }}</td>
                        <td>{{ label ? label : nullValue }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="dao-setting-content" v-if="!node.metadata.labels">未设置</div>
              </div>
            </div>
        </div>
          <!-- 现状 -->
        <div class="dao-setting-layout kubernetes-now">
            <div class="dao-setting-layout-title">
              <div class="dao-setting-title capitalize">kubernetes 现状</div>
            </div>
            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-content scrollable-table">
                  <table class="dao-table row">
                    <thead>
                      <tr>
                        <th>类型</th>
                        <th>状态</th>
                        <th>最近心跳时间</th>
                        <th>最近变化时间</th>
                        <th>原因</th>
                        <th>消息</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(condition,index) in sortConditions(node.status.conditions)"
                        :key='index'
                        :class="{'condition-warning': !checkCondition(condition)}"
                      >
                        <td>
                          <el-tooltip class="item" effect="dark" :content='statusType[condition.type] || condition.type' placement="top">
                            <span>{{ condition.type }}</span>
                          </el-tooltip>
                        </td>
                        <td>{{ condition.status }}</td>
                        <td>{{ fromNow(condition.lastHeartbeatTime) }}</td>
                        <td>{{ fromNow(condition.lastTransitionTime) }}</td>
                        <td>{{ condition.reason }}</td>
                        <td>{{ condition.message }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="dao-setting-content" v-if="!node.metadata.labels">未设置</div>
              </div>
            </div>
        </div>

    </div>
</template>
<script>
import dayjs from 'dayjs';

export default {
  props: {
    node: { type: Object, default: () => {} },
  },
  data() {
    return {
      nullValue: '<空>',
      statusType: {
        OutOfDisk: '磁盘空间满',
        MemoryPressure: '内存压力',
        DiskPressure: '磁盘压力',
        Ready: '就绪',
        DCEReady: 'DCE 就绪',
        StorageDriver: '存储驱动',
        InsecureRegistries: 'HTTP 访问镜像仓库',
        TimeSynchronized: '时间同步',
        DCEEngineNotReady: 'DCE 引擎未就绪',
        TimeNotSynchronized: '时间不同步',
        PIDPressure: 'PID 压力',
        NetworkUnavailable: '网络不可用',
      },
    };
  },
  methods: {
    sortConditions(conditions) {
      return _.sortBy(conditions, [
        condition => {
          if (condition.type === 'Ready') {
            switch (condition.status) {
              case 'True':
                return 3;
              case 'False':
                return 1;
              default:
                return 2;
            }
          }
          switch (condition.status) {
            case 'True':
              return 1;
            case 'False':
              return 3;
            default:
              return 2;
          }
        },
      ]);
    },
    checkCondition(condition) {
      if (condition.type === 'Ready') {
        switch (condition.status) {
          case 'True':
            return true;
          case 'False':
            return false;
          default:
            return false;
        }
      }
      switch (condition.status) {
        case 'True':
          return false;
        case 'False':
          return true;
        default:
          return false;
      }
    },
    fromNow(data) {
      return dayjs(data).fromNow();
    },
  },
};
</script>
<style scoped>
.dao-setting-section{
  overflow-x: auto;
}
</style>
