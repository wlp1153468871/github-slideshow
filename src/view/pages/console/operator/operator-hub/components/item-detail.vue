<template>
  <div class="item-detail">
    <div class="modal-body-inner-shadow-covers">
      <div class="properties-slide-panel">
        <el-button
          style="width: 100%"
          size="medium"
          v-if="item.installed"
        >
          Uninstall
        </el-button>
        <el-button
          style="width: 100%"
          size="medium"
          v-else
          @click="install"
        >
          Install
        </el-button>
        <property-item label="Operator Version" :value="item.version"></property-item>
        <property-item label="Provider Type" :value="item.providerType"></property-item>
        <property-item label="Provider" :value="item.provider"></property-item>
        <property-item label="Repository" :value="item.repository"></property-item>
        <property-item label="Container Image" :value="item.containerImage"></property-item>
        <property-item label="Created At" :value="item.createdAt"></property-item>
        <property-item label="Support" :value="item.support"></property-item>
      </div>

      <div class="item-description">
        <d-alert
          style="margin-bottom: 10px;"
          v-if="item.installed"
          type="info"
          :show-icon="true"
          message="Installed Operator"
          description="This Operator has been installed on the cluster."
        ></d-alert>
        <d-alert
          style="margin-bottom: 10px;"
          v-else-if="item.providerType === 'Community'"
          type="info"
          :show-icon="true"
          message="Community Operator"
        >
          <template #description>
          <span>
            This is a community provided operator.&nbsp;
            These are operators which have not been vetted or verified by Red Hat.&nbsp;
            Community Operators should be used&nbsp;
            with caution because their stability is unknown.&nbsp;
            Red Hat provides no support for Community Operators.&nbsp;
            <a :href="RH_OPERATOR_SUPPORT_POLICY_LINK">
              Learn more about Red Hat’s third party software support policy
            </a>
            </span>
          </template>
        </d-alert>
        <markdown class="main-text" :text="item.longDescription">
        </markdown>
      </div>
    </div>
  </div>
</template>

<script>
import PropertyItem from './property-item';

export const RH_OPERATOR_SUPPORT_POLICY_LINK =
  'https://access.redhat.com/third-party-software-support';
export default {
  name: 'ItemDetail',

  components: {
    PropertyItem,
  },

  props: {
    item: {
      type: Object,
    },
  },

  data() {
    return {
      RH_OPERATOR_SUPPORT_POLICY_LINK,
    };
  },

  methods: {
    install() {
      this.$router.push({
        name: 'console.operator-hub-subscribe',
      });
    },
  },
};
</script>

<style lang="scss">
.item-detail {
  height: 100%;
  overflow: hidden auto;
  background-attachment: scroll;
  background-image: radial-gradient(ellipse at top, rgba(0, 0, 0, 0.25) 0%, transparent 90%),
    radial-gradient(ellipse at bottom, rgba(0, 0, 0, 0.25) 0%, transparent 90%);
  background-position: 0 0, 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 5px;
  -webkit-overflow-scrolling: touch;
}

.modal-body-inner-shadow-covers {
  min-height: 100%;
  background-attachment: local;
  background-image: linear-gradient(#fff 30%, rgba(255, 255, 255, 0)),
    linear-gradient(rgba(255, 255, 255, 0), #fff 70%);
  background-position: 0 0, 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 12px;
  width: 100%;
  display: flex;
  flex: 1 1 auto;
  padding: 20px;
}

.properties-slide-panel {
  flex: 0 0 auto;
  width: 165px;
}

.item-description {
  flex: 1 1 auto;
  margin: 0 0 0 20px;
  white-space: pre-wrap;
  max-width: calc(100% - 185px);
}
</style>
