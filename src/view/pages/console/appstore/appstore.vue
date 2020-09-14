<template>
  <div id="appstore" v-if="$can('appstoreAppinstances')">
    <div class="appstore-header">
      <div class="img-box">
        <img src="@/assets/images/app-store.png" alt="应用商店" class="img-size" />
      </div>
      <div class="header-title">服务市场</div>
      <div class="header-desc">欢迎来到 gCloud 服务市场，我们的平台提供了来自不同企业的更多的应用和 Chart 模版，
        并支持多终端访问，自建应用，让客户享受安全，便捷，快速的服务。</div>
    </div>
    <div class="dao-view-main" style="margin-bottom: 20px;margin-top: 20px">
      <div class="dao-view-content">
        <dao-select
          v-model="category"
          class="category"
          size="sm">
          <dao-option
            v-for="item in categories"
            :key="item.id"
            :value="item.name"
            :label="item.name">
          </dao-option>
        </dao-select>
        <!-- <button class="dao-btn blue has-icon" style="margin-left: 20px" @click="linkToApp">
          <svg class="icon"><use xlink:href="#icon_upload"></use></svg>
          <span class="text">新建应用</span>
        </button> -->
        <div class="screen" v-if="checkedApp.length || checkedPro.length">筛选器:
          <el-tag
            v-for="tag in checkedApp"
            :key="tag.name"
            closable
            type="info"
            @close="handleClose1()"
            style="margin-left: 10px;background-color:#E4E7ED;border: none;color: #3D444F;"
          >
            {{tag}}
          </el-tag>
          <el-tag
            v-for="tag in checkedPro"
            :key="tag.name"
            closable
            type="info"
            @close="handleClose2()"
            style="margin-left: 10px;background-color:#E4E7ED;border: none;color: #3D444F;"
          >
            {{tag}}
          </el-tag>
          <span class="clear" @click="clearAll()">全部清除</span>
        </div>
      </div>
      <dao-input
        search
        v-model="key"
        placeholder="搜索">
      </dao-input>
      <button class="dao-btn icon-btn" style="margin-left: 10px;" @click="fresh()">
        <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
      </button>
    </div>
    <div class="store-server-type">
      <span class="type-text">服务类型</span>
      <el-checkbox-group v-model="checkedApp" class="option-blank">
        <el-checkbox
          style="color:#3d444f"
          v-for="(item, index) in appType"
          :label="item"
          :key="index"
          class="type-layout"
        >{{item}}
        </el-checkbox>
      </el-checkbox-group>
      <span class="type-text">
        供应商
      </span>
      <el-checkbox-group v-model="checkedPro" :max="max">
        <el-checkbox
          style="color:#3d444f"
          v-for="(item, index) in provider"
          :label="item"
          :key="index"
          class="type-layout"
        >{{item}}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="store-item-container" v-if="applications.length">
      <!-- <div class="title">我的创建</div>
      <div class="store-item">
        <div v-for="appItem in applications" :key="appItem.id">
          <AppItem :itemData="appItem"></AppItem>
        </div>
      </div> -->
      <div v-for="(item, index) in categories" :key="index">
        <div v-if="item.name === category || category === '全部'">
          <div class="title" v-if="item.isShow">{{ item.name }}</div>
          <div class="store-item">
            <div v-for="appItem in applications" :key="appItem.id">
              <AppItem
                :itemData="appItem"
                v-if="appItem.category.includes(item.name)"
                >
              </AppItem>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-item-container" v-else>
      <div class="box">
        <svg class="icon">
          <use :xlink:href="`#icon_search`"></use>
        </svg>
        <div class="font1">找不到结果</div>
        <div class="font2">找不到与筛选条件匹配的应用</div>
      </div>
    </div>
  </div>
</template>

<script src="./appstore.js"></script>

<style lang="scss" scoped>
v-deep .el-tag {
  background: #E4E7ED;
}

#appstore {
  .appstore-header {
    height: 160px;
    background: #3D4655;
    .header-title {
      padding: 40px 0 0 60px;
      height: 33px;
      font-size: 24px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 33px;
    }
    .header-desc {
      padding: 40px 0 0 60px;
      height:20px;
      width: 700px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color: #fff;
      line-height:20px;
    }
    .img-box {
      float: right;
      height: 160px;
      width: 200px;
      .img-size {
        width: 100%;
        height: 100%;
      }
    }
  }
  .category {
    height: 32px;
    float:left;
  }
  .screen {
    float: left;
    padding-left: 20px;
    color: #3D444F;
    height: 28px;
    .clear {
      padding-left: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: #217EF2;
      cursor: pointer;
    }
  }
  .icon-container {
    width: 32px;
    height: 32px;
    padding-left: 10px;
  }
  .store-server-type {
    float: left;
    overflow: hidden;
    width: 200px;
    .type-text {
      width:180px;
      height:12px;
      margin-left: 30px;
      font-size:12px;
      font-weight:400;
      color:rgba(155,163,175,1);
      line-height:12px;
    }
    .option-blank {
      margin-bottom: 8px;
    }
    .type-layout {
      margin: 0 0 0 30px;
      width: 100%;
    }
    .type-layout:hover {
      background: rgba(56, 144, 255, 0.1);;
    }
  }
  .title {
    margin-bottom: 15px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #3D444F;
  }
  .store-item-container {
    display: block;
    width: calc(100% - 240px);
    float: right;
    .store-item {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
    }
  }
  .no-item-container {
    display: block;
    width: calc(100% - 240px);
    float: right;
    height: 500px;
    .box {
      padding-top: 150px;
      text-align: center;
      .icon{
        width: 60px;
        height: 60px;
        color: #CCD1D9;
      }
      .font1 {
        margin: 15px 0 0 15px;
        height: 18px;
        font-size: 16px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #3D444F;
        line-height: 18px;
      }
      .font2 {
        /* margin-top: 15px; */
        padding: 15px 0 0 15px;
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #9BA3AF;
        line-height: 22px;
      }
    }
  }

}
</style>
