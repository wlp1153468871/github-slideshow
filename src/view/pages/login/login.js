import { mapGetters } from 'vuex';
import AuthService from '@/core/services/auth.service';
import SSOService from '@/core/services/sso.service';

import loginBackground from '@/assets/images/login-bg.jpg';

export default {
  name: 'Login',
  data() {
    return {
      loginBackground,
      loginFail: false,
      user: {
        username: '',
        password: '',
      },
      identityProviders: [],
      ableLocalLogin: '',
      sso: {
        ssoToken: '',
        identityProviderId: '',
      },
    };
  },
  created() {
    this.loadSSOInfo();
    if (AuthService.isAuthed()) {
      this.returnToPage();
    }

    const { sso_token, identity_provider_id } = this.$route.query; // eslint-disable-line
    this.sso.ssoToken = sso_token; // eslint-disable-line
    this.sso.identityProviderId = identity_provider_id; // eslint-disable-line
    if (this.sso.ssoToken && this.sso.identityProviderId) {
      this.autoLogin();
    }
  },
  computed: {
    ...mapGetters(['theme']),
    isFromValid() {
      return this.user.username && this.user.password;
    },
    loginLogo() {
      return this.theme.appPicture.loginPicture;
    },
    title() {
      return this.theme.productName || 'DaoCloud Service Platform';
    },
  },
  methods: {
    login() {
      if (!this.isFromValid) {
        this.shake();
        this.$noty.error('请输入正确的用户名和密码');
      } else {
        AuthService.login(this.user.username, this.user.password)
          .then(() => {
            this.$noty.success('登录成功');
            this.returnToPage();
            this.user.username = '';
          })
          .finally(() => {
            this.user.password = '';
          });
      }
    },

    autoLogin() {
      AuthService.ssoLogin(this.sso.ssoToken, this.sso.identityProviderId).then(() => {
        this.$noty.success('登录成功');
        this.returnToPage();
      });
    },

    returnToPage() {
      const { query } = this.$route;
      if (query.from) {
        let { from } = query;
        try {
          from = JSON.parse(from);
        } catch (err) {
          /** do nothing */
        }
        this.$router.push(from);
      } else {
        this.$router.push({
          name: 'console',
        });
      }
    },

    shake() {
      this.loginFail = true;
      setTimeout(() => {
        this.loginFail = false;
      }, 400);
    },

    loadSSOInfo() {
      SSOService.getIdentityProvider().then(providers => {
        this.identityProviders = providers;
      });
      SSOService.getSSO().then(sso => {
        this.ableLocalLogin = sso;
      });
    },
  },
};
