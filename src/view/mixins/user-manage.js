import { differenceBy } from 'lodash';

export default {
  computed: {
    availableUsers() {
      const { allUsers = [], users = [] } = this;
      return differenceBy(allUsers, users, 'id');
    },
  },
};
