<template>
  <div>
    <dao-setting-layout>
      <template #layout-title
        >基本信息</template
      >

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >区域</template
          >
          <template #content>
            {{ zone.area_name }}
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >环境</template
          >
          <template #content>
            {{ zone.env_name }}
          </template>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >类型</template
          >
          <template #content>
            {{ zone.type }}
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title
        >集群配置</template
      >

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >地址</template
          >
          <template #content>
            {{ zone.clusterUrl }}
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >证书信息</template
          >
          <template #content>
            {{ zone.certificateAuthorityData }}
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title
        >用户信息</template
      >

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >用户证书</template
          >
          <template #content>
            {{ zone.clientCertificateData }}
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >用户私钥</template
          >
          <template #content>
            {{ zone.clientKeyData }}
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title
        >ES 配置</template
      >
      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >ES 地址</template
          >
          <template #content>
            {{ zone.es.esUrl }}
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >ES Token</template
          >
          <template #content>
            {{ zone.es.token }}
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title
        >集群域名配置</template
      >
      <dao-setting-section>
        <dao-setting-item>
          <template #content>
            <template v-if="!zone.router_config.length">
              <p class="text-muted">暂无配置信息</p>
            </template>
            <table v-else class="dao-table row">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>Key</th>
                  <th>标签</th>
                  <th>域名</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in zone.router_config" :key="row.key">
                  <td>{{ row.title }}</td>
                  <td>{{ row.key }}</td>
                  <td>{{ row.label }}</td>
                  <td>{{ row.domain }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title
        >Grafana 配置</template
      >
      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >地址</template
          >
          <template #content>
            {{ zone.grafana.url }}
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title
        >报警配置</template
      >
      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >是否开启</template
          >
          <template #content>
            <dao-switch size="sm" :disabled="true" v-model="zone.is_alert"> </dao-switch>
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title
        >镜像仓库配置</template
      >

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >镜像仓库类型</template
          >
          <template #content>
            Harbor
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >镜像仓库地址</template
          >
          <template #content>
            {{ zone.registry.url }}
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >镜像仓库账号</template
          >
          <template #content>
            {{ zone.registry.username }}
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label
            >镜像仓库密码</template
          >
          <template #content>
            {{ zone.registry.password }}
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <button style="margin-top: 20px;" class="dao-btn blue has-icon pull-right" @click="updateZone">
      <svg class="icon">
        <use xlink:href="#icon_pencil-edit"></use>
      </svg>
      <span class="text">修改可用区</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'BasicPanel',

  props: {
    zone: { type: Object, default: () => ({}) },
  },

  methods: {
    updateZone() {
      this.$router.push({
        name: 'deploy.zone',
        query: {
          zoneId: this.zone.id,
        },
      });
    },
  },
};
</script>
