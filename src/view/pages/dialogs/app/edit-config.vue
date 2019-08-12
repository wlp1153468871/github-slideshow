<template>
  <dao-property-dialog
    title="修改应用"
    :visible.sync="visible"
    :current-tab.sync="currentTab"
    :status="status"
    :is-saving="loadings.updating"
    @confirm="onConfirm"
    @cancel="onCancel">
    <dao-tab :current-tab.sync="currentTab">
      <dao-tab-item :heading="APP_CONFIG_TYPE.IMAGE">
        <image-info
          :ref="APP_CONFIG_TYPE.IMAGE"
          :repository="app.imagename"
          :tag="image.tag"
          :tags="tags"
          :is-loading="isLoadingImage">
        </image-info>
      </dao-tab-item>
      <dao-tab-item :heading="APP_CONFIG_TYPE.LB">
        <load-balance
          :ref="APP_CONFIG_TYPE.LB"
          :host="host"
          :port="app.containerport">
        </load-balance>
      </dao-tab-item>
      <dao-tab-item :heading="APP_CONFIG_TYPE.ENVS">
        <dao-setting-layout>
          <environment
            :configMaps="configMaps"
            :secrets="secrets"
            :ref="APP_CONFIG_TYPE.ENVS"
            :envs="app.envs">
          </environment>
        </dao-setting-layout>
      </dao-tab-item>
      <dao-tab-item :heading="APP_CONFIG_TYPE.MOUNT_FILE">
        <dao-setting-layout>
          <mount-file
            :configMaps="configMaps"
            :secrets="secrets"
            :ref="APP_CONFIG_TYPE.MOUNT_FILE"
            :config-files="configFiles">
          </mount-file>
        </dao-setting-layout>
      </dao-tab-item>
      <dao-tab-item :heading="APP_CONFIG_TYPE.CMD">
        <cmd
          :ref="APP_CONFIG_TYPE.CMD"
          :containercmd="app.containercmd"
          :containerparams="app.containerparams">
        </cmd>
      </dao-tab-item>
      <dao-tab-item :heading="APP_CONFIG_TYPE.VOLUME">
        <volume
          :ref="APP_CONFIG_TYPE.VOLUME"
          :all-volumes="allVolumes"
          :volumes="app.volumes">
        </volume>
      </dao-tab-item>
    </dao-tab>
  </dao-property-dialog>
</template>

<script>
import { isEmpty } from 'lodash';
import { APP_CONFIG_TYPE } from '@/core/constants/app';
import AppService from '@/core/services/app.service';
import ConfigMapService from '@/core/services/config.service';
import AppFactory from '@/core/models/app.factory';
import dialog from '@/view/mixins/dialog';
// sections
import ImageInfo from './sections/image-info';
import LoadBalance from './sections/load-balance';
import Environment from './sections/environment';
import MountFile from './sections/mount-file';
import Volume from './sections/volume';
import Cmd from './sections/cmd';

export default {
  name: 'EditConfigDialog',

  extends: dialog(),

  props: {
    instanceId: { type: String, default: '' },
    tab: { type: String, default: '版本' },
    app: { type: Object, default: () => ({}) },
    tags: { type: Array, default: () => [] },
    isLoadingImage: { type: Boolean, default: false },
    allVolumes: { type: Array, default: () => [] },
    host: { type: String, default: '' },
  },

  components: {
    ImageInfo,
    LoadBalance,
    Environment,
    MountFile,
    Volume,
    Cmd,
  },

  data() {
    return {
      APP_CONFIG_TYPE,
      currentTab: '',
      status: {
        message: '',
        type: '',
        tab: '',
      },
      loadings: {
        updating: false,
      },
      configMaps: [],
      secrets: [],
    };
  },

  computed: {
    configFiles() {
      return this.app.configFiles || [];
    },

    image() {
      return this.app.image || {};
    },
  },

  watch: {
    tab: {
      immediate: true,
      handler(tab) {
        if (tab) {
          this.currentTab = tab;
        }
      },
    },
  },

  created() {
    this.ensureConfigs().then(res => {
      this.loadConfig(res);
    });
  },

  methods: {
    onConfirm() {
      const status = this.onValidate();
      if (status.type === 'error') {
        this.status = status;
        return;
      }

      const app = this.mergePartialModel();
      app.deployments = this.app.deployments;
      let infos = AppFactory.toInfo(app);
      infos = infos.map(x => ({ id: x.name, value: x.value }));
      this.loadings.updating = true;
      AppService.updateAppParameters(this.instanceId, infos)
        .then(() => {
          this.$noty.success('修改应用成功');
          this.$emit('on-updated');
          this.onClose();
        })
        .finally(() => {
          this.loadings.updating = false;
        });
    },

    onValidate() {
      const { IMAGE, LB, ENVS } = APP_CONFIG_TYPE;
      let tab = IMAGE;
      let type = '';
      // eslint-disable-next-line
      for (const item of [IMAGE, LB, ENVS]) {
        if (!this.$refs[item].validate()) {
          type = 'error';
          tab = item;
          break;
        }
      }
      return {
        type,
        tab,
        message: `"${tab}"校验错误, 点击前往修复`,
      };
    },

    mergePartialModel(app = {}) {
      const {
        IMAGE, LB, ENVS, MOUNT_FILE, VOLUME,
      } = APP_CONFIG_TYPE;

      [IMAGE, LB, ENVS, MOUNT_FILE, VOLUME].forEach(tab => {
        const ref = this.$refs[tab];
        Object.assign(app, ref.providePartialModel());
      });

      return app;
    },

    dialogWillClose() {
      this.status.type = '';
      this.status.message = '';
    },

    ensureConfigs() {
      return new Promise((resolve, reject) => {
        const { platformService } = this.$store.getters;
        if (!isEmpty(platformService)) {
          const { configMap, secret } = platformService;
          resolve([configMap, secret]);
        } else {
          this.$store.watch(
            () => this.$store.getters.platformService,
            res => {
              if (!isEmpty(res)) {
                const { configMap, secret } = res;
                resolve([configMap, secret]);
              } else {
                reject();
              }
            },
          );
        }
      });
    },

    async loadConfig(configs = []) {
      const requests = configs.map(c => {
        const {
          services: [{ id }],
        } = c;
        if (id) return ConfigMapService.listConfigMaps(id);
        return null;
      });
      const [configMaps, secrets] = await Promise.all(requests);
      this.configMaps = configMaps || [];
      this.secrets = secrets || [];
    },
  },
};
</script>
