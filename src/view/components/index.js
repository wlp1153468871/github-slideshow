import { forEach, camelCase } from 'lodash';
import DAlert from './alert/alert';
import Annotations from './resource/annotations/annotations';
import AppFooter from './app-footer/app-footer';
import Breadcrumb from './breadcrumb/breadcrumb';
import CircleLoading from './loading/circles';
import CommonStatusBar from './status-bar/common-status-bar';
import ConsoleSideBar from './side-bar/console-side-bar';
import ConsoleStatusBar from './status-bar/console-status-bar';
import ContainerTerminal from './container-terminal/container-terminal';
import DaoEditableInput from './dao-editable-input/dao-editable-input';
import DaoInfoSheet from './dao-info-sheet/dao-info-sheet';
import DaoTable from './dao-table/dao-table.vue';
import DaoTablePagination from './dao-table-pagination/dao-table-pagination';
import Daox from './daox';
import EditYamlDialog from './yaml-edit/edit-yaml';
import ElTableNameCell from './el-table-name-cell/el-table-name-cell';
import EmptyState from './empty-state/empty-state';
import EnvEditor from './env-editor/env-editor';
import ErrorInfo from './error-info/error-info';
import EventList from './event-list/event-list';
import EventsTable from './resource/events-table/events-table';
import GlobalNavBar from './nav-bar/global-nav-bar';
import InlineExtend from './resource/inline-extend/inline-extend.vue';
import InnerFooter from './inner-footer/inner-footer';
import InstanceRestBtns from './instance-rest-btns/instance-rest-btns';
import IntegerInput from './integer-input/integer-input';
import KubernetesObjectDescribeContainerState from './resource/kubernetes-object-describe-container-state/kubernetes-object-describe-container-state';
import Labels from './labels/labels';
import LabelTip from './label-tip/label-tip';
import LoadingStack from './loading/stack';
import LoadingState from './loading-state/loading-state';
import LoadingThreeBounce from './loading/three-bounce';
import LogoContainer from './logo-container/logo-container';
import LogoPlaceholder from './logo-placeholder/logo-placeholder';
import ManageSideBar from './side-bar/manage-side-bar';
import Markdown from './markdown/markdown';
import PodTemplateContainer from './resource/pod-template-container/pod-template-container';
import Probe from './resource/probe/probe';
import ProfileSideBar from './side-bar/profile-side-bar';
import QuotaGallery from './quota-gallery/quota-gallery';
import Replicas from './resource/replicas/replicas';
import ResourceHeader from './resource-header/resource-header';
import SaveButton from './save-button/save-button';
import Selectors from './resource/selectors/selectors';
import ServiceLogo from './service-logo/service-logo';
import SpaceCard from './space-card/space-card';
import StatusIcon from './status-icon/status-icon';
import Timeline from './timeline/timeline';
import TruncateLongText from './truncate-long-text/truncate-long-text';
import UploadInput from './upload-input/upload-input';
import XTable from './x-table/x-table';
import XTableStatus from './x-table-status/x-table-status';
import ResourceLink from './resource/resource-link/resource-link';
import OverflowTooltip from './overflow-tooltip/overflow-tooltip';
import DAside from './aside';
import { PercentCircle, PieChart, ProgressDount } from './charts';
import SpaceZone from './space-zone/space-zone';
import Marked from './marked/marked';

const components = {
  ...Daox,
  DAside,
  DAlert,
  ResourceLink,
  Annotations,
  AppFooter,
  Breadcrumb,
  CircleLoading,
  CommonStatusBar,
  ConsoleSideBar,
  ConsoleStatusBar,
  ContainerTerminal,
  DaoEditableInput,
  DaoInfoSheet,
  DaoTable, // TODO(jerry) i gonna to hell
  DaoTablePagination,
  DaoTableView: DaoTable, // TODO(jerry) i gonna to hell
  EditYamlDialog,
  ElTableNameCell,
  EmptyState,
  EnvEditor,
  ErrorInfo,
  EventList,
  EventsTable,
  GlobalNavBar,
  InlineExtend,
  InnerFooter,
  InstanceRestBtns,
  IntegerInput,
  KubernetesObjectDescribeContainerState,
  Labels,
  LabelTip,
  LoadingStack,
  LoadingState,
  LoadingThreeBounce,
  LogoContainer,
  LogoPlaceholder,
  ManageSideBar,
  Markdown,
  PercentCircle,
  PieChart,
  PodTemplateContainer,
  Probe,
  ProfileSideBar,
  ProgressDount,
  QuotaGallery,
  Replicas,
  ResourceHeader,
  SaveButton,
  Selectors,
  ServiceLogo,
  SpaceCard,
  StatusIcon,
  Timeline,
  TimelineItem: Timeline.Item,
  TruncateLongText,
  UploadInput,
  XTable,
  XTableStatus,
  OverflowTooltip,
  SpaceZone,
  Marked,
};

function install(Vue) {
  forEach(components, (c, key) => {
    const name = typeof c === 'function' ? key : c.name;
    if (name) {
      const componentName = camelCase(name);
      Vue.component(componentName, c);
    } else {
      console.error(`${key} has been deleted.`);
    }
  });
}

export default {
  install,
};
