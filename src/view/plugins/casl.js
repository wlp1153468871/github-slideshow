// import { ZONE_ROLE } from '@/core/constants/role';
// import { abilitiesPlugin } from '@casl/vue';
// import { AbilityBuilder } from '@casl/ability';
// import store from '@/core/store';
// import { find, get as getValue } from 'lodash';

// function defineAbilitiesFor(role) {
//   if (role === ZONE_ROLE.VIEW) {
//     return AbilityBuilder.define((can, cannot) => {
//       can('read', 'all');
//       cannot('read', 'Secret');
//     });
//   }

//   if (role === ZONE_ROLE.EDIT) {
//     return AbilityBuilder.define(can => {
//       can('read', 'all');
//       can('update', 'all');
//       can('create', 'all');
//     });
//   }

//   // if (role === ZONE_ROLE.ADMIN || role === PLATFORM_ROLE.ADMIN) {
//   return AbilityBuilder.define(can => {
//     can('read', 'all');
//     can('update', 'all');
//     // can('create', 'all');
//     can(['read', 'write', 'created12'], 'dashboard');
//     can('delete', 'all');
//   });
//   // }
// }

// function updateVueUsedCaslPluginWeWillInjectWatcher(Vue) {
//   store.watch(
//     x => x.user,
//     user => {
//       const zone_role = getValue(
//         find(user.zone_space_roles, { zone_id: store.state.zone.id }),
//         'zone_role',
//         ZONE_ROLE.UNAUTHORIZED,
//       );
//       if (Vue.prototype.$ability) {
//         const ability = defineAbilitiesFor(zone_role);
//         Vue.prototype.$ability.update(ability.rules); // update
//       }
//     },
//   );
// }

// export default function caslPlugin(Vue) {
//   const ability = defineAbilitiesFor(ZONE_ROLE.VIEW);
//   // const ability = defineAbilitiesFor({});
//   Vue.use(abilitiesPlugin, ability);

//   updateVueUsedCaslPluginWeWillInjectWatcher(Vue);
// }


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
