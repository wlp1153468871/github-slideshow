import { forEach } from 'lodash';

// components
// dao prefix
import DaoPropertyDialog from './property-dialog/property-dialog';
import DaoSettingItem from './setting-layout/setting-item';
import DaoSettingLayout from './setting-layout/setting-layout';
import DaoSettingSection from './setting-layout/setting-section';

// daox prefix
import InfoTable from './info-table/info-table';
import ListGroup from './list-group/list-group';
// import Slider from './slider/slider';
// import Wizard from './wizard/wizard/wizard.vue';
// import WizardContent from './wizard/wizard-content/wizard-content.vue';

const prefix = 'Daox';

function $usingDaoxPrefix(components) {
  forEach(components, (c, key) => {
    c.name = prefix + key;
  });
  return components;
}

export default {
  DaoPropertyDialog,
  DaoSettingItem,
  DaoSettingLayout,
  DaoSettingSection,
  ...$usingDaoxPrefix({
    InfoTable,
    ListGroup,
    // Slider,
    // Wizard,
    // WizardContent,
  }),
};
