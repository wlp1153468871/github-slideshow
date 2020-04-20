import { abilitiesPlugin } from '@casl/vue';
import { AbilityBuilder } from '@casl/ability';
import store from '@/core/store';

function defineAbilitiesFor(actions) {
  return AbilityBuilder.define(can => {
    can(actions, 'all');
  });
}

function updateVueUsedCaslPluginWeWillInjectWatcher(Vue) {
  store.watch(
    (state, getter) => {
      return getter.actions;
    },
    action => {
      if (Vue.prototype.$ability) {
        const ability = defineAbilitiesFor(action);
        Vue.prototype.$ability.update(ability.rules);
      }
    },
  );
}

export default function caslPlugin(Vue) {
  const ability = defineAbilitiesFor([]);
  Vue.use(abilitiesPlugin, ability);

  updateVueUsedCaslPluginWeWillInjectWatcher(Vue);
}
