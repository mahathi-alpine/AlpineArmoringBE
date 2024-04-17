#!/bin/bash

# Get enviornment variables from parameter store
env_vars=$(aws ssm get-parameter --name "env_vars" --query "Parameter.Value" --output text)

# Check if file content retrieval was successful
if [ -z "$env_vars" ]; then
    echo "Failed to retrieve file content from Parameter Store."
    exit 1
fi
# Write the file content to the specified file path
echo -e "$env_vars" > /var/www/html/alpine/.env

# Check if the file was written successfully
if [ $? -eq 0 ]; then
    echo "File successfully written to $FILE_PATH."
else
    echo "Failed to write file to $FILE_PATH."
    exit 1
fi

su - ubuntu -c 'ln -s "$(which node)" /usr/bin/node && ln -s "$(which npm)" /usr/bin/npm'

# Create logging directory
mkdir -p /home/ubuntu/logs && touch /home/ubuntu/logs/strapi.log && chmod 777 /home/ubuntu/logs/strapi.log

# Update permissions on project directory
chmod -R 777 /var/www/html/alpine

# Install project dependencies, remove previous deployments from pm2, and build the application
su - ubuntu -c 'cd /var/www/html/alpine && source ~/.nvm/nvm.sh && nvm use 18.17.0 && yarn install && yarn build && pm2 delete all && pm2 start yarn --name "Alpine" -- start > /home/ubuntu/logs/strapi.log 2>&1'