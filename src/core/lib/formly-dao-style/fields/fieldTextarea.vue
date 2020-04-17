<template>
  <dao-setting-section>
    <dao-setting-item>
      <div slot="label">
        <label v-if="to.label" :for="to.id ? to.id : null">
          {{ to.label }}
        </label>
      </div>
      <div slot="content">
        <textarea
          class="dao-control"
          type="text"
          rows="3"
          :disabled="to.disabled"
          :placeholder="getAtts(to.atts, 'placeholder')"
          v-model="model[field.key]"
        >
        </textarea>
      </div>
      <p slot="content-helper">
        <span>注意: 一行一条配置, 多个用分号";"分隔</span><br />
        <span
          >示例: jndiname1 | root | root | com.mysql.jdbc.Driver |
          jdbc:mysql://localhost:3306/testSite1;</span
        >
        <span>{{ to.description }} </span>
      </p>
    </dao-setting-item>
  </dao-setting-section>
</template>

<script>
import baseField from './baseField';

export default {
  mixins: [baseField],
};
</script>
