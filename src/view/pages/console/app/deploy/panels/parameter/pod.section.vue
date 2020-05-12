<template>
  <dao-setting-layout>
    <template slot="layout-title">容器配置</template>
    <dao-setting-section>
      <div slot="label">存活检查</div>
      <div slot="content">
        <dao-radio-group>
          <dao-radio
            v-model="livenessProbeSelect"
            v-for="(option, index) in livenessOptions"
            :key="index"
            :label="option.label"
          >
            {{ option.title }}
          </dao-radio>
        </dao-radio-group>
        <div class="dao-setting-patch pod" v-if="livenessProbeSelect !== 'none'">
          <div v-if="livenessProbeSelect === 'httpGet'">
            <dao-setting-item>
              <div slot="label">请求路径</div>
              <div slot="content">
                <dao-input
                  v-model="livenessProbe.httpGet.path"
                  icon-inside
                  name="path"
                  v-validate.immediate="'required'"
                  :message="veeErrors.first('path')"
                  :status="veeErrors.has('path') ? 'error' : ''"
                  data-vv-as="请求路径"
                  placeholder="例: /healthz"
                >
                </dao-input>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求头</div>
              <div slot="content">
                <dao-editable-table
                  class="headers"
                  :config="config"
                  v-model="livenessProbe.httpGet.httpHeaders"
                >
                </dao-editable-table>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求协议</div>
              <div slot="content">
                <dao-radio-group style="display: flex;">
                  <dao-radio
                    style="margin-right: 30px;"
                    v-model="livenessProbe.httpGet.scheme"
                    label="HTTP"
                  >
                    HTTP
                  </dao-radio>
                  <dao-radio v-model="livenessProbe.httpGet.scheme" label="HTTPS">
                    HTTPS
                  </dao-radio>
                </dao-radio-group>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求地址</div>
              <div slot="content">
                <dao-input
                  v-model="livenessProbe.httpGet.host"
                  icon-inside
                  name="address"
                  v-validate.immediate="'ip_or_fqdn'"
                  :message="veeErrors.first('address')"
                  :status="veeErrors.has('address') ? 'error' : ''"
                  data-vv-as="请求地址"
                  placeholder="默认为容器组 IP"
                >
                </dao-input>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求端口</div>
              <div slot="content">
                <dao-numeric-input
                  required
                  v-model="livenessProbe.httpGet.port"
                  type="int"
                  :min="1"
                  :max="65535"
                  placeholder="必填，且端口号必须在 1 - 65535 之间"
                >
                </dao-numeric-input>
              </div>
            </dao-setting-item>
          </div>
          <dao-setting-item v-if="livenessProbeSelect === 'exec'">
            <div slot="label">检查命令</div>
            <div slot="content">
              <dao-input
                v-model="livenessProbe.exec.command"
                icon-inside
                name="command"
                v-validate.immediate="'required'"
                :message="veeErrors.first('command')"
                :status="veeErrors.has('command') ? 'error' : ''"
                data-vv-as="检查命令"
                placeholder="例: cat /tmp/healthy"
              >
              </dao-input>
            </div>
          </dao-setting-item>
          <dao-setting-item v-if="livenessProbeSelect === 'tcpSocket'">
            <div slot="label">连接端口</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="livenessProbe.tcpSocket.port"
                type="int"
                :min="1"
                :max="65535"
                placeholder="必填"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查间隔</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="livenessProbe.periodSeconds"
                type="int"
                :min="1"
                unit="秒"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">延迟检查时间</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="livenessProbe.initialDelaySeconds"
                type="int"
                :min="0"
                unit="秒"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查超时</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="livenessProbe.timeoutSeconds"
                type="int"
                :min="1"
                unit="秒"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查重试次数</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="livenessProbe.failureThreshold"
                type="int"
                :min="1"
                unit="次"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查所需次数</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="livenessProbe.successThreshold"
                type="int"
                :min="1"
                unit="次"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
        </div>
      </div>
    </dao-setting-section>

    <dao-setting-section>
      <div slot="label">就绪检查</div>
      <div slot="content">
        <dao-radio-group>
          <dao-radio
            v-model="readinessProbeSelect"
            v-for="(option, index) in livenessOptions"
            :key="index"
            :label="option.label"
          >
            {{ option.title }}
          </dao-radio>
        </dao-radio-group>
        <div class="dao-setting-patch pod" v-if="readinessProbeSelect !== 'none'">
          <div v-if="readinessProbeSelect === 'httpGet'">
            <dao-setting-item>
              <div slot="label">请求路径</div>
              <div slot="content">
                <dao-input
                  v-model="readinessProbe.httpGet.path"
                  icon-inside
                  name="readyPath"
                  v-validate.immediate="'required'"
                  :message="veeErrors.first('readyPath')"
                  :status="veeErrors.has('readyPath') ? 'error' : ''"
                  data-vv-as="请求路径"
                  placeholder="例: /healthz"
                >
                </dao-input>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求头</div>
              <div slot="content">
                <dao-editable-table
                  class="headers"
                  :config="config"
                  v-model="readinessProbe.httpGet.httpHeaders"
                >
                </dao-editable-table>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求协议</div>
              <div slot="content">
                <dao-radio-group style="display: flex;">
                  <dao-radio
                    style="margin-right: 30px;"
                    v-model="readinessProbe.httpGet.scheme"
                    label="HTTP"
                  >
                    HTTP
                  </dao-radio>
                  <dao-radio v-model="readinessProbe.httpGet.scheme" label="HTTPS">
                    HTTPS
                  </dao-radio>
                </dao-radio-group>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求地址</div>
              <div slot="content">
                <dao-input
                  v-model="readinessProbe.httpGet.host"
                  icon-inside
                  name="readyAddress"
                  v-validate.immediate="'ip_or_fqdn'"
                  :message="veeErrors.first('readyAddress')"
                  :status="veeErrors.has('readyAddress') ? 'error' : ''"
                  data-vv-as="请求地址"
                  placeholder="默认为容器组 IP"
                >
                </dao-input>
              </div>
            </dao-setting-item>
            <dao-setting-item>
              <div slot="label">请求端口</div>
              <div slot="content">
                <dao-numeric-input
                  required
                  v-model="readinessProbe.httpGet.port"
                  type="int"
                  :min="1"
                  :max="65535"
                  placeholder="必填，且端口号必须在 1 - 65535 之间"
                >
                </dao-numeric-input>
              </div>
            </dao-setting-item>
          </div>
          <dao-setting-item v-if="readinessProbeSelect === 'exec'">
            <div slot="label">检查命令</div>
            <div slot="content">
              <dao-input
                v-model="readinessProbe.exec.command"
                icon-inside
                name="readyCommand"
                v-validate.immediate="'required'"
                :message="veeErrors.first('readyCommand')"
                :status="veeErrors.has('readyCommand') ? 'error' : ''"
                data-vv-as="检查命令"
                placeholder="例: cat /tmp/healthy"
              >
              </dao-input>
            </div>
          </dao-setting-item>
          <dao-setting-item v-if="readinessProbeSelect === 'tcpSocket'">
            <div slot="label">连接端口</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="readinessProbe.tcpSocket.port"
                type="int"
                :min="1"
                :max="65535"
                placeholder="必填"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查间隔</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="readinessProbe.periodSeconds"
                type="int"
                :min="1"
                unit="秒"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">延迟检查时间</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="readinessProbe.initialDelaySeconds"
                type="int"
                :min="0"
                unit="秒"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查超时</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="readinessProbe.timeoutSeconds"
                type="int"
                :min="1"
                unit="秒"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查重试次数</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="readinessProbe.failureThreshold"
                type="int"
                :min="1"
                unit="次"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">检查所需次数</div>
            <div slot="content">
              <dao-numeric-input
                required
                v-model="readinessProbe.successThreshold"
                type="int"
                :min="1"
                unit="次"
              >
              </dao-numeric-input>
            </div>
          </dao-setting-item>
        </div>
      </div>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
  name: 'PodPanel',

  inject: ['$validator'],

  data() {
    return {
      livenessOptions: [
        {
          title: '无',
          label: 'none',
        },
        {
          title: '执行命令',
          label: 'exec',
        },
        {
          title: '发送网络 GET 请求',
          label: 'httpGet',
        },
        {
          title: '测试 TCP Socket 连接',
          label: 'tcpSocket',
        },
      ],
      livenessProbeSelect: 'none',
      readinessProbeSelect: 'none',
      livenessProbe: {
        periodSeconds: 10, // 检查间隔
        initialDelaySeconds: 0, // 延迟检查时间
        timeoutSeconds: 10, // 检查超时
        failureThreshold: 3, // 重试次数
        successThreshold: 1, // 检查所需次数
        exec: {
          command: '',
        },
        httpGet: {
          path: '/live',
          httpHeaders: [],
          host: '',
          port: 8080,
          scheme: 'HTTP',
        },
        tcpSocket: {
          host: '',
          port: 8080,
        },
      },
      readinessProbe: {
        periodSeconds: 10, // 检查间隔
        initialDelaySeconds: 0, // 延迟检查时间
        timeoutSeconds: 10, // 检查超时
        failureThreshold: 3, // 重试次数
        successThreshold: 1, // 检查所需次数
        exec: {
          command: '',
        },
        httpGet: {
          path: '/ready',
          httpHeaders: [],
          host: '',
          port: 8080,
          scheme: 'HTTP',
        },
        tcpSocket: {
          host: '',
          port: 8080,
        },
      },
      config: {
        // TODO: add validation ?
        header: ['键', '值'],
        body: [
          {
            type: 'input',
            name: 'name',
            default: '',
          },
          {
            type: 'input',
            name: 'value',
            default: '',
          },
        ],
      },
    };
  },

  computed: {
    probeValid() {
      return probe => {
        const {
          periodSeconds,
          initialDelaySeconds,
          timeoutSeconds,
          successThreshold,
          failureThreshold,
        } = probe;

        return (
          periodSeconds === '' ||
          initialDelaySeconds === '' ||
          timeoutSeconds === '' ||
          successThreshold === '' ||
          failureThreshold === ''
        );
      };
    },

    publicForm() {
      const { livenessProbeSelect, readinessProbeSelect, livenessProbe, readinessProbe } = this;

      if (livenessProbeSelect !== 'none' && readinessProbeSelect === 'none') {
        if (livenessProbeSelect === 'httpGet' || livenessProbeSelect === 'tcpSocket') {
          return (
            this.probeValid(livenessProbe) ||
            livenessProbe.httpGet.port === '' ||
            livenessProbe.tcpSocket.port === ''
          );
        }
        return this.probeValid(livenessProbe);
      } else if (livenessProbeSelect === 'none' && readinessProbeSelect !== 'none') {
        if (readinessProbeSelect === 'httpGet' || readinessProbeSelect === 'tcpSocket') {
          return (
            this.probeValid(readinessProbe) ||
            readinessProbe.httpGet.port === '' ||
            readinessProbe.tcpSocket.port === ''
          );
        }
        return this.probeValid(readinessProbe);
      } else if (livenessProbeSelect !== 'none' && readinessProbeSelect !== 'none') {
        return (
          this.probeValid(livenessProbe) ||
          this.probeValid(readinessProbe) ||
          livenessProbe.httpGet.port === '' ||
          livenessProbe.tcpSocket.port === '' ||
          readinessProbe.httpGet.port === '' ||
          readinessProbe.tcpSocket.port === ''
        );
      }
      return false;
    },
  },

  watch: {
    livenessProbe: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit('pod-model', this.providePodModel());
      },
    },

    readinessProbe: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit('pod-model', this.providePodModel());
      },
    },

    livenessProbeSelect: {
      immediate: true,
      handler() {
        this.$emit('pod-model', this.providePodModel());
      },
    },

    readinessProbeSelect: {
      immediate: true,
      handler() {
        this.$emit('pod-model', this.providePodModel());
      },
    },
  },

  methods: {
    providePodModel() {
      let livenessProbe = cloneDeep(this.livenessProbe);
      let readinessProbe = cloneDeep(this.readinessProbe);
      if (this.livenessProbeSelect === 'none') livenessProbe = {};
      if (this.readinessProbeSelect === 'none') readinessProbe = {};

      ['exec', 'httpGet', 'tcpSocket'].forEach(action => {
        if (this.livenessProbeSelect !== action) delete livenessProbe[action];
        if (this.readinessProbeSelect !== action) delete readinessProbe[action];
      });

      return {
        livenessProbe,
        readinessProbe,
      };
    },

    vaildResult() {
      return this.publicForm || this.veeErrors.any();
    },
  },
};
</script>

<style lang="scss">
.dao-setting-patch {
  &.pod {
    width: 608px;
  }

  .headers {
    width: 430px;
    margin-top: 7px;
  }
}
</style>
