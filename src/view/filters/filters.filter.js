import Vue from 'vue';

export default function filtersFilter(data, filtersStr = '') {
  if (filtersStr.trim() === '') return data;

  const filters = filtersStr.split('|');
  if (filters.length === 0) return data;

  return filters.reduce((value, filterName) => {
    const filter = Vue.filter(filterName.trim());
    if (!filter) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`The filter named ${filterName} is not exist`);
      }
      return value;
    }
    return filter(value);
  }, data);
}
