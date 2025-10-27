import { Validation, ValidationEntity, ValidationType } from '../../../../../src/types/lint';
import { getStats, getTotalStats } from '../../../../../src/core/lint/PostgreSQL/PostgreSQLLintStats';

describe('PostgreSQLLintStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return stats', () => {
    const validations: Validation[] = [
      {
        type: ValidationType.INFO,
        entity: ValidationEntity.TABLE,
        identifier: 'users',
        message: 'Some message'
      },
      {
        type: ValidationType.WARNING,
        entity: ValidationEntity.TABLE,
        identifier: 'users',
        message: 'Some message'
      },
      {
        type: ValidationType.ERROR,
        entity: ValidationEntity.TABLE,
        identifier: 'users',
        message: 'Some message'
      },
      {
        type: ValidationType.ERROR,
        entity: ValidationEntity.TABLE,
        identifier: 'users',
        message: 'Some message',
        isIgnored: true,
        ignoredReason: 'Some reason'
      }
    ];

    expect(getStats(validations)).toStrictEqual({
      validations: {
        info: 1,
        warning: 1,
        error: 2,
        ignoredError: 1
      }
    });
  });

  describe('getTotalStats', () => {
    it('should return total stats', () => {
      const stats = [
        {
          validations: {
            info: 1,
            warning: 1,
            error: 2,
            ignoredError: 1
          }
        },
        {
          validations: {
            info: 0,
            warning: 0,
            error: 1,
            ignoredError: 0
          }
        }
      ];
      expect(getTotalStats(stats)).toStrictEqual({
        validations: {
          info: 1,
          warning: 1,
          error: 3,
          ignoredError: 1
        }
      });
    });
  });
});
