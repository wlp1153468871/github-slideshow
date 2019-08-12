import getDefaultMenus from '@/core/constants/default-header-menus';
import getDetailPath from '@/view/router/util/detail-map';
import { mapGetters, mapState } from 'vuex';
import SpaceService from '@/core/services/space.service';
import getResourcePath from '@/view/router/util/router-map';
import { find, isEmpty, includes, cloneDeep } from 'lodash';

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
    ]),

    isDisplayOrgSelect() {
      return this.orgs.length && this.isConsoleView && this.isOrganizationAdmin;
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

    isOrgView() {
      return this.$route.name.substring(0, 4) === 'org.';
    },

    availableServices() {
      return this.services.map(s => s.id);
    },
  },

  created() {
    this.ensureServices().then(() => {
      this.defaultMenus = getDefaultMenus();
    });
  },

  destroyed() {
    this.hideDropdown();
  },

  watch: {
    filteredCategory(categories) {
      if (!categories) return;

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
      return new Promise((resolve, reject) => {
        const { helpURLDict } = this.$store.state;
        if (!isEmpty(helpURLDict)) {
          resolve(helpURLDict);
        } else {
          this.$store.watch(
            () => this.$store.state.helpURLDict,
            res => {
              if (isEmpty(res)) reject();
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
      const [service = {}, instance = {}] = this.options;
      const allOptions = [...service.options, ...instance.options];
      const { route } = find(allOptions, { id }) || {};
      if (!route) return;
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
              options: res.superservices.map(superService => {
                return {
                  ...superService,
                  route: getResourcePath(superService),
                };
              }),
            },
            {
              label: '实例',
              showType: true,
              overflowHidden: true,
              options: res.instances.map(instance => {
                return {
                  ...instance,
                  route: {
                    id: instance.id,
                    ...getDetailPath(instance),
                  },
                };
              }),
            },
          ];
        });
      } else {
        this.options = [];
      }
    },

    onSelectOrg(org) {
      this.$store.dispatch('switchOrg', { org });
      this.$tada(`切换租户到 ${org.name}`, {
        buttons: false,
        timer: 2000,
      });
      this.$router.push({
        name: 'console.dashboard',
      });
    },

    gotoProfile() {
      this.$router.push({
        name: 'console.profile',
      });
    },

    gotoOrgOrManage() {
      this.$router.push({
        name: this.isOrgView ? 'console.dashboard' : 'console.org',
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
