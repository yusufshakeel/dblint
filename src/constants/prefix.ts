import { ConstraintType, IndexType } from '../types/database';

export const PREFIX = {
  VIEW: 'v',
  FOREIGN_KEY: 'fk',
  TRIGGER: 'trg',
  CONSTRAINT: {
    [ConstraintType.PRIMARY_KEY]: 'pk',
    [ConstraintType.UNIQUE]: 'un',
    [ConstraintType.CHECK]: 'ck',
    [ConstraintType.EXCLUDE]: 'ex',
    [ConstraintType.CONSTRAINT_TRIGGER]: 'tr'
  },
  INDEX: {
    [IndexType.REGULAR_INDEX]: 'idx',
    [IndexType.UNIQUE_INDEX]: 'uidx',
    [IndexType.UNIQUE_PARTIAL_INDEX]: 'upidx',
    [IndexType.PARTIAL_INDEX]: 'pidx'
  }
};

export type ConstraintPrefixType = keyof typeof PREFIX.CONSTRAINT;
export type IndexPrefixType = keyof typeof PREFIX.INDEX;
