<template>
  <div class="operator-hub-subscribe">
    <breadcrumb
      :links="[
        { text: 'OperatorHub', route: { name: 'console.operator-hub' } },
        { text: 'Operator Subscription' },
      ]"
    ></breadcrumb>

    <h1>Create Operator Subscription</h1>

    <p class="d-help-text">
      Install your Operator by subscribing to one of the update channels
      to keep the Operator up to date. The strategy determines either manual or automatic updates.
    </p>

    <div class="d-pane__body">
      <div class="row">
        <div class="col-xs-6">
          <div class="form-group">
            <label class="co-required">Installation Mode</label>
            <el-radio
              :disabled='!supportsGlobal'
              v-model="selectedInstallMode"
              :label="InstallModeType.InstallModeTypeAllNamespaces"
            >
              All namespaces on the cluster(default)
            </el-radio>
            <p class="text-muted">{{ descFor(InstallModeType.InstallModeTypeAllNamespaces) }}</p>

            <el-radio
              :disabled="!supportsSingle"
              v-model="selectedInstallMode"
              :label="InstallModeType.InstallModeTypeOwnNamespace"
            >
              A specific namespace on the cluster
            </el-radio>
            <p class="text-muted">{{ descFor(InstallModeType.InstallModeTypeOwnNamespace) }}</p>

            <el-select
              v-if="selectedInstallMode === InstallModeType.InstallModeTypeOwnNamespace"
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

          <div class="form-group">
            <el-tooltip
              content="The channel to track and receive the updates from."
              placement="top"
            >
              <label class="co-required">Update Channel</label>
            </el-tooltip>

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
          </div>

          <div class="form-group">
            <el-tooltip
              content="The strategy to determine either manual or automatic updates."
              placement="top"
            >
              <label class="co-required">Approval Strategy</label>
            </el-tooltip>

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
          </div>

        </div>
        <div class="col-xs-6">
          <div class="d-clusterserviceversion-logo">
            d-clusterserviceversion-logo
          </div>
          <h4>Provided APIs</h4>
          <div class="co-crd-card-row">
            co-crd-card-row
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
