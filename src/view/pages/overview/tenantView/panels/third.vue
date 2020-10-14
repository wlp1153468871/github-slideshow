<template>
    <div class="partThird">
      <div class="storage">
        <div class="storage-info">
          <information
          :form="storageObj"
          :need-type="storageObj.needType"
          :need-img="storageObj.needImg"></information>
        </div>
        <div class="network">
          <information
            :form="networkObj"
            :need-type="networkObj.needType"
            :need-img="networkObj.needImg"></information>
        </div>
      </div>
      <div class="rank-instances">
        <div class="rank-reset">
          <information
            :form="rankResetObj"
            :need-img="rankResetObj.needImg"
            :need-type="rankResetObj.needType"></information>
        </div>
        <div class="instance">
          <information
            :form="normalObj"
            :need-type="normalObj.needType"
            :need-img="normalObj.needImg"></information>
        </div>
      </div>
      <div class="normal-rate">
        <information
          :form="instanceObj"
          :need-img="instanceObj.needImg"
          :need-type="instanceObj.needType"
          :need-rank="instanceObj.needRank"></information>
        <information
          :need-type="instanceObj.needRank"
          :need-head="instanceObj.needHead"></information>
      </div>
    </div>
</template>

<script>
import information from '../../components/information';

export default {
  name: 'third',
  components: {
    information,
  },
  data() {
    return {
      storageObj: {
        name: '存储',
        count: 18,
        describe: '存储数量',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/storage.png'),
        needType: 'number',
        needImg: true,
      },
      networkObj: {
        name: '网络入口',
        count: 6,
        describe: '网络入口数量',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/network .png'),
        needType: 'number',
        needImg: true,
      },
      rankResetObj: {
        name: '应用重启次数排行 Top 5',
        needType: 'useRate',
        needImg: false,
      },
      instanceObj: {
        name: '存储',
        count: 18,
        describe: '存储数量',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/container.png'),
        needType: 'number',
        needImg: true,
        needRank: 'instanceRank',
        needHead: false,
      },
      normalObj: {
        name: '应用正常率',
        normalNumber: 42,
        total: 62,
        needImg: false,
        needType: 'needPie',
      },
    };
  },
};
</script>

<style scoped lang="scss">
.partThird {
  display: flex;
  justify-content: space-between;
  height: 280px;
  .storage {
    width: 23.5%;
    height: 100%;

    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .storage-info {
      height: 132px;
      /*background-color: #79b4ff;*/
    }
    .network {
      height: 132px;
      /*background-color: #79b4ff;*/
    }
  }
  .rank-instances {
    width: 50%;
    height: 100%;
    /*background-color: #fff;*/
    display: flex;
    justify-content: space-between;
    .rank-reset {
      width: 52%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
    }
    .instance {
      width: 45%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
    }
  }
  .normal-rate {
    width: 23.5%;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
  }
}
</style>
