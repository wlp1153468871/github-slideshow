/**
 * create a dialog mixins
 * @param {String|Object} title
 * @param config
 */
export default function dialogFactory(title = '', config = {}) {
  return {
    props: {
      visible: { type: Boolean, default: false },
    },

    data() {
      return {
        isShow: this.visible,
        config: {
          title,
          size: 'auto',
          type: 'normal',
          showHeader: true,
          showFooter: true,
          closeOnClickOutside: false,
          ...config,
        },
      };
    },

    methods: {
      onClose() {
        if (this.dialogWillClose) {
          this.dialogWillClose();
        }
        this.$emit('close');
      },

      onResolve(res) {
        if (this.dialogWillClose) {
          this.dialogWillClose();
        }
        this.$emit('__resolve', res);
        this.$emit('close');
      },

      onReject(res) {
        if (this.dialogWillClose) {
          this.dialogWillClose();
        }
        this.$emit('__reject', res);
        this.$emit('close');
      },

      setDialogTitle(dialogTitle) {
        if (dialogTitle) {
          this.config.title = dialogTitle;
        }
      },

      onConfirm() {
        this.isShow = false;
        this.$emit('confirm');
      },

      onCancel() {
        this.isShow = false;
        this.$emit('cancel');
        this.$emit('close'); // 兼容旧写法
      },

      onBeforeClose() {
        this.$emit('before-close');
      },

      onClosed() {
        this.$emit('closed');
      },

      onBeforeOpen() {
        this.$emit('before-open');
      },

      onOpened() {
        this.$emit('opened');
      },

      onWrapperMousedown() {
        if (this.computedCloseOnClickOutside) {
          this.onClose();
        }
      },
    },

    computed: {
      computedCloseOnClickOutside() {
        if (typeof this.config.closeOnClickOutside === 'boolean') {
          return this.config.closeOnClickOutside;
        }
        return this.closeOnClickOutside;
      },
    },

    watch: {
      visible(visible) {
        this.isShow = visible;
      },
    },
  };
}
