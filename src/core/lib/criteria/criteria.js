import { isNil, zip, orderBy, filter as filterBy, iteratee, overEvery } from 'lodash';
import Pagination from './pagination';

class Criteria {
  constructor(data = []) {
    this.data = data;
    this.orders = new Map();
    this.filters = new Map();
  }

  static of(list) {
    return new Criteria(list);
  }

  setData(data) {
    this.data = data;
  }

  setFilter(key, filter) {
    this.filters.set(key, filter);
    return this;
  }

  removeFilter(key) {
    this.filters.delete(key);
    return this;
  }

  setOrder(sortBy, order) {
    this.orders.set(sortBy, order);
    return this;
  }

  updateOrder(sortBy, order) {
    if (!this.orders.has(sortBy)) {
      this.orders.clear();
    }
    this.orders.set(sortBy, order);
    return this;
  }

  list() {
    let list = this.data;

    list = this.execFilter(list);
    list = this.execOrder(list);

    return list;
  }

  asPagination(tLimit, tPage) {
    const list = this.list();
    return new Pagination(list, tLimit, tPage);
  }

  execFilter(list) {
    let filteredList = list;
    if (this.filters.size) {
      const filters = Array.from(this.filters.values())
        .filter(x => !isNil(x))
        .map(iteratee);
      filteredList = filterBy(list, overEvery(filters));
    }
    return filteredList;
  }

  execOrder(list) {
    let orderedList = list;
    if (this.orders.size) {
      const orders = zip(...Array.from(this.orders));
      orderedList = orderBy(list, ...orders);
    }
    return orderedList;
  }
}

export default Criteria;
