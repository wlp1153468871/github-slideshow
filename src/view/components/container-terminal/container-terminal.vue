<template>
  <div class="xterm-wrapper">
    <button
      class="dao-btn mini blue icon-btn btn-fullscreen"
      :class="{ fullscreened: isFullscreened }"
      @click="fullScreen"
    >
      <svg class="icon">
        <use xlink:href="#icon_full-screen-exit"></use>
      </svg>
    </button>
    <div
      class="xterm-wrapper-container"
      ref="xtermContainer"
      @mouseup="copySelectionToClipboard"
      @onkeydown="keydown"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import 'xterm/dist/xterm.css';
import 'xterm/dist/addons/fullscreen/fullscreen.css';
import { Terminal } from 'xterm';
import * as fit from 'xterm/dist/addons/fit/fit';
import * as fullscreen from 'xterm/dist/addons/fullscreen/fullscreen';
import PodService from '@/core/services/pod.service';
import NodeService from '@/core/services/node.service';
import TerminalHistoryService from '@/core/services/terminal-history.service';
import SockJS from 'sockjs-client';
import { FUll_SCREENED } from '@/core/store/mutation-types';

Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);

export default {
  name: 'ContainerTerminal',

  props: {
    prevent: { type: Boolean },
    pod: { type: Object },
    container: { type: String },
    status: { type: String, default: 'disconnected' },
    autofocus: { type: Boolean },
    command: { type: String },
    screenKeys: { type: Boolean },
    isManageView: { type: Boolean, default: false },
  },

  data() {
    const { podName, namespace, zone: zoneId } = this.$route.params;
    return {
      term: null,
      alive: null,
      conn: null,
      terminalResponse: {},
      first: true,
      keyWords: [],
      podName,
      namespace,
      zoneId,
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'isFullscreened']),
  },

  mounted() {
    window.onresize = () => {
      this.sizeTerminal();
    };

    this.term = new Terminal({
      cursorBlink: true,
      fontFamily: "'Courier New', 'Courier', monospace",
      fontSize: 14,
      lineHeight: 1.3,
      theme: {
        foreground: '#f0f0f0',
        background: '#33424f',
      },
      insertMode: true,
      wraparoundMode: false,
      screenKeys: this.screenKeys || true,
      applicationCursor: true,
      mouseEvents: true,
    });

    this.term.open(this.$refs.xtermContainer);
    this.term.cursorHidden = true;
    this.term.fit();

    this.term.onData(data => {
      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            Op: 'stdin',
            Data: data,
            Rows: this.term.rows,
            Cols: this.term.cols,
          }),
        );
      }
      this.keyWords.push(data);
    });

    this.term.textarea.onkeydown = e => {
      if (e.keyCode === 8) {
        this.keyWords.pop();
        this.keyWords.pop();
      }
      if (e.keyCode === 13) {
        this.keyWords.pop();
        if (this.isManageView) {
          NodeService.executePodsCmd(
            this.namespace,
            this.podName,
            this.container,
            this.zoneId,
            { message: this.keyWords.join('') },
          );
        } else {
          TerminalHistoryService.saveTerminalHistories(
            this.space.id,
            this.zone.id,
            this.pod.metadata.name,
            this.container,
            { message: this.keyWords.join('') },
          );
        }

        this.keyWords = [];
      }
    };
    // eslint-disable-next-line no-underscore-dangle
    this.term._initialized = true;
  },

  destroyed() {
    if (this.term) {
      this.term.dispose();
      this.term.destroy();
    }
    this.disconnect();
    window.onresize = null;
  },

  watch: {
    prevent: {
      immediate: true,
      handler(prevent) {
        if (!prevent) this.connect();
      },
    },
  },

  methods: {
    // 鼠标按钮释放事件
    copySelectionToClipboard() {
      document.execCommand('Copy');
    },

    // 按键事件
    keydown(event) {
      if (event.keyCode === 13) {
        return true;
      }
      return false;
    },

    fullScreen() {
      // this.isFullscreened = !this.isFullscreened;
      this.$store.commit(FUll_SCREENED, !this.isFullscreened);
      if (this.term) this.term.toggleFullScreen(this.isFullscreened);
    },

    getPodShell() {
      if (this.isManageView) {
        return NodeService.getPodShell(
          this.namespace,
          this.podName,
          this.container,
          this.zoneId,
        );
      }
      return PodService.getPodShell({
        pod: this.pod.metadata.name,
        container: this.container,
        space: this.space.id,
        zone: this.zone.id,
      });
    },

    establishConnection() {
      return this.getPodShell().then(terminalResponse => {
        this.terminalResponse = terminalResponse;
        return new SockJS('/app-server/ws/v1/container/terminal');
      });
    },

    bindSession() {
      this.conn.send(JSON.stringify({ Op: 'bind', SessionID: this.terminalResponse.id }));
      this.sizeTerminal();
    },

    sizeTerminal() {
      if (this.term) this.term.fit();
      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            Op: 'resize',
            Rows: this.term.rows,
            Cols: this.term.cols,
          }),
        );
      }
    },

    onConnectionMessage(evt) {
      const msg = JSON.parse(evt.data);
      switch (msg.Op) {
        case 'stdout':
          this.term.write(msg.Data);
          break;
        case 'toast':
          this.term.write(msg.Data);
          break;
        default:
          console.error('Unexpected message type:', msg);
      }
    },

    onConnectionClose(evt) {
      if (evt.reason !== '' && evt.code < 1000) {
        this.term.write(evt.reason);
      } else {
        this.term.write('Connection closed\r\n');
      }
      this.$emit('update:status', 'disconnected');
      this.disconnect();
    },

    connect() {
      this.disconnect();
      if (this.term) this.term.reset();

      this.establishConnection()
        .then(socket => {
          this.conn = socket;
          this.conn.onopen = this.bindSession;
          this.conn.onmessage = this.onConnectionMessage;
          this.conn.onclose = this.onConnectionClose;

          if (this.first) {
            this.first = false;
            this.term.cursorHidden = false;
            // this.term._core.showCursor();
            if (this.autofocus && this.term.element) {
              this.term.focus();
            }
          }
        })
        .catch(ex => {
          this.onConnectionClose(ex);
        });

      this.$emit('update:status', 'connected');
    },

    disconnect() {
      this.$emit('update:status', 'disconnected');

      if (this.term) {
        this.term.cursorHidden = true;
      }

      if (this.conn) {
        this.conn.onopen = null;
        this.conn.onmessage = null;
        this.conn.onerror = null;
        this.conn.onclose = null;
        this.conn.close();
        this.conn = null;
      }
    },
  },
};
</script>

<style lang="scss" src="./_container-terminal.scss"></style>
