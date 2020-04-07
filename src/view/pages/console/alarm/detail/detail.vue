<template>
  <div id="alarm-detail">
    <!--<circle-loading v-if="!rule"></circle-loading>-->
    <template>
      <resource-header :resource="resource">
        <template #action-buttons>
          <dao-dropdown
            trigger="click"
            :append-to-body="true"
            placement="bottom-end">
            <button class="dao-btn ghost has-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>
            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                id="remove"
                @click="onRemove"
                :disabled="loadings.submitRemove"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red">
                <span>删除</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                @click="onConfirm"
                :disabled="loadings.submitUpdate">
                <span>修改</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
        </template>
      </resource-header>
      <div class="btn-group">
        <button
          class="dao-btn has-icon blue"
          id="confirmed"
          @click="onConfirm"
          :disabled="loadings.submitUpdate">
          <svg class="icon icon-edit">
            <use xlink:href="#icon_pencil-edit"></use>
          </svg>
          <span class="text">确认修改</span>
        </button>
      </div>
      <div class="card-wrapper">
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>规则详情</span>
              <button
                class="dao-btn mini blue"
                type="text"
                @click="onClickDetail"
                v-show="!detail.changeView"
              >编辑</button>
            </div>
          </template>
          <div class="row">
            <label for="">名称</label>
            <div class="content">{{ rule.name }}</div>
          </div>
          <div class="row">
            <label for="">告警内容</label>
            <div class="content">
              <span v-if="!detail.changeView">
                {{ rule.description || '-' }}
              </span>
              <dao-input
                v-else
                block
                icon-inside
                v-model.trim="detail.description"
                name="desc"
                placeholder="请输入"
                class="desc-input"
                data-vv-as="告警内容"
                v-validate="'required|max:255'"
                :message="veeErrors.first('desc')"
                :status="veeErrors.has('desc') ? 'error' : ''">
                >
              </dao-input>
            </div>
          </div>
          <div class="row">
            <label for="">阈值</label>
            <div class="content multi-content">
              <span v-if="!detail.changeView">
                {{ rule.threshold ? rule.threshold.join('') : '' }}
              </span>
              <template v-else>
                <el-select
                  v-model="detail.threshold[0]"
                  size="small"
                  class="atomSelector"
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
                  v-model.trim="detail.threshold[1]"
                  name="threshold"
                  class="atomSelector"
                  placeholder="请输入"
                  data-vv-as="阈值"
                  v-validate="'required|numeric'"
                  :message="veeErrors.first('threshold')"
                  :status="veeErrors.has('threshold') ? 'error' : ''">
                  >
                </dao-input>
              </template>
            </div>
          </div>
          <div class="row">
            <label for="">持续时间</label>
            <div class="content multi-content">
              <span v-if="!detail.changeView">
                {{ rule.for ? rule.for.join('') : '' }}
              </span>
              <template v-else>
                <dao-input
                  block
                  icon-inside
                  v-model.trim="detail.for[0]"
                  name="duration"
                  class="atomSelector"
                  placeholder="请输入"
                  data-vv-as="持续时间"
                  v-validate="'required|numeric'"
                  :message="veeErrors.first('duration')"
                  :status="veeErrors.has('duration') ? 'error' : ''">
                  >
                </dao-input>
                <el-select
                  v-model="detail.for[1]"
                  size="small"
                  class="atomSelector"
                >
                  <el-option
                    v-for="f in rulesStatic.for"
                    :key="f"
                    :label="f"
                    :value="f">
                  </el-option>
                </el-select>
              </template>
            </div>
          </div>
          <div class="row">
            <label for=""></label>
            <div class="content"></div>
          </div>
        </el-card>
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>作用范围</span>
              <button
                class="dao-btn mini blue"
                type="text"
                @click="onClickScope"
                v-show="!scope.changeView"
              >编辑</button>
            </div>
          </template>
          <div class="row">
            <label for="">类型</label>
            <div class="content" v-if="rule.ruleType && subScope">
              {{ rule.ruleType | alarmScope }}/{{ subScope }}
            </div>
            <div class="content" v-else></div>
          </div>
          <div class="row">
            <label for="">实例</label>
            <div class="content">
              <template v-if="!scope.changeView">
                <el-table
                  :data="cViewScope"
                >
                  <el-table-column
                    prop="name"
                    label="实例名"
                  >
                  </el-table-column>
                </el-table>
              </template>
              <template v-else>
                <dao-switch
                  v-model="scope.monitorAll"
                  size="sm"
                >
                </dao-switch>
                <instances-table
                  v-show="!scope.monitorAll"
                  :originInstances="scope.instances"
                  ref="instanceTable"
                  v-loading="loadings.instances"
                >
                </instances-table>
              </template>

            </div>
          </div>
        </el-card>
        <el-card class="card">
          <template #header>
            <span>规则指标</span>
          </template>
          <div class="row">
            <label for="">指标名</label>
            <div class="content">{{ metric.name }}</div>
          </div>
          <div class="row">
            <label for="">默认告警内容</label>
            <div class="content">{{ metric.description }}</div>
          </div>
          <div class="row">
            <label for="">默认阈值</label>
            <div class="content">{{ metric.threshold ? metric.threshold.join('') : '' }}</div>
          </div>
          <div class="row">
            <label for="">默认时长</label>
            <div class="content">{{ metric.for ? metric.for.join('') : '' }}</div>
          </div>
        </el-card>
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span>收件人</span>
              <button
                class="dao-btn mini blue"
                @click="onClickEmail"
                v-show="!email.changeView"
              >添加</button>
            </div>
          </template>
          <el-table
            :data="cViewReceivers"
            v-if="!email.changeView"
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
          </el-table>
          <email-table
            v-else
            :originInstances="email.receivers"
            ref="emailTable"
            v-loading="loadings.receivers"
          ></email-table>
        </el-card>
      </div>
    </template>

  </div>
</template>
<script src="./detail.js"></script>
<style scoped lang="scss">
  @import './detail';
</style>
