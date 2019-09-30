export const ALARM_CONFIG = {
  key: 'alarm',
  name: '告警',
  icon: '#icon_application',
  logo: '#icon_application-logo',
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
