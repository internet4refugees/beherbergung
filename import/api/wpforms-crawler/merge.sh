## quick and dirty! TODO: replace grep -v

source ./config.sh

(
  cd $DATA_DIR
  head -n1 $(ls | head -n1)
) >$OUT
cat $DATA_DIR/* | grep -v 'Name,Land,Straße,Hausnummer' >>$OUT

wc -l $OUT
