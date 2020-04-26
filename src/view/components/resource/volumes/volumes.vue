<template>
  <div class="volumes">
    <div v-for="(volume, index) in volumes" :key="index">
      <p class="volume-name">
        {{ volume.name
        }}<span v-if="canRemove" class="header-actions">
          <a href="" @click="removeFn({ volume })">Remove</a>
        </span>
      </p>
      <dl class="dl-horizontal">
        <template v-if="volume.secret && $can('secret.view')">
          <dt>Type:</dt>
          <dd>
            secret
            <span class="small text-muted">(populated by a secret when the pod is created)</span>
          </dd>
          <dt>Secret:</dt>
          <dd>
            <span>
              <router-link
                :to="{
                  name: 'resource.secrets.detail',
                  params: { name: volume.secret.secretName },
                }"
              >
                {{ volume.secret.secretName }}
              </router-link>
            </span>
          </dd>
          <div v-for="item in volume.secret.items" :key="item.key">
            <dt>Key to File:</dt>
            <dd>{{ item.key }}&#8201;&#8594;&#8201;{{ item.path }}</dd>
          </div>
        </template>

        <template v-if="volume.persistentVolumeClaim">
          <dt>Type:</dt>
          <dd>
            persistent volume claim
            <span class="small text-muted">(reference to a persistent volume claim)</span>
          </dd>
          <dt>Claim name:</dt>
          <dd>
            <router-link
              :to="{
                name: 'resource.persistentvolumeclaims.detail',
                params: { name: volume.persistentVolumeClaim.claimName },
              }"
            >
              {{ volume.persistentVolumeClaim.claimName }}
            </router-link>
          </dd>
          <dt>Mode:</dt>
          <dd>
            <span v-if="volume.persistentVolumeClaim.readOnly">read-only</span>
            <span v-if="!volume.persistentVolumeClaim.readOnly">read-write</span>
          </dd>
        </template>

        <template v-if="volume.hostPath">
          <dt>Type:</dt>
          <dd>
            host path
            <span class="small text-muted">(bare host directory volume)</span>
          </dd>
          <dt>Path:</dt>
          <dd>{{ volume.hostPath.path }}</dd>
        </template>

        <template v-if="volume.emptyDir">
          <dt>Type:</dt>
          <dd>
            empty dir
            <span class="small text-muted">(temporary directory destroyed with the pod)</span>
          </dd>
          <dt>Medium:</dt>
          <dd>
            <span v-if="!volume.emptyDir.medium">node's default</span>
            <span v-if="volume.emptyDir.medium">{{ volume.emptyDir.medium }}</span>
          </dd>
        </template>

        <template v-if="volume.gitRepo">
          <dt>Type:</dt>
          <dd>
            git repo
            <span class="small text-muted">(pulled from git when the pod is created)</span>
          </dd>
          <dt>Repository:</dt>
          <dd>{{ volume.gitRepo.repository }}</dd>
          <!--&lt;!&ndash;<dt ng-if-start="volume.gitRepo.revision">Revision:</dt>&ndash;&gt;-->
          <!--&lt;!&ndash;<dd ng-if-end>{{volume.gitRepo.revision}}</dd>&ndash;&gt;-->
        </template>

        <template v-if="volume.downwardAPI">
          <dt>Type:</dt>
          <dd>
            downward API
            <span class="small text-muted">(populated with information about the pod)</span>
          </dd>
          <div v-for="(item, idx) in volume.downwardAPI.items" :key="idx">
            <dt>Volume File:</dt>
            <dd>{{ item.fieldRef.fieldPath }}&#8201;&#8594;&#8201;{{ item.path }}</dd>
          </div>
        </template>

        <template v-if="volume.configMap">
          <dt>Type:</dt>
          <dd>
            config map
            <span class="small text-muted">(populated by a config map)</span>
          </dd>
          <dt>Config Map:</dt>
          <dd>
            <router-link
              :to="{
                name: 'resource.configmaps.detail',
                params: { name: volume.configMap.name },
              }"
            >
              {{ volume.configMap.name }}
            </router-link>
          </dd>
          <div v-for="item in volume.configMap.items" :key="item.key">
            <dt>Key to File:</dt>
            <dd>{{ item.key }}&#8201;&#8594;&#8201;{{ item.path }}</dd>
          </div>
        </template>
      </dl>
    </div>
  </div>
</template>

<script>
import getPreferredVersion from '@/core/utils/get-preferred-version';

export default {
  name: 'Volumes',

  props: {
    volumes: { type: Array, default: () => [] },
    namespace: { type: String },
    canRemove: { type: Boolean },
    removeFn: { type: Function },
  },

  data() {
    return {
      secretsVersion: getPreferredVersion('secrets'),
    };
  },
};
</script>

<style lang="scss">
.volume-name {
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  line-height: 1.1;
}
</style>
