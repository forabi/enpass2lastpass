'use strict';
const assert = require('assert');
const fns = require('./fns');

describe('isUseful', () => {
  it('items with both password and url missing are not useful', () => {
    const input = {
      username: 'user',
      name: 'website.com',
      notes: 'whatever',
    };

    const actual = fns.isUseful(input);
    const expected = false;

    assert.equal(actual, expected);
  });
});

describe('cleanUrl', () => {
  it('should remove query strings only', () => {
    const input = {
      username: 'user',
      url: 'https://login.live.com/login?q=1&something=yes',
      password: '123456',
    };

    const actual = fns.cleanUrl(input);
    const expected = {
      username: 'user',
      url: 'https://login.live.com/login',
      password: '123456',
    };

    assert.deepEqual(actual, expected);
  });
});

describe('cleanName', () => {
  it('should remove "Generated password for..."', () => {
    const input = {
      username: 'user',
      url: 'https://login.live.com/login?q=1&something=yes',
      name: 'Generated password for website.com',
    };

    const actual = fns.cleanName(input);
    const expected = {
      username: 'user',
      url: 'https://login.live.com/login?q=1&something=yes',
      name: 'website.com',
    };

    assert.deepEqual(actual, expected);
  });
});

describe('fallbackToEmail', () => {
  it('should use email as username when username is missing', () => {
    const input = {
      email: 'user@gmail.com',
      url: 'https://login.live.com/login?q=1&something=yes',
      password: '123456',
    };

    const actual = fns.fallbackToEmail()(input).username;
    const expected = input.email;

    assert.equal(actual, expected);
  });

  it('should use email as username when username is missing' +
  ', even if a default one is provided', () => {
    const input = {
      email: 'user@gmail.com',
      url: 'https://login.live.com/login?q=1&something=yes',
      password: '123456',
    };

    const actual = fns.fallbackToEmail('user@gmail.com')(input).username;
    const expected = input.email;

    assert.equal(actual, expected);
  });

  it('should use provided email as username when username and email are missing', () => {
    const input = {
      url: 'https://login.live.com/login?q=1&something=yes',
      password: '123456',
    };

    const actual = fns.fallbackToEmail('default@email.com')(input).username;
    const expected = 'default@email.com';

    assert.equal(actual, expected);
  });
});

describe('toCSV', () => {
  it('should be a comma seperated value containing at ' +
'least username, password and url', () => {
    const input = {
      username: 'user',
      url: 'https://login.live.com/login?q=1&something=yes',
      password: '123456',
    };

    const row = fns.toCSV(input).split(',');
    const expected = (function containsAllRequiredFields() {
      for (const field in input) {
        if (input.hasOwnProperty(field)) {
          if (row.indexOf(input[field]) === -1) return false;
        }
      }
      return true;
    })();

    assert.ok(expected);
  });
});
