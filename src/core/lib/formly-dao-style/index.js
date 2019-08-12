import fieldCheckbox from './fields/fieldCheckbox';
import fieldInput from './fields/fieldInput';
import fieldInteger from './fields/fieldInteger';
import fieldRadio from './fields/fieldRadio';
import fieldSelect from './fields/fieldSelect';
import fieldSwitch from './fields/fieldSwitch';
import fieldTextarea from './fields/fieldTextarea';
// import fieldPassword from './fields/fieldPassword';

const Fields = {
  checkbox: fieldCheckbox,
  input: fieldInput,
  integer: fieldInteger,
  radio: fieldRadio,
  select: fieldSelect,
  switch: fieldSwitch,
  textarea: fieldTextarea,
  // password: fieldPassword,
};

const FormlyDaoStyle = {
  install(Vue) {
    Object.keys(Fields).forEach(key => {
      Vue.$formly.addType(key, Fields[key]);
    });
  },
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(FormlyDaoStyle);
}

export default FormlyDaoStyle;
