import { mapGetters, mapActions, mapState } from 'vuex';
import { REFRESH_COUNT } from '@/core/constants/constants';
import AuthService from '@/core/services/auth.service';
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
    ...mapState(['ssoList', 'localLogin']),
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
      this.toConsolePage();
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
    ...mapActions(['loadSSOInfo']),
    login() {
      if (!this.isFromValid) {
        this.shake();
        this.$noty.error('请输入正确的用户名和密码');
      } else if (!this.loadings.login) {
        this.loadings.login = true;
        AuthService.login(this.user.username, this.user.password)
          .then(() => {
            this.loginSuccess();
          })
          .catch(() => {
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

    loginSuccess() {
      this.$noty.success('登录成功');
      const nowTime = new Date();
      nowTime.setSeconds(nowTime.getSeconds() + REFRESH_COUNT);
      this.$ls.set('refreshTime', nowTime.toString());
      this.toConsolePage();
    },

    toConsolePage() {
      this.$router.push({
        name: 'console',
      }, () => {
        this.loadings.login = false;
      });
    },
  },
};
