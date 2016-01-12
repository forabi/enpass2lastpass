#!/bin/env node
'use strict';

const fs = require('fs');
const _ = require('highland');
const toCSV = require('../lib/convert');
const parseArgs = require('../lib/parse-args');

const fatal = e => {
  process.stderr.write(e.message + '\n');
  process.exit(1);
};

const _args = parseArgs(process.argv.slice(2));

if (!_args._[0]) {
  fatal(new Error('You must specify an Enpass export file to process.'));
}

_(fs.createReadStream(_args._[0], 'utf8'))
.through(toCSV(_args))
.on('error', fatal)
.pipe(_args.output ? fs.createWriteStream(_args.output) : process.stdout);
