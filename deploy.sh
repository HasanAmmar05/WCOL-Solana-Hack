#!/bin/bash
set -e

# Setup env vars for script
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"

echo "=== 1. Install Rust ==="
if ! command -v cargo &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    export PATH="$HOME/.cargo/bin:$PATH"
fi

echo "=== 2. Install Solana ==="
if ! command -v solana &> /dev/null; then
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.23/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

echo "=== 3. Install Anchor ==="
if ! command -v anchor &> /dev/null; then
    wget https://github.com/coral-xyz/anchor/releases/download/v0.30.1/anchor-cli-linux-x86_64.tar.gz -O anchor.tar.gz
    tar -xzf anchor.tar.gz
    mkdir -p $HOME/.cargo/bin
    mv anchor-cli $HOME/.cargo/bin/anchor
    chmod +x $HOME/.cargo/bin/anchor
    rm anchor.tar.gz
fi

echo "=== 4. Configure Solana & Airdrop ==="
mkdir -p ~/.config/solana
if [ ! -f ~/.config/solana/id.json ]; then
    solana-keygen new --no-bip39-passphrase -o ~/.config/solana/id.json
fi
solana config set --url devnet
solana airdrop 2 || echo "Airdrop 1 failed, might already have SOL"
sleep 5

echo "=== 5. First Anchor Build & Deploy ==="
cd "/mnt/c/Users/Victus by HP/Downloads/WCOL-Solana-Hack"

# Ensure Anchor.toml points to the correct keypair
sed -i 's|wallet = ".*"|wallet = "~/.config/solana/id.json"|g' Anchor.toml

anchor build

# We will deploy to get the program ID
echo "Deploying to devnet to get Program ID..."
anchor deploy --provider.cluster devnet > deploy_output.txt 2>&1 || true

cat deploy_output.txt
PROGRAM_ID=$(grep "Program Id:" deploy_output.txt | awk '{print $3}')

if [ -z "$PROGRAM_ID" ]; then
    echo "ERROR: Failed to extract PROGRAM_ID"
    exit 1
fi

echo "FOUND PROGRAM ID: $PROGRAM_ID"
echo "$PROGRAM_ID" > program_id.txt

# Now we need to update the files with the real PROGRAM_ID.
# But wait, this script just outputs the Program ID. The agent will read it and update the files.
# No, let's just do it in the script to save time!

echo "=== 6. Update Files with Program ID ==="
sed -i "s/declare_id!(\"PLACEHOLDER\")/declare_id!(\"$PROGRAM_ID\")/g" programs/wcol/src/lib.rs
sed -i "s/wcol = \"PLACEHOLDER\"/wcol = \"$PROGRAM_ID\"/g" Anchor.toml

# We also need to update .env.local and route.ts, but the agent can do that.
# Let's rebuild and redeploy.

echo "=== 7. Final Build & Deploy ==="
anchor build
anchor deploy --provider.cluster devnet

echo "=== DONE ==="
echo "FINAL_PROGRAM_ID=$PROGRAM_ID"
