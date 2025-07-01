#!/bin/bash
set -e

echo "🔐 Logging into AWS ECR..."
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "$ECR_REPOSITORY_URI"

echo "📥 Pulling latest Docker image..."
docker pull "$ECR_REPOSITORY_URI":latest

echo "🧹 Cleaning up old container..."
docker stop node-app || true
docker rm node-app || true

echo "🚀 Starting new container..."
docker run -d --name node-app -p 3000:3000 \
  -e DB_HOST="$DB_HOST" \
  -e DB_USER="$DB_USER" \
  -e DB_PASSWORD="$DB_PASSWORD" \
  -e DB_NAME="$DB_NAME" \
  -e PORT="$PORT" \
  "$ECR_REPOSITORY_URI":latest

echo "✅ Deployment completed!"
