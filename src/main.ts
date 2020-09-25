// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// vender
import 'babel-polyfill';
import Vue from 'vue';
import VueStorage from 'vue-ls';
import { clone } from 'lodash';

// 3-part components
import DaoStyle from 'dao-style-vue';
import VueNoty from 'vuejs-noty';
import VeeValidate from 'vee-validate';
import VueFormly from 'vue-formly';

// application biz
import App from '@/view/App';
import router from '@/view/router';
import AppComponents from '@/view/components';
import store from '@/core/store';
import SchemaForm from '@daox/schema-form';
import VueFormlyDaoStyle from '@/core/lib/formly-dao-style';
import validationConfig from '@/core/lib/validation-config/vee-config';
import '@/core/lib/validation-config';
import '@/view/filters';
import '@/view/directives';

// plugins
import VueTada from '@/view/plugins/vue-tada';
import VueDaoDialog from '@/view/plugins/vue-dialog';
import JsYaml from '@/view/plugins/js-yaml';
import DayJS from '@/view/plugins/dayjs';
import CaslPlugin from '@/view/plugins/casl';

// 3rd part style
import 'dao-style-vue/styles/dao-style.css';
import 'vuejs-noty/dist/vuejs-noty.css';

import preloaderFinished from '@/core/utils/preloader';

// application style
import '@/assets/svgs';
import './assets/styles/index.scss';
import './view/plugins/element';

preloaderFinished();

Vue.use(DayJS);
Vue.use(CaslPlugin);
Vue.use(DaoStyle);
Vue.use(VeeValidate, validationConfig());
Vue.use(VueTada);
Vue.use(VueDaoDialog);
Vue.use(VueFormly);
Vue.use(SchemaForm);
Vue.use(VueFormlyDaoStyle);
Vue.use(AppComponents);
Vue.use(VueNoty, {
  timeout: 2000,
  progressBar: true,
  layout: 'topCenter',
});
Vue.use(JsYaml);

// local storage 配置
Vue.use(clone(VueStorage), {
  namespace: 'dsp_', // sorage 前缀
  name: 'ls', // 注入vue中的别名，this.$ls
  storage: 'local',
  events: ['name'],
});

new Vue({
  router,
  store,
  mounted() {
    window.appBootstrap();
  },
  render: h => h(App),
}).$mount('#app');
