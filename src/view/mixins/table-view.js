function tableViewMixinFactory(...setting) {
  const [tTrackBy = 'id', tLimit = 25, tSortProp, tSortOrder = 'asc'] = setting;

  const data = {
    tConfig: {
      tTrackBy,
      // hideSortHelper: true,
      hideSearchInput: false,
      selectable: false,
      pagination: {
        limit: tLimit,
      },
      sort: {
        prop: tSortProp,
        order: tSortOrder,
      },
      loadingText: '加载中.....',
      emptyText: '暂无数据',
      props: [],
      operations: [],
    },
  };

  return {
    data() {
      return data;
    },
    methods: {
      setTableConfig(tConfig) {
        Object.assign(this.tConfig, tConfig);
      },

      setTableProps(tCols = []) {
        this.tCols = tCols;
        const columns = tCols.map(item => {
          const { id, name, type = 'text', ...option } = item;
          return {
            id,
            name,
            type,
            ...option,
          };
        });
        this.tConfig.props = columns;
      },

      setTableOperations(operations = []) {
        this.tConfig.operations = operations;
      },
    },
  };
}

export default tableViewMixinFactory;
