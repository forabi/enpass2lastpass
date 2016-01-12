'use strict';
const exec = require('child_process').exec;
const assert = require('assert');
const fs = require('fs');
const os = require('os');

const filename = './fixtures/Enpass_2016-01-11_01-42-13.txt';
const tmpFilename = `${os.tmpdir()}/output.txt`;

describe('Output', () => {
  let fixture1;
  before(done => {
    fs.readFile('./fixtures/output.txt', 'utf8', (readErr, str) => {
      fixture1 = str;
      done(readErr);
    });
  });

  it('should output to stdout by default', (done) => {
    exec(`./bin/index.js ${filename}`, (err, stdout, stderr) => {
      assert.ifError(stderr);
      assert.equal(stdout, fixture1);
      done();
    });
  });

  it('can output to a file instead', (done) => {
    exec(`./bin/index.js ${filename} -o ${tmpFilename}`, (err, stdout, stderr) => {
      assert.ifError(stderr);

      fs.readFile(tmpFilename, 'utf8', (tmpErr, tmpOutput) => {
        assert.equal(tmpOutput, fixture1);
        assert.ifError(tmpErr);
        done();
      });
    });
  });
});

it('should recognize options', (done) => {
  fs.readFile('./fixtures/output2.txt', 'utf8', (readErr, fixture2) => {
    exec('./bin/index.js ' + filename + ' --clean-names false ' +
    '--clean-urls false --ignore-empty false', (err, stdout, stderr) => {
      assert.ifError(stderr);
      assert.equal(stdout, fixture2);
      assert.ifError(readErr);
      done();
    });
  });
});
