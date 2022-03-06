## common

DATA_DIR="./data"

## download

START=500  #57
END=500  #1000

WP_ADMIN_URL='https://example.com/wp-admin/admin.php'
FORM_ID=16993
NONCE='caffeeeeee'
AUTHORIZATION_HEADER='authorization: Basic Base64EncodedDataaaaaaaaaa=='
COOKIE_HEADER='cookie: wordpress_sec_thisCopiedFromTheBrower; wordpress_logged_in_; some_other_cookies'

## HEADERS_THAT_SEEM_TO_BE_NOT_REQUIRED
#-H 'authority: example.com' \
#-H 'upgrade-insecure-requests: 1' \
#-H 'cache-control: max-age=0' \

## merge

OUT="/tmp/example.csv"

## setup

[ -d $DATA_DIR ] || mkdir $DATA_DIR
