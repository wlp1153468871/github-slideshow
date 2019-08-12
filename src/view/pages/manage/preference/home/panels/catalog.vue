<template>
  <div class="home-catalog__module">
    <dao-setting-layout>
      <div class="dao-view-wrap dao-view-main">
        <!-- 租户 -->
        <div class="dao-view-sidebar pri">
          <div class="dao-list-group-container">
            <button
              class="dao-btn mini blue"
              @click="openAddCatalogDialog()">
              <svg class="icon" style="vertical-align: middle;">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span style="vertical-align: middle;">&nbsp;创建分类</span>
            </button>
            <draggable
              class="dao-list-group catalog-list"
              v-model="categoryList"
              element="ul">
              <li
                class="dao-list-item drag-drop-list-item pri"
                v-for="tab in categoryList"
                :key="tab.name"
                :class="{ 'active': selectedCategory.name === tab.name }"
                @click="switchCatalog(tab)">
                <span class="icon icon-prepend">
                  <svg><use xlink:href="#icon_drag-point"></use></svg>
                </span>
                <div>{{ tab.name }}</div>
                <span
                  class="icon editable"
                  style="right: 30px"
                  @click.stop="openEditCatalogDialog(tab)">
                  <svg><use xlink:href="#icon_pencil"></use></svg>
                </span>
                <span class="icon" @click.stop="confirmRemoveCategory(tab)">
                  <svg><use xlink:href="#icon_minus-circled"></use></svg>
                </span>
              </li>
            </draggable>
          </div>
        </div>
        <div class="dao-view-sidebar sub">
          <div class="dao-list-group-container">
            <button
              :disabled="isEmpty(selectedCategory)"
              class="dao-btn mini blue"
              @click="openAddSubCatalogDialog()">
              <svg class="icon" style="vertical-align: middle;">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span style="vertical-align: middle;">&nbsp;创建二级分类</span>
            </button>
            <draggable
              class="dao-list-group catalog-list"
              v-model="selectedCategory.children"
              element="ul">
              <li
                class="dao-list-item drag-drop-list-item"
                v-for="tab in selectedCategory.children"
                :key="tab.name"
                :class="{ 'active': selectedSubCategory.name === tab.name }"
                @click="switchSubCatalog(tab)">
                <span class="icon icon-prepend">
                  <svg><use xlink:href="#icon_drag-point"></use></svg>
                </span>
                <div>{{ tab.name }}</div>
                <span
                  class="icon editable"
                  style="right: 30px"
                  @click.stop="openSubEditCatalogDialog(tab)">
                  <svg><use xlink:href="#icon_pencil"></use></svg>
                </span>
                <span class="icon" @click.stop="confirmRemoveSubCategory(tab)">
                  <svg><use xlink:href="#icon_minus-circled"></use></svg>
                </span>
              </li>
            </draggable>
          </div>
        </div>

        <div class="dao-view-content dao-square-container">
          <div class="dao-square-table-title clearfix">
            <button
              :disabled="isEmpty(selectedSubCategory)"
              class="dao-btn mini blue"
              @click="openAddServiceDialog(selectedSubCategory.services)">
              <svg class="icon" style="vertical-align: middle;">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              添加服务
            </button>
            <span class="pull-right">{{ selectedSubCategory.name }}</span>
          </div>
          <draggable
            class="dao-sequare-warpper"
            v-model="selectedSubCategory.services"
            element="div">
            <div
              class="dao-sequare-item"
              v-for="item in selectedSubCategory.services"
              :key="item.id">
              <a
                class="dao-sequare-item-close"
                href="javascript:void(0)"
                @click="confirmDeleteService(item)">
                <svg class="icon">
                  <use xlink:href="#icon_close-circled"></use>
                </svg>
              </a>
              <div class="box-wrap">
                <div
                  class="logo-box"
                  v-if="item.logo_url"
                  v-bg-image="item.logo_url">
                </div>
                <logo-placeholder size="medium" v-if="!item.logo_url">
                </logo-placeholder>
              </div>
              <div class="service-name">{{ item.name }}</div>
              <div
                class="service-content"
                v-if="item.short_description">
                {{ item.short_description }}
              </div>
              <div class="zone-info">{{ getZone(item) }}</div>
            </div>
          </draggable>
          <div
            class="dao-setting-section"
            v-show="selectedSubCategory.services&&!selectedSubCategory.services.length">
            <empty-state
              style="margin-left: 0"
              title="暂无服务, 该分类将不会展示在租户的导航栏中">
            </empty-state>
          </div>
        </div>
      </div>
      <template slot="footer">
        <button
          class="dao-btn blue"
          @click="onSave()">
          保存
        </button>
      </template>
    </dao-setting-layout>

    <!-- dialogs start -->
    <add-catalog-dialog
      @create="addCatalog"
      :visible="dialogConfigs.addCatalog.visible"
      @close="dialogConfigs.addCatalog.visible = false">
    </add-catalog-dialog>

    <add-sub-catalog-dialog
      @create="addSubCategory"
      :visible="dialogConfigs.addSubCatalog.visible"
      @close="dialogConfigs.addSubCatalog.visible = false">
    </add-sub-catalog-dialog>

    <edit-catalog-dialog
      :catalog="selectedCategory"
      @update="editCatalog"
      :visible="dialogConfigs.editCatalog.visible"
      @close="dialogConfigs.editCatalog.visible = false">
    </edit-catalog-dialog>

    <edit-sub-catalog-dialog
      :catalog="selectedSubCategory"
      @update="editSubCatalog"
      :visible="dialogConfigs.editSubCatalog.visible"
      @close="dialogConfigs.editSubCatalog.visible = false">
    </edit-sub-catalog-dialog>

    <add-service-dialog
      :services="services"
      :used-services="usedServices"
      @create="addService"
      :visible="dialogConfigs.addService.visible"
      @close="dialogConfigs.addService.visible = false">
    </add-service-dialog>
    <!-- dialogs end -->
  </div>
</template>

<script>
import { first, find, findIndex, isEmpty } from 'lodash';
import draggable from 'vuedraggable';
import SchemaService from '@/core/services/catalog.service';
import AddServiceDialog from '@/view/pages/dialogs/preference/add-service';
import AddCatalogDialog from '@/view/pages/dialogs/preference/add-catalog';
import AddSubCatalogDialog from '@/view/pages/dialogs/preference/add-subCatalog';
import EditCatalogDialog from '@/view/pages/dialogs/preference/edit-catalog';
import EditSubCatalogDialog from '@/view/pages/dialogs/preference/edit-subCatalog';
import CategoryUtil from '@/core/utils/category-util';

export default {
  name: 'CatalogPanel',

  components: {
    draggable,
    AddServiceDialog,
    AddCatalogDialog,
    AddSubCatalogDialog,
    EditCatalogDialog,
    EditSubCatalogDialog,
  },

  props: {
    subCatalogs: { type: Array, default: () => [] },
    services: { type: Array, default: () => [] },
  },

  data() {
    return {
      categoryList: [],
      selectedCategory: {},
      selectedSubCategory: {},
      usedServices: [],
      dialogConfigs: {
        addService: { visible: false },
        addCatalog: { visible: false },
        editCatalog: { visible: false },
        addSubCatalog: { visible: false },
        editSubCatalog: { visible: false },
      },
      isSaved: false,
    };
  },

  created() {
    this.getSchema();
  },

  methods: {
    isEmpty,

    getSchema() {
      SchemaService.getSchema().then(category => {
        this.categoryList = CategoryUtil.map2Array(category);
        this.selectedCategory = first(this.categoryList) || {};
        this.selectedSubCategory = first(this.selectedCategory.children) || {};
      });
    },

    getZone(item) {
      const service = find(this.services, { id: item.id });
      if (!service) return '';
      return `（${service.zone.name}）`;
    },

    switchCatalog(catalog) {
      this.selectedCategory = catalog;
      this.selectedSubCategory = first(catalog.children) || {};
    },

    onSave() {
      this.categoryList = this.categoryList.filter(category => category.children.length);
      const saveCategory = CategoryUtil.array2Map(this.categoryList);
      SchemaService.updateSchema(saveCategory)
        .then(() => {
          this.$noty.success('保存成功');
        })
        .catch(() => {
          this.$noty.error('保存失败，请重试');
        });
      this.isSaved = true;
    },

    openAddCatalogDialog() {
      this.dialogConfigs.addCatalog.visible = true;
    },

    openAddSubCatalogDialog() {
      this.dialogConfigs.addSubCatalog.visible = true;
    },

    openAddServiceDialog(services) {
      this.usedServices = services;
      this.dialogConfigs.addService.visible = true;
    },

    addCatalog(catalog) {
      const hasExit = find(this.categoryList, x => x.name === catalog.name);
      if (!hasExit) {
        this.categoryList.push(catalog);
        this.switchCatalog(catalog);
        this.selectedSubCategory = {};
        this.$noty.success('添加分类');
      } else {
        this.$tada.error('该分类名已存在');
      }
    },

    addSubCategory(subCatalog) {
      const hasExit = find(
        this.selectedCategory.children,
        x => x.name === subCatalog.name,
      );
      if (!hasExit) {
        this.selectedCategory.children.push(subCatalog);
        this.switchSubCatalog(subCatalog);
        this.$noty.success('添加二级分类');
      } else {
        this.$tada.error('该二级分类名已存在');
      }
    },

    addService(service) {
      if (service) {
        this.selectedSubCategory.services.push(service);
        this.$noty.success('添加服务成功, 请点击“保存”按钮以保存更改');
      }
    },

    openEditCatalogDialog(catalog) {
      this.selectedCategory = catalog;
      this.dialogConfigs.editCatalog.visible = true;
    },

    openSubEditCatalogDialog(catalog) {
      this.selectedSubCategory = catalog;
      this.dialogConfigs.editSubCatalog.visible = true;
    },

    switchSubCatalog(catalog) {
      this.selectedSubCategory = catalog;
    },

    editCatalog(catalog) {
      this.selectedCategory.name = catalog.name;
    },

    editSubCatalog(catalog) {
      this.selectedSubCategory.name = catalog.name;
    },

    confirmDeleteService(service) {
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

    confirmRemoveCategory(category) {
      this.$tada
        .confirm({
          title: '删除分类',
          text: `您确定要删除分类 ${category.name} 吗?`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.removeCategory(category);
          }
        });
    },

    confirmRemoveSubCategory(category) {
      this.$tada
        .confirm({
          title: '删除二级分类',
          text: `您确定要删除二级分类 ${category.name} 吗?`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.removeCategory(category, true);
          }
        });
    },

    removeService(serviceId) {
      const index = findIndex(this.selectedSubCategory.services, service => {
        return service.id === serviceId;
      });
      this.selectedSubCategory.services.splice(index, 1);
      this.$noty.success('删除服务成功, 请点击“保存”按钮以保存更改');
    },

    setCategory(category, isSub) {
      if (!isSub) {
        this.switchCatalog(category);
      } else {
        this.selectedSubCategory = category;
      }
    },

    /**
     * 从分类中移除分类
     * @param category
     * @param isSub 是否是二级分类
     */
    removeCategory(category, isSub) {
      let index = 0;
      let categories;

      if (!isSub) {
        categories = this.categoryList;
      } else {
        categories = this.selectedCategory.children;
      }

      index = findIndex(categories, x => x.name === category.name);
      categories.splice(index, 1);
      this.$noty.success('删除成功, 请点击“保存”按钮以保存更改');
      const prevIndex = index - 1;

      if (categories[prevIndex]) {
        this.setCategory(categories[prevIndex], isSub);
      } else {
        let nextCategory = first(categories);
        if (!nextCategory) {
          nextCategory = {
            id: '',
            children: [],
          };
        }
        this.setCategory(nextCategory, isSub);
      }
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.sub {
  border-left: 1px solid #e4e7ed;
}

.pri {
  background-color: #e4e7ed;
}

.home-catalog__module {
  .daox-setting-layout > .dao-setting-layout {
    padding-left: 0px;

    .dao-setting-layout-footer {
      margin-left: 0px;
    }
  }
}

.dao-view-sidebar {
  .dao-list-group-container {
    .dao-btn {
      margin: 4px 10px;
    }

    .catalog-list {
      box-shadow: none;

      .dao-list-item:last-child {
        border-bottom: 0;
      }
    }

    .dao-list-item {
      border-top: 0;
      position: relative;

      .plus-icon {
        width: 16px;
        height: 16px;
        fill: #3890ff;
        position: absolute;
        left: 6px;
        top: 1px;
      }
    }
  }
}

.dao-square-container {
  color: #3d444f;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 4px rgba(204, 209, 217, 0.3);
  box-shadow: 0 1px 4px rgba(204, 209, 217, 0.3);
  background-color: #fff;
  line-height: 1;
  // TODO(jerry) 一人做事一人当
  padding: 0 10px !important;

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
    }

    .zone-info {
      color: #9ba3af;
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
      overflow: hidden;
      -webkit-box-orient: vertical;
      display: -moz-box;
      -moz-orient: vertical;
      -moz-line-clamp: 2; //文本行数
      &:after {
        content: '...';
        position: absolute;
        bottom: 0;
        right: 14px;
        padding-left: 40px;
      }
    }

    &:hover {
      .dao-sequare-item-close {
        display: block;
      }
    }
  }

  .dao-list-item {
    border: 0;
  }

  .dao-sequare-item-close {
    display: none;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .dao-setting-layout {
    padding: 0 10px;
    margin-bottom: 0px;
  }
}
</style>
