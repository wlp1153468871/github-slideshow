import { mapGetters } from 'vuex';
import { REFRESH_COUNT } from '@/core/constants/constants';
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
      loadings: {
        login: false,
      },
    };
  },

  computed: {
    ...mapGetters(['theme']),
    isFromValid() {
      return this.user.username
        && this.user.password
        && !this.veeErrors.any();
    },
    title() {
      return this.theme.productName || 'DaoCloud Service Platform';
    },
  },

  created() {
    this.loadSSOInfo();
    if (AuthService.isAuthed()) {
      this.returnToPage();
    }

    Object.assign(
      this.sso,
      {
        ssoToken: this.$route.query.sso_token,
        identityProviderId: this.$route.query.identity_provider_id,
      },
    );
    if (this.sso.ssoToken && this.sso.identityProviderId) {
      this.autoLogin();
    }
  },

  methods: {
    login() {
      if (!this.isFromValid) {
        this.shake();
        this.$noty.error('请输入正确的用户名和密码');
      } else {
        this.loadings.login = true;
        AuthService.login(this.user.username, this.user.password)
          .then(() => {
            this.loginSuccess();
          })
          .finally(() => {
            this.loadings.login = false;
          });
      }
    },

    autoLogin() {
      AuthService.ssoLogin(this.sso.ssoToken, this.sso.identityProviderId).then(() => {
        this.loginSuccess();
      });
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

    loginSuccess() {
      this.$noty.success('登录成功');
      const nowTime = new Date();
      nowTime.setSeconds(nowTime.getSeconds() + REFRESH_COUNT);
      this.$ls.set('refreshTime', nowTime.toString());
      this.returnToPage();
    },

    returnToPage() {
      this.$router.push({
        name: 'console',
      });
    },
  },
};
