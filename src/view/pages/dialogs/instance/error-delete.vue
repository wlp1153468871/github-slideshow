<template>
  <el-dialog
    title="提示"
    append-to-body=""
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
  >
    <span>这是一段信息</span>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="onClose">取 消</el-button>
      <el-button
        type="primary"
        @click="visible = false"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ErrorDeleteDialog',
  data() {
    return {};
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    onClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>