<template>
  <div class="container space-view-list">
    <div class="space-tool row">
      <button
        class="dao-btn white has-icon"
        @click="openAddSpaceDialog()">
        <svg class="icon">
          <use xlink:href="#icon_plus-circled"></use>
        </svg>
        创建项目组
      </button>
    </div>
    <div class="row">
      <div
        style="padding: 5px;"
        class="col-md-3"
        v-for="space in spaces"
        :key="space.id">
        <space-card
          :space="space"
          @goto="gotoSpace">
        </space-card>
      </div>
    </div>

    <!-- dialog start -->
    <add-space-dialog
      @create="createSpace"
      :visible="dialogConfigs.addSpace.visible"
      :orgId="org.id"
      @close="dialogConfigs.addSpace.visible = false">
    </add-space-dialog>
    <!-- dialog end -->
  </div>
</template>

<script src="./space-list.js"></script>

<style lang="scss">
.space-view-list {
  .space-tool {
    margin: 5px -10px;
  }
}
</style>
