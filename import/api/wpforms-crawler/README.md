[wpforms](https://wpforms.com/) uses a counter for `ENTRY_ID`s and seems to be vulnerable against CSRF :(

Once we have obtained a cookie, crawling is trivial…

## configuration && usage

```bash
cp config.sh{,~}
edit config.sh~

. config.sh~ && ./download.sh
./merge.sh
```
