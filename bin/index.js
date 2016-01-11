#!/bin/env node
'use strict';

const fs = require('fs');
const _ = require('highland');
const toCSV = require('../lib/convert');

const fatal = e => {
  process.stderr.write(e.message + '\n');
  process.exit(1);
};

const parseArgs = args => require('minimist')(args, {
  string: 'default-email',
  boolean: ['clean-names', 'clean-urls', 'remove-unuseful'],
  alias: {
    'clean-names': 'n',
    'clean-urls': 'l',
    'remove-unuseful': ['i', 'ignore-empty'],
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
    fatal(`Unknown argument ${a}.\n`);
  },
});

const fileToCSVStream = (filename, options) => {
  return _(fs.createReadStream(filename, 'utf8'))
  .through(toCSV(options))
  .on('error', fatal);
};

const _args = parseArgs(process.argv.slice(2));

if (!_args._[0]) {
  fatal('You must specify an Enpass export file to process.\n');
}

fileToCSVStream(_args._[0], _args)
.pipe(process.stdout);

module.exports = { parseArgs, fileToCSVStream, fatal };
