import HPAService from '@/core/services/hpa.service';

export default {
  data() {
    return {
      dialogConfigs: {
        hpaEdit: false,
      },
      selectedHPA: null,
    };
  },

  methods: {
    confirmDeleteHPA(name) {
      this.$tada
        .confirm({
          title: '删除 HPA',
          text: `您确定要删除HPA ${name} 吗？`,
        })
        .then(willDel => {
          if (willDel) {
            this.deleteHPA(name);
          }
        });
    },

    deleteHPA(name) {
      HPAService.delete({ name }).then(() => {
        this.$noty.success(`删除 HPA ${name} 成功`);
        this.$emit('refresh');
      });
    },

    updateHPA(hpa) {
      this.selectedHPA = hpa;
      this.dialogConfigs.hpaEdit = true;
    },

    updateHPAByYaml(data) {
      const { name } = this.selectedHPA.metadata;
      HPAService.update({ name, data }).then(instance => {
        if (instance.is_need_approval) {
          this.$noty.success('请在审批记录页面，查看审批进度');
        } else {
          this.$noty.success('修改HPA成功');
        }
        this.$emit('refresh');
      });
    },
  },
};
