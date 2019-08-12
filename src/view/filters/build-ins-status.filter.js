const INS_STATUS = {
  success: '成功',
  building: '正在构建',
  failure: '失败',
  cancel: '取消',
};

export default function buildInsStatusFilter(status) {
  return INS_STATUS[status] || '';
}
