'use strict';
const _ = require('highland');
const fns = require('./fns');

module.exports = function toCSVStream(inputStream, _options) {
  const opts = Object.assign({}, _options, {
    removeUnuseful: true,
    cleanNames: true,
    cleanUrl: true,
    defaultEmail: null,
  });

  const header = _(['name,url,username,password,extra\n']);
  let rows = inputStream
    .splitBy(/\n\n/igm) // Get each each entry
    .map(s => s.trim().split('\n')) // Split each entry into an array
    .map(s => {
      // Ignore name, process other lines to get keys and values
      return s.slice(1).map(l => {
        const m = l.match(/^([a-z\s]+)\s(.+)$/i);
        if (m) return [m[1].toLowerCase(), m[2]]; // Password 1234
        return ['notes', l]; // Otherwise it is a comment
      })
      .filter(x => !!x)
      .concat([['name', s[0]]]) // Add name
      .reduce((o, field) => { // Convert arrays to key: value
        const _prop = { };
        _prop[field[0]] = field[1];
        return Object.assign({}, o, _prop);
      }, {});
    })
    .map(fns.fallbackToEmail(opts.defaultEmail));

  if (opts.removeUnuseful) rows = rows.filter(fns.isUseful);
  if (opts.cleanUrl) rows = rows.map(fns.cleanUrl);
  if (opts.cleanNames) rows = rows.map(fns.cleanName);

  rows = rows.map(fns.toCSV);

  return _([header, rows]).merge();
};
