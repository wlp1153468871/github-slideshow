<template>
  <div class="part-first">
    <div class="colony-info">
      <information
      :form="colonyInfo"
      :need-img="colonyInfo.needImg"
      :need-type="colonyInfo.needType"></information>
      <information
        :form="colonyDescription"
        :need-img="colonyDescription.needImg"
        :need-type="colonyDescription.needType"
      :need-head="colonyDescription.needHead"></information>
    </div>
    <div class="application">
      <div style="margin-bottom: 16px">
        <information
          :form="applicationObj"
          :need-img="applicationObj.needImg"
          :need-type="applicationObj.needType"></information>
      </div>
      <div>
        <information
          :form="projectGroupObj"
          :need-img="projectGroupObj.needImg"
          :need-type="projectGroupObj.needType"></information>
      </div>
    </div>
    <div class="journal">
      <information
      :form="journalObj"
      :need-img="journalObj.needImg"
      :need-type="journalObj.needType"></information>
    </div>
  </div>
</template>

<script>
import Information from '../../components/information';

export default {
  name: 'first',
  components: { Information },
  data() {
    return {
      colonyInfo: {
        name: '可用区信息',
        count: '测试可用区',
        describe: '1.15版本',
        needImg: false,
        needType: 'number',
      },
      colonyDescription: {
        needImg: false,
        needType: 'colonyInfo',
        needHead: false,
        instanceData: [{
          // eslint-disable-next-line global-require
          imgUrl: require('@/assets/images/overview/filecode.png'),
          zhName: '类型',
          des: 'k8s',
        }, {
          // eslint-disable-next-line global-require
          imgUrl: require('@/assets/images/overview/building.png'),
          zhName: '环境',
          des: 'dev',
        }, {
          // eslint-disable-next-line global-require
          imgUrl: require('@/assets/images/overview/nodesmall.png'),
          zhName: '节点数',
          des: '10',
        }, {
          // eslint-disable-next-line global-require
          imgUrl: require('@/assets/images/overview/cpu.png'),
          zhName: 'CPU',
          des: '200core',
        }, {
          // eslint-disable-next-line global-require
          imgUrl: require('@/assets/images/overview/rammemory.png'),
          zhName: '内存',
          des: '700Gb',
        }],
      },
      applicationObj: {
        name: '应用',
        count: 62,
        describe: '测试可用区应用数',
        needImg: true,
        needType: 'number',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/stack-fill.png'),
      },
      projectGroupObj: {
        name: '项目组',
        count: 24,
        describe: '测试可用区项目组数',
        needImg: true,
        needType: 'number',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/projectGrop.png'),
      },
      journalObj: {
        name: '审计日志',
        needImg: false,
        needType: 'steps',
      },
    };
  },
};
</script>

<style scoped lang="scss">
.part-first {
  display: flex;
  justify-content: space-between;
  .colony-info, .application, .journal {
    width: 31.9%;
    height: 280px;
    background-color: #fff;
    border-radius: 4px;
  }
  .application {
    background-color: transparent;
  }
}
</style>
