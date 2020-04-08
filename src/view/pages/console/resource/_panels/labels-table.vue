<template>
  <dao-setting-layout>
    <template slot="layout-title">{{ dialogTitle }}</template>
    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">
          {{ dialogTitle }}
        </template>
        <template slot="content">
          <div class="csp-table-container">
            <table class="csp-table-layout">
              <thead>
              <tr>
                <th>键</th>
                <th>值
                  <svg
                    class="icon"
                    @click="isCipherText = false"
                    v-show="isCipherText && isSecret">
                    <use xlink:href="#icon_eye-slash"></use>
                  </svg>
                  <svg
                    class="icon"
                    @click="isCipherText = true"
                    v-show="!isCipherText && isSecret">
                    <use xlink:href="#icon_eye"></use>
                  </svg>
                </th>
              </tr>
              </thead>
              <tbody v-if="!isDateEmpty">
              <tr v-for="(item, index) in data" :key="index">
                <td>{{ index }}</td>
                <td>{{ isCipherText && isSecret ? '******' : item }}</td>
              </tr>
              </tbody>
            </table>
            <empty-state v-if="isDateEmpty"></empty-state>
            <div slot="footer" style="margin-top: 10px;">
              <button
                class="dao-btn blue"
                @click="openEditDialog()">
                编辑
              </button>
            </div>
          </div>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <edit-labels-dialog
      :dialog-title="dialogTitle"
      :visible="dialogConfigs.editLabel.visible"
      :data="currentData"
      @edit="edit"
      @close="dialogConfigs.editLabel.visible = false">
    </edit-labels-dialog>

    <edit-data-dialog
      :data="currentContentData"
      @result="updateContentData"
      @check="setCheck"
      @edit="edit"
      :visible="dialogConfigs.editdata.visible"
      @close="dialogConfigs.editdata.visible = false">
    </edit-data-dialog>
  </dao-setting-layout>
</template>

<script>
import { map, fromPairs, isEmpty, forOwn } from 'lodash';
import { CONFIG_TITLE_TYPE } from '@/core/constants/constants';
import editLabelsDialog from '@/view/pages/dialogs/config/edit-label';
import editDataDialog from '@/view/pages/dialogs/config/edit-data';

export default {
  name: 'labelsTable',
  components: {
    editLabelsDialog,
    editDataDialog,
  },

  props: {
    dialogTitle: { type: String, default: CONFIG_TITLE_TYPE.LABEL },
    data: { type: Object, default: () => ({}) },
    validator: { type: Object, default: () => ({}) },
    isSecret: { type: Boolean, default: false },
  },

  data() {
    return {
      CONFIG_TITLE_TYPE,
      currentData: {}, // 根据用户编辑的字段设置当前 data
      currentContentData: [],
      dialogConfigs: {
        editLabel: { visible: false },
        editdata: { visible: false },
      },
      // 提交的参数
      params: {},
      check: false,
      // 是否密文显示，默认密文显示
      isCipherText: true,
    };
  },

  computed: {
    // dialog 是否为“编辑标签”
    isData() {
      return this.dialogTitle === CONFIG_TITLE_TYPE.DATA;
    },

    isDateEmpty() {
      return isEmpty(this.data);
    },
  },

  methods: {
    edit(params) {
      this.$emit('edit', params);
    },

    openEditDialog() {
      if (this.isData) {
        this.dialogConfigs.editdata.visible = true;
      } else {
        this.dialogConfigs.editLabel.visible = true;
      }
      this.currentData = this.data;
      const data = [];
      if (this.dialogTitle === CONFIG_TITLE_TYPE.DATA) {
        forOwn(this.data, (value, key) => {
          data.push({ key, value });
        });
        this.currentContentData = data;
      }
    },

    updateContentData(keyValueData) {
      const pairs = map(keyValueData, pair => [pair.key, pair.value]);
      this.params.data = fromPairs(pairs);
    },

    // 设置当前内容是否可以保存
    setCheck(check) {
      this.check = check;
    },
  },
};
</script>
