#!/bin/bash

# Install NVM
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 

source ~/.bashrc

# Load NVM to avoid pathing error
export NVM_DIR="$HOME/.nvm"

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install or update Node.js LTS using NVM within the specified range
nvm install 18.17.0

# Install Yarn
npm install -g yarn

# Install pm2
npm install -g pm2