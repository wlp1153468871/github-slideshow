import { orderBy, first, range } from 'lodash';

function orderPlans(plans) {
  const getQutoas = str => str.split('/').map(x => parseFloat(x));

  if (!plans.length) return plans;

  const planList = plans.map((item, index) => {
    const quotas = getQutoas(item.name);
    quotas.index = index;
    return quotas;
  });
  const length = first(planList).length; // eslint-disable-line

  return orderBy(
    planList,
    range(length),
    range(length).fill('asc'),
  ).map(x => plans[x.index]);
}

export default orderPlans;
