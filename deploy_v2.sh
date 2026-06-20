#!/bin/bash
set -e

# Setup env vars for script
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"

echo "=== 1. Install Rust (Assuming Already Installed) ==="
if ! command -v cargo &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    export PATH="$HOME/.cargo/bin:$PATH"
fi

echo "=== 2. Install Solana CLI (Anza) ==="
if ! command -v solana &> /dev/null; then
    sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

echo "=== 3. Install build dependencies ==="
sudo -n apt-get update && sudo -n apt-get install -y pkg-config build-essential libudev-dev || echo "Sudo failed, hoping deps are present"

echo "=== 4. Install Anchor ==="
if ! command -v anchor &> /dev/null; then
    echo "Installing AVM via cargo... this will take 5-10 minutes."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi

echo "=== 5. Configure Solana & Airdrop ==="
mkdir -p ~/.config/solana
if [ ! -f ~/.config/solana/id.json ]; then
    solana-keygen new --no-bip39-passphrase -o ~/.config/solana/id.json
fi
solana config set --url devnet
solana airdrop 2 || echo "Airdrop failed, continuing..."

echo "=== 6. Build and Deploy ==="
cd "/mnt/c/Users/Victus by HP/Downloads/WCOL-Solana-Hack"

# Fix Anchor.toml wallet path
sed -i 's|wallet = ".*"|wallet = "~/.config/solana/id.json"|g' Anchor.toml

anchor build

echo "Deploying..."
anchor deploy --provider.cluster devnet > deploy_output.txt 2>&1 || true
cat deploy_output.txt

PROGRAM_ID=$(grep "Program Id:" deploy_output.txt | awk '{print $3}')
if [ -z "$PROGRAM_ID" ]; then
    echo "ERROR: Could not get Program ID"
    exit 1
fi
echo "FOUND PROGRAM ID: $PROGRAM_ID"

echo "=== 7. Hot-Swap Program ID ==="
sed -i "s/declare_id!(\"PLACEHOLDER\")/declare_id!(\"$PROGRAM_ID\")/g" programs/wcol/src/lib.rs
sed -i "s/wcol = \"PLACEHOLDER\"/wcol = \"$PROGRAM_ID\"/g" Anchor.toml

echo "=== 8. Final Build and Deploy ==="
anchor build
anchor deploy --provider.cluster devnet

echo "SUCCESS_PROGRAM_ID=$PROGRAM_ID"
