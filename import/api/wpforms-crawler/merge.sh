#!/usr/bin/env bash
## quick and dirty! TODO: replace grep -v
set -eu -o pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
# shellcheck source=config.sh
source "$SCRIPT_DIR/config.sh"

pushd "$DATA_DIR"
find . | head -n1 | xargs head -n1 >"$OUT"
popd
cat "$DATA_DIR"/* | grep -v 'Name,Land,Straße,Hausnummer' >>"$OUT"

wc -l "$OUT"
