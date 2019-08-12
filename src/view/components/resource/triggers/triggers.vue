<template>
  <div class="triggers">
    <dl class="dl-horizontal">
      <template>
        <dt>Manual (CLI):</dt>
        <dd style="margin-bottom: 5px;">
          <!-- eslint-disable-next-line -->
          <dao-copy-block>{{'oc rollout latest dc/' + dcName + ' -n ' + projectName}}</dao-copy-block>
        </dd>
        <div v-for="(t, i) in triggers" :key="i">
          <span v-if="t.type === 'ConfigChange'">
            <dt>Change Of:</dt>
            <dd>Config</dd>
          </span>
          <span v-else-if="t.imageChangeParams.from">
            <dt>New Image For:</dt>
            <dd>
              {{t.imageChangeParams.from | imageObjectRef(dcNamespace)}}
              <small
                v-if="t.imageChangeParams.automatic"
              >(disabled)</small>
            </dd>
          </span>
        </div>
      </template>
    </dl>
  </div>
</template>

<script>
import getPreferredVersion from '@/core/utils/get-preferred-version';

export default {
  name: 'Triggers',

  props: {
    triggers: { type: Array, default: () => [] },
    projectName: { type: String },
    dcName: { type: String },
    dcNamespace: { type: String },
  },

  data() {
    return {
      secretsVersion: getPreferredVersion('secrets'),
    };
  },

  // filters: {
  //   imageObjectRef(objectRef, nsIfUnspecified, shortOutput) {
  //     if (!objectRef) {
  //       return "";
  //     }

  //     let ns = objectRef.namespace || nsIfUnspecified || "";
  //     if (!_.isEmpty(ns)) {
  //       ns = ns + "/";
  //     }
  //     let kind = objectRef.kind;
  //     if (kind === "ImageStreamTag" || kind === "ImageStreamImage") {
  //       return ns + objectRef.name;
  //     }
  //     if (kind === "DockerImage") {
  //       let name = objectRef.name;
  //       if (shortOutput) {
  //         name = name.substring(name.lastIndexOf("/") + 1);
  //       }
  //       return name;
  //     }
  //     var ref = ns + objectRef.name;
  //     return ref;
  //   }
  // }
};
</script>


<style lang="scss">
.clipboard {
  width: 80%;
}
</style>
