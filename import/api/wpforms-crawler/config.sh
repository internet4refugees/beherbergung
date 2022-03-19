## common

export DATA_DIR=${DATA_DIR:='./data'}

## download

export START=${START:=500} #57
export END=${END:=1000}

export WP_ADMIN_URL=${WP_ADMIN_URL:='https://example.com/wp-admin/admin.php'}
export FORM_ID=${FORM_ID:=16993}
export NONCE=${NONCE:='caffeeeeee'} ## it will change and needs be replaced
export AUTHORIZATION_HEADER=${AUTHORIZATION_HEADER:='authorization: Basic Base64EncodedDataaaaaaaaaa=='}
export COOKIE_HEADER=${COOKIE_HEADER:='cookie: wordpress_sec_thisCopiedFromTheBrower; wordpress_logged_in_; some_other_cookies'}

## HEADERS_THAT_SEEM_TO_BE_NOT_REQUIRED
#-H 'authority: example.com' \
#-H 'upgrade-insecure-requests: 1' \
#-H 'cache-control: max-age=0' \

## merge

export UT=${OUT:="/tmp/example.csv"}

## setup

[ -d $DATA_DIR ] || mkdir $DATA_DIR
