import { REFRESH_COUNT } from '@/core/constants/constants';
import store from '@/core/store';
import { mapState, mapGetters } from 'vuex';
import AuthService from '@/core/services/auth.service';
import SSOService from '@/core/services/sso.service';
import loginBackground from '@/assets/images/login-bg.jpg';

export default {
  name: 'Login',

  beforeRouteEnter(to, from, next) {
    store.dispatch('loadSSOInfo').finally(() => {
      next();
    });
  },

  data() {
    return {
      loginBackground,
      loginFail: false,
      user: { username: '', password: '' },
      sso: { ssoToken: '', identityProviderId: '' },
      isLocalLogin: false,
      timer: null,
      timeLeft: 3,
      ssoOnly: true,
    };
  },

  computed: {
    ...mapState(['sgmLoginURL', 'sgmSso']),
    ...mapGetters(['theme']),

    isFromValid() {
      return this.user.username && this.user.password;
    },

    title() {
      return this.theme.productName || '如意云';
    },
  },

  created() {
    this.loadSSOInfo();
    if (AuthService.isAuthed()) {
      this.returnToPage();
    }

    const { sso_token, identity_provider_id } = this.$route.query;
    this.sso.ssoToken = sso_token;
    this.sso.identityProviderId = identity_provider_id;
    if (this.sso.ssoToken && this.sso.identityProviderId) {
      this.autoLogin();
    } else {
      this.triggerTimer();
    }
  },

  destroyed() {
    this.clearTimer();
  },

  methods: {
    loadSSOInfo() {
      SSOService.getSSO().then(sso => {
        this.ssoOnly = !sso.enable_local_login;
      });
    },

    toggleLoginWay(isLocalLogin) {
      this.isLocalLogin = isLocalLogin;
      if (this.isLocalLogin) {
        this.clearTimer();
      } else {
        this.triggerTimer();
      }
    },

    clearTimer() {
      window.clearInterval(this.timer);
      this.timer = null;
    },

    triggerTimer() {
      const TIME_COUNT = 3;
      if (!this.timer) {
        this.timeLeft = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.timeLeft > 0 && this.timeLeft <= TIME_COUNT) {
            this.timeLeft -= 1;
          } else {
            this.clearTimer();
            window.location.href = this.sgmLoginURL;
          }
        }, 1000);
      }
    },

    login() {
      if (!this.isFromValid) {
        this.shake();
        this.$noty.error('请输入正确的用户名和密码');
      } else {
        AuthService.login(this.user.username, this.user.password)
          .then(() => {
            this.loginSuccess();
            this.user.username = '';
          })
          .finally(() => {
            this.user.password = '';
          });
      }
    },

    autoLogin() {
      AuthService.ssoLogin(this.sso.ssoToken, this.sso.identityProviderId).then(() => {
        this.loginSuccess();
      });
    },

    returnToPage() {
      this.$router.push({
        name: 'console',
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
      this.returnToPage();
    },
  },
};
