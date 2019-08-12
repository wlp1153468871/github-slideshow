import QuotaService from '@/core/services/quota.service';
import tableView from '@/view/mixins/table-view';
// dialogs
import CreateQuotaFieldDialog from '@/view/pages/dialogs/quota/create-quota-field';
import UpdateQuotaFieldDialog from '@/view/pages/dialogs/quota/update-quota-field';

export default {
  name: 'QuotaField',
  extends: tableView('id', 10, 'code'),
  components: {
    CreateQuotaFieldDialog,
    UpdateQuotaFieldDialog,
  },
  created() {
    this.loadQuotaFields();
    this.setTableProps([
      { id: 'code', name: '唯一标识', sortable: true },
      { id: 'name', name: '字段名', sortable: true },
      { id: 'unit', name: '单位', sortable: true },
      { id: 'description', name: '描述', filter: 'otherwise' },
    ]);
    this.setTableOperations([
      { name: '修改', event: 'open-update-quota-field-dialog' },
      { name: '删除', event: 'confirm-delete-quota-field' },
    ]);
  },
  data() {
    return {
      config: {
        selectable: false,
        serach: {
          shutDown: false,
          autofocus: true,
          placeholder: '请输入查询内容',
        },
      },
      columns: [],
      rows: [],
      quotaFields: [],
      quotaField: {},
      dialogConfigs: {
        createQuotaField: { visible: false },
        updateQuotaField: { visible: false },
      },
      loadings: {
        listQuotaField: false,
      },
    };
  },
  methods: {
    loadQuotaFields() {
      this.loadings.listQuotaField = true;
      QuotaService.listQuotaFields().then(list => {
        this.quotaFields = list;
        this.rows = list;
      }).finally(() => {
        this.loadings.listQuotaField = false;
      });
    },

    createQuotaField(quotaField) {
      const hasExit = this.quotaFields.some(q => {
        return q.code === quotaField.code;
      });

      if (hasExit) {
        this.$tada.error('该唯一标识已存在');
      }

      QuotaService.createQuotaField(quotaField).then(() => {
        this.$noty.success('添加配额字段成功');
        this.loadQuotaFields();
      }).finally(() => {
        this.dialogConfigs.createQuotaField.visible = false;
      });
    },

    updateQuotaField(quotaField) {
      const quotaFieldId = this.findQuotaFileId(quotaField);
      this.quotaField = this.quotaFields.find(q => q.id === quotaFieldId);
      QuotaService.updateQuotaField(quotaFieldId, quotaField).then(() => {
        this.$noty.success('修改配额字段成功');
        this.loadQuotaFields();
      }).finally(() => {
        this.dialogConfigs.updateQuotaField.visible = false;
      });
    },

    createQuotaFieldShow() {
      this.dialogConfigs.createQuotaField.visible = true;
    },

    confirmDeleteQuotaField(item) {
      this.$tada.confirm({
        title: '删除配额字段',
        text: `您确定要删除配额字段 ${item.name} 吗？`,
      }).then(willDelete => {
        if (willDelete) {
          this.removeQuotaField(item);
        }
      });
    },

    removeQuotaField(item) {
      const quotaFieldId = this.findQuotaFileId(item);
      return QuotaService.deleteQuotaField(quotaFieldId).then(() => {
        const index = this.quotaFields.findIndex(v => v.id === quotaFieldId);
        this.quotaFields.splice(index, 1);
        this.loadQuotaFields();
        this.$noty.success('删除成功');
      }).catch(() => {
        this.$noty.error('删除失败');
      });
    },

    openUpdateQuotaFieldDialog(item) {
      this.quotaField = item;
      this.dialogConfigs.updateQuotaField.visible = true;
    },

    findQuotaFileId(item) {
      const quotaField = this.quotaFields.find(q => q.code === item.code);
      return quotaField.id;
    },
  },
};
