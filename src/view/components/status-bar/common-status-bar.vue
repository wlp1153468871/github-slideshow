<template>
  <nav class="container-fluid navbar" :class="{'navbar-inverse': inverse}">
    <div class="container">
      <section class="navbar-header">
        <router-link class="navbar-brand" :to="{ name: 'home' }">
          <logo-container :inverse="inverse"></logo-container>
        </router-link>
      </section>
      <section class="navbar-collapse">
        <ul class="navbar-nav navbar-right" v-if="isAuthed">
          <li>
            <router-link
              v-if="isPlatformAdmin"
              class="console"
              :to="{ name: 'manage' }">
              控制台
            </router-link>
            <router-link
              v-else
              :to="{name: 'console.dashborad'}"
              class="console">
              控制台
            </router-link>
          </li>
          <li>
            <dao-dropdown
              trigger="click"
              :append-to-body="true"
              placement="bottom-end">
              <a class="username">{{ user.username }}</a>
              <dao-dropdown-menu slot="list">
                <dao-dropdown-item @click="onLogout(user)">
                  <svg class="icon">
                    <use xlink:href="#icon_logout"></use>
                  </svg>
                  <span class="text">退出</span>
                </dao-dropdown-item>
              </dao-dropdown-menu>
            </dao-dropdown>
          </li>
        </ul>
        <ul class="navbar-nav navbar-right" v-else>
          <li class="login">
            <router-link :to="{ name: 'login' }">登录</router-link>
          </li>
        </ul>
      </section>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AuthService from '@/core/services/auth.service';

export default {
  name: 'CommonStatusBar',

  props: {
    inverse: { type: Boolean, default: false },
  },

  data() {
    return {
      lineWidth: 50,
    };
  },

  computed: {
    ...mapState(['theme', 'user']),
    ...mapGetters(['isPlatformAdmin']),

    isAuthed() {
      return AuthService.isAuthed();
    },
  },

  methods: {
    onLogout() {
      this.$store.dispatch('logout');
      this.$router.push({
        name: 'home',
      });
    },
  },
};
</script>

<style lang="scss">
.navbar {
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 54px;
  color: #fff;
  background-color: #1f201f;

  .logo-wrapper {
    display: inline-block;
    height: 100%;

    .logo {
      max-width: 100%;
      max-height: 100%;
      display: block;
      padding: 10px 0;
    }
  }

  a {
    color: #fff;

    &:hover {
      text-decoration: none;
    }
  }

  .navbar-header {
    float: left;
    margin: 0;

    .navbar-brand {
      $width-svg: 10px;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 54px;
      line-height: 45px;

      svg {
        width: 82px;
        height: 100%;
        padding: $width-svg;
        margin-left: -$width-svg;
      }

      .navPicture {
        width: 16px;
        height: 16px;
        background-size: contain;
      }
    }
  }

  .navbar-collapse {
    width: 100%;
    height: 100%;
    padding-left: 25px;
  }

  .navbar-nav {
    float: left;
    padding: 0;
    margin: 0;

    & > li {
      position: relative;
      float: left;
      display: block;
      list-style: none;

      & > a,
      a.dao-btn {
        position: relative;
        display: block;
        padding: 17px 15px;
      }

      &.line {
        position: absolute;
        bottom: 0;
        display: none;
        height: 4px;
        padding: 0;
        color: #fff;
        background-color: #4b9af2;
        border-radius: 2px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }

    &.nav-slider > li {
      &.active > a::after {
        content: ' ';
        display: block;
        width: 50px;
        height: 4px;
        margin: 0 auto;
        margin-top: 13px;
        background-color: #4b9af2;
        border-radius: 2px;
      }
    }

    .console {
      &:hover {
        color: #4b9af2;
      }
    }

    .username {
      position: relative;
      display: block;
      padding: 17px 15px;
    }
  }

  .navbar-left {
    float: left !important;
  }

  .navbar-right {
    float: right !important;

    & > li:last-child {
      & > a,
      & > .nav-dropdown {
        padding-right: 0;
      }
    }
  }

  // inverse color
  &.navbar-inverse {
    background-color: #fff;
    box-shadow: 0 2px 0 0 rgba(228, 231, 237, 0.5);
    border: none;

    a {
      color: rgba(61, 68, 79, 0.8);
    }
  }
}
</style>
