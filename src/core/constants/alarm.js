export const ALARM_CONFIG = {
  key: 'alarm',
  name: '告警',
  icon: '#icon_bell',
  logo: '#icon_bell-logo',
  links: [
    {
      text: '告警中心',
      route: { name: 'console.alarm' },
    },
  ],
};

export const RULE_STATIC = {
  threshold: ['<', '>', '==', '!='],
  for: ['s', 'm', 'h', 'd', 'w', 'y'],
};
