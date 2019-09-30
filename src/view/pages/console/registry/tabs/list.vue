<template>
  <div class="registry-content">
    <div class="table-toolbar">
      <div class="table-toolbar-right">
        <div>
          <dao-input
            search
            placeholder="搜索镜像"
            @change="updateKey"
            v-model="query.q"
          >
          </dao-input>
          <button
            class="dao-btn"
            style="margin-left: 10px;"
            @click="getImages">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <el-table
      :data="images"
      v-loading="imageTableLoading"
      @expand-change="onExpandChange">
      <el-table-column type="expand">
        <template #default="{ row: repository }">
          <el-table
            v-loading="repository.tagLoading"
            :data="repository.tags"
            size="mini">
            <el-table-column
              prop="name"
              label="标签"
              width="180">
              <template #default="{ row: tag }">
                <router-link
                  :to="scanDetailRouter(repository.name, tag)">
                  {{tag.name}}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              width="180">
            </el-table-column>
            <el-table-column
              prop="created"
              label="创建时间"
              :formatter="formatCreationTime">
            </el-table-column>
            <el-table-column
              prop="docker_version"
              label="Docker版本">
            </el-table-column>
            <el-table-column
              prop="scan_overview"
              label="漏洞扫描">
              <template #default="{ row: tag }">
                <scan-status :status="tag.scan_overview | scan_overview_status"></scan-status>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              header-align="center"
              width="80"
            >
              <template #default="{ row: tag }">
                <router-link :to="scanDetailRouter(repository.name, tag)">
                  详情
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        sortable>
      </el-table-column>
      <el-table-column
        prop="tags_count"
        label="标签数">
      </el-table-column>
      <el-table-column
        prop="pull_count"
        sortable
        label="下载数">
      </el-table-column>
      <el-table-column
        sortable
        prop="update_time"
        :formatter="formatUpdateTime"
        label="更新时间">
      </el-table-column>
      <el-table-column label="操作" v-if="$can('create')">
        <template slot-scope="scope">
          <button
            class="dao-btn btn-sm mini blue"
            @click="deploy(scope.row)">部署应用
          </button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="getImages"
      @current-change="getImages"
      :current-page.sync="query.page"
      :page-sizes="[10, 50, 100]"
      :page-size.sync="query.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce, toNumber } from 'lodash';
import RegistryService from '@/core/services/registry.service';
import ScanStatus from '@/view/components/scan-overview-status/scan-status';

export default {
  name: 'Registry-List',
  computed: {
    ...mapState(['space', 'zone', 'services']),
  },
  data() {
    return {
      totalCount: 0,
      query: {
        zone: '',
        page: 1,
        page_size: 10,
        q: '',
      },
      currentPage: 1,
      images: [],
      imageTableLoading: true,
    };
  },

  created() {
    this.query.zone = this.zone.id;
    this.getImages();
  },

  watch: {
    'query.q': {
      handler() {
        this.updateKey();
      },
    },
  },

  methods: {
    updateKey: debounce(function updateKey() {
      this.getImages();
    }, 300),

    deploy(img) {
      let imgUrl = `${this.zone.registry.url}/${img.name}`;
      imgUrl = imgUrl.replace(/http[s]:\/\//, '');

      this.$router.push({
        name: 'deploy.applications',
        query: { imgUrl },
      });
    },

    formatUpdateTime(row) {
      return this.$options.filters.date(row.update_time);
    },

    formatCreationTime(row) {
      return this.$options.filters.date(row.created);
    },

    getImages() {
      this.imageTableLoading = true;
      RegistryService.getImages(this.space.id, this.query).then(res => {
        this.totalCount = toNumber(res.total_count);
        this.images = res.data.map(image => {
          return {
            ...image,
            tags: [],
            tagLoading: false,
          };
        });
        this.imageTableLoading = false;
      });
    },

    onExpandChange(row) {
      row.tagLoading = true;
      RegistryService.getTags(this.space.id, row.name, {
        zone: this.zone.id,
      }).then(tags => {
        row.tags = tags.map(t => {
          return { ...t, author: t.author || '暂无' };
        });
        row.tagLoading = false;
      });
    },

    scanDetailRouter(repositoryName, tag) {
      const [project, imageName] = repositoryName.split('/');
      return {
        name: 'registry.registryTag',
        params: {
          project,
          imageName,
          tagName: tag.name,
        },
      };
    },
  },
  components: {
    ScanStatus,
  },
};
</script>
