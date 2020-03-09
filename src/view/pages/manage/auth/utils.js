function perCompare(p1, p2) {
  const x1 = p1.id.toUpperCase();
  const x2 = p2.id.toUpperCase();
  if (x1 < x2) {
    return -1;
  }
  if (x1 > x2) {
    return 1;
  }
  return 0;
}

export function permission2treeData(permission) {
  return {
    ...permission,
    children: permission.children
      .filter(p => !p.featurePoint)
      .map(permission2treeData)
      .sort(perCompare),
    actions: permission.children.filter(p => p.featurePoint).sort(perCompare),
  };
}

export function treeData2permission(treeData) {
  return {
    ...treeData,
    children: treeData.children
      .map(treeData2permission)
      // eslint-disable-next-line function-paren-newline
      .concat(
        (treeData.actions || []).map(a => {
          return {
            ...a,
            children: a.children.map(c => {
              return {
                ...c,
                access: a.access,
              };
            }),
          };
        }),
        // eslint-disable-next-line function-paren-newline
      )
      .sort(perCompare),
    actions: undefined,
  };
}


export const getCheckedKeys = (tree, result = []) => {
  tree.forEach(item => {
    if (item.children) getCheckedKeys(item.children, result);
    if (item.access) result.push(item.featureCode);
  });
  return result;
};
