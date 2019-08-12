<template>
  <div class="event-table">
    <div class="table-toolbar">
      <div class="table-toolbar-right">
        <dao-input
          v-model="filterKey"
          search
          placeholder="请输入搜索内容">
        </dao-input>
        <button
          class="dao-btn"
          style="margin-left: 10px;"
          @click="$emit('refresh')">
          <svg class="icon">
            <use xlink:href="#icon_update"></use>
          </svg>
        </button>
      </div>
    </div>
    <el-table
      :default-sort="{prop: 'time', order: 'descending'}"
      v-loading="loading"
      :data="eventsInCurrentPage"
      style="width: 100%">
      <el-table-column
        sortable
        prop="time"
        label="时间"
        :sort-method="sortStartTime"
        width="200">
        <template slot-scope="{ row: event }">
          <td data-title="Time" class="nowrap">{{event.lastTimestamp | date}}</td>
        </template>
      </el-table-column>
      <el-table-column
        prop="reason"
        label="原因"
        width="180">
        <template slot-scope="{ row: event}">
          <span>
            {{event.reason | humanize_reason}}
          </span>
          <svg
            class="icon"
            v-if="event.type === 'Warning'">
            <use xlink:href="#icon_warning"></use>
          </svg>
        </template>
      </el-table-column>
      <el-table-column
        prop="message"
        label="信息">
        <template slot-scope="{ row: event }">
          <truncate-long-text
            :content="event.message"
            :limit="1000"
            :newline-limit="4"
            :use-word-boundary="true"
            :expandable="true">
          </truncate-long-text>
          <div v-if="event.count > 1" class="text-muted small">
            {{event.count}} times in the last
            <span class="duration">{{event.firstTimestamp | date_from(null, true)}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :disabled="loading"
      :page-sizes="[10,30,50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      layout="sizes, prev, pager, next"
      :total="totalPages">
    </el-pagination>

  </div>
</template>

<script>
import dayjs from 'dayjs';
import { chunk, nth } from 'lodash';

export default {
  name: 'EventsTable',

  props: {
    events: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },

  data() {
    return {
      filterKey: '',
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    eventsFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      return this.events.filter(event =>
        event.reason.toLowerCase().includes(filterKey) ||
          event.message.toLowerCase().includes(filterKey));
    },

    paginaEvents() {
      return chunk(this.eventsFilteredByKey, this.pageSize);
    },

    eventsInCurrentPage() {
      return nth(this.paginaEvents, this.currentPage - 1);
    },

    totalPages() {
      return this.eventsFilteredByKey.length;
    },
  },

  methods: {
    sortStartTime(a, b) {
      const prevTime = dayjs(a.lastTimestamp);
      const nextTime = dayjs(b.lastTimestamp);
      if (prevTime.isSame(nextTime)) {
        return 0;
      } else if (prevTime.isBefore(nextTime)) {
        return -1;
      }
      return 1;
    },
  },
};
</script>
