import { chunk } from 'lodash';

class Pagination {
  constructor(tList = [], tLimit, tPage = 0) {
    this.tLimit = tLimit;
    this.tPage = tPage;
    this.setList(tList);
  }

  setList(list) {
    this.tList = list;
    this.tTotalCount = list.length;
    this.tChunks = chunk(list, this.tLimit);
    if (this.tPage >= this.tChunks.length && this.tPage !== 0) this.prev();
    this.tCurrentList = this.gotoPage(this.tPage);
  }

  // go to next page
  next() {
    return this.gotoPage(this.tPage + 1);
  }

  // go to previous page;
  prev() {
    if (this.tPage > 0) {
      return this.gotoPage(this.tPage - 1);
    }
    return [];
  }

  gotoPage(tPage) {
    this.tPage = tPage;
    this.tCurrentList = this.tChunks[tPage] || [];
    return this.tCurrentList;
  }
}

export default Pagination;
