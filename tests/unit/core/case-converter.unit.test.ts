import caseConverter from '../../../src/core/case-converter';
import { CaseType } from '../../../src/types/case-type';

describe('caseConverter', () => {
  describe('PascalCase', () => {
    it('should do nothing if the identifier is already in PascalCase', () => {
      expect(caseConverter('UserId')).toStrictEqual({
        newIdentifier: 'UserId',
        tokens: [
          'User',
          'Id'
        ]
      });
      expect(caseConverter('Users')).toStrictEqual({
        newIdentifier: 'Users',
        tokens: [
          'Users'
        ]
      });
    });

    it('should be able to convert identifier', () => {
      expect(caseConverter('user_id')).toStrictEqual({
        newIdentifier: 'UserId',
        tokens: [
          'user',
          'id'
        ]
      });
      expect(caseConverter('user_id_V2')).toStrictEqual({
        newIdentifier: 'UserIdV2',
        tokens: [
          'user',
          'id',
          'V2'
        ]
      });
    });

    it('should retain acronyms', () => {
      expect(caseConverter('ISRO_satellite_launch_date')).toStrictEqual({
        newIdentifier: 'ISROSatelliteLaunchDate',
        tokens: [
          'ISRO',
          'satellite',
          'launch',
          'date'
        ]
      });
      expect(caseConverter('homePageURL')).toStrictEqual({
        newIdentifier: 'HomePageURL',
        tokens: [
          'home',
          'Page',
          'URL'
        ]
      });
    });
  });

  describe('camelCase', () => {
    it('should do nothing if the identifier is already in camelCase', () => {
      expect(caseConverter('userId', CaseType.CAMEL_CASE)).toStrictEqual({
        newIdentifier: 'userId',
        tokens: [
          'user',
          'Id'
        ]
      });
      expect(caseConverter('id', CaseType.CAMEL_CASE)).toStrictEqual({
        newIdentifier: 'id',
        tokens: [
          'id'
        ]
      });
    });

    it('should be able to convert identifier', () => {
      expect(caseConverter('user_id', CaseType.CAMEL_CASE)).toStrictEqual({
        newIdentifier: 'userId',
        tokens: [
          'user',
          'id'
        ]
      });
      expect(caseConverter('user_id_V2', CaseType.CAMEL_CASE)).toStrictEqual({
        newIdentifier: 'userIdV2',
        tokens: [
          'user',
          'id',
          'V2'
        ]
      });
    });

    it('should retain acronyms', () => {
      expect(caseConverter('ISRO_satellite_launch_date', CaseType.CAMEL_CASE)).toStrictEqual({
        newIdentifier: 'ISROSatelliteLaunchDate',
        tokens: [
          'ISRO',
          'satellite',
          'launch',
          'date'
        ]
      });
      expect(caseConverter('homePage_URL', CaseType.CAMEL_CASE)).toStrictEqual({
        newIdentifier: 'homePageURL',
        tokens: [
          'home',
          'Page',
          'URL'
        ]
      });
    });
  });
});
