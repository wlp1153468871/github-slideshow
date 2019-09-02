<template>
  <tr>
    <td>
      <span v-if="!port.nodePort" class="text-muted">暂无</span>
      <span v-if="port.nodePort">{{port.nodePort}}</span>
    </td>

    <td role="presentation" class="text-muted text-center">
      <svg class="icon text-muted">
        <use xlink:href="#icon_arrow-right"></use>
      </svg>
    </td>

    <td data-title="Service Port">
      {{port.port}}/{{port.protocol}}
      <span v-if="port.name">({{port.name}})</span>
    </td>

    <td role="presentation" class="text-muted text-center">
      <svg class="icon text-muted">
        <use xlink:href="#icon_arrow-right"></use>
      </svg>
    </td>

    <td data-title="Target Port">
      {{port.targetPort}}
    </td>

    <td data-title="Hostname"><span class="text-muted">暂无</span></td>

    <td data-title="Termination">
      <span class="text-muted">暂无</span>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'UnusedPort',

  props: {
    port: { type: Object },
  },
};
</script>
