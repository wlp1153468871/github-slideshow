import { mapState } from 'vuex';
// import SpaceService from '@/core/services/space.service';
import OrgService from '@/core/services/org.service';
import AddSpaceDialog from '@/view/pages/dialogs/space/add-space';
import { omit } from 'lodash';

export default {
  name: 'SpaceList',
  components: {
    AddSpaceDialog,
  },
  data() {
    return {
      dialogConfigs: {
        addSpace: { visible: false },
      },
    };
  },
  computed: {
    spaces() {
      return this.$store.getters.orgSpaces;
    },
    ...mapState(['org']),
  },
  methods: {
    createSpace(params) {
      const space = {
        ...omit(params, 'zoneIds'),
        zone_ids: params.zoneIds,
        organization_id: this.org.id,
      };
      OrgService.createOrgSpace(this.org.id, space).then(() => {
        this.$store.dispatch('loadSpaces');
        this.$noty.success('创建项目组成功');
      });
    },

    openAddSpaceDialog() {
      this.dialogConfigs.addSpace.visible = true;
    },

    gotoSpace(space) {
      this.$store.dispatch('switchSpace', { space });
      this.$router.push({
        name: 'console.dashboard',
      });
    },
  },
};
