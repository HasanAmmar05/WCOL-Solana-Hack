#!/bin/bash
export PATH=/home/hasan/.local/share/solana/install/active_release/bin:/home/hasan/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

HELIUS_RPC="https://devnet.helius-rpc.com/?api-key=15530520-b11b-469b-93e4-ae5c04d78290"
PROGRAM_ID="3tSTD3jLywE8xsAcsR3G1xWowgvJiU5Guxvk3RSEySw8"

echo "=== Setting Solana config to Helius RPC ==="
solana config set --url "$HELIUS_RPC"

echo ""
echo "=== Program show ==="
solana program show "$PROGRAM_ID" 2>&1

echo ""
echo "=== declare_id in lib.rs ==="
grep "declare_id" /mnt/c/Users/Victus\ by\ HP/Downloads/WCOL-Solana-Hack/programs/wcol/src/lib.rs
