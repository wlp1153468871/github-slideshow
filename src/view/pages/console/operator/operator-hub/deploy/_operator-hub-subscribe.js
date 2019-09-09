import { mapState } from 'vuex';
import { get, flatMap, compact, flatten, intersection, isEmpty } from 'lodash';
import OperatorService from '@/core/services/operator.service.ts';
import {
  InstallModeType,
  installedFor,
  supports,
  isGlobal,
  providedAPIsFor,
  referenceForGroupVersionKind,
} from '@/core/models/operator-lifecycle-manager/operator-group.ts';
import { InstallPlanApproval } from '@/core/models/operator-lifecycle-manager/constant.ts';

const defaultChannelFor = pkg => pkg.status.defaultChannel || pkg.status.channels[0].name;

const installModesFor = pkg => channel =>
  pkg.status.channels.find(ch => ch.name === channel).currentCSVDesc.installModes;

const supportedInstallModesFor = pkg => channel =>
  installModesFor(pkg)(channel).filter(({ supported }) => supported);

const providedAPIsForChannel = pkg => channel =>
  compact(
    flatten([
      pkg.status.channels.find(ch => ch.name === channel).currentCSVDesc.customresourcedefinitions
        .owned,
      pkg.status.channels.find(ch => ch.name === channel).currentCSVDesc.apiservicedefinitions
        .owned,
    ]),
  );

export const referenceForProvidedAPI = desc =>
  get(desc, 'group')
    ? referenceForGroupVersionKind(desc.group)(desc.version)(desc.kind)
    : referenceForGroupVersionKind(desc.name.slice(desc.name.indexOf('.') + 1))(desc.version)(
        desc.kind,
      );

export default {
  name: 'OperatorHubSubscribe',

  data() {
    return {
      packageManifestList: null,
      targetNamespace: null,
      operatorGroup: [],
      selectedApproval: InstallPlanApproval.Automatic,
      subscription: [],
      InstallModeType,
      packageManifest: null,
      selectedUpdateChannel: null,
      selectedInstallMode: null,
      approvals: [
        { value: InstallPlanApproval.Automatic, title: 'Automatic' },
        { value: InstallPlanApproval.Manual, title: 'Manual' },
      ],
    };
  },

  computed: {
    ...mapState(['spaces']),

    selectedTargetNamespace() {
      if (this.selectedInstallMode === InstallModeType.InstallModeTypeAllNamespaces) {
        return get(
          this.operatorGroup.find(og => og.metadata.name === 'global-operators'),
          'metadata.namespace',
        );
      }
      return this.targetNamespace;
    },

    channels() {
      return get(this.packageManifest, 'status.channels', []);
    },

    installModes() {
      return get(
        this.channels.find(ch => ch.name === this.selectedUpdateChannel),
        'currentCSVDesc.installModes',
        [],
      );
    },

    supportsSingle() {
      return get(
        this.installModes.find(m => m.type === InstallModeType.InstallModeTypeOwnNamespace),
        'supported',
      );
    },

    supportsGlobal() {
      return get(
        this.installModes.find(m => m.type === InstallModeType.InstallModeTypeAllNamespaces),
        'supported',
      );
    },
  },

  created() {
    Promise.all([
      this.getPackageManifest(),
      this.getOperatorGroup(),
      this.listSubscriptions(),
    ]).then(() => {
      this.packageManifest = get(this.packageManifestList, 'items[0]');
      this.selectedUpdateChannel = defaultChannelFor(this.packageManifest);
      this.selectedInstallMode = supportedInstallModesFor(this.packageManifest)(
        this.selectedUpdateChannel,
      ).reduce(
        (preferredInstallMode, mode) =>
          mode.type === InstallModeType.InstallModeTypeAllNamespaces
            ? InstallModeType.InstallModeTypeAllNamespaces
            : preferredInstallMode,
        InstallModeType.InstallModeTypeOwnNamespace,
      );
    });
  },

  methods: {
    getPackageManifest() {
      OperatorService.getPackageManifest().then(res => {
        this.packageManifestList = res;
      });
    },

    getOperatorGroup() {
      OperatorService.getOperatorGroup().then(res => {
        this.operatorGroup = res.items;
      });
    },

    listSubscriptions() {
      return OperatorService.listSubscriptions().then(({ items }) => {
        this.subscription = items;
      });
    },

    descFor(mode) {
      if (mode === InstallModeType.InstallModeTypeAllNamespaces && this.supportsGlobal) {
        return 'Operator will be available in all namespaces.';
      }
      if (mode === InstallModeType.InstallModeTypeOwnNamespace && this.supportsSingle) {
        return 'Operator will be available in a single namespace only.';
      }
      return 'This mode is not supported by this Operator';
    },

    subscriptionExists(ns) {
      installedFor(this.subscription)(this.operatorGroup)(this.packageManifest.status.packageName)(
        ns,
      );
    },

    namespaceSupports(ns) {
      return mode => {
        const operatorGroup = this.operatorGroup.find(og => og.metadata.namespace === ns);
        if (!operatorGroup || !ns) {
          return true;
        }
        return supports([{ type: mode, supported: true }])(operatorGroup);
      };
    },

    conflictingProvidedAPIs(ns) {
      const operatorGroups = this.operatorGroup.filter(
        og => og.status.namespaces.includes(ns) || isGlobal(og),
      );
      if (isEmpty(operatorGroups)) {
        return [];
      }
      const existingAPIs = flatMap(operatorGroups, providedAPIsFor);
      const providedAPIs = providedAPIsForChannel(this.packageManifest)(
        this.selectedUpdateChannel,
      ).map(desc => referenceForProvidedAPI(desc));

      return intersection(existingAPIs, providedAPIs);
    },
  },
};
