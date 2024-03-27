#!/bin/bash

# Navigate to the project directory
cd /var/www/html/myapp

# Fix node version error - hardcoded to 18.17.0 for now
source ~/.nvm/nvm.sh

nvm use 18.17.0

# Install project dependencies
yarn install

# Get enviornment variables from parameter store
env_vars=$(aws ssm get-parameter --name "env_vars" --query "Parameter.Value" --output text)

# Check if file content retrieval was successful
if [ -z "$env_vars" ]; then
    echo "Failed to retrieve file content from Parameter Store."
    exit 1
fi

# Write the file content to the specified file path
echo -e "$env_vars" > /var/www/html/myapp/.env

# Check if the file was written successfully
if [ $? -eq 0 ]; then
    echo "File successfully written to $FILE_PATH."
else
    echo "Failed to write file to $FILE_PATH."
    exit 1
fi

# Build the application
yarn build

# Create logging directory
mkdir -p /home/ubuntu/logs && touch /home/ubuntu/logs/strapi.log

# Run the application in the background using Yarn
nohup yarn start > /home/ubuntu/logs/strapi.log 2>&1 &