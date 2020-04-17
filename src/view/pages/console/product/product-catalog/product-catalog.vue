<template>
  <div class="catalog-wrap">
    <div class="container">
      <p class="cate-title">{{ catalog.name }}</p>
    </div>
    <div class="container clearfix">
      <div class="dao-setting-layout">
        <div class="dao-setting-section">
          <div class="content container">
            <div
              class="cell"
              v-for="service in catalog.services"
              :key="service.id"
              @click="gotoService(service.id)"
            >
              <div class="box-wrap">
                <div class="logo" v-if="service.logo_url" v-bg-image="service.logo_url"></div>
                <logo-placeholder class="large-logo" v-if="!service.logo_url"> </logo-placeholder>
              </div>
              <div class="product-name">
                {{ service.name }}
              </div>
              <div class="product-content">
                {{ service.short_description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./product-catalog.js"></script>

<style lang="scss">
.catalog-wrap {
  .container {
    .cate-title {
      font-size: 16px;
      padding-left: 42px;
    }
  }
  .container {
    .dao-setting-layout {
      border: none;
      box-shadow: none;
      .dao-setting-section {
        .container {
          .cell {
            float: left;
            width: 260px;
            height: 258px;
            box-shadow: 0px 2px 4px 1px rgba(204, 209, 217, 0.1);
            border: 1px solid #e4e7ed;
            margin: 8px;
            background: #fff;
            border-radius: 5px;
            .box-wrap {
              width: 85px;
              height: 85px;
              margin: 42px auto 0px;
              .logo {
                width: 85px;
                height: 85px;
                margin-bottom: 28px;
                border-radius: 5px;
                border: 1px solid #e4e7ed;
                box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.07);
                // margin-left: auto;
                margin-right: auto;
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% auto;
              }
              .logo-placeholder {
                height: 85px;
                width: 85px;
                border-radius: 5px;
                overflow: hidden;
                box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.07);
                .default-logo {
                  width: 85px;
                  height: 85px;
                  border-radius: 5px;
                  svg {
                    width: 85px;
                    height: 85px;
                    margin: 0;
                  }
                }
              }
            }
            .product-name {
              text-align: center;
              margin-top: 20px;
              font-size: 16px;
            }
            .product-content {
              position: relative;
              height: 4em;
              line-height: 2em;
              text-align: center;
              font-size: 1em;
              color: #9ba3af;
              padding: 0px 32px 0px;
              display: -webkit-box;
              overflow: hidden;
              -webkit-box-orient: vertical;
              display: -moz-box;
              -moz-orient: vertical;
              -moz-line-clamp: 2; //文本行数
              &:after {
                content: '...';
                position: absolute;
                bottom: 0;
                right: 24px;
                padding-left: 40px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
