#!/bin/env node
'use strict';

const fs = require('fs');
const _ = require('highland');
const toCSV = require('../lib/convert');

const args = process.argv.slice(2);

const filename = args[0];

if (!filename) {
  process.stderr.write('You must specify an Enpass export file to process.\n');
  process.exit(1);
}

_(fs.createReadStream(filename, 'utf8'))
.through(toCSV)
.pipe(process.stdout);
