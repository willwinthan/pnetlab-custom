#!/bin/bash

# ==============================================================================
# Pnetlab Ubuntu 24.04 Compatibility Setup Script
# ==============================================================================
# This script prepares an Ubuntu 24.04 server to run the legacy Pnetlab system
# stably by installing PHP 7.4 FPM (co-existing with default PHP 8.3), configuring
# Apache virtual host redirection, enabling cgroups v1 for Docker nodes, and
# adjusting MySQL authentication configurations.
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0;0m' # No Color

echo -e "${GREEN}=== Pnetlab Ubuntu 24.04 Compatibility Script ===${NC}"

# Check root privilege
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Error: Please run this script as root or with sudo.${NC}"
  exit 1
fi

# 1. Update package lists
echo -e "\n${YELLOW}[1/6] Updating system package lists...${NC}"
apt-get update

# 2. Install software-properties-common & add PHP PPA
echo -e "\n${YELLOW}[2/6] Adding repository for PHP 7.4...${NC}"
apt-get install -y software-properties-common
add-apt-repository -y ppa:ondrej/php
apt-get update

# 3. Install PHP 7.4 FPM and required modules
echo -e "\n${YELLOW}[3/6] Installing PHP 7.4 FPM and extension packages...${NC}"
apt-get install -y php7.4-fpm php7.4-cli php7.4-mysql php7.4-xml php7.4-gd \
                   php7.4-curl php7.4-mbstring php7.4-zip php7.4-bcmath \
                   php7.4-sqlite3 php7.4-soap php7.4-intl

# Start and enable PHP 7.4 FPM
systemctl start php7.4-fpm
systemctl enable php7.4-fpm

# 4. Configure Apache Virtual Host to route /opt/unetlab via PHP 7.4
echo -e "\n${YELLOW}[4/6] Configuring Apache for PHP 7.4 FPM...${NC}"
a2enmod proxy_fcgi setenvif
a2enconf php7.4-fpm

# Modify Apache VirtualHost to enforce PHP 7.4 on EVE-NG/Pnetlab paths
# We insert proxy configuration for php7.4-fpm socket in apache site config
APACHE_CONF="/etc/apache2/sites-available/000-default.conf"
if [ -f "$APACHE_CONF" ]; then
    echo -e "Configuring php7.4-fpm handler in $APACHE_CONF..."
    # Backup conf
    cp "$APACHE_CONF" "${APACHE_CONF}.bak"
    
    # Check if filesmatch directive already exists, if not, append to virtualhost
    if ! grep -q "php7.4-fpm.sock" "$APACHE_CONF"; then
        # Insert FPM socket route inside <VirtualHost *:80> block before </VirtualHost>
        sed -i '/<\/VirtualHost>/i \    <FilesMatch \\.php$>\n        SetHandler "proxy:unix:/var/run/php/php7.4-fpm.sock|fcgi://localhost"\n    </FilesMatch>' "$APACHE_CONF"
    fi
    systemctl restart apache2
    echo -e "${GREEN}Apache configuration updated successfully.${NC}"
else
    echo -e "${YELLOW}Warning: Apache configuration file $APACHE_CONF not found.${NC}"
fi

# 5. GRUB Kernel parameters configuration for cgroups v1 (Docker compatibility)
echo -e "\n${YELLOW}[5/6] Configuring cgroups v1 in GRUB...${NC}"
GRUB_FILE="/etc/default/grub"
if [ -f "$GRUB_FILE" ]; then
    cp "$GRUB_FILE" "${GRUB_FILE}.bak"
    # Check if configurations already exist
    if ! grep -q "systemd.unified_cgroup_hierarchy=0" "$GRUB_FILE"; then
        # Append parameters to GRUB_CMDLINE_LINUX_DEFAULT
        # Matches GRUB_CMDLINE_LINUX_DEFAULT="..." and inserts inside the quotes
        sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT="\(.*\)"/GRUB_CMDLINE_LINUX_DEFAULT="\1 systemd.unified_cgroup_hierarchy=0 cgroup_enable=memory swapaccount=1"/' "$GRUB_FILE"
        echo -e "GRUB configuration updated. Running update-grub..."
        update-grub
        echo -e "${GREEN}GRUB updated. A reboot is required to activate cgroups v1 compatibility.${NC}"
    else
        echo -e "cgroups v1 parameters already exist in GRUB settings."
    fi
else
    echo -e "${RED}Error: GRUB configuration file not found at $GRUB_FILE.${NC}"
fi

# 6. MySQL 8.x native password authentication compatibility
echo -e "\n${YELLOW}[6/6] Ensuring MySQL compatibility settings...${NC}"
# In MySQL 8.0/8.4, native password auth might need to be explicitly allowed or configured
MYSQL_CONF="/etc/mysql/conf.d/pnetlab_compat.cnf"
echo -e "Creating database compatibility config at $MYSQL_CONF..."
mkdir -p "$(dirname "$MYSQL_CONF")"
cat <<EOF > "$MYSQL_CONF"
[mysqld]
# Enable legacy authentication method compatibility if required
# default_authentication_plugin=mysql_native_password
# sql_mode = "ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"
EOF
systemctl restart mysql || echo -e "${YELLOW}Warning: Failed to restart mysql. Please verify if mysql server is installed on this node.${NC}"

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "${YELLOW}Important: Please run 'sudo reboot' to apply Kernel cgroups modifications.${NC}"
echo -e "==========================================="
