import { mapState } from 'vuex';

import ZoneAdminService from '@/core/services/zone-admin.service';
import col from 'element-ui/packages/col/src/col';

export default {
  name: 'Zone',
  data() {
    return {
      zoneList: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getzoneList();
  },

  methods: {
    /**
     * 获取所有可用区
     */
    getzoneList() {
      ZoneAdminService.getzoneList().then(res => {
        if (res) {
          this.zoneList = res;
        }
      });
    },
    /**
     * 可用区名称的字体颜色
     */
    nameStyle(column) {
      if(column.columnIndex === 0) {
        console.log(column.columnIndex)
        return {
          color: '#217EF2',
          cursor: 'pointer',
        }
      }
      return {}
    },
    /**
     * 表格某列被点击
     */
    cellClick(row, column, cell, event) {
      console.log(row, column);
      if (column.label === '可用区名称') {
        this.$router.push(`zone/detail/${row.id}/${row.name}`);
      }
    },
    /**
     * 分页改变
     */
    changeDropDown(val) {
      console.log(val, '分页改变')
    }
  },
};
