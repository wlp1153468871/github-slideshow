<template>
  <div class="operator-hub">
    <div class="page__nav-title">
      <h1 class="page__heading">
        OperatorHub
      </h1>

      <p class="page__description">
        Discover Operators from the Kubernetes community and Red Hat partners,
        curated by Red Hat.
        Operators can be installed on your clusters to provide optional add-ons and
        shared services to your developers. Once installed,
        the capabilities provided by the Operator appear in the
        <a href="/catalog">Developer Catalog</a>, providing a self-service experience.
      </p>
    </div>
    <circle-loading v-if="loading"></circle-loading>
    <template v-else>
      <d-alert
        v-if="loadError"
        style="margin-top: 20px;"
        :show-icon="true"
        type="error"
        message="No OperatorHub Items Found"
      >
        <span slot="description">
          Please check that the OperatorHub is running and that you have created
          a valid OperatorSource.
          For more information about OperatorHub, please click
          <a
            target="_blank"
            href="https://github.com/operator-framework/operator-marketplace"
          >here</a>.
        </span>
      </d-alert>
      <div class="d-catalog-page" v-else>
        <div class="d-catalog-page__tabs">
          <d-vertical-tabs
            v-model="selectedCategory"
            :tabs="categories"
          ></d-vertical-tabs>
          <d-filter-panel
            @change="updateActiveFilters"
            :available-filters="availableFilters"
          ></d-filter-panel>
        </div>
        <div class="d-catalog-page__content">
          <div class="d-catalog-page__header">
            <div class="d-catalog-page__heading text-capitalize">{{ selectedCategory.label }}</div>
            <div class="d-catalog-page__filter">
              <dao-input
                search
                @change="updateActiveFilters('keyword', null, $event)"
                placeholder="请输入搜索内容"
              >
              </dao-input>
              <div class="d-catalog-page__num-items">{{ filterItems.length }} items</div>
            </div>
          </div>
          <div class="catalog-tile-view">
            <catalog-tile
              :key="tile.name + index"
              v-for="(tile, index) in filterItems"
              :tile="tile"
            ></catalog-tile>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script src="./_operator-hub.js">
</script>

<style lang="scss" src="./_operator-hub.scss">
</style>
