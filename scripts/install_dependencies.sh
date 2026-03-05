#!/bin/bash

# Set up 2GB swap if not already present (t3a.medium has only 4GB RAM)
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "Swap space created and enabled."
else
    # Ensure swap is active (may not be after reboot if fstab entry was lost)
    swapon /swapfile 2>/dev/null || true
    echo "Swap already exists."
fi

# Install NVM, node v 18.17.0 and required npm packages
su - ubuntu -c 'curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash && source ~/.bashrc && export NVM_DIR="/home/ubuntu/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && nvm install 18.17.0 && npm install --global yarn && npm install --global pm2'
