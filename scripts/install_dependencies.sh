#!/bin/bash

# Install Yarn
npm install --global yarn

# Install pm2
npm install --global pm2

# Install NVM
su - ubuntu -c 'curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash'

su - ubuntu -c 'source ~/.bashrc'

# Load NVM to avoid pathing error
su - ubuntu -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"'

# Install or update Node.js LTS using NVM within the specified range
su - ubuntu -c 'source ~/.bashrc && nvm install 18.17.0'

