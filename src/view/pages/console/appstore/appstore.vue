<template>
  <div id="appstore">
    <div class="appstore-header">
      <div class="img-box">
        <img src="../../../../assets/images/app-store.png" alt="应用商店" class="img-size" />
      </div>
      <div class="header-title">应用商店</div>
      <div class="header-desc">应用商店简短介绍应用商店简短介绍</div>
    </div>
    <div class="dao-view-main" style="margin-bottom: 20px;">
      <div class="dao-view-content">
        <dao-select
          v-model="category"
          style="height: 32px;"
          size="sm">
          <dao-option
            v-for="item in categories"
            :key="item.id"
            :value="item.name"
            :label="item.name">
          </dao-option>
        </dao-select>
        <button class="dao-btn blue has-icon" style="margin-left: 20px" @click="linkToApp">
          <svg class="icon"><use xlink:href="#icon_upload"></use></svg>
          <span class="text">新建应用</span>
        </button>
        <div class="screen" v-if="checkedApp.length || checkedPro.length">筛选器：
          <el-tag
            v-for="tag in checkedApp"
            :key="tag.name"
            closable
            @close="handleClose1()"
          >
            {{tag}}
          </el-tag>
          <el-tag
            v-for="tag in checkedPro"
            :key="tag.name"
            closable
            @close="handleClose2()"
          >
            {{tag}}
          </el-tag>
        </div>
      </div>
      <dao-input
        search
        v-model="key"
        placeholder="搜索">
      </dao-input>
      <el-button size="mini" style="margin-left: 10px">
        <span>
          <svg class="icon">
            <use :xlink:href="`#icon_cw`"></use>
          </svg>
        </span>
      </el-button>
    </div>
    <div class="store-server-type">
      <span class="type-text">服务类型</span>
      <el-checkbox-group v-model="checkedApp">
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
      <el-checkbox-group v-model="checkedPro">
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

    <div class="store-item-container">
      <div class="title">我的创建</div>
      <div class="store-item">
        <div v-for="(appItem, index) in applications" :key="index">
          <AppItem :itemData="appItem"></AppItem>
        </div>
      </div>
      <div v-for="(item, index) in categories" :key="index">
        <div v-if="item.name === category || category === '全部'">
          <div class="title" v-if="item.isShow">{{ item.name }}</div>
          <div class="store-item">
            <div v-for="(appItem, index) in applications" :key="index">
              <AppItem :itemData="appItem" v-if="appItem.category.includes(item.name)"></AppItem>
            </div>
          </div>
        </div>
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
  background: #F1F3F6;
  overflow: hidden;
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
  .screen {
    position: absolute;
    left: 370px;
    top: 180px;
  }
  .store-server-type {
    float: left;
    overflow: hidden;
    min-width: 240px;
    .type-text {
      width:180px;
      height:12px;
      margin-left: 30px;
      font-size:12px;
      font-weight:400;
      color:rgba(155,163,175,1);
      line-height:12px;
    }
    .type-layout {
      margin: 0 0 20px 30px;
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
    display: inline-block;
    .store-item {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
    }
  }

}
</style>
