#!/bin/bash
curl -X POST https://solfaucet.com/api/airdrop \
  -H 'Content-Type: application/json' \
  -d '{"network":"devnet","account":"Anab7LvcRjAnnqyVeiD5Q2XKpbSHG59iLVbZSyVRkUZF","amount":2}'
