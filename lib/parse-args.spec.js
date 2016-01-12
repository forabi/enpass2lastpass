const assert = require('assert');
const parseArgs = require('./parse-args');

describe('parseArgs', () => {
  it('should recognize long options', () => {
    const actual = parseArgs([
      '--default-email', 'email@domain.com',
      '--clean-urls',
      '--clean-names', 'false',
      '--remove-unuseful', 'false',
    ]);

    assert.equal(actual['default-email'], 'email@domain.com');
    assert.equal(actual['clean-urls'], true);
    assert.equal(actual['clean-names'], false);
    assert.equal(actual['remove-unuseful'], false);
  });

  it('should recognize --ignore-empty as an alias for --remove-unuseful', () => {
    it('when disabled', () => {
      const actual = parseArgs([
        '--ignore-empty', 'false',
      ]);

      assert.equal(actual['remove-unuseful'], false);
    });

    it('when enabled', () => {
      const actual = parseArgs([
        '--ignore-empty',
      ]);

      assert.equal(actual['remove-unuseful'], true);
    });
  });

  it('should recognize aliases -l, -n, -i, -e', () => {
    const actual = parseArgs([
      '-e', 'email@domain.com',
      '-l',
      '-n', 'false',
      '-i', 'false',
    ]);

    assert.equal(actual['default-email'], 'email@domain.com');
    assert.equal(actual['clean-urls'], true);
    assert.equal(actual['clean-names'], false);
    assert.equal(actual['remove-unuseful'], false);
  });

  it('should not provide a default email', () => {
    const actual = parseArgs([
      '-l', '-n', '-i',
    ]);

    assert.equal(actual['default-email'], null);
  });
});
