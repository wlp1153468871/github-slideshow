const ORDER_STATUS = {
  INIT: '初始化',
  UNPAY: '未付款',
  FINISH: '已付款',
  CANCEL: '取消',
};

export default function orderStatusFilter(type) {
  return ORDER_STATUS[type] || '';
}
