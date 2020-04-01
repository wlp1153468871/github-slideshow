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
    children: (permission.children || [])
      .filter(p => p.type !== 'feature')
      .map(permission2treeData)
      .sort(perCompare),
    actions: (permission.children || []).filter(p => p.type === 'feature').sort(perCompare),
  };
}

function setTreeDataActionChildAccess(children, actionAccess) {
  if (!children || children.length === 0) {
    return children;
  }
  return children.map(c => ({
    ...c,
    children: setTreeDataActionChildAccess(c.children, actionAccess),
    access: actionAccess,
  }));
}

export function treeData2permission(treeData) {
  return {
    ...treeData,
    access: treeData.type === 'root' ? true : treeData.access,
    children: (treeData.children || [])
      .map(treeData2permission)
      // eslint-disable-next-line function-paren-newline
      .concat(
        (treeData.actions || []).map(a => {
          return {
            ...a,
            children: setTreeDataActionChildAccess(a.children, a.access),
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
