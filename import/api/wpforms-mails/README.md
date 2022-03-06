Assume someone used [wpforms](https://wpforms.com/) on a WordPress As A Service without having database access and than `wpforms` is buggy and the download feature doesn't work. Also there is no access to the database and the only way of getting your data is extracting the data from HTML-mails wpforms was sending…

This repo provides a quick hack to load mails via `imap` or a `local mbox`, extract wpforms datasets by parsing HTML-mails and storing the data as `edn`/`json`/`csv`/`xlsx`

## Usage

Provide the config via .lein-env or environment-variables:

```sh
WPFORMS_MAILS_FILE="~/.thunderbird/myprofileid.default/Mail/Local Folders/example_folder" lein run /tmp/output.csv
```
