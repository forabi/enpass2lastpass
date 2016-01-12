Enpass2LastPass ![build status](https://travis-ci.org/forabi/enpass2lastpass.svg)
=================

A little script that converts plain text files produced by Enpass export tool to LastPass importable CSV.

Usage
------

_Note: Node >= 5.0 is required._

1. Install globally:

  ```shell
  npm install -g enpass2lastpass
  ```

2. The script accepts a path to a text file and outputs to stdout:

  ```shell
  enpass2lastpass ./enpass-export.txt > lastpass-import.csv
  ```

  Options:
    * `--ignore-empty` or `-i`: removes entries that are missing both a url and a password  (default: true).
    * `--clean-names` or `-n`: removes 'Generated Password for ' from the title (default: true).
    * `--clean-urls` or `-l`: removes query strings from the URL (default: true).
    * `--default-email` or `-e`: an email address to use for entries without a username or an email.
  
3. Done!

Contribution
------------
Bug reports and pull requests are welcome!
