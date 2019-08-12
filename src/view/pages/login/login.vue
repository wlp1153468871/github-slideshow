<template>
  <div class="login-layout">
    <div class="bg-img" :style="{backgroundImage: `url('${loginBackground}')`}"></div>
    <div class="section-logo">
      <logo-container :target="'login'"></logo-container>
    </div>
    <div class="login-container" :class="{'shake': !loginFail}">
      <h2 class="title">
        {{ title }}
      </h2>
      <hr class="header-line"/>

      <template v-if="!isLocalLogin">
        <div class="sgm-login">
          <img src="~@/assets/images/saic-gm-logo.png" alt="SAIC_GM"/>
          <span class="auto-redirect-message">
            <span class="time-left">{{ timeLeft }}秒</span>&nbsp;后跳转到&nbsp;
            <a :href="sgmLoginURL">上汽通用汽车统一身份管理平台</a>
          </span>
        </div>
      </template>

      <template v-if="isLocalLogin">
        <div class="login-form">
          <div class="form-group">
            <label>用户名</label>
            <dao-input
              width="100%"
              block
              type="text"
              v-model="user.username"
              @keyup.enter="login"
              tabindex="1"
              autofocus>
            </dao-input>
          </div>
          <div class="form-group">
            <label>密码</label>
            <dao-input
              block
              type="password"
              v-model="user.password"
              @keyup.enter="login"
              tabindex="2">
            </dao-input>
          </div>
          <button
            class="dao-btn blue login-btn"
            tabindex="3"
            @click="login">
            登录
          </button>
        </div>
      </template>

      <div class="login-footer">
        <span v-if="!ssoOnly" @click="toggleLoginWay(true)">本地账号登录</span>
        <span v-if="!ssoOnly" class="separate-line"></span>
        <span @click="toggleLoginWay(false)">SGM 统一认证</span>
      </div>

    </div>
  </div>
</template>

<script src="./login.js">
</script>

<style lang="scss">
@import './login.scss';
</style>
