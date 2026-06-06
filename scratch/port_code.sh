#!/bin/bash

# ==============================================================================
# Pnetlab Custom Codebase Porting Script (Laravel 5.5 -> Laravel 11)
# ==============================================================================
# This script automates copying files from store_backup to the new store,
# updating namespaces from App\Model to App\Models, and registering
# custom Service Providers in Laravel 11 bootstrap files.
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0;0m' # No Color

echo -e "${GREEN}=== Porting Codebase to Laravel 11 Structure ===${NC}"

# Check paths
if [ ! -d "html/store_backup" ] || [ ! -d "html/store" ]; then
    echo -e "${RED}Error: Make sure html/store_backup and html/store exist. Run modernize_framework.sh first.${NC}"
    exit 1
fi

# 1. Copying app components
echo -e "\n${YELLOW}[1/4] Copying custom app folders...${NC}"

# Copy app sub-directories
DIRS=("Constants" "Exceptions" "Helpers")
for dir in "${DIRS[@]}"; do
    if [ -d "html/store_backup/app/$dir" ]; then
        echo -e "Copying app/$dir..."
        cp -r "html/store_backup/app/$dir" "html/store/app/"
    fi
done

# Copy Model and rename to Models
if [ -d "html/store_backup/app/Model" ]; then
    echo -e "Copying and renaming app/Model to app/Models..."
    mkdir -p html/store/app/Models
    cp -r html/store_backup/app/Model/* html/store/app/Models/
fi

# Copy Custom Service Providers
PROVIDERS=("ConstantsServiceProvider.php" "DataServiceProvider.php" "LoaderServiceProvider.php")
for provider in "${PROVIDERS[@]}"; do
    if [ -f "html/store_backup/app/Providers/$provider" ]; then
        echo -e "Copying App/Providers/$provider..."
        cp "html/store_backup/app/Providers/$provider" "html/store/app/Providers/"
    fi
done

# Copy Controllers (overwrite default Laravel 11 ones if needed, but backing up first)
if [ -d "html/store_backup/app/Http/Controllers" ]; then
    echo -e "Copying custom Controllers..."
    cp -r html/store_backup/app/Http/Controllers/* html/store/app/Http/Controllers/
fi

# 2. Copying public assets & views
echo -e "\n${YELLOW}[2/4] Copying public assets and blade views...${NC}"
if [ -d "html/store_backup/resources/views" ]; then
    echo -e "Copying resources/views..."
    cp -r html/store_backup/resources/views/* html/store/resources/views/
fi

PUBLIC_ASSETS=("assets" "extensions" "table")
for asset in "${PUBLIC_ASSETS[@]}"; do
    if [ -d "html/store_backup/public/$asset" ]; then
        echo -e "Copying public/$asset..."
        cp -r "html/store_backup/public/$asset" "html/store/public/"
    fi
done

# 3. Rename namespaces (App\Model -> App\Models)
echo -e "\n${YELLOW}[3/4] Renaming namespaces in PHP files...${NC}"
# Find and replace in app directory
find html/store/app -type f -name "*.php" -exec sed -i 's/App\\Model/App\\Models/g' {} +
find html/store/app -type f -name "*.php" -exec sed -i 's/App\/Model/App\/Models/g' {} +

# Specific fix for Models.php helper dynamic path mapping
MODELS_HELPER="html/store/app/Helpers/DB/Models.php"
if [ -f "$MODELS_HELPER" ]; then
    echo -e "Adjusting dynamic path mapping in Models.php..."
    sed -i 's/App\\\\Model/App\\\\Models/g' "$MODELS_HELPER"
fi

echo -e "${GREEN}Namespace renaming completed.${NC}"

# 4. Register Service Providers in Laravel 11 bootstrap/providers.php
echo -e "\n${YELLOW}[4/4] Registering service providers in Laravel 11...${NC}"
PROVIDERS_FILE="html/store/bootstrap/providers.php"
if [ -f "$PROVIDERS_FILE" ]; then
    # Insert custom providers into the return array
    sed -i "/return \[/a \    App\\\Providers\\\ConstantsServiceProvider::class,\n    App\\\Providers\\\DataServiceProvider::class,\n    App\\\Providers\\\LoaderServiceProvider::class," "$PROVIDERS_FILE"
    echo -e "${GREEN}Service providers registered in $PROVIDERS_FILE.${NC}"
else
    echo -e "${RED}Warning: $PROVIDERS_FILE not found. Please register custom providers manually.${NC}"
fi

# Copy custom routes to web.php
if [ -f "html/store_backup/routes/web.php" ]; then
    echo -e "Appending custom routes to routes/web.php..."
    cat html/store_backup/routes/web.php >> html/store/routes/web.php
fi

echo -e "\n${GREEN}=== Porting Complete! ===${NC}"
echo -e "Your codebase has been migrated to Laravel 11. Run composer install to sync files if needed.${NC}"
echo -e "==========================================="
