const RADIX = ['K', 'M', 'G', 'T'];

function autoGetSize(size = 0, s = 0) {
  const reduce = size / 1024;

  if (reduce > 1024) {
    s += 1;
    return autoGetSize(reduce, s);
  }

  return {
    reduce,
    unit: RADIX[s],
  };
}

export default autoGetSize;
