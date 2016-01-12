'use strict';
const _ = require('highland');
const fns = require('./fns');

module.exports = _options => inputStream => {
  const opts = Object.assign({}, {
    removeUnuseful: true,
    cleanNames: true,
    cleanUrls: true,
    defaultEmail: null,
  }, _options);

  const header = _(['name,url,username,password,extra\n']);
  let rows = inputStream
    .splitBy(/\n\n/igm) // Get each each entry
    .map(s => s.trim().split('\n')) // Split each entry into an array
    .map(s => {
      // Ignore name, process other lines to get keys and values
      return s.slice(1).map(l => {
        const m = l.match(/^([a-z\s]+)\s(.+)$/i);
        return [m[1].toLowerCase(), m[2]]; // Password 1234
      })
      .filter(x => !!x)
      .concat([['name', s[0]]]) // Add name
      .reduce((o, field) => { // Convert arrays to key: value
        const _prop = { };
        _prop[field[0]] = field[1];
        // Order of assignment is important here so that a comment
        // which starts with Password for... does not replace the
        // password field.
        return Object.assign({}, _prop, o);
      }, {});
    })
    .map(fns.fallbackToEmail(opts.defaultEmail));

  if (opts.removeUnuseful) rows = rows.filter(fns.isUseful);
  if (opts.cleanUrls) rows = rows.map(fns.cleanUrl);
  if (opts.cleanNames) rows = rows.map(fns.cleanName);

  rows = rows.map(fns.toCSV);

  return _([header, rows]).merge();
};
