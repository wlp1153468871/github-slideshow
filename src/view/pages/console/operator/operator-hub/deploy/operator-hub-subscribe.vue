<template>
  <div class="operator-hub-subscribe">
    <div class="resource-header">
      <div class="d-clusterserviceversion-logo">
        <div class="d-clusterserviceversion-logo__icon">
          <img
            :src="icon"
            :alt="displayName"
          />
        </div>
        <div class="d-clusterserviceversion-logo__name">
          <breadcrumb :links="resource.links"></breadcrumb>
          <span class="d-clusterserviceversion-logo__name__provider text-muted">
            provided by {{ provider }}
          </span>
        </div>
      </div>
    </div>

    <div class="d-pane__body">
      <div class="row">
        <div class="col-lg-6">
          <div class="dao-setting-layout">
            <div class="dao-setting-layout-title">
              <div class="dao-setting-title">
                Create Operator Subscription
                <div class="helper-text">
                  Install your Operator by subscribing to one of the update channels to
                  keep the Operator up to date. The strategy determines
                  either manual or automatic updates.
                </div>
              </div>
            </div>
            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-label">
                  <label class="co-required">Installation Mode</label>
                </div>
                <div class="dao-setting-content">
                  <el-radio
                    :disabled='!supportsGlobal'
                    v-model="selectedInstallMode"
                    :label="InstallModeType.InstallModeTypeAllNamespaces"
                  >
                    All namespaces on the cluster(default)
                    <label-tip
                      :text="descFor(InstallModeType.InstallModeTypeAllNamespaces)"
                    ></label-tip>
                  </el-radio>

                  <el-radio
                    :disabled="!supportsSingle"
                    v-model="selectedInstallMode"
                    :label="InstallModeType.InstallModeTypeOwnNamespace"
                  >
                    A specific namespace on the cluster
                    <label-tip
                      :text="descFor(InstallModeType.InstallModeTypeOwnNamespace)"
                    ></label-tip>
                  </el-radio>
                </div>
              </div>
            </div>

            <div
              class="dao-setting-section"
              v-if="selectedInstallMode === InstallModeType.InstallModeTypeOwnNamespace"
            >
              <div class="dao-setting-item">
                <div class="dao-setting-label">
                  <label class="co-required">Namespace</label>
                </div>
                <div class="dao-setting-content">
                  <el-select
                    size="small"
                    v-model="targetNamespace"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="ns in spaces"
                      :key="ns.id"
                      :label="ns.name"
                      :value="ns.short_name"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>

            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-label">
                  <label class="co-required">Update Channel</label>
                </div>
                <div class="dao-setting-content">
                  <el-radio-group
                    v-model="selectedUpdateChannel"
                  >
                    <el-radio
                      :key="channel.name"
                      v-for="channel in channels"
                      :label="channel.name"
                    >
                      {{channel.name}}
                    </el-radio>
                  </el-radio-group>
                  <div class="helper-text">
                    The channel to track and receive the updates from.
                  </div>
                </div>
              </div>
            </div>

            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-label">
                  <label class="co-required">
                    Approval Strategy
                  </label>
                </div>
                <div class="dao-setting-content">
                  <el-radio-group
                    v-model="selectedApproval"
                  >
                    <el-radio
                      :key="approval.title"
                      v-for="approval in approvals"
                      :label="approval.value"
                    >
                      {{approval.title}}
                    </el-radio>
                  </el-radio-group>
                  <div class="helper-text">
                    The strategy to determine either manual or automatic updates.
                  </div>
                </div>
              </div>
            </div>

            <div class="dao-setting-layout-footer" style="text-align: right;">
              <div class="dao-btn blue">保存</div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="panel-default">
            <p class="panel-header">Provided APIs</p>
            <div class="panel-content">
              <div class="d-crd-card-row">
                <article class="d-card">
                  <div class="d-card__head">
                    <p>ClickHouseInstallation</p>
                  </div>
                  <div class="d-card__body">
                    ClickHouse Installation - set of ClickHouse Clusters
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./_operator-hub-subscribe.js">
</script>

<style lang="scss" src="./_operator-hub-subscribe.scss">
</style>
