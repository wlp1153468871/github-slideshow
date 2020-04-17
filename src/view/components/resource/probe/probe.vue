<!-- Make sure there is no whitespace before comma -->
<template>
  <div>
    <span v-if="probe.httpGet">
      GET {{ probe.httpGet.path || '/' }} on port {{ probe.httpGet.port || 'unknown' }} ({{
        probe.httpGet.scheme || 'HTTP'
      }})
    </span>
    <span v-if="probe.exec && probe.exec.command">
      <code class="command">
        <truncate-long-text
          :content="probe.exec.command.join(' ')"
          :limit="80"
          :newline-limit="1"
          :expandable="true"
          :use-word-boundary="false"
        >
        </truncate-long-text>
      </code>
    </span>
    <span v-if="probe.tcpSocket"> Open socket on port {{ probe.tcpSocket.port }} </span>

    <small class="text-muted">
      <span v-if="probe.initialDelaySeconds" class="nowrap">
        {{ probe.initialDelaySeconds }}s delay,
      </span>
      <span class="nowrap">{{ probe.timeoutSeconds || 1 }}s timeout</span>
    </small>
  </div>
</template>

<script>
export default {
  name: 'Probe',

  props: {
    probe: { type: Object },
  },
};
</script>
