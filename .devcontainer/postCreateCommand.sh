# /bin/bash

# Install Biome
npm install -g @biomejs/biome

# # PNPM setup
pnpm config set store-dir ~/.local/share/pnpm/store

# Install dependencies
pnpm install