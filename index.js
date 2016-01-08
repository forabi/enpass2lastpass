#!/bin/env node
'use strict';

const fs = require('fs');
const url = require('url');
const _ = require('highland');
const args = process.argv.slice(2);

const filename = args[0];

if (!filename) {
    process.stderr.write('You must specify an Enpass export file to process.\n');
    process.exit(1);
    return;
}

let a = 0;

process.stdout.write('name,url,username,password,extra\n')

_(fs.createReadStream(filename, 'utf8'))
.splitBy(/\n\n/igm)
.map(s => s.trim().split('\n'))
.map(s => {
    return s.slice(1).map(l => {
        const m = l.match(
            /^([a-z\s]+)\s(.+)$/i);
        if (m) {
            return [m[1].toLowerCase(), m[2]];
        } else {
            return ['notes', l];
        }
    })
    .filter(x => x)
    .concat([['name', s[0]]])
    .reduce((o, field) => {
        o[field[0]] = field[1];
        return o;
    }, {})
})
.filter(x => x.password && x.url)
.map(x => {
    if (!x.url) return x;
    const oldUrl = url.parse(x.url);
    
    x.url = url.format({
        host: oldUrl.host,
        protocol: oldUrl.protocol,
        auth: oldUrl.auth
    });
    
    return x;
})
.map(x => {
    if (!x.name) return x;
    const m = x.name.match(/^(Generated Password for|إنشاء كلمة السر لـ )\s?(.+)$/i)
    if (m) {
        x.name = m[2];
    }
    return x;
})
.map(x => {
    x.username = x.username || x.email;
    return x;
})
.map(x => [x.name, x.url, x.username, x.password, x.notes].join() + '\n')
.tap(x => a++)
.pipe(process.stdout);
