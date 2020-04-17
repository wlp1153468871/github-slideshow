import { mapState, mapGetters } from 'vuex';
import store from '@/core/store';
import AuthService from '@/core/services/auth.service';
import appSrc from '@/assets/images/application.png';
import serviceSrc from '@/assets/images/service.png';
import multiCenterSrc from '@/assets/images/multi-center.png';

export default {
  name: 'Home',

  beforeRouteEnter(to, from, next) {
    store.dispatch('loadSSOInfo');
    next();
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['isPlatformAdmin']),

    isAuthed() {
      return AuthService.isAuthed();
    },
  },

  data() {
    return {
      highlists: [
        {
          title: '应用',
          src: appSrc,
          desc: '以应用为中心的企业级数字化管理能力。',
        },
        {
          title: '服务',
          src: serviceSrc,
          desc: '标准化服务对接能力、开放能力以及自助申请能力。',
        },
        {
          title: '多数据中心',
          src: multiCenterSrc,
          desc: '企业资源能力高度化整合，以及统一管理能力。',
        },
      ],
      features: {
        application: {
          title: '应用',
          svg: '#home-app',
          desc: [
            '提供一站式的应用部署能力',
            '统一的应用运维和管理入口',
            '丰富的应用编排特性',
            '灵活的应用检查方法',
          ],
        },
        container: {
          title: '容器资源对象',
          svg: '#home-resource',
          desc: ['原生的容器运维能力', '全面且灵活的的资源管理能力', '全面的资源对象种类'],
        },
        image: {
          title: '镜像中心',
          svg: '#home-image',
          desc: [
            '多数据中心级的镜像仓库',
            '安全的镜像扫描能力',
            '统一的镜像访问入口',
            '多租户能力的镜像权限管理',
          ],
        },
        service: {
          title: '服务目录',
          svg: '#home-service',
          desc: [
            '标准的对接规范',
            '灵活的服务上下架能力',
            '高度的服务扩展能力',
            '自主开放的申请服务',
          ],
        },
        monitor: {
          title: '监控中心',
          svg: '#home-monitor',
          desc: ['社区标准化的监控方案', '多租户隔离的监控面板', '高度可扩展的监控能力'],
        },
      },
      numbers: [
        {
          number: '20+',
          desc: '企业级服务数',
        },
        {
          number: '1000+',
          desc: '可承载容器数',
        },
        {
          number: '20%+',
          desc: '资源利用率提升',
        },
      ],
    };
  },

  methods: {
    onLogout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({
          name: 'login',
        });
      });
    },
  },
};
