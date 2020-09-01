const OPT_STATUS = {
  started: '开始',
  failed: '失败',
  succeed: '成功',
  timeOut: '超时',
};

function optStatusFilter(status) {
  return OPT_STATUS[status] || '';
}

export default optStatusFilter;
