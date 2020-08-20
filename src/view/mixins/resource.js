import Resource from '@/view/components/resource/resource-link/resource';
// eslint-disable-next-line import/no-named-as-default-member, import/no-named-as-default
import ResourceTemplateService from '@/core/services/resource.template.service';
import { mapState, mapGetters } from 'vuex';

export default key => {
  return {
    data() {
      const { name, podName } = this.$route.params;
      return {
        name,
        podName,
        template: {},
      };
    },

    computed: {
      ...mapState(['space', 'zone']),
      ...mapGetters(['gerResourceForHeader']),

      resource() {
        let resourceList;
        try {
          resourceList = this.gerResourceForHeader(key, this.name);
        } catch (e) {
          this.$router.push({ name: 'console.dashboard' });
        }
        return resourceList;
      },
    },

    methods: {
      goBack() {
        if (!this.podName) {
          const resource = new Resource(key);
          this.$router.push(resource.route);
        }
      },

      getTemplate() {
        return ResourceTemplateService.getTemplate(key).then(template => {
          template.metadata.namespace = this.space.short_name;
          this.template = template;
        });
      },
    },
  };
};
