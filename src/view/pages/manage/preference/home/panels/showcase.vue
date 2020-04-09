<template>
  <div>
    <dao-setting-layout>
      <div class="dao-view-wrap dao-view-main">
        <!-- 租户 -->
        <div class="dao-view-sidebar">
          <div class="dao-list-group-container">
            <draggable class="dao-list-group" v-model="showcaseList" element="ul">
              <li
                class="dao-list-item drag-drop-list-item"
                v-for="(tab, index) in showcaseList"
                :key="tab.name"
                :class="{ active: showcase.name === tab.name }"
                @click="switchShowcase(tab)"
              >
                <span class="icon icon-prepend">
                  <svg><use xlink:href="#icon_drag-point"></use></svg>
                </span>
                <div>Show Case {{ index + 1 }}</div>
              </li>
            </draggable>
          </div>
        </div>
        <!-- 配额 -->
        <div class="dao-view-content dao-square-container">
          <dao-setting-layout>
            <div class="dao-square-table-title clearfix">
              <a class="pull-left has-icon" @click="openAddServiceDialog(showcase.services)">
                <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
                添加服务
              </a>
              <span class="pull-right">{{ showcase.name }}</span>
            </div>
            <draggable class="dao-sequare-warpper" v-model="showcase.services" element="div">
              <div class="dao-sequare-item" v-for="item in showcase.services" :key="item.id">
                <a
                  class="dao-sequare-item-close"
                  href="javascript:void(0)"
                  @click="comfirmDeleteService(item)"
                >
                  <svg class="icon">
                    <use xlink:href="#icon_close-circled"></use>
                  </svg>
                </a>
                <div class="box-wrap">
                  <div class="logo-box" v-if="item.logo_url" v-bg-image="item.logo_url"></div>
                  <logo-placeholder size="medium" v-if="!item.logo_url"> </logo-placeholder>
                </div>
                <div class="service-name">{{ item.name }}</div>
                <div class="service-content" v-if="item.short_description">
                  {{ item.short_description }}
                </div>
              </div>
            </draggable>
            <div class="dao-setting-section" v-show="!showcase.services.length">
              <empty-state title="暂无服务"></empty-state>
            </div>
          </dao-setting-layout>
        </div>
      </div>
      <template slot="footer">
        <button class="dao-btn blue" @click="onSave()">
          保存
        </button>
      </template>
    </dao-setting-layout>

    <!-- dialogs start -->
    <add-service-dialog
      :services="services"
      :used-services="usedServices"
      @create="addService"
      :visible="dialogConfigs.addService.visible"
      @close="dialogConfigs.addService.visible = false"
    >
    </add-service-dialog>
    <!-- dialogs end -->
  </div>
</template>

<script>
import { first, findIndex, cloneDeep } from 'lodash';
import draggable from 'vuedraggable';
import AddServiceDialog from '@/view/pages/dialogs/preference/add-service';

export default {
  name: 'ShowcasePanel',
  components: {
    draggable,
    AddServiceDialog,
  },
  props: {
    showcases: { type: Array, default: () => [] },
    services: { type: Array, default: () => [] },
    updateSchema: { type: Function, default: () => ({}) },
  },
  data() {
    return {
      showcase: {
        id: '',
        services: [],
      },
      showcaseList: [], // local props.categories;
      usedServices: [],
      dialogConfigs: {
        addService: { visible: false },
      },
      isSaved: false,
    };
  },
  watch: {
    showcases: {
      immediate: true,
      handler(showcases) {
        const showcaseList = cloneDeep(showcases);
        this.showcaseList = showcaseList;
        if (showcaseList.length && !this.isSaved) {
          this.showcase = first(showcaseList);
        }
      },
    },
  },
  methods: {
    switchShowcase(showcase) {
      this.showcase = showcase;
    },

    onSave() {
      let saveCase = {};
      saveCase = this.showcaseList.reduce((sc, item) => {
        sc[item.orderName] = item;
        return sc;
      }, saveCase);
      this.updateSchema(saveCase)
        .then(() => {
          this.$noty.success('保存成功');
        })
        .catch(() => {
          this.$noty.error('保存失败，请重试');
        });
      this.isSaved = true;
    },

    openAddServiceDialog(services) {
      this.usedServices = services;
      this.dialogConfigs.addService.visible = true;
    },

    addService(service) {
      this.showcase.services.push(service);
      this.$noty.success('添加服务成功, 请点击“保存”按钮以保存更改');
    },

    comfirmDeleteService(service) {
      this.$tada
        .confirm({
          title: '移除服务',
          text: `您确定要移除服务 ${service.name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.removeService(service.id);
          }
        });
    },

    removeService(serviceId) {
      const index = findIndex(this.showcase.services, service => {
        return service.id === serviceId;
      });
      this.showcase.services.splice(index, 1);
      this.$noty.success('删除服务成功, 请点击“保存”按钮以保存更改');
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.dao-square-container {
  .dao-square-table-title {
    font-size: 14px;
    line-height: 39px;
    border-bottom: 1px solid $grey-light;
  }

  .dao-sequare-warpper {
    // background-color: rgb(241, 243, 246);
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .dao-sequare-item {
      border-radius: 5px;
    }
  }

  // w 356 x h 384
  $item-width: 100% / 4;
  $item-min-width: 178px;
  $item-max-width: 200px;
  $item-height: 192px;
  $box-width: 85px;
  $box-height: 60px;
  .dao-sequare-item {
    position: relative;
    flex: none;
    max-width: $item-max-width;
    width: $item-width;
    min-width: $item-min-width;
    height: $item-height;
    margin: 8px;
    border: 1px solid $white-dark-lighter;
    // border-right: 1px solid $white-dark-lighter;
    // border-bottom: 1px solid $white-dark-lighter;
    text-align: center;
    background: #fff;
    .box-wrap {
      width: $box-width;
      height: $box-height;
      margin: 32px auto 0px;
      .logo-box {
        width: 50px;
        height: 50px;
        margin-bottom: 12px;
        border-radius: 5px;
        border: 1px solid #e4e7ed;
        box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.07);
        margin-left: auto;
        margin-right: auto;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
      }
    }
    .service-name {
      // margin: 28px auto -7px 96px;
      text-align: center;
      font-size: 14px;
      color: #595f69;
      font-weight: 500;
      margin-top: 12px;
    }
    .service-content {
      position: relative;
      height: 3em;
      line-height: 1.5em;
      width: 100%;
      text-align: center;
      font-size: 1em;
      color: #9ba3af;
      padding: 0px 18px 0px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      display: -moz-box;
      -moz-orient: vertical;
      -moz-line-clamp: 2; //文本行数
      overflow: hidden;
      &:after {
        content: '...';
        position: absolute;
        bottom: 0;
        right: 14px;
        padding-left: 40px;
      }
    }
  }

  .dao-list-item {
    border: 0;
  }

  .dao-sequare-item-close {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .dao-setting-layout {
    padding: 0 10px;
    margin-bottom: 0;
  }
}
</style>
