const statusMap = {
  true: 'green',
  false: 'red',
};

export default function planStatusColorFilter(status) {
  return statusMap[status] || '';
}
