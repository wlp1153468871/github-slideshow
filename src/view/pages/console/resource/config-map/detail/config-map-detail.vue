<template>
  <div>
    <circle-loading v-if="loadings.configMap"></circle-loading>
    <template v-if="!loadings.configMap">

      <resource-header :resource="resource">
        <template #creationTime>
          创建于{{ configMap.metadata.creationTimestamp | date }}
        </template>
        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{'状态': '审批中'}"></labels>
        </template>

        <template #labels>
          <labels :labels="configMap.metadata.labels || {}"></labels>
        </template>
      </resource-header>

      <dao-tab class="dao-header-tab-nav">
        <!-- 概览 -->
        <dao-tab-item :heading="TABS.OVERVIEW">
          <div class="dao-view-main">
            <div class="dao-view-content">
              <labels-table
                :data="data"
                :dialog-title="CONFIG_TITLE_TYPE.DATA"
                @edit="editData">
              </labels-table>

              <labels-table
                :data="labels"
                :dialog-title="CONFIG_TITLE_TYPE.LABEL"
                @edit="editLabel">
              </labels-table>

              <labels-table
                :data="annotations"
                :dialog-title="CONFIG_TITLE_TYPE.ANNOTATIONS"
                @edit="editAnnotations">
              </labels-table>
            </div>
          </div>
        </dao-tab-item>

        <!-- 操作记录 -->
        <dao-tab-item :heading="TABS.EVENT">
          <div class="dao-view-main">
            <div class="dao-view-content">
              <event-panel :jobs="events" v-if="events.length"></event-panel>
              <empty-state v-else></empty-state>
            </div>
          </div>
        </dao-tab-item>

        <!-- 高级设置 -->
        <dao-tab-item :heading="TABS.SENIOR" v-if="$can('delete')">
          <div class="dao-view-main">
            <div class="dao-view-content">
              <senior-panel
                :instance="configMap"
                @delete="deleteConfigMap">
              </senior-panel>
            </div>
          </div>
        </dao-tab-item>
      </dao-tab>
    </template>
  </div>
</template>

<script src="./_config-map-detail.js">
</script>
