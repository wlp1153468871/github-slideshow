import Vue from 'vue';
import { get as getProp } from 'lodash';
import Criteria from '@/core/lib/criteria';

import LinkData from './link-data';
import StatusData from './status-data';
import OperationData from './operation-data';

export default {
  name: 'DaoTableView',
  components: {
    LinkData,
    StatusData,
    OperationData,
  },
  props: {
    config: { type: Object, default: () => ({}) },
    rows: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  created() {
    this.filtersFilter = Vue.filter('filters');
  },
  data() {
    const {
      tTrackBy = 'id',
      pagination = {},
      sort = {},
      operations = [],
      hideRefresh = false,
      hideSearchInput = false,
      hideToolbar = false,
      loadingText = '加载中.....',
      emptyText = '暂无数据',
      tKeywordHandler = undefined,
    } = this.config;

    const tField = sort.prop;
    const tOrder = sort.order || 'asc';
    const tLimit = pagination.limit || 25;

    const DATA_TYPE = {
      TEXT: 'text',
      LINK: 'goto',
      GOTO: 'goto',
      STATUS: 'status',
    };

    const tCriteria = new Criteria();
    tCriteria.setOrder(tField, tOrder);
    const tPagination = new Criteria.Pagination();
    return {
      tCriteria,
      tTrackBy,
      tSearchWord: '',
      tKeyword: '',
      tField,
      tOrder,
      tFilters: [],
      tCurrentRows: [],
      tLimit,
      tPagination,
      tOperations: operations,
      tSelected: {},
      tPlaceholder: '搜索 按下回车',
      hideRefresh,
      hideSearchInput,
      hideToolbar,
      loadingText,
      emptyText,
      DATA_TYPE,
      tKeywordHandler,
    };
  },
  computed: {
    tProps() {
      const { props = [] } = this.config;
      const { TEXT, LINK, STATUS } = this.DATA_TYPE;
      return props.map(x => {
        const { other = {} } = x;
        let { type = TEXT } = x;
        if (typeof type === 'function') {
          try {
            type = type(x);
          } catch (err) {
            type = TEXT;
          }
        }
        if (type === LINK) {
          if (!other.onClick) other.onClick = () => {}; // initial click
        } else if (type === STATUS) {
          // if (!other.status) other.status = 'gray'; // initial color
        }
        return {
          ...x,
          type,
          other,
        };
      });
    },
  },
  watch: {
    rows: {
      immediate: true,
      handler(rows) {
        this.tCriteria.setData(rows);
        this.search();
      },
    },

    tField(tField) {
      this.tCriteria.updateOrder(tField, this.tOrder);
      this.search();
    },

    tOrder(tOrder) {
      this.tCriteria.updateOrder(this.tField, tOrder);
      this.search();
    },

    tKeyword(tKeyword = '', old) {
      const key = '@@tKeyword';
      let keyword = tKeyword.trim();

      if (keyword === '' && old === '') return;

      if (tKeyword !== '') {
        keyword = keyword.toLowerCase();
        const handler =
          this.tKeywordHandler ||
          (item => this.defaultSearchHandler(keyword, item));
        this.tCriteria.setFilter(key, handler);
      } else if (tKeyword === '' && old !== '') {
        this.tCriteria.removeFilter(key);
      }
      this.search({ page: 0 });
    },

    tFilters(filters) {
      filters.forEach(group => {
        const [key, filter] = group;
        this.tCriteria.setFilter(key, filter);
      });
      this.search();
    },
  },
  methods: {
    renderText(item, option) {
      const { id, value, filter } = option;
      let text = item[id];

      // get value
      if (value) {
        // value will be one of ['string', 'function']
        if (typeof value === 'function') {
          try {
            text = value(text, item);
          } catch (err) {
            text = '';
          }
        } else if (typeof value === 'string') {
          text = getProp(item, value, '');
        }
      }

      // fitler parse
      if (filter && filter.trim() !== '') {
        text = this.filtersFilter(text, filter);
      }
      return text;
    },

    search({ page } = {}) {
      this.tSelected = -1;
      if (page === undefined) {
        const { tPage = 0 } = this.tPagination;
        page = tPage;
      }
      const pagination = this.tCriteria.asPagination(this.tLimit, page);
      this.tPagination = pagination;
      this.tCurrentRows = pagination.tCurrentList;

      // custom defind
      if (this.onSearch) {
        this.onSearch();
      }
    },

    defaultSearchHandler(keyword, item) {
      return this.tProps.some(prop => {
        const text = this.renderText(item, prop);
        return (text.toString() || '').toLowerCase().includes(keyword);
      });
    },

    // go to next page
    next() {
      this.tCurrentRows = this.tPagination.next();
    },

    // go to previous page;
    prev() {
      this.tCurrentRows = this.tPagination.prev();
    },

    gotoPage(page) {
      this.tCurrentRows = this.tPagination.gotoPage(page);
    },

    setFilter(key, filter) {
      const { tFilters } = this;
      let index = tFilters.findIndex(group => group[0] === key);
      if (index === -1) index = tFilters.length;
      tFilters.splice(index, 1, [key, filter]);
    },

    onSearchKeyupEnter() {
      this.tKeyword = this.tSearchWord;
    },

    toggleOrder(prop) {
      if (prop.sort === false) return;
      const sort = prop.sort ? prop.sort : prop.id;
      if (this.tField === sort) {
        // toggle
        this.tOrder = this.tOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.tField = sort;
        this.tOrder = 'asc';
      }
    },

    onSelectRow(item, index, event) {
      const isOperation =
        event.target.nodeName.toUpperCase() === 'SVG' ||
        event.target.nodeName.toUpperCase() === 'USE' ||
        event.target.className.indexOf('dao-dropdown-item') > -1;
      if (isOperation) return;
      this.tSelected = index;
      this.$emit('checked-rows-change', [item]);
    },

    onRefresh() {
      this.$emit('refresh');
    },
  },
};
