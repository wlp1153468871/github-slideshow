<template>
  <div class="ingress-list">
    <circle-loading v-if="loadings.page"></circle-loading>

    <template v-else>
      <resource-header :resource="resource"></resource-header>

      <div class="dao-view-main">
        <div class="dao-view-content">
          <x-table
            :data="ingressList"
            :filter-method="filterMethod"
            :loading="loadings.table"
            @refresh="listIngresses">
            <template #operation>
              <button
                class="dao-btn blue has-icon"
                v-if="$can('create')"
                @click="dialogs.create = true">
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </template>
            <el-table-column
              label="名称"
              sortable
              :sort-method="sortName"
              min-width="150">
              <template slot-scope="{ row: ingress }">
                <el-table-name-cell
                  :resource="ingress"
                  routerName="resource.ingresses.detail">
                </el-table-name-cell>
              </template>
            </el-table-column>
            <el-table-column
              label="HOSTS"
              min-width="150">
              <template slot-scope="{ row: ingress }">
                {{ formatHost(ingress) }}
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="metadata.creationTimestamp"
              width="200">
            </el-table-column>
          </x-table>
        </div>
      </div>
    </template>

    <edit-yaml-dialog
      :value="formModel"
      :visible.sync="dialogs.create"
      @opened="getTemplate"
      @update="createIngress">
    </edit-yaml-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isEmpty, get as getValue } from 'lodash';
import { RESOURCE } from '@/core/constants/resource';
import ResourceTemplateService from '@/core/services/resource.template.service';
import IngressService from '@/core/services/ingress.service';

export default {
  name: 'IngressList',

  props: {},

  data() {
    const { create = 'false' } = this.$route.query;

    return {
      loadings: {
        page: false,
        table: false,
      },
      resource: {
        ...RESOURCE.INGRESS,
        links: [
          {
            text: RESOURCE.INGRESS.name,
          },
        ],
      },
      ingressList: [],
      filterMethod: (data, filterKey) =>
        data.metadata.name.toLowerCase().includes(filterKey),
      formModel: null,
      dialogs: {
        create: JSON.parse(create),
      },
    };
  },

  computed: {
    ...mapState(['space']),
  },

  created() {
    this.listIngresses();
  },

  methods: {
    listIngresses() {
      IngressService.list().then(({ items }) => {
        this.ingressList = items;
      });
    },

    sortName(prev, next) {
      return getValue(prev, 'metadata.name') - getValue(next, 'metadata.name');
    },

    formatHost(ingress) {
      const rules = getValue(ingress, 'spec.rules');
      return rules.map(rule => rule.host).join();
    },

    createIngress() {},

    getTemplate() {
      if (!isEmpty(this.formModel)) return;
      ResourceTemplateService.getTemplate('ingress').then(template => {
        template.metadata.namespace = this.space.short_name;
        this.formModel = template;
      });
    },
  },
};
</script>
