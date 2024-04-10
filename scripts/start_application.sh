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


# Install project dependencies and build the application and create the logging directory
su - ubuntu -c 'cd /var/www/html/alpine && source ~/.nvm/nvm.sh && nvm use 18.17.0 && yarn install && yarn build && mkdir -p /home/ubuntu/logs && touch /home/ubuntu/logs/strapi.log'

# Run the application in the background using Yarn and PM2 for resiliency
su - ubuntu -c 'cd /var/www/html/alpine && source ~/.nvm/nvm.sh && nvm use 18.17.0 && pm2 start yarn --name "Alpine" -- start > /home/ubuntu/logs/strapi.log 2>&1'