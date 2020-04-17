import { abilitiesPlugin } from '@casl/vue';
import { AbilityBuilder } from '@casl/ability';
import store from '@/core/store';

function defineAbilitiesFor(actions) {
  return AbilityBuilder.define(can => {
    Object.entries(actions).forEach(([value, code]) => {
      can(code, value);
    });
  });
}

function updateVueUsedCaslPluginWeWillInjectWatcher(Vue) {
  store.watch(
    x => {
      const action = Object.assign({}, x.zoneAction, x.spaceAction, x.orgAction, x.platformAction);
      return action;
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
  const ability = defineAbilitiesFor({});
  Vue.use(abilitiesPlugin, ability);

  updateVueUsedCaslPluginWeWillInjectWatcher(Vue);
}
