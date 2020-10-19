<template>
    <div class="colony-panels">
      <div class="version-info">
        <information
        :form="versionInfo"
        :need-type="versionInfo.needType"
        :need-img="versionInfo.needImg"></information>
        <information
          :form="versionDescription"
          :need-type="versionDescription.needType"
          :need-img="versionDescription.needImg"
          :need-head="versionDescription.needHead"></information>
      </div>
      <div class="colony-total" ref="colonyInfo">
        <information
        :form="colonyTotal"
        :need-type="colonyTotal.needType"
        :need-img="colonyTotal.needImg"></information>
        <information
          :form="colonyInfo"
          :need-type="colonyInfo.needType"
          :need-img="colonyInfo.needImg"
          :need-head="colonyInfo.needHead"></information>
        <div class="paging" v-if="showDot">
          <div class="dot" v-for="(item,index) in dotLength" :key="index"></div>
        </div>
      </div>
    </div>
</template>

<script>
import Information from '../../components/information';

export default {
  name: 'colony',
  components: { Information },
  data() {
    return {
      versionInfo: {
        name: '版本信息',
        count: '2.3.0',
        describe: '平台版本',
        needImg: false,
        needType: 'number',
      },
      versionDescription: {
        needImg: false,
        needType: 'instanceRank',
        needHead: false,
        instanceData: [{
          name: '平台状态',
          count: '健康',
        }, {
          name: '全部应用数',
          count: 62,
        }, {
          name: '全部服务数',
          count: 24,
        }],
        needMargin: true,
      },
      colonyTotal: {
        name: '可用区',
        count: '32',
        describe: '全部可用区数',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/colony.png'),
        needImg: true,
        needType: 'number',
      },
      // 13个
      colonyInfo: {
        needImg: false,
        needType: 'instanceRank',
        needHead: false,
        instanceData: [{
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }, {
          name: 'APIServe',
          count: '健康',
        }],
      },
      dotLength: 0,
      showDot: false, // 判断什么时候显示dot
      currentIndex: 0,
      instanceArray: [],
    };
  },
  beforeMount() {

  },
  mounted() {
    const len = this.colonyInfo.instanceData.length;
    this.dotLength = Math.ceil(len / 13);
    const height = this.$refs.colonyInfo.offsetHeight;
    if (height > 576) {
      this.showDot = true;
    }
    if (this.colonyInfo.instanceData.length > 13) {
      let arr = [];
      this.colonyInfo.instanceData.forEach(item => {
        if (arr.length < 13) {
          arr.push(item);
        } else {
          this.instanceArray.push(arr);
          arr = [];
        }
      });
      if (arr.length !== 0) {
        this.instanceArray.push(arr);
      }
      // eslint-disable-next-line prefer-destructuring
      this.colonyInfo.instanceData = this.instanceArray[0];
    }
    console.log(this.colonyInfo.instanceData, this.instanceArray, 'mounted');
  },
  computed: {
  },
};
</script>

<style scoped lang="scss">
.colony-panels {
  .version-info {
    height: 280px;
    background-color: #fff;
    border-radius: 4px;
  }
  .colony-total {
    margin-top: 16px;
    background-color: #fff;
    border-radius: 4px;
    .paging {
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #E4E7EDFF;
        cursor: pointer;
        margin: 0px 5px;
      }
    }
  }
}
</style>
