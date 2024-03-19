#!/bin/bash

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Source NVM initialization script
source ~/.nvm/nvm.sh

# Install or update Node.js LTS using NVM within the specified range
nvm install 18.17.0

# Verify the Node.js version
echo "Node.js version: $(node --version)"

# Navigate to the project directory
cd /var/www/html/myapp

# Install Yarn if not installed
if ! command -v yarn &> /dev/null
then
    echo "Yarn is not installed. Installing..."
    npm install -g yarn
else
    echo "Yarn is already installed."
fi

# Install project dependencies
yarn install

