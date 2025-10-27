import { Stats, Validation, ValidationType } from '../../../types/lint';

export const getStats = (validations: Validation[]): Stats => {
  return validations.reduce((acc, curr) => {
    if (curr.type === ValidationType.INFO) {
      return { validations: { ...acc.validations, info: acc.validations.info + 1 } };
    } else if (curr.type === ValidationType.WARNING) {
      return { validations: { ...acc.validations, warning: acc.validations.warning + 1 } };
    } else {
      let ignoredError = acc.validations.ignoredError;
      if (curr.isIgnored) {
        ignoredError++;
      }
      return {
        validations: { ...acc.validations, error: acc.validations.error + 1, ignoredError }
      };
    }
  }, { validations: { info: 0, warning: 0, error: 0, ignoredError: 0 } } as Stats);
};

export const getTotalStats = (stats: Stats[]): Stats => {
  return stats.reduce((acc, curr) => {
    return {
      validations: {
        info: acc.validations.info + curr.validations.info,
        warning: acc.validations.warning + curr.validations.warning,
        error: acc.validations.error + curr.validations.error,
        ignoredError: acc.validations.ignoredError + curr.validations.ignoredError
      }
    };
  });
};
