<template>
  <div class="login-layout">
    <div
      class="bg-img"
      :style="{backgroundImage: `url('${loginBackground}')`}"
    ></div>
    <div class="section-logo">
      <logo-container
        :target="'login'"
        :inverse="true"
      ></logo-container>
    </div>
    <div
      class="login-container"
      :class="{'shake': !loginFail}"
    >
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
          style="margin:10px 0"
          :href="item.login_url"
        >
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
