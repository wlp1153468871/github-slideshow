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
        <div class="d-catalog-page__tabs"></div>
        <div class="d-catalog-page__content">
          <div class="catalog-tile-view">
            <catalog-tile
              :key="index"
              v-for="(tile, index) in operatorHubItemList"
              :tile="tile"
            ></catalog-tile>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { get, pick, map } from 'lodash';
import OperatorService from '@/core/services/operator.service.ts';
import { PACKAGE_MANIFEST_MODEL } from '@/core/models/operator-lifecycle-manager/constant';
import {
  installedFor,
  subscriptionFor,
  iconFor,
} from '@/core/models/operator-lifecycle-manager/operator-group';
import { getOperatorProviderType } from '@/core/models/operator-lifecycle-manager/utils';
import CatalogTile from './components/catalog-tile';

export default {
  name: 'OperatorHub',

  components: {
    CatalogTile,
  },

  data() {
    return {
      operatorGroupList: [],
      subscriptionList: [],
      loading: false,
      loadError: null,
      operatorHubItemList: [],
      namespace: 'test',
    };
  },

  created() {
    Promise.all([this.listSubscriptions(), this.listOperatorGroups()]).then(() => {
      this.listPackageManifests();
    });
  },

  methods: {
    listSubscriptions() {
      return OperatorService.listSubscriptions().then(({ items }) => {
        this.subscriptionList = items;
      });
    },

    listOperatorGroups() {
      return OperatorService.listOperatorGroups().then(({ items }) => {
        this.operatorGroupList = items;
      });
    },

    listPackageManifests() {
      const { operatorGroupList, subscriptionList, namespace } = this;
      OperatorService.listPackageManifests().then(({ items }) => {
        this.operatorHubItemList = items.map(pkg => {
          const { currentCSVDesc } = get(pkg, 'status.channels[0]', {});
          const currentCSVAnnotations = get(currentCSVDesc, 'annotations', {});

          return {
            obj: pkg,
            kind: PACKAGE_MANIFEST_MODEL.kind,
            name: get(currentCSVDesc, 'displayName', pkg.metadata.name),
            uid: `${pkg.metadata.name}-${pkg.status.catalogSourceNamespace}`,
            // eslint-disable-next-line max-len
            installed: installedFor(subscriptionList)(operatorGroupList)(pkg.status.packageName)(namespace),
            // eslint-disable-next-line max-len
            subscription: subscriptionFor(subscriptionList)(operatorGroupList)(pkg.status.packageName)(namespace),
            // FIXME: Just use `installed`
            // eslint-disable-next-line max-len
            installState: installedFor(subscriptionList)(operatorGroupList)(pkg.status.packageName)(namespace)
              ? 'Installed'
              : 'Not Installed',
            imgUrl: iconFor(pkg),
            description: currentCSVAnnotations.description || currentCSVDesc.description,
            longDescription: currentCSVDesc.description || currentCSVAnnotations.description,
            provider: get(pkg, 'status.provider.name', get(pkg, 'metadata.labels.provider')),
            providerType: getOperatorProviderType(pkg),
            tags: pkg.metadata.tags,
            version: get(currentCSVDesc, 'version'),
            categories:
              currentCSVAnnotations.categories &&
              map(currentCSVAnnotations.categories.split(','), category => category.trim()),
            catalogSource: get(pkg, 'status.catalogSource'),
            catalogSourceNamespace: get(pkg, 'status.catalogSourceNamespace'),
            ...pick(currentCSVAnnotations, [
              'certifiedLevel',
              'healthIndex',
              'repository',
              'containerImage',
              'createdAt',
              'support',
            ]),
            capabilityLevel: currentCSVAnnotations.capabilities,
          };
        });
      });
    },
  },
};
</script>

<style lang="scss" src="./_operator-hub.scss">
</style>
