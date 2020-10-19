<template>
    <div class="part-third">
      <div class="normal">
        <information
          :form="normalObj"
          :need-type="normalObj.needType"
          :need-img="normalObj.needImg"></information>
      </div>
      <div class="instances">
        <information
          :form="instanceObj"
          :need-img="instanceObj.needImg"
          :need-type="instanceObj.needType"
          :need-rank="instanceObj.needRank"></information>
        <information
          :need-type="instanceObj.needRank"
          :need-head="instanceObj.needHead"></information>
      </div>
      <div class="storage">
        <div class="application">
          <information
            :needType="infoObj.needType"
            :needImg="infoObj.needImg"
            :form="infoObj"></information>
        </div>
        <div class="other">
          <div class="other-work">
            <information
              :form="workObj"
              :need-img="workObj.needImg"
              :need-type="workObj.needType"></information>
          </div>
          <div class="other-container">
            <information
              :form="containerObj"
              :need-img="containerObj.needImg"
              :need-type="containerObj.needType"></information>
          </div>
        </div>
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
      normalObj: {
        name: '应用正常率',
        normalNumber: 42,
        total: 62,
        needImg: false,
        needType: 'needPie',
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
      infoObj: {
        name: '应用',
        count: 62,
        describe: '全部应用数',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/stack-fill.png'),
        needType: 'number',
        needImg: true,
      },
      workObj: {
        name: '工作负载',
        count: 24,
        describe: '工作负载数',
        needType: 'number',
        needImg: false,
      },
      containerObj: {
        name: '容器组',
        count: 16,
        describe: '容器组数',
        needType: 'number',
        needImg: false,
      },
    };
  },
};
</script>

<style scoped lang="scss">
.part-third {
  display: flex;
  justify-content: space-between;
  .normal, .instances, .storage {
    width: 31.9%;
    height: 280px;
    background-color: #fff;
    border-radius: 4px;
  }
  .storage {
    background-color: transparent;
    .application {
      width: 100%;
      height: 132px;
      overflow: hidden;
      background-color: #fff;
      border-radius: 4px;
    }
    .other {
      width: 100%;
      height: 132px;
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      .other-work, .other-container {
        width: 48%;
      }
    }
  }
}
</style>
