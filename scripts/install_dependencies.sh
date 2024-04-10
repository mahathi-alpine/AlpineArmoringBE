#!/bin/bash

# Install Yarn
npm install --global yarn

# Install pm2
npm install --global pm2

# Install NVM
su - ubuntu -c 'curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash && source ~/.bashrc && export NVM_DIR="/home/ubuntu/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && nvm install 18.17.0'

