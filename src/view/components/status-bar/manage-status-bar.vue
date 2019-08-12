<template>
  <div>
    <section class="versatile-bar">
    </section>
    <section class="user-bar">
      <dao-dropdown
        trigger="click"
        :append-to-body="true"
        placement="bottom-end">
        <div class="user-profile">
          <div class="info">
            <span class="name">{{ user.username }}</span>
            <span class="permisson">平台{{ user.platform_role | platform_role }}</span>
          </div>
          <svg><use xlink:href="#icon_caret-down"></use></svg>
        </div>
        <dao-dropdown-menu slot="list">
          <dao-dropdown-item @click="onLogout()">
            <svg><use xlink:href="#icon_log-out"></use></svg>
            <span class="text">登出</span>
          </dao-dropdown-item>
        </dao-dropdown-menu>
      </dao-dropdown>
    </section>
  </div>
</template>

<script>
import { first } from 'lodash';

export default {
  name: 'ManageStatusBar',
  props: {
    user: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      docLink: '',
      zoneId: '',
    };
  },
  computed: {
    breadcrumb() {
      const { breadcrumb = [] } = this.$route.meta;
      const show = Boolean(breadcrumb.length);
      return {
        show,
        route: show ? first(breadcrumb) : {},
      };
    },
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({
          name: 'home',
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';
$logo-bg: #25282d;
$status-bar-height: 61px;
$radial-blue-border: #c1ddff;

@mixin status-bar-round() {
  width: 36px;
  height: 36px;
  border-radius: 18px;
}

.dao-status-bar {
  display: flex;
  height: $status-bar-height;
  border-bottom: $white-dark 1px solid;
  svg {
    width: 16px;
    height: 16px;

    fill: currentColor;
  }
  span {
    white-space: nowrap;
  }
  section {
    $animation-speed: 0.7;
    border-right: $white-dark 1px solid;
    &.versatile-bar {
      flex: 1;
      color: $black-light;
      line-height: $status-bar-height;
      .zone-select {
        margin-left: 40px;
      }

      .back-to-list {
        padding-left: 30px;
        color: $black-light;
        svg {
          width: 24px;
          height: 24px;
        }
        & > svg,
        & > span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    &.notification-bar {
      display: flex;
      padding: 0 16px;
      .notification {
        @include status-bar-round();
        position: relative;
        display: inline-flex;
        margin: auto 10px;
        border: 1px solid;
        border-color: $grey-light;
        border-radius: 50%;
        transition: 500ms * $animation-speed linear all;
        a {
          height: 16px;
          margin: auto;
        }
        .dao-dropdown-rel,
        .dao-tooltip-rel,
        .dao-popover-rel {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          margin: auto;
          cursor: pointer;
        }
        .dao-tooltip-inner {
          word-break: keep-all;
        }
        svg.notification-icon {
          color: $grey-light;
          transform: scale(1);
          transition: 700ms * $animation-speed 300ms * $animation-speed linear
            all;
          opacity: 1;

          fill: $grey-light;
        }
        &:hover {
          border: 1px solid $grey-dark;
          svg.notification-icon {
            fill: $grey-dark;
          }
        }
        svg.radial-progress-bar {
          @include status-bar-round();
          position: absolute;
          top: -1px;
          right: -1px;
          bottom: -1px;
          left: -1px;
          opacity: 0;
          circle {
            transition: stroke-dasharray 0.25s;

            cx: 18px;
            cy: 18px;
            fill: none;
            r: 16px;
            stroke-width: 4px;
            -webkit-transition: stroke-dasharray 0.25s;
            &.bg {
              stroke: $radial-blue-border;
            }
            &.paint {
              transform: matrix(0, -1, 1, 0, 0, 36);

              stroke: $blue;
            }
          }
        }
        span.notification-icon,
        span.notification-number,
        span.task-number {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: 14px;
          line-height: 1;
          transform: translate(-50%, -50%);
          opacity: 0;
          &.task-number {
            color: $blue;
          }
          &.notification-number {
            color: white;
          }
        }
        &.has-task {
          border-color: transparent;
          svg.radial-progress-bar {
            content: '';
            animation: change-border 300ms * $animation-speed 500ms *
              $animation-speed forwards;
            @keyframes change-border {
              from {
                transform: scale(1.15);
                opacity: 1;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          }
          // circle {
          //   -webkit-transition: stroke-dasharray .25s;
          //   transition: stroke-dasharray .25s;
          // }
          svg.notification-icon {
            transform: scale(0);
            opacity: 0;
          }
          span.task-number {
            animation: number-show 700ms * $animation-speed 900ms *
              $animation-speed forwards;
            // animation-direction: alternate;
            @keyframes number-show {
              from {
                transform: translate(-50%, -50%) scale(0.66);
                opacity: 0.25;
              }
              14% {
                transform: translate(-50%, -50%) scale(0.88);
                opacity: 0.5;
              }
              28% {
                transform: translate(-50%, -50%) scale(1.1);
                opacity: 0.75;
              }
              42% {
                transform: translate(-50%, -50%) scale(1.33);
                opacity: 1;
              }
              56% {
                transform: translate(-50%, -50%) scale(0.93);
                opacity: 1;
              }
              70% {
                transform: translate(-50%, -50%) scale(0.93);
                opacity: 1;
              }
              84% {
                transform: translate(-50%, -50%) scale(0.96);
                opacity: 1;
              }
              to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          }
        }
        &.has-warning {
          background-color: $red;
          border: none;
          .notification-icon {
            display: none;
          }
          span.notification-number {
            color: white;
            opacity: 1;
          }
        }
      }
    }
    &.user-bar {
      display: flex;
      padding: 0 15px;
      div.user-profile {
        padding: 11px 15px;
        cursor: pointer;
        div.info {
          display: inline-block;
          min-width: $status-bar-height;
          vertical-align: middle;
          span.name {
            display: block;
            color: #3d444f;
            font-size: 14px;
          }
          span.permisson {
            display: block;
            color: $grey-dark;
            font-size: 12px;
          }
        }
        svg {
          display: inline-block;
          vertical-align: middle;

          fill: $grey-dark;
        }
      }
    }
  }
}
</style>
