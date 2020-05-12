<template>
  <div class="home">
    <div class="header">
      <div class="wide-container">
        <div class="banner-row">
          <a href="#" class="logo-link">
            <logo-container></logo-container>
          </a>
          <div class="banner-right">
            <template v-if="isAuthed">
              <router-link v-if="isPlatformAdmin" class="console" :to="{ name: 'manage' }">
                控制台
              </router-link>
              <router-link v-else :to="{ name: 'console' }" class="console">
                控制台
              </router-link>
              <dao-dropdown trigger="click" :append-to-body="true" placement="bottom-end">
                <span class="user-profile">
                  {{ user.username }}
                  <svg class="icon">
                    <use xlink:href="#icon_caret-down"></use>
                  </svg>
                </span>
                <dao-dropdown-menu slot="list">
                  <dao-dropdown-item @click="onLogout(user)">
                    <svg class="icon">
                      <use xlink:href="#icon_logout"></use>
                    </svg>
                    <span class="text">退出</span>
                  </dao-dropdown-item>
                </dao-dropdown-menu>
              </dao-dropdown>
            </template>
            <template v-else>
              <router-link :to="{ name: 'login' }" class="login">登录</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="banner">
      <div class="container">
        <div class="intro">
          <h1>
            安全稳定易用的云服务平台
          </h1>
          <ul>
            <li>统一的云服务门户入口</li>
            <li>便利的自助申请服务</li>
            <li>集中式的运维管理能力</li>
            <li>丰富的资源整合标准</li>
          </ul>
        </div>
        <img class="discuss" src="~@/assets/images/banner-discuss.png" alt="discuss" />
      </div>
    </div>
    <div class="boxes container">
      <h2 style="margin-top: 100px;">产品亮点</h2>
      <div class="box-row">
        <div class="box-item" v-for="h in highlists" :key="h.title">
          <img :src="h.src" :alt="h.title" />
          <h3>{{ h.title }}</h3>
          <p>{{ h.desc }}</p>
        </div>
      </div>
    </div>
    <div class="features">
      <div class="boxes container">
        <h2>主要产品功能</h2>
        <div class="box-row">
          <div class="box-item feature-box" v-for="f in features" :key="f.title">
            <svg>
              <use :xlink:href="f.svg"></use>
            </svg>
            <h3>{{ f.title }}</h3>
            <ul>
              <li v-for="desc in f.desc" :key="desc">
                {{ desc }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="numbers">
      <div class="container">
        <h3>企业数字化转型，服务云化，应用容器化，集中式的多云服务</h3>
        <div class="numbers-row">
          <div v-for="s in numbers" :key="s.desc">
            <h4>{{ s.number }}</h4>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="services">
      <div class="container">
        <h3>我们的服务内容</h3>
        <div class="services-row">
          <img src="~@/assets/images/home/shape.png" alt="rabbitmq" />
          <img src="~@/assets/images/home/zookeeper.png" alt="zookeeper" />
          <img src="~@/assets/images/home/elasticsearch.png" alt="elasticsearch" />
          <img src="~@/assets/images/home/bars.png" alt="bars" />
          <img src="~@/assets/images/home/service-flink.png" alt="service-flink" />
          <img src="~@/assets/images/home/nginx.png" alt="nginx" />
          <img src="~@/assets/images/home/security.png" alt="security" />
          <img src="~@/assets/images/home/rocketmq.png" alt="rocketmq" />
          <img class="wide" src="~@/assets/images/home/user-info.png" alt="user-info" />
          <img src="~@/assets/images/home/kafka.png" alt="kafka" />
        </div>
        <img class="oracle" src="~@/assets/images/home/oracle.png" alt="oracle" />
      </div>
    </div>
    <app-footer class="footer"> </app-footer>
  </div>
</template>

<script src="./home.js"></script>

<style lang="scss" scoped>
@import './home.scss';
</style>
