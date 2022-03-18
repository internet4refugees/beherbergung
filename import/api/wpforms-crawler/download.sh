#!/usr/bin/env bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
# shellcheck source=config.sh
source "$SCRIPT_DIR/config.sh"

function download() {
  ENTRY=$1
  OUT="${DATA_DIR}/${ENTRY}.csv"
  echo "$ENTRY"
  curl "${WP_ADMIN_URL}?page=wpforms-tools&view=export&action=wpforms_tools_single_entry_export_download&form=${FORM_ID}&entry_id=${ENTRY}&export_options%5B0%5D=csv&nonce=${NONCE}" \
    -H "$COOKIE_HEADER" \
    -H "$AUTHORIZATION_HEADER" \
    --compressed | tee "$OUT"
}

for i in $(seq "$START" "$END"); do
  download "$i" || exit
done
