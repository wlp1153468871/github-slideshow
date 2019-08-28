<template>
  <div class="login-layout">
    <div class="bg-img" :style="{backgroundImage: `url('${loginBackground}')`}"></div>
    <div class="section-logo">
      <logo-container :target="'login'" :inverse="true"></logo-container>
    </div>
    <div class="login-container" :class="{'shake': !loginFail}">
      <h2 class="title">
        {{ title }}
      </h2>
      <hr class="header-line"/>

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

      <div v-if="identityProviders.length">
        <div class="gap">或使用以下账号登录</div>
        <a
          v-for="item in identityProviders"
          :key="item.key"
          class="dao-btn ghost sso-btn"
          style="margin:10px 0"
          :href="item.login_url">
          {{ item.name }}
        </a>
      </div>

    </div>
  </div>
</template>

<script src="./login.js">
</script>

<style lang="scss">
@import './login.scss';
</style>
