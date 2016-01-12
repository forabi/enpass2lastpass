const parseArgs = args => require('minimist')(args, {
  string: 'default-email',
  boolean: ['clean-names', 'clean-urls', 'remove-unuseful'],
  alias: {
    'clean-names': 'n',
    'clean-urls': 'l',
    'remove-unuseful': ['i', 'ignore-empty'],
    'default-email': 'e',
    output: 'o',
  },
  default: {
    'default-email': null,
    'clean-names': true,
    'clean-urls': true,
    'remove-unuseful': false,
    output: undefined,
  },
  unknown: (a) => {
    if (a === args[0]) return true;
    throw new Error(`Unknown argument ${a}.\n`);
  },
});

module.exports = parseArgs;
