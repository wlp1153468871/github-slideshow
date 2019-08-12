import Vue from 'vue';
import { kebabCase } from 'lodash';

// import { onScrollButtom, onScrollTop } from './on-scroll';
import bgImage from './bg-image.directive';
import clickOutside from './click-outside';

const directives = {
  // onScrollButtom,
  // onScrollTop,
  bgImage,
  clickOutside,
};

Object.keys(directives).forEach(key => {
  Vue.directive(kebabCase(key), directives[key]);
});

export default directives;
