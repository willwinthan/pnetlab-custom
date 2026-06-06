#!/bin/bash

# ==============================================================================
# Pnetlab Custom Codebase Modernization Script (Option 2)
# ==============================================================================
# This script automates the backup of the legacy Laravel 5.5 app, initializes
# a clean Laravel 11 structure, runs Rector to upgrade PHP core files to PHP 8.3,
# and sets up a Vite + React 18 development pipeline.
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0;0m' # No Color

echo -e "${GREEN}=== Pnetlab Custom Modernization (Laravel 11 & React 18) ===${NC}"

# 1. Check PHP version
PHP_VER=$(php -r 'echo PHP_VERSION_ID;')
if [ "$PHP_VER" -lt 80200 ]; then
  echo -e "${RED}Error: PHP version 8.2 or 8.3 is required for Laravel 11 and Rector. Current version: $(php -v | head -n 1)${NC}"
  exit 1
fi

# 2. Check Composer
if ! [ -x "$(command -v composer)" ]; then
  echo -e "${RED}Error: Composer is not installed on this server. Please install composer first.${NC}"
  exit 1
fi

# 3. Check Node/NPM
if ! [ -x "$(command -v npm)" ]; then
  echo -e "${YELLOW}Warning: npm is not installed. You will need it to build React assets later.${NC}"
fi

# 4. Backup the old store folder
echo -e "\n${YELLOW}[1/5] Backing up legacy Laravel 5.5 store folder...${NC}"
if [ -d "html/store" ]; then
    if [ -d "html/store_backup" ]; then
        echo -e "${YELLOW}Warning: html/store_backup already exists. Overwriting...${NC}"
        rm -rf html/store_backup
    fi
    mv html/store html/store_backup
    echo -e "${GREEN}Legacy store moved to html/store_backup.${NC}"
else
    echo -e "${RED}Error: html/store directory not found. Please run this script from the project root.${NC}"
    exit 1
fi

# 5. Initialize fresh Laravel 11 project
echo -e "\n${YELLOW}[2/5] Creating a new Laravel 11 project...${NC}"
composer create-project laravel/laravel html/store "11.*" --prefer-dist --no-interaction
echo -e "${GREEN}Laravel 11 initialized successfully.${NC}"

# 6. Set up Rector for PHP 8.3 conversion
echo -e "\n${YELLOW}[3/5] Setting up Rector to upgrade legacy PHP Core syntax...${NC}"
cd html/store
composer require rector/rector --dev --no-interaction

# Copy prepared rector.php configuration
if [ -f "../../scratch/rector.php" ]; then
    cp ../../scratch/rector.php ./rector.php
    echo -e "Running Rector to automatically upgrade PHP syntax to PHP 8.3 compatibility..."
    vendor/bin/rector process --dry-run || true
    echo -e "\n${YELLOW}Rector check finished. To apply modifications to code, run:${NC}"
    echo -e "${GREEN}cd html/store && vendor/bin/rector process${NC}"
else
    echo -e "${RED}Error: rector.php configuration file not found in scratch folder.${NC}"
fi

# 7. Set up Vite + React 18 packages
echo -e "\n${YELLOW}[4/5] Configuring npm packages for Vite and React 18...${NC}"
# Add React dependencies to package.json
npm install react react-dom @vitejs/plugin-react --save-dev --no-interaction || echo -e "${YELLOW}Warning: NPM install skipped or failed. Please run manually later.${NC}"

# Create Vite Config file
cat <<'EOF' > vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/react',
        },
    },
});
EOF

echo -e "${GREEN}Vite config file created.${NC}"

# 8. Copying legacy React source code structure to new project
echo -e "\n${YELLOW}[5/5] Copying legacy React sources to new resource location...${NC}"
mkdir -p resources/react
if [ -d "../store_backup/resources/react" ]; then
    cp -r ../store_backup/resources/react/* resources/react/
    echo -e "${GREEN}React sources copied to resources/react/.${NC}"
else
    echo -e "${YELLOW}Warning: Legacy React folder not found in store_backup.${NC}"
fi

echo -e "\n${GREEN}=== Modernization Initialization Complete! ===${NC}"
echo -e "Next steps:"
echo -e "1. Run ${YELLOW}cd html/store && vendor/bin/rector process${NC} to apply PHP 8.3 compatibility rules."
echo -e "2. Port DB credentials and custom tables to ${YELLOW}html/store/config/database.php${NC}."
echo -e "3. Port models from ${YELLOW}html/store_backup/app/Model/${NC} to ${YELLOW}html/store/app/Models/${NC}."
echo -e "4. Port controller logic from ${YELLOW}html/store_backup/app/Http/Controllers/${NC}."
echo -e "==========================================="
