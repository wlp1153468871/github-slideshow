<template>
  <div>
    <h2 style="margin: 10px 5px;">
      {{name}}
      <a
class="sec-toggle"
v-if="isSec"
@click="toggleSecHid">{{secHid ? '显示' : '隐藏'}}</a>
    </h2>
    <table class="dao-table kv">
      <tbody v-if="haskv">
        <tr v-for="(v, k) in kvs" :key="k">
          <td>{{k}}</td>
          <td>
            <template v-if="isSec">
              <code v-if="secHid">******</code>
              <collapsible-code :code="decodeCode(v)" v-else></collapsible-code>
            </template>
            <collapsible-code :code="v" v-else-if="isCfgMpa"></collapsible-code>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr style="text-align: center">无</tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import { isEmpty } from 'lodash';
import collapsibleCode from './collapsible-code';

export default {
  name: 'formTrDialog',
  props: ['form', 'formatedSecrets', 'formatedConfigMaps'],
  components: {
    collapsibleCode,
  },
  computed: {
    isSec() {
      return !!this.form.secretRef;
    },
    isCfgMpa() {
      return !!this.form.configMapRef;
    },
    haskv() {
      return !isEmpty(this.kvs);
    },
    kvs() {
      if (this.isSec) {
        const sec = this.formatedSecrets.find(s => {
          return s.value === this.form.secretRef.name;
        });
        return sec.data;
      } else if (this.isCfgMpa) {
        const cm = this.formatedConfigMaps.find(s => {
          return s.value === this.form.configMapRef.name;
        });
        return cm.data;
      }
      return {};
    },
    name() {
      if (this.isSec) {
        return this.form.secretRef.name;
      } else if (this.isCfgMpa) {
        return this.form.configMapRef.name;
      }
      return '';
    },
  },
  data() {
    return {
      secHid: true,
    };
  },
  methods: {
    toggleSecHid() {
      this.secHid = !this.secHid;
    },
    decodeCode(code) {
      return Base64.decode(code);
    },
  },
};
</script>

<style lang="scss" scoped>
.sec-toggle {
  font-size: 14px;
  font-weight: normal;
  margin-left: 5px;
}
.dao-table.kv {
  display: table;
  width: auto;
  min-width: 600px;
  font-size: 12px;
  table-layout: fixed;
  box-sizing: border-box;
  tbody {
    tr {
      display: table-row;
    }
    td {
      line-height: 20px;
      display: table-cell;
      white-space: pre-wrap;
      max-width: 500px;
      width: 500px;
      word-break: break-word;
      // overflow: auto;
      text-overflow: initial;
      &:nth-child(1) {
        width: 150px;
        max-width: 150px;
      }
    }
  }
}
</style>
