export default {
  name: 'WizardContent',
  props: {
    title: { type: String, default: '' },
    beforeChange: { type: Function },
    afterChange: { type: Function },
    route: { type: [String, Object] },
    additionalInfo: { type: Object, default: () => ({}) },
  },
  inject: ['addTab', 'removeTab'],
  data() {
    return {
      active: false,
      validationError: null,
      checked: false,
      tabId: '',
    };
  },
  mounted() {
    this.addTab(this);
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.removeTab(this);
  },
};
