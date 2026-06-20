#!/bin/bash
set -e

export PATH=/home/hasan/.local/share/solana/install/active_release/bin:/home/hasan/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

PROJ="/mnt/c/Users/Victus by HP/Downloads/WCOL-Solana-Hack"
RPC="https://api.devnet.solana.com"
KEYPAIR="$HOME/wcol-admin-keypair.json"

cd "$PROJ"

echo "=== declare_id in lib.rs ==="
grep "declare_id" programs/wcol/src/lib.rs

echo ""
echo "=== Setting config ==="
solana config set --url "$RPC" --keypair "$KEYPAIR"

echo ""
echo "=== anchor build --no-idl (binary only, IDL already exists) ==="
anchor build --no-idl 2>&1

echo ""
echo "=== Built .so exists? ==="
ls -lh target/deploy/wcol.so

echo ""
echo "=== IDL address (unchanged) ==="
grep '"address"' target/idl/wcol.json | head -2

echo ""
echo "=== anchor deploy ==="
anchor deploy --provider.cluster "$RPC" --provider.wallet "$KEYPAIR" 2>&1

echo ""
echo "=== DEPLOY COMPLETE ==="
