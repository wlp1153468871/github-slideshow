<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="content">
          <div class="csp-table-container">
            <table class="csp-table-layout" v-if="pods.length">
              <thead>
                <tr>
                  <th>实例</th>
                  <th>状态</th>
                  <th width="80px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pods" :key="index">
                  <td><span>{{ item.name }}</span></td>
                  <td><span>{{ item.status }}</span></td>
                  <td><a @click="openTerminal(item.name)">控制台</a></td>
                </tr>
              </tbody>
            </table>
            <empty-state
              v-else
              title="暂无副本数">
            </empty-state>
          </div>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';
import AppService from '@/core/services/app.service';

export default {
  name: 'PodsDetailDialog',
  extends: dialog('实例'),
  props: {
    pods: { type: Array, default: () => [] },
    namespace: { type: String, default: '' },
  },
  methods: {
    openTerminal(pod) {
      AppService.openTerminal(this.namespace, pod);
    },
  },
};
</script>
