#!/bin/bash

# Configuration
SERVER="root@82.112.240.180"
BACKEND_DIR="/var/www/real-creativo/backend"
TARGET_DIR="$BACKEND_DIR/dist"
LOCAL_DIR="./dist"
APP_NAME="real-creativo"

echo "Starting backend deployment to $SERVER:$TARGET_DIR"

# Step 1: Move uploads directory to parent
echo "Preserving uploads directory..."
ssh $SERVER "cd $TARGET_DIR && mv uploads ../"

# Step 2: Clean the remote dist directory
echo "Cleaning remote dist directory..."
ssh $SERVER "cd $TARGET_DIR && rm -rf *"

# Step 3: Deploy new files
echo "Deploying new backend files..."
scp -r $LOCAL_DIR/* $SERVER:$TARGET_DIR/

# Step 4: Restore uploads directory
echo "Restoring uploads directory..."
ssh $SERVER "cd $BACKEND_DIR && mv uploads ./dist"

# Step 5: PM2 process management
echo "Restarting PM2 process..."
ssh $SERVER "cd $BACKEND_DIR && \
             pm2 delete $APP_NAME && \
             pm2 save && \
             pm2 start ecosystem.config.js --env production && \
             pm2 save && \
             pm2 startup"

echo "Backend deployment completed successfully!"