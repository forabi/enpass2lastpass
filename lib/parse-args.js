const parseArgs = args => require('minimist')(args, {
  string: ['defaultEmail', 'output'],
  boolean: ['cleanNames', 'cleanUrls', 'removeUnuseful'],
  alias: {
    cleanNames: ['clean-names', 'n'],
    cleanUrls: ['clean-urls', 'l'],
    removeUnuseful: ['remove-unuseful', 'i', 'ignore-empty'],
    defaultEmail: ['default-email', 'e'],
    output: 'o',
  },
  default: {
    defaultEmail: null,
    cleanNames: true,
    cleanUrls: true,
    removeUnuseful: true,
    output: undefined,
  },
});

module.exports = parseArgs;
