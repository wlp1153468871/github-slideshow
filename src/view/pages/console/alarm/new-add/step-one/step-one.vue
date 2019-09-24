<template>
  <div id="alarm-new-add-step-one" class="container">
    <div>
      <section>
        <div class="table-toolbar-right search-atom-container title-line">
          <label for="">规则</label>
          <dao-input
            search
            v-model.trim="searchRulesKey"
            :disabled="loadings.rules"
            placeholder="搜索指标名"
            @change="onSearch"
            class="search-atom"
          >
          </dao-input>
        </div>
        <el-table
          :data="currentRules"
          v-loading="loadings.rules"
          @selection-change="onChooseRules"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="ruleName"
            label="规则名"
            v-slot="{ row, $index }"
          >
            <dao-input
              block
              icon-inside
              v-model.trim="row.ruleName"
              :name="`ruleName-${$index}`"
              placeholder="请输入"
              :disabled="!row.choosed"
              data-vv-as="规则名"
              v-validate="row.choosed ? 'required|max:50' : false"
              :message="row.choosed ? veeErrors.first(`ruleName-${$index}`) : ''"
              :status="veeErrors.has(`ruleName-${$index}`) && row.choosed ? 'error' : ''">
            >
            </dao-input>
          </el-table-column>
          <el-table-column
            prop="name"
            label="指标名"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="告警内容"
            v-slot="{ row, $index }"
          >
            <dao-input
              block
              icon-inside
              v-model.trim="row.description"
              :name="`desc-${$index}`"
              placeholder="请输入"
              :disabled="!row.choosed"
              data-vv-as="告警内容"
              v-validate="row.choosed ? 'required|max:255' : false"
              :message="row.choosed ? veeErrors.first(`desc-${$index}`) : ''"
              :status="veeErrors.has(`desc-${$index}`) ? 'error' : ''">
              >
            </dao-input>
          </el-table-column>
          <el-table-column
            prop="threshold"
            label="阈值"
            v-slot="{ row, $index }"
          >
            <el-select
              v-model="row.threshold[0]"
              size="small"
              class="atomSelector"
              :disabled="!row.choosed"
            >
              <el-option
                v-for="ts in rulesStatic.threshold"
                :key="ts"
                :label="ts | threshold"
                :value="ts">
              </el-option>
            </el-select>
            <dao-input
              block
              icon-inside
              v-model.trim="row.threshold[1]"
              :name="`threshold-${$index}`"
              class="atomSelector"
              placeholder="请输入"
              :disabled="!row.choosed"
              data-vv-as="阈值"
              v-validate="row.choosed ? 'required|numeric' : false"
              :message="row.choosed ? veeErrors.first(`threshold-${$index}`) : ''"
              :status="veeErrors.has(`threshold-${$index}`) ? 'error' : ''"
             >
            </dao-input>
          </el-table-column>
          <el-table-column
            prop="for"
            label="持续时间"
            v-slot="{ row, $index }"
          >
            <dao-input
              block
              icon-inside
              v-model.trim="row.for[0]"
              :name="`duration-${$index}`"
              class="atomSelector"
              placeholder="请输入"
              :disabled="!row.choosed"
              data-vv-as="持续时间"
              v-validate="'required|numeric'"
              :message="row.choosed ? veeErrors.first(`duration-${$index}`) : ''"
              :status="veeErrors.has(`duration-${$index}`) ? 'error' : ''">
              >
            </dao-input>
            <el-select
              v-model="row.for[1]"
              size="small"
              class="atomSelector"
              :disabled="!row.choosed"
            >
              <el-option
                v-for="f in rulesStatic.for"
                :key="f"
                :label="f"
                :value="f">
              </el-option>
            </el-select>
          </el-table-column>
        </el-table>
      </section>

      <section class="receiver">
        <div class="title-line">
          <label for="">收件人</label>
        </div>
        <el-table
          :data="chooseReceiverInfo"
          v-loading="loadings.receivers"
        >
          <el-table-column
            prop="username"
            label="用户名"
          >
          </el-table-column>
          <el-table-column
            prop="email"
            label="用户邮箱"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            v-slot="{ row }"
          >
            <button
              @click="onDeleteReceiver(row.email)"
              class="dao-btn mini red btn-sm"
              type="text"
            >删除</button>
          </el-table-column>
        </el-table>
        <button
          class="dao-btn blue addReceiverBtn"
          @click="onAddReceiver"
        >
          增加收件人
        </button>
      </section>

      <section>
        <div class="title-line">
          <label for="">监控全部实例</label>
        </div>
        <dao-switch
          v-model="instancesMonitor.monitorAll"
          size="sm"
        >
        </dao-switch>
        <instances-table
          v-show="!instancesMonitor.monitorAll"
          :originInstances="instancesMonitor.instances"
          ref="instanceTable"
          v-loading="loadings.instances"
        >
        </instances-table>
      </section>
    </div>
    <dao-dialog
      header="选择收件人"
      :visible.sync="receiverDialogOn"
      @confirm="onConfirmReceivers"
      @closed="onCloseReceivers"
    >
      <el-form
        class="receiver-dialog"
      >
        <el-form-item
          label="收件人"
        >
          <el-select
            filterable
            v-model="receiverCandidates"
            value-key="email"
            multiple
            collapse-tags
            placeholder="输入或选择邮箱"
          >
            <el-option
              v-for="ri in unChooseReceiverInfo"
              :label="ri.email"
              :key="ri.email"
              :value="ri"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </dao-dialog>
  </div>
</template>
<script src="./step-one.js"></script>
<style lang="scss">
  @import './step-one';
</style>
