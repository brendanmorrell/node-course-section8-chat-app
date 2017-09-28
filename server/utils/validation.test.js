const expect = require('expect');
const {isRealString} = require('./validation.js')

describe('isRealString', () => {
  it('should reject non-string values', () => {
    let string = true;
    let string2 = undefined;
    let string3 = {name:'harold'};
    let string4 = null;
    let string5 = 98;
    expect(isRealString(string)).toBeFalsy();
    expect(isRealString(string2)).toBeFalsy();
    expect(isRealString(string3)).toBeFalsy();
    expect(isRealString(string4)).toBeFalsy();
    expect(isRealString(string5)).toBeFalsy();
  });

  it('should reject strings that are just spaces', () => {
    let string = '     '
    expect(isRealString(string)).toBeFalsy();
  });

  it('should allow any string including non-space characters', () => {
    let string = '  s 5  s'
    expect(isRealString(string)).toBeTruthy();
  });

})
