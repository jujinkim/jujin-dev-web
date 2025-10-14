#!/bin/bash

# Sync content from Obsidian vault to Quartz content directory
# This script copies files from your Obsidian vault's publish directory to the Quartz content folder

# Configuration
OBSIDIAN_VAULT_PATH="$HOME/Obsidian Vault/jujin.dev-publish"
QUARTZ_CONTENT_PATH="./content"

# Check if Obsidian vault path exists
if [ ! -d "$OBSIDIAN_VAULT_PATH" ]; then
  echo "Error: Obsidian vault path not found: $OBSIDIAN_VAULT_PATH"
  echo "Please update the OBSIDIAN_VAULT_PATH variable in this script."
  exit 1
fi

# Create content directory if it doesn't exist
mkdir -p "$QUARTZ_CONTENT_PATH"

# Sync content (preserving directory structure)
echo "Syncing content from Obsidian vault to Quartz..."
rsync -av --delete \
  --exclude='.obsidian' \
  --exclude='.git' \
  --exclude='private' \
  --exclude='templates' \
  "$OBSIDIAN_VAULT_PATH/" "$QUARTZ_CONTENT_PATH/"

echo "Content sync completed!"
