
const joinApproveStatus = (data = {}, newItemPrototype = {}) => {
  const { items = [] } = data;
  const { approvingItems = [] } = data;
  const set = new Set();
  approvingItems.forEach(({ name }) => {
    set.add(name);
  });
  items.forEach(element => {
    const name = element.metadata && element.metadata.name;
    if (set.has(name)) element.approveStatus = 'approving';
    set.delete(name);
  });

  set.forEach(name => {
    items.push({
      ...newItemPrototype, metadata: { name }, approveStatus: 'approving', isNew: true,
    });
  });
  return items;
};

export default joinApproveStatus;
