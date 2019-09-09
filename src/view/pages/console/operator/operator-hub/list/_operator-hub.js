import {
  get,
  pick,
  map,
  keys,
  find,
  reduce,
  sortBy,
  cloneDeep,
  some,
  set,
  each,
  forEach,
  forOwn,
  isEmpty,
  includes,
  filter,
  clone,
  values,
} from 'lodash';
import OperatorService from '@/core/services/operator.service.ts';
import {
  ProviderType,
  InstalledState,
  CapabilityLevel,
} from '@/core/models/operator-lifecycle-manager/operator.ts';
import { PACKAGE_MANIFEST_MODEL } from '@/core/models/operator-lifecycle-manager/constant';
import { getOperatorProviderType } from '@/core/models/operator-lifecycle-manager/utils';
import {
  installedFor,
  subscriptionFor,
  iconFor,
} from '@/core/models/operator-lifecycle-manager/operator-group';
import CatalogTile from '../components/catalog-tile';
import DVerticalTabs from '../components/vertical-tabs';
import DFilterPanel from '../components/filter-panel';
import ItemDetail from '../components/item-detail';

/**
 * Filter property white list
 */
const filterGroups = ['providerType', 'provider', 'installState', 'capabilityLevel'];
const ignoredProviderTails = [', Inc.', ', Inc', ' Inc.', ' Inc', ', LLC', ' LLC'];

const defaultFilters = {
  keyword: {
    value: '',
    active: false,
  },
};

const allCategory = {
  id: 'all',
  label: 'All Itsems',
  items: [],
};
const otherCategory = {
  id: 'other',
  label: 'Other',
  items: [],
};

export default {
  name: 'OperatorHub',

  components: {
    CatalogTile,
    DVerticalTabs,
    DFilterPanel,
    ItemDetail,
  },

  data() {
    return {
      categories: {},
      operatorGroupList: [],
      subscriptionList: [],
      loading: false,
      loadError: null,
      items: [],
      namespace: 'test',
      isCategoryEmpty: ({ items }) => isEmpty(items),
      itemsSorter: itemsToSort => sortBy(itemsToSort, ({ name }) => name.toLowerCase()),
      selectedCategory: allCategory,
      activeFilters: defaultFilters,
      filterGroupsShowAll: {},
      availableFilters: {},
      emptyStateInfo: 'No OperatorHub items are being shown due to the filters being applied.',
      isShowRight: false,
      selectedItem: null,
    };
  },

  computed: {
    filterItems() {
      if (isEmpty(this.activeFilters)) {
        return this.selectedCategory.items;
      }
      const filteredByKeyword = this.filterByKeyword();
      const filteredByGroup = this.filterByGroup(filteredByKeyword);
      return [...values(filteredByGroup), filteredByKeyword].reduce((a, b) =>
        a.filter(c => b.includes(c)),
      );
    },
  },

  created() {
    Promise.all([this.listSubscriptions(), this.listOperatorGroups()]).then(() => {
      this.listPackageManifests().then(() => {
        this.availableFilters = this.getAvailableFilters(defaultFilters, this.items);
        this.categories = Object.freeze(
          this.categorizeItems(
            this.items,
            this.itemsSorter,
            this.getAvailableCategories(this.items),
          ),
        );
      });
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
      return OperatorService.listPackageManifests().then(({ items }) => {
        this.items = items.map(pkg => {
          const { currentCSVDesc } = get(pkg, 'status.channels[0]', {});
          const currentCSVAnnotations = get(currentCSVDesc, 'annotations', {});

          return Object.freeze({
            obj: pkg,
            kind: PACKAGE_MANIFEST_MODEL.kind,
            name: get(currentCSVDesc, 'displayName', pkg.metadata.name),
            uid: `${pkg.metadata.name}-${pkg.status.catalogSourceNamespace}`,
            // eslint-disable-next-line max-len
            installed: installedFor(subscriptionList)(operatorGroupList)(pkg.status.packageName)(
              namespace,
            ),
            // eslint-disable-next-line max-len
            subscription: subscriptionFor(subscriptionList)(operatorGroupList)(
              pkg.status.packageName,
            )(namespace),
            // FIXME: Just use `installed`
            // eslint-disable-next-line max-len
            installState: installedFor(subscriptionList)(operatorGroupList)(pkg.status.packageName)(
              namespace,
            )
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
          });
        });
      });
    },

    keywordCompare(filterString, item) {
      if (!filterString) {
        return true;
      }
      if (!item) {
        return false;
      }

      return (
        item.name.toLowerCase().includes(filterString) ||
        get(item, 'obj.metadata.name', '')
          .toLowerCase()
          .includes(filterString) ||
        (item.description && item.description.toLowerCase().includes(filterString)) ||
        (item.tags && item.tags.includes(filterString))
      );
    },

    getProviderValue(value) {
      if (!value) {
        return value;
      }

      const providerTail = find(ignoredProviderTails, tail => value.endsWith(tail));
      if (providerTail) {
        return value.substring(0, value.indexOf(providerTail));
      }

      return value;
    },

    getAvailableFilters(initialFilters, items) {
      const filters = cloneDeep(initialFilters);

      // Always show both install state filters
      filters.installState = {
        Installed: {
          label: 'Installed',
          value: 'Installed',
          active: false,
        },
        'Not Installed': {
          label: 'Not Installed',
          value: 'Not Installed',
          active: false,
        },
      };

      each(filterGroups, field => {
        // eslint-disable-next-line no-shadow
        const values = [];
        each(items, item => {
          let value = item[field];
          let synonyms;
          if (field === 'provider') {
            value = this.getProviderValue(value);
            synonyms = map(ignoredProviderTails, tail => `${value}${tail}`);
          }
          if (value !== undefined) {
            if (!some(values, { value })) {
              values.push({
                label: value,
                synonyms,
                value,
                active: false,
              });
            }
          }
        });

        forEach(this.sortFilterValues(values, field), nextValue =>
          set(filters, [field, nextValue.value], nextValue),
        );
      });

      return filters;
    },

    updateActiveFilters(filterType, id, value) {
      if (filterType === 'keyword') {
        set(this.activeFilters, 'keyword.value', value);
        set(this.activeFilters, 'keyword.active', !!value);
      } else {
        set(this.activeFilters, [filterType, id, 'active'], value);
      }
      this.activeFilters = reduce(
        this.availableFilters,
        (updatedFilters, filterGroup, filterGroupName) => {
          if (filterGroupName === 'keyword') {
            updatedFilters.keyword = this.activeFilters.keyword;
            return updatedFilters;
          }

          each(filterGroup, (filterItem, filterItemName) => {
            updatedFilters[filterGroupName][filterItemName].active = get(
              this.activeFilters,
              [filterGroupName, filterItemName, 'active'],
              false,
            );
          });

          return updatedFilters;
        },
        this.availableFilters,
      );
    },

    clearActiveFilters() {
      const { activeFilters } = this;
      // Clear the keyword filter
      set(activeFilters, 'keyword.value', '');
      set(activeFilters, 'keyword.active', false);

      // Clear the group filters
      each(filterGroups, field => {
        each(keys(activeFilters[field]), key => set(activeFilters, [field, key, 'active'], false));
      });
    },

    getAvailableCategories(items) {
      const newCategories = {};
      each(items, item => {
        each(item.categories, category => {
          if (!newCategories[category]) {
            newCategories[category] = {
              id: category,
              label: category,
              field: 'categories',
              values: [category],
            };
          }
        });
      });

      const sortedKeys = keys(newCategories).sort((key1, key2) =>
        key1.toLowerCase().localeCompare(key2.toLowerCase()),
      );

      return reduce(
        sortedKeys,
        (categories, key) => {
          categories[key] = newCategories[key];
          return categories;
        },
        {},
      );
    },

    categorizeItems(items, itemsSorter, initCategories) {
      const categories = {
        all: allCategory,
        ...cloneDeep(initCategories),
        other: otherCategory,
      };

      this.categorize(items, categories);
      this.pruneCategoriesWithNoItems(categories);
      this.processCategories(categories, itemsSorter);

      return Object.freeze(categories);
    },

    categorize(items, categories) {
      // Categorize each item
      each(items, item => {
        let itemCategorized = false;

        each(categories, category => {
          const matchedSubcategories = this.filterSubcategories(category, item);
          each(matchedSubcategories, subcategory => {
            this.addItem(item, category, subcategory); // add to subcategory & main category
            itemCategorized = true;
          });
        });
        if (!itemCategorized) {
          this.addItem(item, categories.other); // add to Other category
        }
      });

      categories.all.items = items;
    },

    pruneCategoriesWithNoItems(categories) {
      if (!categories) {
        return;
      }

      forOwn(categories, (category, key) => {
        if (this.isCategoryEmpty(category)) {
          delete categories[key];
        } else {
          this.pruneCategoriesWithNoItems(category.subcategories);
        }
      });
    },

    processCategories(categories, itemsSorter) {
      forOwn(categories, category => {
        if (category.items) {
          category.items = itemsSorter(category.items);
          this.processSubCategories(category, itemsSorter);
        }
      });
    },

    processSubCategories(category, itemsSorter) {
      forOwn(category.subcategories, subcategory => {
        if (subcategory.items) {
          subcategory.items = itemsSorter(subcategory.items);
          this.processSubCategories(subcategory, itemsSorter);
        }
        if (category.subcategories) {
          each(category.items, item => {
            const included = find(keys(category.subcategories), subcat =>
              includes(category.subcategories[subcat].items, item),
            );
            if (!included) {
              // eslint-disable-next-line no-shadow
              let otherCategory = get(category.subcategories, 'other');
              if (!otherCategory) {
                otherCategory = { id: `${category.id}-other`, label: 'Other', items: [] };
                category.subcategories.other = otherCategory;
              }
              otherCategory.items.push(item);
            }
          });
        }
      });
    },

    filterSubcategories(category, item) {
      if (!category.subcategories) {
        if (!category.values) {
          return [];
        }

        // eslint-disable-next-line no-shadow
        let values = get(item, category.field);
        if (!Array.isArray(values)) {
          values = [values];
        }

        const intersection = [category.values, values].reduce((a, b) =>
          a.filter(c => b.includes(c)),
        );
        if (!isEmpty(intersection)) {
          return [category];
        }

        return [];
      }

      const matchedSubcategories = [];
      forOwn(category.subcategories, subCategory => {
        // eslint-disable-next-line no-shadow
        let values = get(item, category.field);

        if (!Array.isArray(values)) {
          values = [values];
        }

        const valuesIntersection = [subCategory.values, values].reduce((a, b) =>
          a.filter(c => b.includes(c)),
        );
        if (!isEmpty(valuesIntersection)) {
          matchedSubcategories.push(subCategory, ...this.filterSubcategories(subCategory, item));
        }
      });

      return matchedSubcategories;
    },

    filterByKeyword() {
      const { keyword } = this.activeFilters;
      const { items } = this.selectedCategory;
      if (!keyword || !keyword.active) {
        return items;
      }

      const filterString = keyword.value.toLowerCase();
      return filter(items, item => this.keywordCompare(filterString, item));
    },

    filterByGroup(items) {
      // Filter items by each filter group
      return reduce(
        this.activeFilters,
        (filtered, group, key) => {
          if (key === 'keyword') {
            return filtered;
          }

          // Only apply active filters
          const activeFilters = filter(group, 'active');
          if (activeFilters.length) {
            // eslint-disable-next-line no-shadow
            const values = reduce(
              activeFilters,
              // eslint-disable-next-line no-shadow
              (filterValues, filter) => {
                filterValues.push(filter.value, ...get(filter, 'synonyms', []));
                return filterValues;
              },
              [],
            );

            filtered[key] = filter(items, item => {
              return values.includes(item[key]);
            });
          }

          return filtered;
        },
        {},
      );
    },

    // categorize item under sub and main categories
    addItem(item, category, subcategory = null) {
      // Add the item to the category
      if (!category.items) {
        category.items = [item];
      } else if (!category.items.includes(item)) {
        category.items = category.items.concat(item);
      }

      // Add the item to the subcategory
      if (subcategory) {
        if (!subcategory.items) {
          subcategory.items = [item];
        } else if (!subcategory.items.includes(item)) {
          subcategory.items = subcategory.items.concat(item);
        }
      }
    },

    // eslint-disable-next-line no-shadow
    sortFilterValues(values, field) {
      let sorter = ['value'];

      if (field === 'provider') {
        sorter = this.providerSort;
      }

      if (field === 'providerType') {
        sorter = this.providerTypeSort;
      }

      if (field === 'installState') {
        sorter = this.installedStateSort;
      }

      if (field === 'capabilityLevel') {
        sorter = this.capabilityLevelSort;
      }

      return sortBy(values, sorter);
    },

    providerSort(provider) {
      if (provider.value.toLowerCase() === 'red hat') {
        return '';
      }
      return provider.value;
    },

    providerTypeSort(provider) {
      switch (provider.value) {
        case ProviderType.RedHat:
          return 0;
        case ProviderType.Certified:
          return 1;
        case ProviderType.Community:
          return 2;
        case ProviderType.Custom:
          return 4;
        default:
          return 5;
      }
    },

    installedStateSort(provider) {
      switch (provider.value) {
        case InstalledState.Installed:
          return 0;
        case InstalledState.NotInstalled:
          return 1;
        default:
          return 3;
      }
    },

    capabilityLevelSort(provider) {
      switch (provider.value) {
        case CapabilityLevel.BasicInstall:
          return 0;
        case CapabilityLevel.SeamlessUpgrades:
          return 1;
        case CapabilityLevel.FullLifecycle:
          return 2;
        case CapabilityLevel.DeepInsights:
          return 3;
        default:
          return 5;
      }
    },

    onShowAllToggle(groupName) {
      const { filterGroupsShowAll } = this.state;
      const updatedShow = clone(filterGroupsShowAll);
      set(updatedShow, groupName, !get(filterGroupsShowAll, groupName, false));
      this.filterGroupsShowAll = updatedShow;
    },

    openOverlay(item) {
      this.selectedItem = item;
      this.isShowRight = true;
    },
  },

  updated() {},
};
