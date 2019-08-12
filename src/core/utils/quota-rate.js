export default function quotaRate(qutoa) {
  return qutoa.in_use / (qutoa.limit || 1);
}
