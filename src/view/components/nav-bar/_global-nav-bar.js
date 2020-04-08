import { RESOURCE_TYPE } from '@/core/constants/resource';
import { mapGetters, mapState } from 'vuex';
import { find, isEmpty, includes, cloneDeep } from 'lodash';
import getDefaultMenus from '@/core/constants/default-header-menus';
import getDetailPath from '@/view/router/util/resource-detail-map';
import getListPath from '@/view/router/util/resource-list-map';
import SpaceService from '@/core/services/space.service';

export default {
  name: 'GlobalNavBar',

  data() {
    return {
      options: [],
      searchKeyword: null,
      list: [],
      loading: false,
      triangleLeft: 0,
      expand: true,
      dropdownHeight: 0,
      headerMenus: [],
      defaultMenus: [],
      selectedIndex: -1,
      selectedSubIndex: 0,
    };
  },

  computed: {
    ...mapGetters([
      'isPlatformAdmin',
      'zoneUnauthorized',
      'isOrganizationAdmin',
    ]),
    ...mapState([
      'org',
      'orgs',
      'space',
      'theme',
      'zone',
      'user',
      'services',
      'filteredCategory',
      'isFullscreened',
      'zoneRole',
    ]),

    isDisplayOrgSelect() {
      return this.orgs.length && this.isConsoleView && this.isOrganizationAdmin;
    },

    isDisplayAppSelect() {
      return this.orgs.length && this.isConsoleView;
    },

    selectedServices() {
      return this.headerMenus[this.selectedIndex].children[
        this.selectedSubIndex
      ].services;
    },

    isConsoleView() {
      // TODO(jerry) this part will update;
      return (
        !this.$route.path.startsWith('/manage/') &&
        !this.$route.path.startsWith('/console/deploy/') &&
        !this.$route.path.startsWith('/product/checkout/')
      );
    },

    availableServices() {
      return this.services.map(s => s.id);
    },
  },

  created() {
    this.ensureServices().then(() => {
      this.$store.watch(
        () => this.$store.state.apiResource,
        apiResource => {
          if (!apiResource) return;
          const defaultMenus = getDefaultMenus();
          defaultMenus[0].children = defaultMenus[0].children.filter(resource => {
            if (resource.kind) {
              if (resource.kind === RESOURCE_TYPE.APPLICATION) return true;
              return !!apiResource[resource.kind];
            }
            return true;
          });
          this.defaultMenus = defaultMenus;
        },
        {
          immediate: true,
        },
      );
    });
  },

  destroyed() {
    this.hideDropdown();
  },

  watch: {
    filteredCategory(categories) {
      if (!categories.children) return;

      const filterValue = cloneDeep(categories).filter(category => {
        const filterCategory = category.children.filter(child => {
          const serviceList = child.services.filter(({ id, available }) => {
            return (
              available === 'available' && includes(this.availableServices, id)
            );
          });
          child.services = serviceList;
          return serviceList.length;
        });
        category.children = filterCategory;
        return filterCategory.length;
      });

      this.headerMenus.splice(0, this.headerMenus.length, ...this.defaultMenus);
      this.headerMenus.splice(
        this.headerMenus.length,
        filterValue.length,
        ...filterValue,
      );
    },

    space() {
      this.options = [];
    },
  },

  methods: {
    ensureServices() {
      return new Promise(resolve => {
        const { helpURLDict } = this.$store.state;
        if (!isEmpty(helpURLDict)) {
          resolve(helpURLDict);
        } else {
          this.$store.watch(
            () => this.$store.state.helpURLDict,
            res => {
              resolve(res);
            },
          );
        }
      });
    },

    showDropdown() {
      this.expand = true;
      this.dropdownHeight = 416;
    },

    hideDropdown() {
      this.expand = false;
      this.dropdownHeight = 0;
      this.selectedIndex = -1;
    },

    focusSelect() {
      this.$refs.globalSearch.focus();
    },

    onValueChanged(id) {
      if (!id) return;
      const [{ options: services }, { options: instances }] = this.options;
      let route;
      let resource = find(instances, { id });
      if (resource) {
        route = getDetailPath(resource);
      } else {
        resource = find(services, { id });
        route = getListPath(resource);
      }
      this.$router.push(route);
      this.options = [];
    },

    replaceTriangle(event, index) {
      this.selectedIndex = index;
      const clientWidth = event.target.clientWidth / 2;
      const left = event.target.offsetLeft + clientWidth;
      this.triangleLeft = left - 8;
      this.selectedSubIndex = 0;
      if (this.$refs.blockRight) {
        this.$refs.blockRight.scrollTo(0, 0);
      }
    },

    onMouserEnterSubMenu(index) {
      this.selectedSubIndex = index;
      if (this.$refs.blockRight) {
        this.$refs.blockRight.scrollTo(0, 0);
      }
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        SpaceService.globalSearch(query, this.zone.id).then(res => {
          this.loading = false;
          this.options = [
            {
              label: '服务',
              options: res.superservices,
            },
            {
              label: '实例',
              showType: true,
              overflowHidden: true,
              options: res.instances,
            },
          ];
        });
      } else {
        this.options = [];
      }
    },

    gotoDashboard() {
      this.$router.push({
        name: 'console.gateway',
      });
    },

    gotoProfile() {
      this.$router.push({
        name: 'console.profile',
      });
    },

    gotoOrg() {
      this.$router.push({
        name: 'console.org',
      });
    },

    onLogout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({
          name: 'home',
        });
      });
    },
  },
};
