'use strict';
const url = require('url');

const isUseful = x => Boolean(x.password && x.url);

const cleanUrl = x => {
  if (!x.url) return x;
  const _url = url.parse(x.url);
  delete _url.query;
  delete _url.search;
  return Object.assign({}, x, { url: url.format(_url) });
};

const cleanName = x => {
  if (!x.name) return x;
  const m = x.name.match(/^(Generated Password for|إنشاء كلمة السر لـ )\s?(.+)$/i);
  if (m) return Object.assign({}, x, { name: m[2] });
  return x;
};

const fallbackToEmail = defaultEmail => x => {
  return Object.assign({}, x, { username: x.username || x.email || defaultEmail });
};

const toCSV = x => [x.name, x.url, x.username, x.password, x.notes].join() + '\n';

module.exports = { isUseful, cleanUrl, cleanName, fallbackToEmail, toCSV };
