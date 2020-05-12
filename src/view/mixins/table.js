import Criteria from '@/core/lib/criteria';
// import { curry } from 'lodash';

/**
 * This mixins more like abstract class
 * This function will create obj for common table operation.
 * obj will watch rows, and auto sorted value.
 *
 * @param {String} tTrackBy the primary value
 * @param {Number} tLimit then number per page
 * @param {String} tField the filed need sorted
 * @param {String} tOrder order direction
 */
export default function tableFactory(...config) {
  return {
    data() {
      const [tTrackBy = 'id', tLimit = 25, tField, tOrder = 'desc'] = config;

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
      };
    },
    watch: {
      rows(rows) {
        this.tCriteria.setData(rows);
        this.search();
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
          const defaultHandler = x => {
            return (x[this.tField] || '').toLowerCase().includes(keyword);
          };
          const handler = this.tKeywordHandler || defaultHandler;
          this.tCriteria.setFilter(key, handler);
        } else if (tKeyword === '' && old !== '') {
          this.tCriteria.removeFilter(key);
        }
        this.search();
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
      search() {
        const pagination = this.tCriteria.asPagination(this.tLimit);
        this.tPagination = pagination;
        this.tCurrentRows = pagination.tCurrentList;

        if (this.onSearch) {
          this.onSearch();
        }
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
    },
  };
}
