const ORDER_TYPE = {
  NEW: '新建',
  RENEW: '续费',
  UPDATE: '更新',
  DELETE: '删除',
};

export default function orderTypeFilter(type) {
  return ORDER_TYPE[type] || '';
}
