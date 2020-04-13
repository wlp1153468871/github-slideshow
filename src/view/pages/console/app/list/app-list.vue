<template>
  <div>
    <resource-header :resource="service"></resource-header>

    <div class="dao-view-main">
      <div class="dao-view-content">
        <x-table
          :loading="loadings.instances"
          :data="rows"
          @refresh="loadInstances"
          :filter-method="filterMethod"
          style="width: 100%;"
        >
          <template #operation>
            <dao-dropdown
              trigger="click"
              :append-to-body="true"
              v-if="$can('serviceInstance.create', 'serviceInstance')"
              placement="bottom-start"
            >
              <save-button
                :saving="loadings.updateByYaml"
                :disabled="appDeployDisabled"
                text="部署应用"
              >
                <template #icon>
                  <svg class="icon" :style="{ 'margin-left': loadings.updateByYaml ? '5px' : 0 }">
                    <use xlink:href="#icon_plus-circled"></use>
                  </svg>
                </template>
              </save-button>

              <template #list v-if="!appDeployDisabled">
                <dao-dropdown-menu>
                  <dao-dropdown-item @click="toggleYamlDialog">
                    <span>通过 YAML 部署</span>
                  </dao-dropdown-item>
                  <dao-dropdown-item @click="deployApplication">
                    <span>通过 镜像 部署</span>
                  </dao-dropdown-item>
                </dao-dropdown-menu>
              </template>
            </dao-dropdown>
          </template>
          <el-table-column prop="name" sortable label="实例">
            <template slot-scope="{ row: instances }">
              <a href="javascript:void(0)" @click="gotoDetail(instances)">
                {{ instances.name }}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="创建时间"
            sortable
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row: instances }">
              {{ instances.created_at | unix_date }}
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="创建者" sortable :show-overflow-tooltip="true">
            <template slot-scope="{ row: instances }">
              {{ instances.owner.name }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="部署状态" sortable>
            <template slot-scope="{ row: instances }">
              <x-table-status
                :row="instances"
                :other="other"
                :text="renderStatus(instances.status)"
              >
              </x-table-status>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="" align="center" header-align="center" width="56">
            <template slot-scope="{ row: instances }">
              <el-dropdown @command="handleOperate($event, instances)" trigger="click">
                <span>
                  <svg class="icon dropdown-trigger">
                    <use xlink:href="#icon_more"></use>
                  </svg>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-item-error"
                    v-if="$can('serviceInstance.delete', 'serviceInstance')"
                    icon="el-icon-delete"
                    :disabled="disableDelete(instances)"
                    command="delete"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </x-table>
      </div>
    </div>

    <error-info-dialog
      :text="selectedInstanceInfo"
      :visible="dialogConfigs.errorInfo.visible"
      @close="dialogConfigs.errorInfo.visible = false"
    >
    </error-info-dialog>
    <edit-yaml-dialog
      ref="yamlEditor"
      :value="resources"
      :visible.sync="dialogConfigs.editYaml.visible"
      @update="onCreateYaml"
      @close="dialogConfigs.editYaml.visible = false"
    >
      <template #extra>
        <dao-setting-layout id="extra-layout">
          <dao-setting-section>
            <template #label>
              <span>应用名</span>
            </template>
            <template #content>
              <dao-input
                icon-inside
                type="text"
                name="name"
                placeholder="应用名"
                v-model.trim="name"
                @blur="checkIsDuplicateName()"
                data-vv-as="应用名"
                v-validate="'required|namespace_code|dns_1035_label|min:6|max:20'"
                :message="veeErrors.first('name')"
                :status="veeErrors.has('name') ? 'error' : ''"
              >
              </dao-input>
            </template>
            <template #content-helper v-if="recommendNames.length">
              推荐应用名:
              <a @click.prevent="name = rName" v-for="rName in recommendNames" :key="rName">
                {{ rName }}
              </a>
            </template>
          </dao-setting-section>
          <dao-setting-section>
            <dao-setting-item>
              <template slot="label">
                <span>应用版本</span>
              </template>
              <template slot="content">
                <dao-input
                  icon-inside
                  type="text"
                  name="version"
                  placeholder="应用版本"
                  v-model="version"
                  v-validate="'required|namespace_code|min:2|max:20'"
                  :message="veeErrors.first('version')"
                  :status="veeErrors.has('version') ? 'error' : ''"
                  data-vv-as="应用版本"
                >
                </dao-input>
              </template>
            </dao-setting-item>
          </dao-setting-section>
        </dao-setting-layout>
      </template>
      <template #footer>
        <button class="dao-btn ghost" @click="onCloseYaml">
          取消
        </button>
        <button class="dao-btn blue" :disabled="!yamlDeployEnabled" @click="onTryConfirmYaml">
          确定
        </button>
      </template>
    </edit-yaml-dialog>
  </div>
</template>

<script src="./app-list.js"></script>
<style scoped lang="scss">
#extra-layout .dao-setting-section:last-of-type {
  border-top: 0;
}
</style>
