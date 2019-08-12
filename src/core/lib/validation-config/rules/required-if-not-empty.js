import { isEmpty } from 'lodash';

const validate = (value, [otherFieldVal] = []) => {
  const required = !!otherFieldVal;

  if (!required) {
    return {
      valid: true,
      data: {
        required,
      },
    };
  }

  const invalid = isEmpty(value);

  return {
    valid: !invalid,
    data: {
      required,
    },
  };
};

const options = {
  hasTarget: true,
  computesRequired: true,
};

export { validate, options };

export default {
  validate,
  options,
};
