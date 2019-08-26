// TODO : 待完善

const dict = {
  name: '名称',
  hostname: '访问域名',
  targetPort: '目标端口',
};

export default function translateFilter(key) {
  return dict[key] || key;
}
