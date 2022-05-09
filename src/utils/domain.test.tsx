import { getInitialFromName } from './domain';

describe('Domain Utils', () => {
  it('Get correct initials from name', () => {
    expect(getInitialFromName('Peter')).toEqual('PE');
    expect(getInitialFromName('Peter Edwards')).toEqual('PE');
    expect(getInitialFromName('Peter Alex Smith')).toEqual('PS');
    expect(getInitialFromName('Peter super')).toEqual('PS');
    expect(getInitialFromName('peter Warner')).toEqual('PW');
    expect(getInitialFromName('p')).toEqual('P');
    expect(getInitialFromName('åP Miolo')).toEqual('ÅM');
  });
});
