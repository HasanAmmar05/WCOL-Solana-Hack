#!/bin/bash
export PATH=/home/hasan/.local/share/solana/install/active_release/bin:/home/hasan/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

cd "/mnt/c/Users/Victus by HP/Downloads/WCOL-Solana-Hack"
KEYPAIR="$HOME/wcol-admin-keypair.json"
RPC="https://api.devnet.solana.com"

for i in 1 2 3 4 5; do
  echo ""
  echo "=== Deploy attempt $i ==="
  result=$(anchor deploy --provider.cluster "$RPC" --provider.wallet "$KEYPAIR" 2>&1)
  echo "$result"
  if echo "$result" | grep -q "Program Id:"; then
    echo "=== SUCCESS ==="
    exit 0
  fi
  if [ $i -lt 5 ]; then
    echo "Waiting 30s before retry..."
    sleep 30
  fi
done
echo "All attempts failed."
exit 1
