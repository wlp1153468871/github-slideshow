<template>
  <div class="login-layout">
    <div class="bg-img" :style="{ backgroundImage: `url('${loginBackground}')` }"></div>
    <div class="section-logo">
      <logo-container :target="'login'" :inverse="true"></logo-container>
    </div>
    <div class="login-container" :class="{ shake: !loginFail }">
      <h2 class="title">
        {{ title }}
      </h2>
      <hr class="header-line" />

      <div class="login-form" v-if="localLogin">
        <div class="form-group">
          <label>用户名</label>
          <dao-input
            width="100%"
            icon-inside
            block
            type="text"
            v-model="user.username"
            @keyup.enter="login"
            tabindex="1"
            autofocus
            name="username"
            v-validate="'required|namespace_code|min:2|max:20'"
            :message="veeErrors.first('username')"
            :status="veeErrors.has('username') ? 'error' : ''"
            data-vv-as="用户名"
          ></dao-input>
        </div>
        <div class="form-group">
          <label>密码</label>
          <dao-input
            block
            type="password"
            icon-inside
            v-model="user.password"
            @keyup.enter="login"
            tabindex="2"
            name="pwd"
            v-validate="'exclude_spaces|required|min:5'"
            :message="veeErrors.first('pwd')"
            :status="veeErrors.has('pwd') ? 'error' : ''"
            data-vv-as="密码"
          >
          </dao-input>
        </div>
        <button
          class="dao-btn blue login-btn"
          tabindex="3"
          :disabled="!isFromValid || loadings.login"
          @click="login"
        >
          登录
        </button>
      </div>

      <div v-if="ssoList.length">
        <div class="gap">或使用以下账号登录</div>
        <a
          v-for="item in ssoList"
          :key="item.key"
          class="dao-btn ghost sso-btn"
          style="margin: 10px 0;"
          :href="item.login_url"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
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
      return this.user.username && this.user.password && !this.veeErrors.any();
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

    Object.assign(this.sso, {
      ssoToken: this.$route.query.sso_token,
      identityProviderId: this.$route.query.identity_provider_id,
    });
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
          .catch(res => {
            if (res.data.error_info) {
              this.$noty.error(res.data.error_info);
            } else {
              this.$noty.error('登陆失败');
            }
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
      this.$router.push(
        {
          name: 'console.gateway',
        },
        () => {
          this.loadings.login = false;
        },
      );
    },
  },
};
</script>

<style lang="scss">
@import './login.scss';
</style>
