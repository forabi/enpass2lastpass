'use strict';
const assert = require('assert');
const fs = require('fs');
const toCSVStream = require('./convert');
const _ = require('highland');

describe('toCSVStream', () => {
  let input;
  let output;

  beforeEach(() => {
    input = _(fs.createReadStream('./fixtures/Enpass_2016-01-11_01-42-13.txt', 'utf8'));
    output = toCSVStream({
      removeUnuseful: true,
      cleanNames: true,
      cleanUrls: true,
    })(input);
  });

  it('should have a header', (done) => {
    output.split().head().pull((err, head) => {
      assert.ok(head.indexOf('username') >= 0);
      assert.ok(head.indexOf('password') >= 0);
      assert.ok(head.indexOf('url') >= 0);
      done();
    });
  });

  it('should be able to use email if username is missing', (done) => {
    output.split()
    .filter(x => x.includes('An item with email but without a username'))
    .pull((err, line) => {
      assert.ok(line.includes('user@gmail.com'));
      done();
    });
  });

  it('should be able to clean up names', (done) => {
    output.split()
    .filter(x => x.includes('website1.com'))
    .pull((err, line) => {
      assert.ok(!line.includes('user@gmail.com'));
      done();
    });
  });

  it('should be able to clean up urls', (done) => {
    output.split()
    .filter(x => x.includes('An item with a query string'))
    .pull((err, line) => {
      assert.ok(!line.includes('https://login.live.com/login?q=1&something=yes'));
      assert.ok(line.includes('https://login.live.com/login'));
      done();
    });
  });

  it('should be able to remove unuseful entries', (done) => {
    output.split()
    .filter(x => x.includes('An item without a password or a url'))
    .pull((err, line) => {
      assert.deepEqual(line, {});
      done();
    });
  });
});
