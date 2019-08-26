import Resource from '@/view/components/resource/resource-link/resource';
import ResourceTemplateService from '@/core/services/resource.template.service';
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    const { name } = this.$route.params;
    return {
      name,
      template: {},
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
    ...mapGetters(['gerResourceForHeader']),

    resource() {
      return this.gerResourceForHeader(this.kind, this.name);
    },
  },

  methods: {
    goBack() {
      const resource = new Resource(this.kind);
      this.$router.push(resource.route);
      resource.unwatch();
    },

    getTemplate() {
      return ResourceTemplateService.getTemplate(this.kind).then(template => {
        template.metadata.namespace = this.space.short_name;
        this.template = template;
      });
    },
  },
};
